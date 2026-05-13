/**
 * @packageDocumentation
 * ESLint rule implementation for `require-repository-instructions-file`.
 */
import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

import {
    getCopilotFileKind,
    getRepositoryInstructionsPaths,
} from "../_internal/copilot-file-kind.js";
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import { pathExists } from "../_internal/file-system.js";
import {
    createMarkdownDocumentListener,
    reportAtDocumentStart,
} from "../_internal/markdown-rule.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";

/** Rule module for `require-repository-instructions-file`. */
const requireRepositoryInstructionsFileRule: CopilotRuleModule =
    createCopilotRule({
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

                const repositoryInstructionsPaths =
                    getRepositoryInstructionsPaths(context.filename);

                if (
                    repositoryInstructionsPaths.some(
                        (repositoryInstructionsPath) =>
                            pathExists(repositoryInstructionsPath)
                    )
                ) {
                    return;
                }

                reportAtDocumentStart(context, {
                    messageId: "missingRepositoryInstructions",
                });
            });
        },
        meta: {
            deprecated: false,
            docs: {
                copilotConfigs: [
                    "copilot.configs.strict",
                    "copilot.configs.all",
                ],
                description:
                    "require repositories that define Copilot customization assets to also provide baseline repository-level AI instructions via `.github/copilot-instructions.md`, `.github/instructions/copilot-instructions.md`, or a root `AGENTS.md`/`CLAUDE.md`/`GEMINI.md` file.",
                frozen: false,
                recommended: false,
                requiresTypeChecking: false,
                url: createRuleDocsUrl("require-repository-instructions-file"),
            },
            messages: {
                missingRepositoryInstructions:
                    "Repositories that define Copilot prompts, custom agents, legacy chat modes, agent instructions, or path-specific instructions should also provide baseline repository-level AI guidance in `.github/copilot-instructions.md`, `.github/instructions/copilot-instructions.md`, or a root `AGENTS.md`/`CLAUDE.md`/`GEMINI.md` file.",
            },
            schema: [],
            type: "suggestion",
        },
        name: "require-repository-instructions-file",
    });

export default requireRepositoryInstructionsFileRule;
