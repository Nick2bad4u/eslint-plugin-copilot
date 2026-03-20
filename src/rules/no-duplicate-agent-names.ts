/**
 * @packageDocumentation
 * ESLint rule implementation for `no-duplicate-agent-names`.
 */
import * as fs from "node:fs";
import * as path from "node:path";

import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

import {
    getAgentName,
    normalizeNameForComparison,
} from "../_internal/copilot-customization-names.js";
import {
    findRepositoryRoot,
    isCustomAgentFilePath,
} from "../_internal/copilot-file-kind.js";
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import { collectDuplicateNameGroups } from "../_internal/duplicate-names.js";
import { listFilesRecursively } from "../_internal/file-system.js";
import { extractFrontmatter } from "../_internal/frontmatter.js";
import {
    createMarkdownDocumentListener,
    reportAtDocumentStart,
} from "../_internal/markdown-rule.js";

const normalizeRelativeFilePath = (
    repositoryRoot: string,
    filePath: string
): string => path.relative(repositoryRoot, filePath).replaceAll("\\", "/");

const noDuplicateAgentNamesRule: CopilotRuleModule = createCopilotRule({
    create(context) {
        return createMarkdownDocumentListener(() => {
            if (!isCustomAgentFilePath(context.filename)) {
                return;
            }

            const repositoryRoot = findRepositoryRoot(context.filename);
            const agentDirectory = path.join(
                repositoryRoot,
                ".github",
                "agents"
            );
            const agentFiles = listFilesRecursively(
                agentDirectory,
                (filePath) => filePath.endsWith(".agent.md")
            );
            const duplicateGroups = collectDuplicateNameGroups(
                agentFiles.map((filePath) => {
                    const sourceText =
                        context.filename === filePath
                            ? context.sourceCode.text
                            : fs.readFileSync(filePath, "utf8");

                    return {
                        filePath,
                        name: getAgentName(
                            filePath,
                            extractFrontmatter(sourceText)
                        ),
                    };
                }),
                normalizeNameForComparison
            );
            const currentAgentName = getAgentName(
                context.filename,
                extractFrontmatter(context.sourceCode.text)
            );
            const duplicateGroup = duplicateGroups.get(
                normalizeNameForComparison(currentAgentName)
            );

            if (duplicateGroup === undefined) {
                return;
            }

            reportAtDocumentStart(context, {
                data: {
                    files: duplicateGroup
                        .map((entry) =>
                            normalizeRelativeFilePath(
                                repositoryRoot,
                                entry.filePath
                            )
                        )
                        .join(", "),
                    name: currentAgentName,
                },
                messageId: "duplicateAgentName",
            });
        });
    },
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            copilotConfigs: [
                "copilot.configs.recommended",
                "copilot.configs.strict",
                "copilot.configs.all",
            ],
            description:
                "disallow duplicate effective custom-agent names across workspace custom-agent files.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
        },
        messages: {
            duplicateAgentName:
                "Copilot custom-agent name `{{name}}` is duplicated across agent files: {{files}}.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-duplicate-agent-names",
});

export default noDuplicateAgentNamesRule;
