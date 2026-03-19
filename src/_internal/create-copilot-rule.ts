/**
 * @packageDocumentation
 * Shared rule creator wrapper used by eslint-plugin-copilot rules.
 */
import { ESLintUtils, TSESLint } from "@typescript-eslint/utils";

import {
    copilotConfigReferenceToName,
    type CopilotConfigName,
    type CopilotConfigReference,
} from "./copilot-config-references.js";
import { getRuleCatalogEntryForRuleName } from "./rule-catalog.js";
import { createRuleDocsUrl } from "./rule-docs-url.js";

/** Copilot-specific metadata extensions stored in `meta.docs`. */
export type CopilotRuleDocs = Readonly<{
    copilotConfigNames: readonly CopilotConfigName[];
    copilotConfigs: readonly CopilotConfigReference[] | CopilotConfigReference;
    description: string;
    frozen: boolean;
    recommended: boolean;
    requiresTypeChecking: boolean;
    ruleId: string;
    ruleNumber: number;
    url: string;
}>;

/** Public runtime rule module shape emitted by this plugin. */
export type CopilotRuleModule = TSESLint.RuleModule<
    string,
    readonly unknown[],
    CopilotRuleDocs
> &
    Readonly<{
        name: string;
    }>;

/** Authored docs metadata accepted by individual rule modules. */
type CopilotRuleInputDocs = Readonly<{
    copilotConfigs: readonly CopilotConfigReference[] | CopilotConfigReference;
    description: string;
    frozen: boolean;
    recommended: boolean;
    requiresTypeChecking: boolean;
}>;

type BaseRuleCreator = ReturnType<
    typeof ESLintUtils.RuleCreator<CopilotRuleInputDocs>
>;

const baseRuleCreator: BaseRuleCreator =
    ESLintUtils.RuleCreator<CopilotRuleInputDocs>(createRuleDocsUrl);

/** Normalize preset references into stable preset-name keys. */
const normalizeCopilotConfigNames: (
    value: readonly CopilotConfigReference[] | CopilotConfigReference
) => readonly CopilotConfigName[] = (
    value: readonly CopilotConfigReference[] | CopilotConfigReference
) => {
    const references = Array.isArray(value) ? value : [value];
    const normalizedNames = new Set<CopilotConfigName>();

    for (const reference of references) {
        normalizedNames.add(
            copilotConfigReferenceToName[reference as CopilotConfigReference]
        );
    }

    return [...normalizedNames];
};

/**
 * Shared rule creator that injects canonical docs URLs and stable catalog ids.
 */
export const createCopilotRule = <
    Options extends readonly unknown[],
    MessageIds extends string,
>(
    ruleDefinition: Parameters<typeof baseRuleCreator<Options, MessageIds>>[0]
): CopilotRuleModule => {
    const createdRule = baseRuleCreator(ruleDefinition);
    const catalogEntry = getRuleCatalogEntryForRuleName(ruleDefinition.name);
    const authoredDocs = ruleDefinition.meta.docs;
    const docs: CopilotRuleDocs = {
        ...authoredDocs,
        copilotConfigNames: normalizeCopilotConfigNames(
            authoredDocs.copilotConfigs
        ),
        ruleId: catalogEntry.ruleId,
        ruleNumber: catalogEntry.ruleNumber,
        url: createRuleDocsUrl(ruleDefinition.name),
    };

    const decoratedRule = createdRule as unknown as CopilotRuleModule;

    decoratedRule.meta.docs = docs;
    decoratedRule.name = ruleDefinition.name;

    return decoratedRule;
};
