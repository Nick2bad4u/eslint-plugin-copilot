/**
 * @packageDocumentation
 * Stable catalog ids for eslint-plugin-copilot rules.
 */

import { assertDefined, setHas } from "ts-extras";

/** Catalog metadata for a single Copilot rule. */
export type CopilotRuleCatalogEntry = Readonly<{
    ruleId: CopilotRuleCatalogId;
    ruleName: CopilotRuleNamePattern;
    ruleNumber: number;
}>;

/** Stable machine-friendly rule id format (for example: `R001`). */
export type CopilotRuleCatalogId = `R${string}`;

/** Pattern for unqualified rule names supported by eslint-plugin-copilot. */
type CopilotRuleNamePattern =
    | "no-blank-customization-body"
    | "no-blank-repository-instructions"
    | "no-blank-skill-body"
    | "no-deprecated-agent-infer"
    | "no-duplicate-agent-names"
    | "no-duplicate-prompt-names"
    | "no-duplicate-skill-names"
    | "no-duplicate-slash-command-names"
    | "no-empty-repository-hook-arrays"
    | "no-legacy-chatmode-files"
    | "prefer-custom-instructions-under-code-review-limit"
    | "prefer-fast-repository-hooks"
    | "prefer-qualified-tools"
    | "require-agent-tool-for-subagents"
    | "require-agents-md-for-cross-surface-agent-instructions"
    | "require-chatmode-file-metadata"
    | "require-existing-agent-hook-cwd"
    | "require-existing-agent-mcp-servers"
    | "require-existing-relative-agent-links"
    | "require-existing-relative-instructions-links"
    | "require-existing-relative-prompt-links"
    | "require-existing-relative-skill-links"
    | "require-existing-repository-hook-cwd"
    | "require-github-copilot-target-for-mcp-servers"
    | "require-instructions-apply-to"
    | "require-json-agent-mcp-servers"
    | "require-prompt-file-metadata"
    | "require-qualified-agent-handoff-models"
    | "require-relative-agent-hook-cwd"
    | "require-relative-agent-links"
    | "require-relative-instructions-links"
    | "require-relative-prompt-links"
    | "require-relative-repository-hook-cwd"
    | "require-relative-skill-links"
    | "require-repository-hook-arrays"
    | "require-repository-hook-command-shell"
    | "require-repository-hooks-object"
    | "require-repository-instructions-file"
    | "require-skill-file-location"
    | "require-skill-file-metadata"
    | "require-skill-md-filename"
    | "require-skill-name-match-directory"
    | "require-string-repository-hook-env-values"
    | "require-valid-agent-argument-hint"
    | "require-valid-agent-handoff-send"
    | "require-valid-agent-handoffs"
    | "require-valid-agent-hook-events"
    | "require-valid-agent-hook-timeouts"
    | "require-valid-agent-hooks"
    | "require-valid-agent-invocation-controls"
    | "require-valid-agent-mcp-servers"
    | "require-valid-agent-model"
    | "require-valid-agent-name"
    | "require-valid-agent-subagents"
    | "require-valid-agent-target"
    | "require-valid-agent-tools"
    | "require-valid-instructions-apply-to-globs"
    | "require-valid-prompt-argument-hint"
    | "require-valid-prompt-model"
    | "require-valid-prompt-name"
    | "require-valid-prompt-tools"
    | "require-valid-repository-hook-command-type"
    | "require-valid-repository-hook-env"
    | "require-valid-repository-hook-events"
    | "require-valid-repository-hook-timeouts"
    | "require-valid-repository-hook-version"
    | "require-valid-skill-directory-name"
    | "require-valid-skill-license"
    | "require-valid-skill-name";

