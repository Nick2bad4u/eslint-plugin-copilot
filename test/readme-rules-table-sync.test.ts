import * as fs from "node:fs/promises";
import * as path from "node:path";
import { describe, expect, it } from "vitest";

import { generateReadmeRulesSectionFromRules } from "../scripts/sync-readme-rules-table.mjs";
import copilotPlugin from "../src/plugin";

const normalizeMarkdownForComparison = (markdown: string): string =>
    markdown.replaceAll("\r\n", "\n").trimEnd();

const extractRulesSection = (markdown: string): string => {
    const headingOffset = markdown.indexOf("## Rules");

    if (headingOffset === -1) {
        throw new Error("README.md is missing the `## Rules` section heading.");
    }

    const nextHeadingOffset = markdown.indexOf("\n## ", headingOffset + 1);

    return markdown.slice(
        headingOffset,
        nextHeadingOffset === -1 ? markdown.length : nextHeadingOffset
    );
};

describe("readme rules table synchronization", () => {
    it("matches the canonical rules matrix generated from plugin metadata", async () => {
        const readmeMarkdown = normalizeMarkdownForComparison(
            await fs.readFile(path.join(process.cwd(), "README.md"), "utf8")
        );

        expect(
            normalizeMarkdownForComparison(extractRulesSection(readmeMarkdown))
        ).toBe(
            normalizeMarkdownForComparison(
                generateReadmeRulesSectionFromRules(copilotPlugin.rules)
            )
        );
    });
});
