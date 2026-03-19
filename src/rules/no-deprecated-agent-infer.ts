/**
 * @packageDocumentation
 * ESLint rule implementation for `no-deprecated-agent-infer`.
 */
import { isCustomAgentFilePath } from "../_internal/copilot-file-kind.js";
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";
import {
    extractFrontmatter,
    hasFrontmatterField,
} from "../_internal/frontmatter.js";
import {
    createMarkdownDocumentListener,
    reportAtDocumentStart,
} from "../_internal/markdown-rule.js";

const noDeprecatedAgentInferRule: CopilotRuleModule = createCopilotRule({
    create(context) {
        return createMarkdownDocumentListener(() => {
            if (!isCustomAgentFilePath(context.filename)) {
                return;
            }

            const frontmatter = extractFrontmatter(context.sourceCode.text);

            if (
                frontmatter === null ||
                !hasFrontmatterField(frontmatter, "infer")
            ) {
                return;
            }

            reportAtDocumentStart(context, {
                messageId: "deprecatedInfer",
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
                "disallow deprecated `infer` frontmatter in Copilot custom agent files.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
        },
        messages: {
            deprecatedInfer:
                "Copilot custom agent files should replace deprecated `infer` frontmatter with `user-invocable` and/or `disable-model-invocation`.",
        },
        schema: [],
        type: "problem",
    },
    name: "no-deprecated-agent-infer",
});

export default noDeprecatedAgentInferRule;
