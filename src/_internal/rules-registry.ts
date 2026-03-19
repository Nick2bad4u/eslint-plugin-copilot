/**
 * @packageDocumentation
 * Canonical runtime registry of all rule modules shipped by eslint-plugin-copilot.
 */
import type { CopilotRuleModule } from "./create-copilot-rule.js";
import noBlankRepositoryInstructionsRule from "../rules/no-blank-repository-instructions.js";
import preferQualifiedToolsRule from "../rules/prefer-qualified-tools.js";
import requireChatmodeFileMetadataRule from "../rules/require-chatmode-file-metadata.js";
import requireInstructionsApplyToRule from "../rules/require-instructions-apply-to.js";
import requirePromptFileMetadataRule from "../rules/require-prompt-file-metadata.js";
import requireRepositoryInstructionsFileRule from "../rules/require-repository-instructions-file.js";

/** Runtime rule module shape used by registry and preset builders. */
export type RuleWithDocs = CopilotRuleModule;

/** Exact runtime rule registry shape. */
type CopilotRuleRegistry = Readonly<{
    "no-blank-repository-instructions": RuleWithDocs;
    "prefer-qualified-tools": RuleWithDocs;
    "require-chatmode-file-metadata": RuleWithDocs;
    "require-instructions-apply-to": RuleWithDocs;
    "require-prompt-file-metadata": RuleWithDocs;
    "require-repository-instructions-file": RuleWithDocs;
}>;

/** Runtime map of all rule modules keyed by unqualified rule name. */
const copilotRuleRegistry: CopilotRuleRegistry = {
    "no-blank-repository-instructions": noBlankRepositoryInstructionsRule,
    "prefer-qualified-tools": preferQualifiedToolsRule,
    "require-chatmode-file-metadata": requireChatmodeFileMetadataRule,
    "require-instructions-apply-to": requireInstructionsApplyToRule,
    "require-prompt-file-metadata": requirePromptFileMetadataRule,
    "require-repository-instructions-file":
        requireRepositoryInstructionsFileRule,
};

/** Exported typed view consumed by the plugin entrypoint. */
export const copilotRules: CopilotRuleRegistry = copilotRuleRegistry;

export default copilotRules;
