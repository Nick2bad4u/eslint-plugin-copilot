/**
 * @packageDocumentation
 * Synchronize or validate the README rules matrix from canonical rule metadata.
 */
// @ts-check

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import builtPlugin from "../dist/plugin.js";
import {
    copilotConfigMetadataByName,
    copilotConfigNamesByReadmeOrder,
} from "../dist/_internal/copilot-config-references.js";

/** @typedef {import("../dist/_internal/copilot-config-references.js").CopilotConfigName} PresetName */

const rulesSectionHeading = "## Rules";
const PRESET_DOCS_URL_BASE =
    "https://nick2bad4u.github.io/eslint-plugin-copilot/docs/rules/presets";

const presetOrder = [...copilotConfigNamesByReadmeOrder];

/**
 * @param {string} markdown
 *
 * @returns {{ endOffset: number; startOffset: number }}
 */
const getReadmeRulesSectionBounds = (markdown) => {
    const startOffset = markdown.indexOf(rulesSectionHeading);

    if (startOffset < 0) {
        throw new Error("README.md is missing the '## Rules' section heading.");
    }

    const nextHeadingOffset = markdown.indexOf(
        "\n## ",
        startOffset + rulesSectionHeading.length
    );

    return {
        endOffset: nextHeadingOffset < 0 ? markdown.length : nextHeadingOffset,
        startOffset,
    };
};

/**
 * @param {string} markdown
 *
 * @returns {string}
 */
export const normalizeRulesSectionMarkdown = (markdown) =>
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

/** @type {Readonly<Record<PresetName, string>>} */
const presetConfigReferenceByName = {
    all: "copilot.configs.all",
    minimal: "copilot.configs.minimal",
    recommended: "copilot.configs.recommended",
    strict: "copilot.configs.strict",
};

/**
 * @param {PresetName} presetName
 *
 * @returns {string}
 */
const createPresetDocsUrl = (presetName) =>
    `${PRESET_DOCS_URL_BASE}/${presetName}`;

/** @returns {readonly string[]} */
const createPresetLegendLines = () =>
    presetOrder.map((presetName) => {
        const docsUrl = createPresetDocsUrl(presetName);
        const presetIcon = copilotConfigMetadataByName[presetName].icon;
        const configReference = presetConfigReferenceByName[presetName];

        return `  - [${presetIcon}](${docsUrl}) — [\`${configReference}\`](${docsUrl})`;
    });

/**
 * @param {Readonly<Record<string, unknown>>} ruleModule
 *
 * @returns {"—" | "💡" | "🔧" | "🔧 💡"}
 */
const getRuleFixIndicator = (ruleModule) => {
    const meta = ruleModule["meta"];

    if (typeof meta !== "object" || meta === null) {
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

/**
 * @param {Readonly<Record<string, unknown>>} ruleModule
 *
 * @returns {readonly PresetName[]}
 */
const getPresetNamesForRule = (ruleModule) => {
    const meta = ruleModule["meta"];

    if (typeof meta !== "object" || meta === null) {
        return [];
    }

    const docs = meta["docs"];

    if (typeof docs !== "object" || docs === null) {
        return [];
    }

    const configNames = docs["copilotConfigNames"];

    return Array.isArray(configNames)
        ? /** @type {readonly PresetName[]} */ (configNames)
        : [];
};

/**
 * @param {Readonly<Record<string, unknown>>} ruleModule
 *
 * @returns {string}
 */
const getPresetIndicator = (ruleModule) => {
    const presetNames = new Set(getPresetNamesForRule(ruleModule));
    const icons = [];

    for (const presetName of presetOrder) {
        if (!presetNames.has(presetName)) {
            continue;
        }

        const docsUrl = createPresetDocsUrl(presetName);
        const presetIcon = copilotConfigMetadataByName[presetName].icon;

        icons.push(`[${presetIcon}](${docsUrl})`);
    }

    return icons.length === 0 ? "—" : icons.join(" ");
};

/**
 * @param {readonly [string, Readonly<Record<string, unknown>>]} entry
 *
 * @returns {string}
 */
const toRuleTableRow = ([ruleName, ruleModule]) => {
    const meta = ruleModule["meta"];
    const docs =
        typeof meta === "object" && meta !== null ? meta["docs"] : undefined;
    const docsUrl =
        typeof docs === "object" && docs !== null ? docs["url"] : undefined;

    if (typeof docsUrl !== "string" || docsUrl.trim().length === 0) {
        throw new TypeError(`Rule '${ruleName}' is missing meta.docs.url.`);
    }

    return `| [\`${ruleName}\`](${docsUrl}) | ${getRuleFixIndicator(ruleModule)} | ${getPresetIndicator(ruleModule)} |`;
};

/**
 * @param {Readonly<Record<string, Readonly<Record<string, unknown>>>>} rules
 *
 * @returns {string}
 */
export const generateReadmeRulesSectionFromRules = (rules) => {
    const ruleEntries = Object.entries(rules).toSorted((left, right) =>
        left[0].localeCompare(right[0])
    );
    const rows = ruleEntries.map(toRuleTableRow);

    return [
        "## Rules",
        "",
        "- `Fix` legend:",
        "  - `🔧` = autofixable",
        "  - `💡` = suggestions available",
        "  - `—` = report only",
        "- `Preset key` legend:",
        ...createPresetLegendLines(),
        "",
        "| Rule | Fix | Preset key |",
        "| --- | :-: | --- |",
        ...rows,
    ].join("\n");
};

/**
 * @param {Readonly<{ writeChanges?: boolean }>} [options]
 *
 * @returns {Promise<{ changed: boolean; markdown: string }>}
 */
export const syncReadmeRulesTable = async (options = {}) => {
    const readmePath = resolve(process.cwd(), "README.md");
    const currentMarkdown = await readFile(readmePath, "utf8");
    const generatedSection = generateReadmeRulesSectionFromRules(
        /** @type {Readonly<
    Record<string, Readonly<Record<string, unknown>>>
>} */ (builtPlugin.rules)
    );
    const { endOffset, startOffset } =
        getReadmeRulesSectionBounds(currentMarkdown);
    const nextMarkdown =
        currentMarkdown.slice(0, startOffset) +
        generatedSection +
        currentMarkdown.slice(endOffset);
    const changed =
        normalizeRulesSectionMarkdown(
            currentMarkdown.slice(startOffset, endOffset)
        ) !== normalizeRulesSectionMarkdown(generatedSection);

    if (changed && options.writeChanges === true) {
        await writeFile(readmePath, nextMarkdown, "utf8");
    }

    return {
        changed,
        markdown: nextMarkdown,
    };
};

const shouldWriteChanges = process.argv.includes("--write");

if (import.meta.url === new URL(`file://${process.argv[1]}`).href) {
    await syncReadmeRulesTable({ writeChanges: shouldWriteChanges });
}
