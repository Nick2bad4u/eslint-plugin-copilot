import * as jsonModule from "@eslint/json";
import * as markdownModule from "@eslint/markdown";
import { ESLint, type Linter } from "eslint";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";

import plugin from "../../src/plugin";

export type CopilotFixtureFileMap = Readonly<Record<string, string>>;

export type LintCopilotFileResult = Readonly<{
    filePath: string;
    messages: readonly Linter.LintMessage[];
}>;

type LintCopilotFilesInput = Readonly<{
    files: CopilotFixtureFileMap;
    ruleId: string;
    targetFiles?: readonly string[];
}>;

const copilotEslintPlugin = plugin as ESLint.Plugin;
const markdownPlugin = markdownModule.default as unknown as ESLint.Plugin;
const jsonPlugin = jsonModule.default as unknown as ESLint.Plugin;

const writeFixtureFile = async (
    rootDirectoryPath: string,
    relativeFilePath: string,
    content: string
): Promise<void> => {
    const absoluteFilePath = path.join(rootDirectoryPath, relativeFilePath);

    await fs.mkdir(path.dirname(absoluteFilePath), { recursive: true });
    await fs.writeFile(absoluteFilePath, content, "utf8");
};

const createLintConfig = (ruleId: string): Linter.Config[] => [
    {
        files: ["**/*.md"],
        language: "markdown/gfm",
        plugins: {
            copilot: copilotEslintPlugin,
            markdown: markdownPlugin,
        },
        rules: {
            [`copilot/${ruleId}`]: "error",
        },
    },
    {
        files: ["**/*.json"],
        language: "json/json",
        plugins: {
            copilot: copilotEslintPlugin,
            json: jsonPlugin,
        },
        rules: {
            [`copilot/${ruleId}`]: "error",
        },
    },
];

export const lintCopilotFiles = async (
    input: LintCopilotFilesInput
): Promise<readonly LintCopilotFileResult[]> => {
    const temporaryRoot = await fs.mkdtemp(
        path.join(os.tmpdir(), "eslint-plugin-copilot-")
    );

    try {
        await writeFixtureFile(
            temporaryRoot,
            "package.json",
            JSON.stringify({ name: "fixture-repo", private: true }, null, 2)
        );

        for (const [relativePath, content] of Object.entries(input.files)) {
            await writeFixtureFile(temporaryRoot, relativePath, content);
        }

        const eslint = new ESLint({
            cwd: temporaryRoot,
            overrideConfig: createLintConfig(input.ruleId),
            overrideConfigFile: true,
        });
        const lintTargets = (input.targetFiles ?? Object.keys(input.files)).map(
            (relativePath) => path.join(temporaryRoot, relativePath)
        );
        const results = await eslint.lintFiles(lintTargets);

        return results.map((result) => ({
            filePath: path
                .relative(temporaryRoot, result.filePath)
                .replaceAll("\\", "/"),
            messages: result.messages,
        }));
    } finally {
        await fs.rm(temporaryRoot, { force: true, recursive: true });
    }
};
