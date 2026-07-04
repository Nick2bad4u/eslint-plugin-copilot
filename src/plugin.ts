/**
 * @packageDocumentation
 * Public plugin entrypoint for eslint-plugin-copilot.
 */
import type { ESLint, Linter } from "eslint";
import type { Except } from "type-fest";

import * as jsonPluginModule from "@eslint/json";
import * as markdownPluginModule from "@eslint/markdown";
import { not, objectEntries, safeCastTo, setHas } from "ts-extras";

import type { CopilotRuleDocs } from "./_internal/create-copilot-rule.js";

import packageJson from "../package.json" with { type: "json" };
import {
    type CopilotBaseConfigName,
    copilotConfigMetadataByName,
    type CopilotConfigName,
} from "./_internal/copilot-config-references.js";
import { copilotRules } from "./_internal/rules-registry.js";

/** ESLint severity used by generated preset rule maps. */
const ERROR_SEVERITY = "error" as const;

/** Markdown files linted by the shipped Copilot presets. */
const COPILOT_MARKDOWN_FILES = [
    "**/AGENTS.md",
    "**/CLAUDE.md",
    "**/GEMINI.md",
    "**/SKILL.md",
    ".claude/skills/**/*.md",
    ".github/agents/**/*.agent.md",
    ".github/chatmodes/**/*.chatmode.md",
    ".github/copilot-instructions.md",
    ".github/instructions/**/*.instructions.md",
    ".github/instructions/copilot-instructions.md",
    ".github/prompts/**/*.prompt.md",
    ".github/skills/**/*.md",
] as const;

/** Repository hook JSON files linted by the shipped Copilot presets. */
const COPILOT_JSON_FILES = [".github/hooks/**/*.json"] as const;

/** Hook JSON rules that should only be enabled in the JSON preset layer. */
const REPOSITORY_HOOK_JSON_RULE_NAMES = new Set<CopilotRuleName>([
    "no-empty-repository-hook-arrays",
    "prefer-fast-repository-hooks",
    "require-existing-repository-hook-cwd",
    "require-relative-repository-hook-cwd",
    "require-repository-hook-arrays",
    "require-repository-hook-command-shell",
    "require-repository-hooks-object",
    "require-string-repository-hook-env-values",
    "require-valid-repository-hook-command-type",
    "require-valid-repository-hook-env",
    "require-valid-repository-hook-events",
    "require-valid-repository-hook-timeouts",
    "require-valid-repository-hook-version",
]);

/** Flat-config preset layers produced by this plugin. */
export type CopilotPresetConfig = CopilotPresetLayer[];

/** Flat-config preset shape produced by this plugin. */
export type CopilotPresetLayer = Linter.Config & {
    rules: NonNullable<Linter.Config["rules"]>;
};

/** Fully qualified Copilot rule ids. */
export type CopilotRuleId = `copilot/${CopilotRuleName}`;

/** Unqualified rule names supported by eslint-plugin-copilot. */
export type CopilotRuleName = keyof typeof copilotRules;

/** Contract for the exported preset map. */
type CopilotConfigsContract = Record<CopilotConfigName, CopilotPresetConfig>;

/** Fully assembled plugin contract used by the runtime default export. */
type CopilotPluginContract = Except<ESLint.Plugin, "configs" | "rules"> & {
    configs: CopilotConfigsContract;
    meta: {
        name: string;
        namespace: string;
        version: string;
    };
    processors: NonNullable<ESLint.Plugin["processors"]>;
    rules: NonNullable<ESLint.Plugin["rules"]>;
};

/** Whether a preset layer should self-register ESLint language plugins. */
type LanguagePluginRegistrationMode = "external" | "self-contained";

/** Resolve the package version from package.json data. */
const getPackageVersion = (pkg: unknown): string => {
    if (typeof pkg !== "object" || pkg === null) {
        return "0.0.0";
    }

    const version = Reflect.get(pkg, "version");

    return typeof version === "string" ? version : "0.0.0";
};

/** Strongly typed ESLint rule map view of the runtime registry. */
const eslintRules: NonNullable<ESLint.Plugin["rules"]> & typeof copilotRules =
    copilotRules as NonNullable<ESLint.Plugin["rules"]> & typeof copilotRules;
const markdownPlugin: ESLint.Plugin = markdownPluginModule.default;
const jsonPlugin: ESLint.Plugin = jsonPluginModule.default;

/** Stable ordered entries used to derive preset membership. */
const copilotRuleEntries = safeCastTo<
    readonly (readonly [
        CopilotRuleName,
        (typeof copilotRules)[CopilotRuleName],
    ])[]
>(
    objectEntries(copilotRules).toSorted(([left], [right]) =>
        left.localeCompare(right)
    )
);

/** Create an empty mutable preset-rule bucket map. */
const createEmptyPresetRuleMap = (): Record<
    CopilotBaseConfigName,
    CopilotRuleName[]
> => ({
    all: [],
    minimal: [],
    recommended: [],
    strict: [],
});

/** Remove duplicates while preserving first-seen ordering. */
const dedupeRuleNames = (
    ruleNames: readonly CopilotRuleName[]
): CopilotRuleName[] => [...new Set(ruleNames)];

