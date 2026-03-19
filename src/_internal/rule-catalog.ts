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
    | "no-deprecated-agent-infer"
    | "no-blank-customization-body"
    | "no-blank-repository-instructions"
    | "no-legacy-chatmode-files"
    | "prefer-qualified-tools"
    | "require-agent-tool-for-subagents"
    | "require-qualified-agent-handoff-models"
    | "require-chatmode-file-metadata"
    | "require-github-copilot-target-for-mcp-servers"
    | "require-instructions-apply-to"
    | "require-prompt-file-metadata"
    | "require-valid-prompt-model"
    | "require-relative-agent-hook-cwd"
    | "require-relative-prompt-links"
    | "require-repository-instructions-file"
    | "require-valid-agent-tools"
    | "require-valid-agent-hook-events"
    | "require-valid-agent-hooks"
    | "require-valid-agent-hook-timeouts"
    | "require-valid-agent-handoffs"
    | "require-valid-agent-handoff-send"
    | "require-valid-agent-invocation-controls"
    | "require-valid-agent-mcp-servers"
    | "require-valid-agent-model"
    | "require-valid-agent-subagents"
    | "require-valid-agent-target";

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
