import type { Linter } from "eslint";

import { lintCopilotFiles } from "./lint-copilot-files";

type LintMarkdownRuleInput = Readonly<{
    additionalFiles?: Readonly<Record<string, string>>;
    filePath: string;
    ruleId: string;
    text: string;
}>;

export const lintMarkdownRule = async (
    input: LintMarkdownRuleInput
): Promise<readonly Linter.LintMessage[]> => {
    const [result] = await lintCopilotFiles({
        files: {
            ...input.additionalFiles,
            [input.filePath]: input.text,
        },
        ruleId: input.ruleId,
        targetFiles: [input.filePath],
    });

    if (result === undefined) {
        return [];
    }

    return result.messages;
};
