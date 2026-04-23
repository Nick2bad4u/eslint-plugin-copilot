import { isDefined, setHas } from "ts-extras";

import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

/**
 * @packageDocumentation
 * ESLint rule implementation for `require-valid-agent-target`.
 */
import { isCustomAgentFilePath } from "../_internal/copilot-file-kind.js";
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import {
    extractFrontmatter,
    getFrontmatterScalar,
    hasFrontmatterField,
} from "../_internal/frontmatter.js";
import {
    createMarkdownDocumentListener,
    reportAtDocumentStart,
} from "../_internal/markdown-rule.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";

const VALID_AGENT_TARGETS = new Set(["github-copilot", "vscode"]);

/** Rule module for `require-valid-agent-target`. */
const requireValidAgentTargetRule: CopilotRuleModule = createCopilotRule({
    create(context) {
        return createMarkdownDocumentListener(() => {
            if (!isCustomAgentFilePath(context.filename)) {
                return;
            }

            const frontmatter = extractFrontmatter(context.sourceCode.text);

            if (
                frontmatter === null ||
                hasFrontmatterField(frontmatter, "mcp-servers") ||
                !hasFrontmatterField(frontmatter, "target")
            ) {
                return;
            }

            const target = getFrontmatterScalar(frontmatter, "target");

            if (!isDefined(target)) {
                reportAtDocumentStart(context, {
                    messageId: "emptyTarget",
                });

                return;
            }

            if (setHas(VALID_AGENT_TARGETS, target)) {
                return;
            }

            reportAtDocumentStart(context, {
                data: { target },
                messageId: "invalidTarget",
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
                "require Copilot custom-agent `target` metadata to use a documented target value when present.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-valid-agent-target"),
        },
        messages: {
            emptyTarget:
                "Copilot custom agent files that declare `target` must use a non-empty documented value (`vscode` or `github-copilot`).",
            invalidTarget:
                "Copilot custom agent `target` must be `vscode` or `github-copilot` (current value: `{{target}}`).",
        },
        schema: [],
        type: "problem",
    },
    name: "require-valid-agent-target",
});

export default requireValidAgentTargetRule;
