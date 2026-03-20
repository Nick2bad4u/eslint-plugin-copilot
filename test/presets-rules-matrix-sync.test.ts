import * as fs from "node:fs/promises";
import * as path from "node:path";
import { describe, expect, it } from "vitest";

import { generatePresetsRulesMatrixSectionFromRules } from "../scripts/sync-presets-rules-matrix.mjs";
import copilotPlugin from "../src/plugin";

const normalizeMarkdownForComparison = (markdown: string): string =>
    markdown.replaceAll("\r\n", "\n").trimEnd();

describe("presets rules matrix synchronization", () => {
    it("matches the canonical matrix generated from plugin metadata", async () => {
        const presetsMarkdown = normalizeMarkdownForComparison(
            await fs.readFile(
                path.join(
                    process.cwd(),
                    "docs",
                    "rules",
                    "presets",
                    "index.md"
                ),
                "utf8"
            )
        );

        const headingOffset = presetsMarkdown.indexOf("## Rule matrix");
        const nextHeadingOffset = presetsMarkdown.indexOf(
            "\n## ",
            headingOffset + 1
        );
        const section = presetsMarkdown.slice(
            headingOffset,
            nextHeadingOffset === -1
                ? presetsMarkdown.length
                : nextHeadingOffset + 1
        );

        expect(normalizeMarkdownForComparison(section)).toBe(
            normalizeMarkdownForComparison(
                generatePresetsRulesMatrixSectionFromRules(copilotPlugin.rules)
            )
        );
    });
});
