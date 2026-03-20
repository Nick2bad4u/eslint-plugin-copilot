/**
 * @packageDocumentation
 * Canonical runtime registry of all rule modules shipped by eslint-plugin-copilot.
 */
import type { CopilotRuleModule } from "./create-copilot-rule.js";

import noBlankCustomizationBodyRule from "../rules/no-blank-customization-body.js";
import noBlankRepositoryInstructionsRule from "../rules/no-blank-repository-instructions.js";
import noBlankSkillBodyRule from "../rules/no-blank-skill-body.js";
import noDeprecatedAgentInferRule from "../rules/no-deprecated-agent-infer.js";
import noDuplicateAgentNamesRule from "../rules/no-duplicate-agent-names.js";
import noDuplicatePromptNamesRule from "../rules/no-duplicate-prompt-names.js";
import noDuplicateSkillNamesRule from "../rules/no-duplicate-skill-names.js";
import noDuplicateSlashCommandNamesRule from "../rules/no-duplicate-slash-command-names.js";
import noEmptyRepositoryHookArraysRule from "../rules/no-empty-repository-hook-arrays.js";
import noLegacyChatmodeFilesRule from "../rules/no-legacy-chatmode-files.js";
import preferCustomInstructionsUnderCodeReviewLimitRule from "../rules/prefer-custom-instructions-under-code-review-limit.js";
import preferFastRepositoryHooksRule from "../rules/prefer-fast-repository-hooks.js";
import preferQualifiedToolsRule from "../rules/prefer-qualified-tools.js";
import requireAgentToolForSubagentsRule from "../rules/require-agent-tool-for-subagents.js";
import requireAgentsMdForCrossSurfaceAgentInstructionsRule from "../rules/require-agents-md-for-cross-surface-agent-instructions.js";
import requireChatmodeFileMetadataRule from "../rules/require-chatmode-file-metadata.js";
import requireExistingAgentHookCwdRule from "../rules/require-existing-agent-hook-cwd.js";
import requireExistingAgentMcpServersRule from "../rules/require-existing-agent-mcp-servers.js";
import requireExistingRelativeAgentLinksRule from "../rules/require-existing-relative-agent-links.js";
import requireExistingRelativeInstructionsLinksRule from "../rules/require-existing-relative-instructions-links.js";
import requireExistingRelativePromptLinksRule from "../rules/require-existing-relative-prompt-links.js";
import requireExistingRelativeSkillLinksRule from "../rules/require-existing-relative-skill-links.js";
import requireExistingRepositoryHookCwdRule from "../rules/require-existing-repository-hook-cwd.js";
import requireGithubCopilotTargetForMcpServersRule from "../rules/require-github-copilot-target-for-mcp-servers.js";
import requireInstructionsApplyToRule from "../rules/require-instructions-apply-to.js";
import requireJsonAgentMcpServersRule from "../rules/require-json-agent-mcp-servers.js";
import requirePromptFileMetadataRule from "../rules/require-prompt-file-metadata.js";
import requireQualifiedAgentHandoffModelsRule from "../rules/require-qualified-agent-handoff-models.js";
import requireRelativeAgentHookCwdRule from "../rules/require-relative-agent-hook-cwd.js";
import requireRelativeAgentLinksRule from "../rules/require-relative-agent-links.js";
import requireRelativeInstructionsLinksRule from "../rules/require-relative-instructions-links.js";
import requireRelativePromptLinksRule from "../rules/require-relative-prompt-links.js";
import requireRelativeRepositoryHookCwdRule from "../rules/require-relative-repository-hook-cwd.js";
import requireRelativeSkillLinksRule from "../rules/require-relative-skill-links.js";
import requireRepositoryHookArraysRule from "../rules/require-repository-hook-arrays.js";
import requireRepositoryHookCommandShellRule from "../rules/require-repository-hook-command-shell.js";
import requireRepositoryHooksObjectRule from "../rules/require-repository-hooks-object.js";
import requireRepositoryInstructionsFileRule from "../rules/require-repository-instructions-file.js";
import requireSkillFileLocationRule from "../rules/require-skill-file-location.js";
import requireSkillFileMetadataRule from "../rules/require-skill-file-metadata.js";
import requireSkillMdFilenameRule from "../rules/require-skill-md-filename.js";
import requireSkillNameMatchDirectoryRule from "../rules/require-skill-name-match-directory.js";
import requireStringRepositoryHookEnvValuesRule from "../rules/require-string-repository-hook-env-values.js";
import requireValidAgentArgumentHintRule from "../rules/require-valid-agent-argument-hint.js";
import requireValidAgentHandoffSendRule from "../rules/require-valid-agent-handoff-send.js";
import requireValidAgentHandoffsRule from "../rules/require-valid-agent-handoffs.js";
import requireValidAgentHookEventsRule from "../rules/require-valid-agent-hook-events.js";
import requireValidAgentHookTimeoutsRule from "../rules/require-valid-agent-hook-timeouts.js";
import requireValidAgentHooksRule from "../rules/require-valid-agent-hooks.js";
import requireValidAgentInvocationControlsRule from "../rules/require-valid-agent-invocation-controls.js";
import requireValidAgentMcpServersRule from "../rules/require-valid-agent-mcp-servers.js";
import requireValidAgentModelRule from "../rules/require-valid-agent-model.js";
import requireValidAgentNameRule from "../rules/require-valid-agent-name.js";
import requireValidAgentSubagentsRule from "../rules/require-valid-agent-subagents.js";
import requireValidAgentTargetRule from "../rules/require-valid-agent-target.js";
import requireValidAgentToolsRule from "../rules/require-valid-agent-tools.js";
import requireValidInstructionsApplyToGlobsRule from "../rules/require-valid-instructions-apply-to-globs.js";
import requireValidPromptArgumentHintRule from "../rules/require-valid-prompt-argument-hint.js";
import requireValidPromptModelRule from "../rules/require-valid-prompt-model.js";
import requireValidPromptNameRule from "../rules/require-valid-prompt-name.js";
import requireValidPromptToolsRule from "../rules/require-valid-prompt-tools.js";
import requireValidRepositoryHookCommandTypeRule from "../rules/require-valid-repository-hook-command-type.js";
import requireValidRepositoryHookEnvRule from "../rules/require-valid-repository-hook-env.js";
import requireValidRepositoryHookEventsRule from "../rules/require-valid-repository-hook-events.js";
import requireValidRepositoryHookTimeoutsRule from "../rules/require-valid-repository-hook-timeouts.js";
import requireValidRepositoryHookVersionRule from "../rules/require-valid-repository-hook-version.js";
import requireValidSkillDirectoryNameRule from "../rules/require-valid-skill-directory-name.js";
import requireValidSkillLicenseRule from "../rules/require-valid-skill-license.js";
import requireValidSkillNameRule from "../rules/require-valid-skill-name.js";

