/**
 * @packageDocumentation
 * Synchronize or validate presets documentation tables from canonical rule metadata.
 */
// @ts-check

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import builtPlugin from "../dist/plugin.js";
import { copilotConfigNames } from "../dist/_internal/copilot-config-references.js";

const matrixSectionHeading = "## Rule matrix";
const presetRulesSectionHeading = "## Rules in this preset";
const presetsDocsDirectoryPath = "docs/rules/presets";

/** @param {unknown} value @returns {value is Readonly<Record<string, unknown>>} */
const isUnknownRecord = (value) =>
    typeof value === "object" && value !== null && !Array.isArray(value);

/** @param {readonly string[]} values @returns {readonly string[]} */
const sortStrings = (values) =>
    [...values].toSorted((left, right) => left.localeCompare(right));

/** @param {string} configRuleKey @returns {null | string} */
const toPluginRuleName = (configRuleKey) => {
    if (!configRuleKey.startsWith("copilot/")) {
        return null;
    }

    return configRuleKey.slice("copilot/".length);
};

/** @param {import("../dist/_internal/copilot-config-references.js").CopilotConfigName} presetConfigName */
const collectPresetRuleNames = (presetConfigName) => {
    const presetConfig = builtPlugin.configs[presetConfigName];

    if (!isUnknownRecord(presetConfig)) {
        throw new TypeError(
            `Missing preset config '${presetConfigName}' in built plugin.`
        );
    }

    const rules = presetConfig["rules"];

    if (!isUnknownRecord(rules)) {
        return [];
    }

    const names = Object.keys(rules)
        .map(toPluginRuleName)
        .filter((name) => typeof name === "string");

    return sortStrings(names);
};

/** @param {Readonly<Record<string, unknown>>} ruleModule @returns {"—" | "💡" |
  "🔧" | "🔧 💡"} */
const getRuleFixIndicator = (ruleModule) => {
    const meta = ruleModule["meta"];

    if (!isUnknownRecord(meta)) {
        return "—";
    }

    const fixable = meta["fixable"] === "code";
    const hasSuggestions = meta["hasSuggestions"] === true;

    if (fixable && hasSuggestions) {
        return "🔧 💡";
    }

    if (fixable) {
        return "🔧";
    }

    return hasSuggestions ? "💡" : "—";
};

/** @param {string} ruleName @returns {Readonly<Record<string, unknown>>} */
const getRuleModuleByName = (ruleName) => {
    const candidate = builtPlugin.rules[ruleName];

    if (!isUnknownRecord(candidate)) {
        throw new TypeError(`Rule '${ruleName}' is missing from built plugin.`);
    }

    return candidate;
};

/** @param {string} ruleName @returns {string} */
const toPresetRuleRow = (ruleName) => {
    const ruleModule = getRuleModuleByName(ruleName);
    const meta = ruleModule["meta"];
    const docs = isUnknownRecord(meta) ? meta["docs"] : undefined;
    const docsUrl = isUnknownRecord(docs) ? docs["url"] : undefined;

    if (typeof docsUrl !== "string" || docsUrl.trim().length === 0) {
        throw new TypeError(`Rule '${ruleName}' is missing meta.docs.url.`);
    }

    return `| [\`${ruleName}\`](${docsUrl}) | ${getRuleFixIndicator(ruleModule)} |`;
};

/** @param {readonly string[]} ruleNames @returns {string} */
const createPresetRulesTable = (ruleNames) => {
    if (ruleNames.length === 0) {
        return [
            "| Rule | Fix |",
            "| --- | :-: |",
            "| — | — |",
        ].join("\n");
    }

    return [
        "| Rule | Fix |",
        "| --- | :-: |",
        ...ruleNames.map(toPresetRuleRow),
    ].join("\n");
};

/** @returns {readonly string[]} */
const createFixLegendLines = () => [
    "- `Fix` legend:",
    "  - `🔧` = autofixable",
    "  - `💡` = suggestions available",
    "  - `—` = report only",
];

/** @param {import("../dist/_internal/copilot-config-references.js").CopilotConfigName} presetConfigName */
const generatePresetRulesSection = (presetConfigName) => {
    const presetRuleNames = collectPresetRuleNames(presetConfigName);

    return [
        presetRulesSectionHeading,
        "",
        ...createFixLegendLines(),
        "",
        createPresetRulesTable(presetRuleNames),
        "",
    ].join("\n");
};

/** @param {string} markdown @returns {{ headingOffset: number; sectionEndOffset:
  number }} */
const findMatrixSectionBounds = (markdown) => {
    const headingOffset = markdown.indexOf(matrixSectionHeading);

    if (headingOffset < 0) {
        throw new Error(
            "docs/rules/presets/index.md is missing the `## Rule matrix` section heading."
        );
    }

    const nextHeadingOffset = markdown.indexOf(
        "\n## ",
        headingOffset + matrixSectionHeading.length
    );

    return {
        headingOffset,
        sectionEndOffset:
            nextHeadingOffset < 0 ? markdown.length : nextHeadingOffset + 1,
    };
};

