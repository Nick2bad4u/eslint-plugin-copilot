import { isDefined, setHas } from "ts-extras";

import type { CopilotRuleModule } from "../_internal/create-copilot-rule.js";

import { getCopilotFileKind } from "../_internal/copilot-file-kind.js";
/**
 * @packageDocumentation
 * ESLint rule implementation for `require-prompt-file-metadata`.
 */
import { createCopilotRule } from "../_internal/create-copilot-rule.js";
import {
    extractFrontmatter,
    getFrontmatterList,
    getFrontmatterScalar,
    hasFrontmatterField,
} from "../_internal/frontmatter.js";
import {
    createMarkdownDocumentListener,
    reportAtDocumentStart,
} from "../_internal/markdown-rule.js";
import { createRuleDocsUrl } from "../_internal/rule-docs-url.js";

const VALID_BUILT_IN_PROMPT_AGENTS = new Set([
    "agent",
    "ask",
    "plan",
]);

const getRequiredPromptScalar = (
    context: Parameters<CopilotRuleModule["create"]>[0],
    frontmatter: Parameters<typeof getFrontmatterScalar>[0],
    key: "agent" | "description",
    emptyMessageId: "emptyAgent" | "emptyDescription",
    missingMessageId: "missingAgent" | "missingDescription"
): string | undefined => {
    const value = getFrontmatterScalar(frontmatter, key);

    if (isDefined(value)) {
        return value;
    }

    reportAtDocumentStart(context, {
        messageId: hasFrontmatterField(frontmatter, key)
            ? emptyMessageId
            : missingMessageId,
    });

    return undefined;
};

const reportAgentToolsRequirement = (
    context: Parameters<CopilotRuleModule["create"]>[0],
    frontmatter: Parameters<typeof getFrontmatterScalar>[0],
    agent: string,
    tools: ReturnType<typeof getFrontmatterList>
): boolean => {
    if (agent === "agent") {
        if (isDefined(tools)) {
            return false;
        }

        reportAtDocumentStart(context, {
            messageId: hasFrontmatterField(frontmatter, "tools")
                ? "emptyTools"
                : "missingTools",
        });

        return true;
    }

    if (
        setHas(VALID_BUILT_IN_PROMPT_AGENTS, agent) &&
        hasFrontmatterField(frontmatter, "tools")
    ) {
        reportAtDocumentStart(context, {
            data: { agent },
            messageId: "unexpectedTools",
        });

        return true;
    }

    return false;
};

/** Rule module for `require-prompt-file-metadata`. */
const requirePromptFileMetadataRule: CopilotRuleModule = createCopilotRule({
    create: (context) =>
        createMarkdownDocumentListener(() => {
            if (getCopilotFileKind(context.filename) !== "prompt") {
                return;
            }

            const frontmatter = extractFrontmatter(context.sourceCode.text);

            if (frontmatter === null) {
                reportAtDocumentStart(context, {
                    messageId: "missingFrontmatter",
                });
                return;
            }

            const description = getRequiredPromptScalar(
                context,
                frontmatter,
                "description",
                "emptyDescription",
                "missingDescription"
            );

            if (!isDefined(description)) {
                return;
            }

            if (hasFrontmatterField(frontmatter, "mode")) {
                reportAtDocumentStart(context, {
                    messageId: "deprecatedMode",
                });
                return;
            }

            const agent = getRequiredPromptScalar(
                context,
                frontmatter,
                "agent",
                "emptyAgent",
                "missingAgent"
            );

            if (!isDefined(agent)) {
                return;
            }

            const tools = getFrontmatterList(frontmatter, "tools");

            reportAgentToolsRequirement(context, frontmatter, agent, tools);
        }),
    meta: {
        deprecated: false,
        docs: {
            copilotConfigs: [
                "copilot.configs.minimal",
                "copilot.configs.recommended",
                "copilot.configs.strict",
                "copilot.configs.all",
            ],
            description:
                "require reusable Copilot prompt files to declare description, agent, and built-in agent-mode tools metadata.",
            frozen: false,
            recommended: true,
            requiresTypeChecking: false,
            url: createRuleDocsUrl("require-prompt-file-metadata"),
        },
        messages: {
            deprecatedMode:
                "Copilot prompt files should use `agent` instead of the deprecated `mode` frontmatter key.",
            emptyAgent:
                "Copilot prompt files must define a non-empty `agent` frontmatter value.",
            emptyDescription:
                "Copilot prompt files must define a non-empty `description` frontmatter value.",
            emptyTools:
                "Built-in `agent` Copilot prompt files must define a non-empty `tools` frontmatter list.",
            missingAgent:
                "Copilot prompt files must define an `agent` frontmatter value.",
            missingDescription:
                "Copilot prompt files must define a `description` frontmatter value.",
            missingFrontmatter:
                "Copilot prompt files must start with YAML frontmatter that declares at least `description` and `agent`.",
            missingTools:
                "Built-in `agent` Copilot prompt files must define a `tools` frontmatter list.",
            unexpectedTools:
                "Copilot prompt files should only declare `tools` when `agent` is the built-in `agent` mode (current agent: `{{agent}}`).",
        },
        schema: [],
        type: "problem",
    },
    name: "require-prompt-file-metadata",
});

export default requirePromptFileMetadataRule;