/** Derive preset membership directly from static rule docs metadata. */
const derivePresetRuleNamesByConfig = (): Readonly<
    Record<CopilotBaseConfigName, readonly CopilotRuleName[]>
> => {
    const presetRuleMap = createEmptyPresetRuleMap();

    for (const [ruleName, ruleModule] of copilotRuleEntries) {
        const docs = ruleModule.meta.docs as CopilotRuleDocs;
        const configNames = docs.copilotConfigNames;

        for (const configName of configNames) {
            presetRuleMap[configName].push(ruleName);
        }
    }

    return {
        all: dedupeRuleNames(presetRuleMap.all),
        minimal: dedupeRuleNames(presetRuleMap.minimal),
        recommended: dedupeRuleNames(presetRuleMap.recommended),
        strict: dedupeRuleNames(presetRuleMap.strict),
    };
};

/** Build a flat-config rules map that enables the provided rules at error. */
const errorRulesFor = (
    ruleNames: readonly CopilotRuleName[]
): CopilotPresetLayer["rules"] => {
    const rules: CopilotPresetLayer["rules"] = {};

    for (const ruleName of ruleNames) {
        rules[`copilot/${ruleName}`] = ERROR_SEVERITY;
    }

    return rules;
};

const presetRuleNamesByConfig = derivePresetRuleNamesByConfig();

/** Split preset rule names into markdown-backed and JSON-backed layers. */
const partitionRuleNamesByPresetLayer = (
    ruleNames: readonly CopilotRuleName[]
): Readonly<{
    jsonRuleNames: readonly CopilotRuleName[];
    markdownRuleNames: readonly CopilotRuleName[];
}> => ({
    jsonRuleNames: ruleNames.filter((ruleName) =>
        setHas(REPOSITORY_HOOK_JSON_RULE_NAMES, ruleName)
    ),
    markdownRuleNames: ruleNames.filter(
        not((ruleName) => setHas(REPOSITORY_HOOK_JSON_RULE_NAMES, ruleName))
    ),
});

/** Build a preset plugin map for Markdown-backed layers. */
const createMarkdownPluginMap = (
    plugin: Readonly<CopilotPluginContract>,
    registrationMode: LanguagePluginRegistrationMode
): NonNullable<CopilotPresetLayer["plugins"]> =>
    registrationMode === "self-contained"
        ? {
              copilot: plugin,
              markdown: markdownPlugin,
          }
        : {
              copilot: plugin,
          };

/** Build a preset plugin map for JSON-backed layers. */
const createJsonPluginMap = (
    plugin: Readonly<CopilotPluginContract>,
    registrationMode: LanguagePluginRegistrationMode
): NonNullable<CopilotPresetLayer["plugins"]> =>
    registrationMode === "self-contained"
        ? {
              copilot: plugin,
              json: jsonPlugin,
          }
        : {
              copilot: plugin,
          };

/** Build one public preset config as layered flat-config entries. */
const createPresetConfig = (
    configName: CopilotBaseConfigName,
    plugin: Readonly<CopilotPluginContract>,
    registrationMode: LanguagePluginRegistrationMode
): CopilotPresetConfig => {
    const presetName =
        registrationMode === "self-contained"
            ? copilotConfigMetadataByName[configName].presetName
            : `${copilotConfigMetadataByName[configName].presetName}-without-language-plugins`;
    const { jsonRuleNames, markdownRuleNames } =
        partitionRuleNamesByPresetLayer(presetRuleNamesByConfig[configName]);
    const configLayers: CopilotPresetLayer[] = [
        {
            files: [...COPILOT_MARKDOWN_FILES],
            language: "markdown/gfm",
            name: `${presetName}:markdown`,
            plugins: createMarkdownPluginMap(plugin, registrationMode),
            rules: errorRulesFor(markdownRuleNames),
        },
    ];

    if (jsonRuleNames.length > 0) {
        configLayers.push({
            files: [...COPILOT_JSON_FILES],
            language: "json/json",
            name: `${presetName}:json`,
            plugins: createJsonPluginMap(plugin, registrationMode),
            rules: errorRulesFor(jsonRuleNames),
        });
    }

    return configLayers;
};

/** Public ESLint plugin entrypoint, including runtime presets and rule metadata. */
const plugin: CopilotPluginContract = {
    configs: {} as CopilotConfigsContract,
    meta: {
        name: "eslint-plugin-copilot",
        namespace: "copilot",
        version: getPackageVersion(packageJson),
    },
    processors: {},
    rules: eslintRules,
};

plugin.configs = {
    all: createPresetConfig("all", plugin, "self-contained"),
    "all-without-language-plugins": createPresetConfig(
        "all",
        plugin,
        "external"
    ),
    minimal: createPresetConfig("minimal", plugin, "self-contained"),
    "minimal-without-language-plugins": createPresetConfig(
        "minimal",
        plugin,
        "external"
    ),
    recommended: createPresetConfig("recommended", plugin, "self-contained"),
    "recommended-without-language-plugins": createPresetConfig(
        "recommended",
        plugin,
        "external"
    ),
    strict: createPresetConfig("strict", plugin, "self-contained"),
    "strict-without-language-plugins": createPresetConfig(
        "strict",
        plugin,
        "external"
    ),
};

export default plugin;