/** Runtime rule module shape used by registry and preset builders. */
export type RuleWithDocs = CopilotRuleModule;

/** Exact runtime rule registry shape. */
type CopilotRuleRegistry = Readonly<{
    "no-blank-customization-body": RuleWithDocs;
    "no-blank-repository-instructions": RuleWithDocs;
    "no-blank-skill-body": RuleWithDocs;
    "no-deprecated-agent-infer": RuleWithDocs;
    "no-duplicate-agent-names": RuleWithDocs;
    "no-duplicate-prompt-names": RuleWithDocs;
    "no-duplicate-skill-names": RuleWithDocs;
    "no-duplicate-slash-command-names": RuleWithDocs;
    "no-empty-repository-hook-arrays": RuleWithDocs;
    "no-legacy-chatmode-files": RuleWithDocs;
    "prefer-custom-instructions-under-code-review-limit": RuleWithDocs;
    "prefer-fast-repository-hooks": RuleWithDocs;
    "prefer-qualified-tools": RuleWithDocs;
    "require-agent-tool-for-subagents": RuleWithDocs;
    "require-agents-md-for-cross-surface-agent-instructions": RuleWithDocs;
    "require-chatmode-file-metadata": RuleWithDocs;
    "require-existing-agent-hook-cwd": RuleWithDocs;
    "require-existing-agent-mcp-servers": RuleWithDocs;
    "require-existing-relative-agent-links": RuleWithDocs;
    "require-existing-relative-instructions-links": RuleWithDocs;
    "require-existing-relative-prompt-links": RuleWithDocs;
    "require-existing-relative-skill-links": RuleWithDocs;
    "require-existing-repository-hook-cwd": RuleWithDocs;
    "require-github-copilot-target-for-mcp-servers": RuleWithDocs;
    "require-instructions-apply-to": RuleWithDocs;
    "require-json-agent-mcp-servers": RuleWithDocs;
    "require-prompt-file-metadata": RuleWithDocs;
    "require-qualified-agent-handoff-models": RuleWithDocs;
    "require-relative-agent-hook-cwd": RuleWithDocs;
    "require-relative-agent-links": RuleWithDocs;
    "require-relative-instructions-links": RuleWithDocs;
    "require-relative-prompt-links": RuleWithDocs;
    "require-relative-repository-hook-cwd": RuleWithDocs;
    "require-relative-skill-links": RuleWithDocs;
    "require-repository-hook-arrays": RuleWithDocs;
    "require-repository-hook-command-shell": RuleWithDocs;
    "require-repository-hooks-object": RuleWithDocs;
    "require-repository-instructions-file": RuleWithDocs;
    "require-skill-file-location": RuleWithDocs;
    "require-skill-file-metadata": RuleWithDocs;
    "require-skill-md-filename": RuleWithDocs;
    "require-skill-name-match-directory": RuleWithDocs;
    "require-string-repository-hook-env-values": RuleWithDocs;
    "require-valid-agent-argument-hint": RuleWithDocs;
    "require-valid-agent-handoff-send": RuleWithDocs;
    "require-valid-agent-handoffs": RuleWithDocs;
    "require-valid-agent-hook-events": RuleWithDocs;
    "require-valid-agent-hook-timeouts": RuleWithDocs;
    "require-valid-agent-hooks": RuleWithDocs;
    "require-valid-agent-invocation-controls": RuleWithDocs;
    "require-valid-agent-mcp-servers": RuleWithDocs;
    "require-valid-agent-model": RuleWithDocs;
    "require-valid-agent-name": RuleWithDocs;
    "require-valid-agent-subagents": RuleWithDocs;
    "require-valid-agent-target": RuleWithDocs;
    "require-valid-agent-tools": RuleWithDocs;
    "require-valid-instructions-apply-to-globs": RuleWithDocs;
    "require-valid-prompt-argument-hint": RuleWithDocs;
    "require-valid-prompt-model": RuleWithDocs;
    "require-valid-prompt-name": RuleWithDocs;
    "require-valid-prompt-tools": RuleWithDocs;
    "require-valid-repository-hook-command-type": RuleWithDocs;
    "require-valid-repository-hook-env": RuleWithDocs;
    "require-valid-repository-hook-events": RuleWithDocs;
    "require-valid-repository-hook-timeouts": RuleWithDocs;
    "require-valid-repository-hook-version": RuleWithDocs;
    "require-valid-skill-directory-name": RuleWithDocs;
    "require-valid-skill-license": RuleWithDocs;
    "require-valid-skill-name": RuleWithDocs;
}>;

