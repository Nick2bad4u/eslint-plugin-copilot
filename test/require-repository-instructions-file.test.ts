import { describe, expect, it } from "vitest";

import { lintMarkdownRule } from "./_internal/lint-markdown-file";

describe("require-repository-instructions-file", () => {
    it.each([
        {
            fileName: ".github/copilot-instructions.md",
            fileText: "# Repository guidance\n\nKeep prompts concise.\n",
            name: "accepts repositories that already define .github/copilot-instructions.md",
        },
        {
            fileName: ".github/instructions/copilot-instructions.md",
            fileText: "# Repository guidance\n\nKeep prompts concise.\n",
            name: "accepts repositories that define .github/instructions/copilot-instructions.md",
        },
        {
            fileName: "AGENTS.md",
            fileText:
                "# Workspace guidance\n\nPrefer scoped prompts for multi-folder repos.\n",
            name: "accepts repositories that define a root AGENTS.md",
        },
        {
            fileName: "CLAUDE.md",
            fileText:
                "# Workspace guidance\n\nPrefer scoped prompts for multi-folder repos.\n",
            name: "accepts repositories that define a root CLAUDE.md",
        },
        {
            fileName: "GEMINI.md",
            fileText:
                "# Workspace guidance\n\nPrefer scoped prompts for multi-folder repos.\n",
            name: "accepts repositories that define a root GEMINI.md",
        },
    ])("$name", async ({ fileName, fileText }) => {
        expect.hasAssertions();

        const messages = await lintMarkdownRule({
            additionalFiles: {
                [fileName]: fileText,
            },
            filePath: ".github/prompts/review.prompt.md",
            ruleId: "require-repository-instructions-file",
            text: "---\ndescription: Review the repository\nagent: ask\n---\nReview the repository for configuration drift.\n",
        });

        expect(messages).toHaveLength(0);
    });

    it("reports missing repository-wide instructions when other Copilot assets exist", async () => {
        expect.hasAssertions();

        const messages = await lintMarkdownRule({
            filePath: ".github/prompts/review.prompt.md",
            ruleId: "require-repository-instructions-file",
            text: "---\ndescription: Review the repository\nagent: ask\n---\nReview the repository for configuration drift.\n",
        });

        expect(messages.map((message) => message.messageId)).toStrictEqual([
            "missingRepositoryInstructions",
        ]);
    });
});
