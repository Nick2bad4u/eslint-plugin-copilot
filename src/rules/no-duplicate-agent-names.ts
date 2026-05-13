/**
 * @packageDocumentation
 * ESLint rule implementation for `no-duplicate-agent-names`.
 */
import path from "node:path";
import { arrayJoin, isDefined } from "ts-extras";

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
import {
    listFilesRecursively,
    readUtf8File,
} from "../_internal/file-system.js";
import { extractFrontmatter } from "../_internal/frontmatter.js";
import {
    createMarkdownDocumentListener,
    reportAtDocumentStart,
} from "../_internal/markdown-rule.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";

const normalizeRelativeFilePath = (
    repositoryRoot: string,
    filePath: string
): string => path.relative(repositoryRoot, filePath).replaceAll("\\", "/");

/** Rule module for `no-duplicate-agent-names`. */
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
                            : readUtf8File(filePath);

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

            if (!isDefined(duplicateGroup)) {
                return;
            }

            reportAtDocumentStart(context, {
                data: {
                    files: arrayJoin(
                        duplicateGroup.map((entry) =>
                            normalizeRelativeFilePath(
                                repositoryRoot,
                                entry.filePath
                            )
                        ),
                        ", "
                    ),
                    name: currentAgentName,
                },
                messageId: "duplicateAgentName",
            });
        });
    },
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
            url: createRuleDocsUrl("no-duplicate-agent-names"),
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
