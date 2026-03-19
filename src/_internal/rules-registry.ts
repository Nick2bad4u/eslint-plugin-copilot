/**
 * @packageDocumentation
 * Canonical runtime registry of all rule modules shipped by eslint-plugin-copilot.
 */
import type { CopilotRuleModule } from "./create-copilot-rule.js";
import noBlankCustomizationBodyRule from "../rules/no-blank-customization-body.js";
import noDeprecatedAgentInferRule from "../rules/no-deprecated-agent-infer.js";
import noBlankRepositoryInstructionsRule from "../rules/no-blank-repository-instructions.js";
import noLegacyChatmodeFilesRule from "../rules/no-legacy-chatmode-files.js";
import preferQualifiedToolsRule from "../rules/prefer-qualified-tools.js";
import requireAgentToolForSubagentsRule from "../rules/require-agent-tool-for-subagents.js";
import requireChatmodeFileMetadataRule from "../rules/require-chatmode-file-metadata.js";
import requireGithubCopilotTargetForMcpServersRule from "../rules/require-github-copilot-target-for-mcp-servers.js";
import requireInstructionsApplyToRule from "../rules/require-instructions-apply-to.js";
import requirePromptFileMetadataRule from "../rules/require-prompt-file-metadata.js";
import requireQualifiedAgentHandoffModelsRule from "../rules/require-qualified-agent-handoff-models.js";
import requireRelativeAgentHookCwdRule from "../rules/require-relative-agent-hook-cwd.js";
import requireRelativePromptLinksRule from "../rules/require-relative-prompt-links.js";
import requireRepositoryInstructionsFileRule from "../rules/require-repository-instructions-file.js";
import requireValidAgentToolsRule from "../rules/require-valid-agent-tools.js";
import requireValidAgentHookEventsRule from "../rules/require-valid-agent-hook-events.js";
import requireValidAgentHandoffSendRule from "../rules/require-valid-agent-handoff-send.js";
import requireValidAgentHooksRule from "../rules/require-valid-agent-hooks.js";
import requireValidAgentHookTimeoutsRule from "../rules/require-valid-agent-hook-timeouts.js";
import requireValidAgentHandoffsRule from "../rules/require-valid-agent-handoffs.js";
import requireValidAgentInvocationControlsRule from "../rules/require-valid-agent-invocation-controls.js";
import requireValidAgentMcpServersRule from "../rules/require-valid-agent-mcp-servers.js";
import requireValidAgentModelRule from "../rules/require-valid-agent-model.js";
import requireValidPromptModelRule from "../rules/require-valid-prompt-model.js";
import requireValidAgentSubagentsRule from "../rules/require-valid-agent-subagents.js";
import requireValidAgentTargetRule from "../rules/require-valid-agent-target.js";

/** Runtime rule module shape used by registry and preset builders. */
export type RuleWithDocs = CopilotRuleModule;

/** Exact runtime rule registry shape. */
type CopilotRuleRegistry = Readonly<{
    "no-blank-customization-body": RuleWithDocs;
    "no-deprecated-agent-infer": RuleWithDocs;
    "no-blank-repository-instructions": RuleWithDocs;
    "no-legacy-chatmode-files": RuleWithDocs;
    "prefer-qualified-tools": RuleWithDocs;
    "require-agent-tool-for-subagents": RuleWithDocs;
    "require-chatmode-file-metadata": RuleWithDocs;
    "require-github-copilot-target-for-mcp-servers": RuleWithDocs;
    "require-instructions-apply-to": RuleWithDocs;
    "require-prompt-file-metadata": RuleWithDocs;
    "require-qualified-agent-handoff-models": RuleWithDocs;
    "require-relative-agent-hook-cwd": RuleWithDocs;
    "require-relative-prompt-links": RuleWithDocs;
    "require-repository-instructions-file": RuleWithDocs;
    "require-valid-agent-tools": RuleWithDocs;
    "require-valid-agent-hook-events": RuleWithDocs;
    "require-valid-agent-handoff-send": RuleWithDocs;
    "require-valid-agent-hooks": RuleWithDocs;
    "require-valid-agent-hook-timeouts": RuleWithDocs;
    "require-valid-agent-handoffs": RuleWithDocs;
    "require-valid-agent-invocation-controls": RuleWithDocs;
    "require-valid-agent-mcp-servers": RuleWithDocs;
    "require-valid-agent-model": RuleWithDocs;
    "require-valid-prompt-model": RuleWithDocs;
    "require-valid-agent-subagents": RuleWithDocs;
    "require-valid-agent-target": RuleWithDocs;
}>;

/** Runtime map of all rule modules keyed by unqualified rule name. */
const copilotRuleRegistry: CopilotRuleRegistry = {
    "no-blank-customization-body": noBlankCustomizationBodyRule,
    "no-deprecated-agent-infer": noDeprecatedAgentInferRule,
    "no-blank-repository-instructions": noBlankRepositoryInstructionsRule,
    "no-legacy-chatmode-files": noLegacyChatmodeFilesRule,
    "prefer-qualified-tools": preferQualifiedToolsRule,
    "require-agent-tool-for-subagents": requireAgentToolForSubagentsRule,
    "require-chatmode-file-metadata": requireChatmodeFileMetadataRule,
    "require-github-copilot-target-for-mcp-servers":
        requireGithubCopilotTargetForMcpServersRule,
    "require-instructions-apply-to": requireInstructionsApplyToRule,
    "require-prompt-file-metadata": requirePromptFileMetadataRule,
    "require-qualified-agent-handoff-models":
        requireQualifiedAgentHandoffModelsRule,
    "require-relative-agent-hook-cwd": requireRelativeAgentHookCwdRule,
    "require-relative-prompt-links": requireRelativePromptLinksRule,
    "require-repository-instructions-file":
        requireRepositoryInstructionsFileRule,
    "require-valid-agent-tools": requireValidAgentToolsRule,
    "require-valid-agent-hook-events": requireValidAgentHookEventsRule,
    "require-valid-agent-handoff-send": requireValidAgentHandoffSendRule,
    "require-valid-agent-hooks": requireValidAgentHooksRule,
    "require-valid-agent-hook-timeouts": requireValidAgentHookTimeoutsRule,
    "require-valid-agent-handoffs": requireValidAgentHandoffsRule,
    "require-valid-agent-invocation-controls":
        requireValidAgentInvocationControlsRule,
    "require-valid-agent-mcp-servers": requireValidAgentMcpServersRule,
    "require-valid-agent-model": requireValidAgentModelRule,
    "require-valid-prompt-model": requireValidPromptModelRule,
    "require-valid-agent-subagents": requireValidAgentSubagentsRule,
    "require-valid-agent-target": requireValidAgentTargetRule,
};

/** Exported typed view consumed by the plugin entrypoint. */
export const copilotRules: CopilotRuleRegistry = copilotRuleRegistry;

export default copilotRules;