/** Stable global ordering used for rule catalog ids. */
const orderedRuleNames = [
    "no-blank-customization-body",
    "no-blank-repository-instructions",
    "no-blank-skill-body",
    "no-deprecated-agent-infer",
    "no-duplicate-agent-names",
    "no-duplicate-prompt-names",
    "no-duplicate-skill-names",
    "no-duplicate-slash-command-names",
    "no-empty-repository-hook-arrays",
    "no-legacy-chatmode-files",
    "prefer-custom-instructions-under-code-review-limit",
    "prefer-fast-repository-hooks",
    "prefer-qualified-tools",
    "require-agent-tool-for-subagents",
    "require-agents-md-for-cross-surface-agent-instructions",
    "require-chatmode-file-metadata",
    "require-existing-agent-hook-cwd",
    "require-existing-agent-mcp-servers",
    "require-existing-relative-agent-links",
    "require-existing-relative-instructions-links",
    "require-existing-relative-prompt-links",
    "require-existing-relative-skill-links",
    "require-existing-repository-hook-cwd",
    "require-github-copilot-target-for-mcp-servers",
    "require-instructions-apply-to",
    "require-json-agent-mcp-servers",
    "require-prompt-file-metadata",
    "require-qualified-agent-handoff-models",
    "require-relative-agent-hook-cwd",
    "require-relative-agent-links",
    "require-relative-instructions-links",
    "require-relative-prompt-links",
    "require-relative-repository-hook-cwd",
    "require-relative-skill-links",
    "require-repository-hook-arrays",
    "require-repository-hook-command-shell",
    "require-repository-hooks-object",
    "require-repository-instructions-file",
    "require-skill-file-location",
    "require-skill-file-metadata",
    "require-skill-md-filename",
    "require-skill-name-match-directory",
    "require-string-repository-hook-env-values",
    "require-valid-agent-argument-hint",
    "require-valid-agent-handoff-send",
    "require-valid-agent-handoffs",
    "require-valid-agent-hook-events",
    "require-valid-agent-hook-timeouts",
    "require-valid-agent-hooks",
    "require-valid-agent-invocation-controls",
    "require-valid-agent-mcp-servers",
    "require-valid-agent-model",
    "require-valid-agent-name",
    "require-valid-agent-subagents",
    "require-valid-agent-target",
    "require-valid-agent-tools",
    "require-valid-instructions-apply-to-globs",
    "require-valid-prompt-argument-hint",
    "require-valid-prompt-model",
    "require-valid-prompt-name",
    "require-valid-prompt-tools",
    "require-valid-repository-hook-command-type",
    "require-valid-repository-hook-env",
    "require-valid-repository-hook-events",
    "require-valid-repository-hook-timeouts",
    "require-valid-repository-hook-version",
    "require-valid-skill-directory-name",
    "require-valid-skill-license",
    "require-valid-skill-name",
] as const satisfies readonly CopilotRuleNamePattern[];

const toRuleCatalogId = (ruleNumber: number): CopilotRuleCatalogId =>
    `R${String(ruleNumber).padStart(3, "0")}`;

/** Canonical catalog metadata entries in stable display/order form. */
export const copilotRuleCatalogEntries: readonly CopilotRuleCatalogEntry[] =
    orderedRuleNames.map((ruleName, index) => {
        const ruleNumber = index + 1;

        return {
            ruleId: toRuleCatalogId(ruleNumber),
            ruleName,
            ruleNumber,
        };
    });

/** Fast lookup map for rule catalog metadata by rule name. */
const copilotRuleCatalogByRuleName = new Map(
    copilotRuleCatalogEntries.map((entry) => [entry.ruleName, entry])
);

const copilotRuleNameSet: ReadonlySet<string> = new Set(orderedRuleNames);

const isCopilotRuleNamePattern = (
    value: string
): value is CopilotRuleNamePattern => setHas(copilotRuleNameSet, value);

/** Resolve stable catalog metadata for a rule name. */
export const getRuleCatalogEntryForRuleName = (
    ruleName: string
): CopilotRuleCatalogEntry => {
    if (!isCopilotRuleNamePattern(ruleName)) {
        throw new TypeError(`Unknown Copilot rule name: ${ruleName}`);
    }

    const entry = copilotRuleCatalogByRuleName.get(ruleName);

    assertDefined(entry);

    return entry;
};