/** @param {string} markdown @returns {string} */
const normalizeMarkdownTableSpacing = (markdown) =>
    markdown
        .replace(/\r\n/gv, "\n")
        .split("\n")
        .map((line) => {
            const trimmedLine = line.trimEnd();

            if (!/^\|.*\|$/v.test(trimmedLine)) {
                return trimmedLine;
            }

            const cells = trimmedLine
                .split("|")
                .slice(1, -1)
                .map((cell) => cell.trim());

            return `| ${cells.join(" | ")} |`;
        })
        .join("\n")
        .trimEnd();

/**
 * @param {Readonly<Record<string, Readonly<Record<string, unknown>>>>} [rules]
 *
 * @returns {string}
 */
export const generatePresetsRulesMatrixSectionFromRules = (
    rules = builtPlugin.rules
) => {
    const orderedRuleNames = Object.keys(rules).toSorted((left, right) =>
        left.localeCompare(right)
    );
    const headerRow = ["Rule", ...copilotConfigNames].join(" | ");
    const separatorRow = ["---", ...copilotConfigNames.map(() => ":-:")].join(
        " | "
    );

    const matrixRows = orderedRuleNames.map((ruleName) => {
        const meta = rules[ruleName]?.meta;
        const docs = isUnknownRecord(meta) ? meta["docs"] : undefined;
        const docsUrl = isUnknownRecord(docs) ? docs["url"] : undefined;
        const configNames =
            isUnknownRecord(docs) && Array.isArray(docs["copilotConfigNames"])
                ? docs["copilotConfigNames"]
                : [];
        const configNameSet = new Set(configNames);

        const cells = [
            typeof docsUrl === "string"
                ? `[\`${ruleName}\`](${docsUrl})`
                : `\`${ruleName}\``,
            ...copilotConfigNames.map((configName) =>
                configNameSet.has(configName) ? "✅" : "—"
            ),
        ];

        return `| ${cells.join(" | ")} |`;
    });

    return [
        matrixSectionHeading,
        "",
        `| ${headerRow} |`,
        `| ${separatorRow} |`,
        ...matrixRows,
        "",
    ].join("\n");
};

/** @param {Readonly<{ writeChanges?: boolean }>} [options] */
export const syncPresetsRulesMatrix = async (options = {}) => {
    const presetsIndexPath = resolve(
        process.cwd(),
        presetsDocsDirectoryPath,
        "index.md"
    );
    const currentIndexMarkdown = await readFile(presetsIndexPath, "utf8");
    const generatedMatrixSection = generatePresetsRulesMatrixSectionFromRules();
    const { headingOffset, sectionEndOffset } =
        findMatrixSectionBounds(currentIndexMarkdown);
    const nextIndexMarkdown =
        currentIndexMarkdown.slice(0, headingOffset) +
        generatedMatrixSection +
        currentIndexMarkdown.slice(sectionEndOffset);

    const changed =
        normalizeMarkdownTableSpacing(
            currentIndexMarkdown.slice(headingOffset, sectionEndOffset)
        ) !== normalizeMarkdownTableSpacing(generatedMatrixSection);

    if (changed && options.writeChanges === true) {
        await writeFile(presetsIndexPath, nextIndexMarkdown, "utf8");
    }

    for (const presetConfigName of copilotConfigNames) {
        const presetDocPath = resolve(
            process.cwd(),
            presetsDocsDirectoryPath,
            `${presetConfigName}.md`
        );
        const currentPresetMarkdown = await readFile(presetDocPath, "utf8");
        const headingOffset = currentPresetMarkdown.indexOf(
            presetRulesSectionHeading
        );

        if (headingOffset < 0) {
            throw new Error(
                `${presetDocPath} is missing the '${presetRulesSectionHeading}' heading.`
            );
        }

        const nextHeadingOffset = currentPresetMarkdown.indexOf(
            "\n## ",
            headingOffset + presetRulesSectionHeading.length
        );
        const sectionEndOffset =
            nextHeadingOffset < 0
                ? currentPresetMarkdown.length
                : nextHeadingOffset + 1;
        const generatedPresetSection =
            generatePresetRulesSection(presetConfigName);
        const nextPresetMarkdown =
            currentPresetMarkdown.slice(0, headingOffset) +
            generatedPresetSection +
            currentPresetMarkdown.slice(sectionEndOffset);

        if (options.writeChanges === true) {
            await writeFile(presetDocPath, nextPresetMarkdown, "utf8");
        }
    }

    return {
        changed,
        markdown: nextIndexMarkdown,
    };
};

const shouldWriteChanges = process.argv.includes("--write");

if (import.meta.url === new URL(`file://${process.argv[1]}`).href) {
    await syncPresetsRulesMatrix({ writeChanges: shouldWriteChanges });
}
