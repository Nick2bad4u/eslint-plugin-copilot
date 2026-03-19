/**
 * @packageDocumentation
 * Public plugin entrypoint for eslint-plugin-copilot.
 */
import type { ESLint, Linter } from "eslint";

import markdown from "@eslint/markdown";

import packageJson from "../package.json" with { type: "json" };
import {
    copilotConfigMetadataByName,
    type CopilotConfigName,
} from "./_internal/copilot-config-references.js";
import type { CopilotRuleDocs } from "./_internal/create-copilot-rule.js";
import { copilotRules } from "./_internal/rules-registry.js";

/** ESLint severity used by generated preset rule maps. */
const ERROR_SEVERITY = "error" as const;

/** Markdown files linted by the shipped Copilot presets. */
const COPILOT_MARKDOWN_FILES = [
    ".github/copilot-instructions.md",
    ".github/instructions/**/*.instructions.md",
    ".github/prompts/**/*.prompt.md",
    ".github/agents/**/*.agent.md",
    ".github/chatmodes/**/*.chatmode.md",
    "**/AGENTS.md",
    "**/CLAUDE.md",
    "**/GEMINI.md",
] as const;

/** Flat-config preset shape produced by this plugin. */
export type CopilotPresetConfig = Linter.Config & {
    rules: NonNullable<Linter.Config["rules"]>;
};

/** Unqualified rule names supported by eslint-plugin-copilot. */
export type CopilotRuleName = keyof typeof copilotRules;

/** Fully qualified Copilot rule ids. */
export type CopilotRuleId = `copilot/${CopilotRuleName}`;

/** Contract for the exported preset map. */
type CopilotConfigsContract = Record<CopilotConfigName, CopilotPresetConfig>;

/** Fully assembled plugin contract used by the runtime default export. */
type CopilotPluginContract = Omit<ESLint.Plugin, "configs" | "rules"> & {
    configs: CopilotConfigsContract;
    meta: {
        name: string;
        namespace: string;
        version: string;
    };
    processors: NonNullable<ESLint.Plugin["processors"]>;
    rules: NonNullable<ESLint.Plugin["rules"]>;
};

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
const markdownPlugin = markdown as unknown as ESLint.Plugin;

/** Stable ordered entries used to derive preset membership. */
const copilotRuleEntries = Object.entries(copilotRules).toSorted(
    ([left], [right]) => left.localeCompare(right)
) as readonly (readonly [
    CopilotRuleName,
    (typeof copilotRules)[CopilotRuleName],
])[];

/** Create an empty mutable preset-rule bucket map. */
const createEmptyPresetRuleMap = (): Record<
    CopilotConfigName,
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
    Record<CopilotConfigName, readonly CopilotRuleName[]>
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
): CopilotPresetConfig["rules"] => {
    const rules: CopilotPresetConfig["rules"] = {};

    for (const ruleName of ruleNames) {
        rules[`copilot/${ruleName}`] = ERROR_SEVERITY;
    }

    return rules;
};

const presetRuleNamesByConfig = derivePresetRuleNamesByConfig();

/** Build one public preset config. */
const createPresetConfig = (
    configName: CopilotConfigName,
    plugin: CopilotPluginContract
): CopilotPresetConfig => ({
    files: [...COPILOT_MARKDOWN_FILES],
    language: "markdown/gfm",
    name: copilotConfigMetadataByName[configName].presetName,
    plugins: {
        copilot: plugin,
        markdown: markdownPlugin,
    },
    rules: errorRulesFor(presetRuleNamesByConfig[configName]),
});

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
    all: createPresetConfig("all", plugin),
    minimal: createPresetConfig("minimal", plugin),
    recommended: createPresetConfig("recommended", plugin),
    strict: createPresetConfig("strict", plugin),
};

export default plugin;