/** Runtime map of all rule modules keyed by unqualified rule name. */
const copilotRuleRegistry: CopilotRuleRegistry = {
    "no-blank-customization-body": noBlankCustomizationBodyRule,
    "no-blank-repository-instructions": noBlankRepositoryInstructionsRule,
    "no-blank-skill-body": noBlankSkillBodyRule,
    "no-deprecated-agent-infer": noDeprecatedAgentInferRule,
    "no-duplicate-agent-names": noDuplicateAgentNamesRule,
    "no-duplicate-prompt-names": noDuplicatePromptNamesRule,
    "no-duplicate-skill-names": noDuplicateSkillNamesRule,
    "no-duplicate-slash-command-names": noDuplicateSlashCommandNamesRule,
    "no-empty-repository-hook-arrays": noEmptyRepositoryHookArraysRule,
    "no-legacy-chatmode-files": noLegacyChatmodeFilesRule,
    "prefer-custom-instructions-under-code-review-limit":
        preferCustomInstructionsUnderCodeReviewLimitRule,
    "prefer-fast-repository-hooks": preferFastRepositoryHooksRule,
    "prefer-qualified-tools": preferQualifiedToolsRule,
    "require-agent-tool-for-subagents": requireAgentToolForSubagentsRule,
    "require-agents-md-for-cross-surface-agent-instructions":
        requireAgentsMdForCrossSurfaceAgentInstructionsRule,
    "require-chatmode-file-metadata": requireChatmodeFileMetadataRule,
    "require-existing-agent-hook-cwd": requireExistingAgentHookCwdRule,
    "require-existing-agent-mcp-servers": requireExistingAgentMcpServersRule,
    "require-existing-relative-agent-links":
        requireExistingRelativeAgentLinksRule,
    "require-existing-relative-instructions-links":
        requireExistingRelativeInstructionsLinksRule,
    "require-existing-relative-prompt-links":
        requireExistingRelativePromptLinksRule,
    "require-existing-relative-skill-links":
        requireExistingRelativeSkillLinksRule,
    "require-existing-repository-hook-cwd":
        requireExistingRepositoryHookCwdRule,
    "require-github-copilot-target-for-mcp-servers":
        requireGithubCopilotTargetForMcpServersRule,
    "require-instructions-apply-to": requireInstructionsApplyToRule,
    "require-json-agent-mcp-servers": requireJsonAgentMcpServersRule,
    "require-prompt-file-metadata": requirePromptFileMetadataRule,
    "require-qualified-agent-handoff-models":
        requireQualifiedAgentHandoffModelsRule,
    "require-relative-agent-hook-cwd": requireRelativeAgentHookCwdRule,
    "require-relative-agent-links": requireRelativeAgentLinksRule,
    "require-relative-instructions-links": requireRelativeInstructionsLinksRule,
    "require-relative-prompt-links": requireRelativePromptLinksRule,
    "require-relative-repository-hook-cwd":
        requireRelativeRepositoryHookCwdRule,
    "require-relative-skill-links": requireRelativeSkillLinksRule,
    "require-repository-hook-arrays": requireRepositoryHookArraysRule,
    "require-repository-hook-command-shell":
        requireRepositoryHookCommandShellRule,
    "require-repository-hooks-object": requireRepositoryHooksObjectRule,
    "require-repository-instructions-file":
        requireRepositoryInstructionsFileRule,
    "require-skill-file-location": requireSkillFileLocationRule,
    "require-skill-file-metadata": requireSkillFileMetadataRule,
    "require-skill-md-filename": requireSkillMdFilenameRule,
    "require-skill-name-match-directory": requireSkillNameMatchDirectoryRule,
    "require-string-repository-hook-env-values":
        requireStringRepositoryHookEnvValuesRule,
    "require-valid-agent-argument-hint": requireValidAgentArgumentHintRule,
    "require-valid-agent-handoff-send": requireValidAgentHandoffSendRule,
    "require-valid-agent-handoffs": requireValidAgentHandoffsRule,
    "require-valid-agent-hook-events": requireValidAgentHookEventsRule,
    "require-valid-agent-hook-timeouts": requireValidAgentHookTimeoutsRule,
    "require-valid-agent-hooks": requireValidAgentHooksRule,
    "require-valid-agent-invocation-controls":
        requireValidAgentInvocationControlsRule,
    "require-valid-agent-mcp-servers": requireValidAgentMcpServersRule,
    "require-valid-agent-model": requireValidAgentModelRule,
    "require-valid-agent-name": requireValidAgentNameRule,
    "require-valid-agent-subagents": requireValidAgentSubagentsRule,
    "require-valid-agent-target": requireValidAgentTargetRule,
    "require-valid-agent-tools": requireValidAgentToolsRule,
    "require-valid-instructions-apply-to-globs":
        requireValidInstructionsApplyToGlobsRule,
    "require-valid-prompt-argument-hint": requireValidPromptArgumentHintRule,
    "require-valid-prompt-model": requireValidPromptModelRule,
    "require-valid-prompt-name": requireValidPromptNameRule,
    "require-valid-prompt-tools": requireValidPromptToolsRule,
    "require-valid-repository-hook-command-type":
        requireValidRepositoryHookCommandTypeRule,
    "require-valid-repository-hook-env": requireValidRepositoryHookEnvRule,
    "require-valid-repository-hook-events":
        requireValidRepositoryHookEventsRule,
    "require-valid-repository-hook-timeouts":
        requireValidRepositoryHookTimeoutsRule,
    "require-valid-repository-hook-version":
        requireValidRepositoryHookVersionRule,
    "require-valid-skill-directory-name": requireValidSkillDirectoryNameRule,
    "require-valid-skill-license": requireValidSkillLicenseRule,
    "require-valid-skill-name": requireValidSkillNameRule,
};

/** Exported typed view consumed by the plugin entrypoint. */
export const copilotRules: CopilotRuleRegistry = copilotRuleRegistry;

export default copilotRules;
