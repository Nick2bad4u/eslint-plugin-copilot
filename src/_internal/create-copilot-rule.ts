/**
 * @packageDocumentation
 * Shared rule creator wrapper used by eslint-plugin-copilot rules.
 */
import { ESLintUtils } from "@typescript-eslint/utils";

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

/** Authored docs metadata accepted by individual rule modules. */
type CopilotRuleInputDocs = Readonly<{
    copilotConfigs: readonly CopilotConfigReference[] | CopilotConfigReference;
    description: string;
    frozen: boolean;
    recommended: boolean;
    requiresTypeChecking: boolean;
}>;

type CopilotRuleCreator = ReturnType<
    typeof ESLintUtils.RuleCreator<CopilotRuleInputDocs>
>;

const baseRuleCreator =
    ESLintUtils.RuleCreator<CopilotRuleInputDocs>(createRuleDocsUrl);

/** Normalize preset references into stable preset-name keys. */
const normalizeCopilotConfigNames = (
    value: readonly CopilotConfigReference[] | CopilotConfigReference
): readonly CopilotConfigName[] => {
    const references = Array.isArray(value) ? value : [value];
    const normalizedNames = new Set<CopilotConfigName>();

    for (const reference of references) {
        normalizedNames.add(copilotConfigReferenceToName[reference]);
    }

    return [...normalizedNames];
};

/**
 * Shared rule creator that injects canonical docs URLs and stable catalog ids.
 */
export const createCopilotRule: CopilotRuleCreator = (ruleDefinition) => {
    const createdRule = baseRuleCreator(ruleDefinition);
    const catalogEntry = getRuleCatalogEntryForRuleName(ruleDefinition.name);
    const docs = createdRule.meta.docs;

    return {
        ...createdRule,
        meta: {
            ...createdRule.meta,
            docs: {
                ...docs,
                copilotConfigNames: normalizeCopilotConfigNames(
                    docs.copilotConfigs
                ),
                ruleId: catalogEntry.ruleId,
                ruleNumber: catalogEntry.ruleNumber,
                url: createRuleDocsUrl(ruleDefinition.name),
            } satisfies CopilotRuleDocs,
        },
        name: ruleDefinition.name,
    };
};
