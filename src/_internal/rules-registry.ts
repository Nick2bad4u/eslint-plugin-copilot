/**
 * @packageDocumentation
 * Canonical runtime registry of all rule modules shipped by eslint-plugin-copilot.
 */
import type { TSESLint } from "@typescript-eslint/utils";

import noBlankRepositoryInstructionsRule from "../rules/no-blank-repository-instructions.js";
import preferQualifiedToolsRule from "../rules/prefer-qualified-tools.js";
import requireChatmodeFileMetadataRule from "../rules/require-chatmode-file-metadata.js";
import requireInstructionsApplyToRule from "../rules/require-instructions-apply-to.js";
import requirePromptFileMetadataRule from "../rules/require-prompt-file-metadata.js";
import requireRepositoryInstructionsFileRule from "../rules/require-repository-instructions-file.js";

/** Runtime rule module shape used by registry and preset builders. */
export type RuleWithDocs = TSESLint.RuleModule<string, readonly unknown[]>;

/** Runtime map of all rule modules keyed by unqualified rule name. */
const copilotRuleRegistry = {
    "no-blank-repository-instructions": noBlankRepositoryInstructionsRule,
    "prefer-qualified-tools": preferQualifiedToolsRule,
    "require-chatmode-file-metadata": requireChatmodeFileMetadataRule,
    "require-instructions-apply-to": requireInstructionsApplyToRule,
    "require-prompt-file-metadata": requirePromptFileMetadataRule,
    "require-repository-instructions-file":
        requireRepositoryInstructionsFileRule,
} as const satisfies Readonly<Record<string, RuleWithDocs>>;

/** Exported typed view consumed by the plugin entrypoint. */
export const copilotRules = copilotRuleRegistry;

export default copilotRules;
