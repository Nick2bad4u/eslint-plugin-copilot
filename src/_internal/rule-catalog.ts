/**
 * @packageDocumentation
 * Stable catalog ids for eslint-plugin-copilot rules.
 */

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
    "require-instructions-apply-to",
    "require-prompt-file-metadata",
    "require-chatmode-file-metadata",
    "no-blank-repository-instructions",
    "require-repository-instructions-file",
    "prefer-qualified-tools",
    "no-deprecated-agent-infer",
    "require-agent-tool-for-subagents",
    "no-blank-customization-body",
    "require-github-copilot-target-for-mcp-servers",
    "no-legacy-chatmode-files",
    "require-valid-agent-handoffs",
    "require-qualified-agent-handoff-models",
    "require-valid-agent-hook-events",
    "require-valid-agent-hooks",
    "require-valid-agent-hook-timeouts",
    "require-valid-agent-subagents",
    "require-relative-agent-hook-cwd",
    "require-valid-agent-target",
    "require-valid-agent-invocation-controls",
    "require-valid-agent-handoff-send",
    "require-valid-agent-model",
    "require-valid-agent-mcp-servers",
    "require-relative-prompt-links",
    "require-valid-agent-tools",
    "require-valid-prompt-model",
    "require-valid-prompt-tools",
    "require-relative-agent-links",
    "require-relative-instructions-links",
    "require-existing-relative-prompt-links",
    "require-existing-relative-agent-links",
    "require-existing-relative-instructions-links",
    "require-existing-agent-mcp-servers",
    "require-json-agent-mcp-servers",
    "require-existing-agent-hook-cwd",
    "prefer-custom-instructions-under-code-review-limit",
    "require-agents-md-for-cross-surface-agent-instructions",
    "no-duplicate-prompt-names",
    "no-duplicate-agent-names",
    "require-valid-prompt-name",
    "require-valid-prompt-argument-hint",
    "require-valid-agent-name",
    "require-valid-agent-argument-hint",
    "require-valid-instructions-apply-to-globs",
    "require-skill-file-location",
    "require-skill-file-metadata",
    "no-blank-skill-body",
    "require-valid-skill-name",
    "require-valid-skill-directory-name",
    "require-skill-name-match-directory",
    "require-valid-skill-license",
    "require-relative-skill-links",
    "require-existing-relative-skill-links",
    "no-duplicate-skill-names",
    "require-skill-md-filename",
    "require-valid-repository-hook-version",
    "require-repository-hooks-object",
    "require-repository-hook-arrays",
    "require-valid-repository-hook-events",
    "require-valid-repository-hook-command-type",
    "require-repository-hook-command-shell",
    "require-relative-repository-hook-cwd",
    "require-existing-repository-hook-cwd",
    "require-valid-repository-hook-timeouts",
    "require-valid-repository-hook-env",
    "require-string-repository-hook-env-values",
    "no-empty-repository-hook-arrays",
    "prefer-fast-repository-hooks",
    "no-duplicate-slash-command-names",
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

/** Resolve stable catalog metadata for a rule name. */
export const getRuleCatalogEntryForRuleName = (
    ruleName: string
): CopilotRuleCatalogEntry => {
    const entry = copilotRuleCatalogByRuleName.get(
        ruleName as CopilotRuleNamePattern
    );

    if (entry === undefined) {
        throw new TypeError(
            `Rule '${ruleName}' is missing from the stable rule catalog.`
        );
    }

    return entry;
};
