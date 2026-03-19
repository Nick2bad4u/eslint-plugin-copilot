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
    | "no-blank-repository-instructions"
    | "prefer-qualified-tools"
    | "require-chatmode-file-metadata"
    | "require-instructions-apply-to"
    | "require-prompt-file-metadata"
    | "require-repository-instructions-file";

/** Stable global ordering used for rule catalog ids. */
const orderedRuleNames = [
    "require-instructions-apply-to",
    "require-prompt-file-metadata",
    "require-chatmode-file-metadata",
    "no-blank-repository-instructions",
    "require-repository-instructions-file",
    "prefer-qualified-tools",
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
