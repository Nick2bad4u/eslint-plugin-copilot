import { isDefined } from "ts-extras";

import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

/**
 * @packageDocumentation
 * ESLint rule implementation for `require-existing-agent-hook-cwd`.
 */
import {
    findRepositoryRoot,
    isCustomAgentFilePath,
} from "../_internal/copilot-file-kind.js";
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import {
    isRelativeWorkspacePath,
    pathExists,
    resolveRepositoryRelativePath,
} from "../_internal/file-system.js";
import {
    extractFrontmatter,
    getFrontmatterObjectListGroups,
} from "../_internal/frontmatter.js";
import {
    createMarkdownDocumentListener,
    reportAtDocumentStart,
} from "../_internal/markdown-rule.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";

/** Rule module for `require-existing-agent-hook-cwd`. */
const requireExistingAgentHookCwdRule: CopilotRuleModule = createCopilotRule({
    create(context) {
        return createMarkdownDocumentListener(() => {
            if (!isCustomAgentFilePath(context.filename)) {
                return;
            }

            const frontmatter = extractFrontmatter(context.sourceCode.text);
            const hookGroups =
                frontmatter === null
                    ? undefined
                    : getFrontmatterObjectListGroups(frontmatter, "hooks");

            if (!isDefined(hookGroups) || hookGroups.size === 0) {
                return;
            }

            const repositoryRoot = findRepositoryRoot(context.filename);

            for (const entries of hookGroups.values()) {
                const missingCwd = entries.find((entry) => {
                    const cwd = entry["cwd"]?.trim();

                    return (
                        typeof cwd === "string" &&
                        cwd.length > 0 &&
                        isRelativeWorkspacePath(cwd) &&
                        !pathExists(
                            resolveRepositoryRelativePath(repositoryRoot, cwd)
                        )
                    );
                })?.["cwd"];

                if (!isDefined(missingCwd)) {
                    continue;
                }

                reportAtDocumentStart(context, {
                    data: {
                        cwd: missingCwd,
                    },
                    messageId: "missingAgentHookCwd",
                });

                return;
            }
        });
    },
    meta: {
        deprecated: false,
        docs: {
            copilotConfigs: ["copilot.configs.strict", "copilot.configs.all"],
            description:
                "require Copilot custom-agent hook `cwd` entries to resolve to existing repository directories.",
            frozen: false,
            recommended: false,
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-existing-agent-hook-cwd"),
        },
        messages: {
            missingAgentHookCwd:
                "Copilot custom-agent hook `cwd` value `{{cwd}}` does not resolve to an existing repository path.",
        },
        schema: [],
        type: "problem",
    },
    name: "require-existing-agent-hook-cwd",
});

export default requireExistingAgentHookCwdRule;
