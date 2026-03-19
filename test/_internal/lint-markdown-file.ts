import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";

import { ESLint, type Linter } from "eslint";
import markdown from "@eslint/markdown";

import copilotPlugin from "../../src/plugin";

type LintMarkdownRuleInput = Readonly<{
    additionalFiles?: Readonly<Record<string, string>>;
    filePath: string;
    ruleId: string;
    text: string;
}>;

const writeFixtureFile = async (
    rootDirectoryPath: string,
    relativeFilePath: string,
    content: string
): Promise<void> => {
    const absoluteFilePath = path.join(rootDirectoryPath, relativeFilePath);

    await fs.mkdir(path.dirname(absoluteFilePath), { recursive: true });
    await fs.writeFile(absoluteFilePath, content, "utf8");
};

const createLintConfig = (ruleId: string): readonly Linter.Config[] => [
    {
        files: ["**/*.md"],
        language: "markdown/gfm",
        plugins: {
            copilot: copilotPlugin,
            markdown,
        },
        rules: {
            [`copilot/${ruleId}`]: "error",
        },
    },
];

export const lintMarkdownRule = async (
    input: LintMarkdownRuleInput
): Promise<readonly Linter.LintMessage[]> => {
    const temporaryRoot = await fs.mkdtemp(
        path.join(os.tmpdir(), "eslint-plugin-copilot-")
    );

    try {
        await writeFixtureFile(
            temporaryRoot,
            "package.json",
            JSON.stringify({ name: "fixture-repo", private: true }, null, 2)
        );

        for (const [relativePath, content] of Object.entries(
            input.additionalFiles ?? {}
        )) {
            await writeFixtureFile(temporaryRoot, relativePath, content);
        }

        await writeFixtureFile(temporaryRoot, input.filePath, input.text);

        const eslint = new ESLint({
            cwd: temporaryRoot,
            overrideConfig: createLintConfig(input.ruleId),
            overrideConfigFile: true,
        });
        const [result] = await eslint.lintFiles([
            path.join(temporaryRoot, input.filePath),
        ]);

        return result?.messages ?? [];
    } finally {
        await fs.rm(temporaryRoot, { force: true, recursive: true });
    }
};
