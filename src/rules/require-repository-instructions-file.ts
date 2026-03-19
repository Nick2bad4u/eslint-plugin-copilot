/**
 * @packageDocumentation
 * ESLint rule implementation for `require-repository-instructions-file`.
 */
import * as fs from "node:fs";

import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import {
    getCopilotFileKind,
    getRepositoryInstructionsPath,
} from "../_internal/copilot-file-kind.js";
import {
    createMarkdownDocumentListener,
    reportAtDocumentStart,
} from "../_internal/markdown-rule.js";

const requireRepositoryInstructionsFileRule = createCopilotRule({
    create(context) {
        return createMarkdownDocumentListener(() => {
            const fileKind = getCopilotFileKind(context.filename);

            if (
                fileKind !== "agent-instructions" &&
                fileKind !== "chatmode" &&
                fileKind !== "instructions" &&
                fileKind !== "prompt"
            ) {
                return;
            }

            const repositoryInstructionsPath = getRepositoryInstructionsPath(
                context.filename
            );

            if (fs.existsSync(repositoryInstructionsPath)) {
                return;
            }

            reportAtDocumentStart(context, {
                messageId: "missingRepositoryInstructions",
            });
        });
    },
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            copilotConfigs: ["copilot.configs.strict", "copilot.configs.all"],
            description:
                "require repositories that define Copilot customization assets to also provide `.github/copilot-instructions.md`.",
            frozen: false,
            recommended: false,
            requiresTypeChecking: false,
        },
        messages: {
            missingRepositoryInstructions:
                "Repositories that define Copilot prompts, chat modes, agent instructions, or path-specific instructions should also provide `.github/copilot-instructions.md` for baseline repository guidance.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "require-repository-instructions-file",
});

export default requireRepositoryInstructionsFileRule;
