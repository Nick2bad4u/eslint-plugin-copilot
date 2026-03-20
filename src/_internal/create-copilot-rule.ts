/**
 * @packageDocumentation
 * Shared rule creator wrapper used by eslint-plugin-copilot rules.
 */
import type { TSESLint } from "@typescript-eslint/utils";

import { ESLintUtils } from "@typescript-eslint/utils";

import type {
    CopilotConfigName,
    CopilotConfigReference,
} from "./copilot-config-references.js";

import { getRuleCatalogEntryForRuleName } from "./rule-catalog.js";
import { createRuleDocsUrl } from "./rule-docs-url.js";

/** Copilot-specific metadata extensions stored in `meta.docs`. */
export type CopilotRuleDocs = Readonly<{
    copilotConfigNames: readonly CopilotConfigName[];
    copilotConfigs: CopilotConfigReference | readonly CopilotConfigReference[];
    description: string;
    frozen: boolean;
    recommended: boolean;
    requiresTypeChecking: boolean;
    ruleId: string;
    ruleNumber: number;
    url: string;
}>;

/** Public runtime rule module shape emitted by this plugin. */
export type CopilotRuleModule = Readonly<{
    name: string;
}> &
    TSESLint.RuleModule<string, readonly unknown[], CopilotRuleDocs>;

type BaseRuleCreator = ReturnType<
    typeof ESLintUtils.RuleCreator<CopilotRuleInputDocs>
>;

/** Authored docs metadata accepted by individual rule modules. */
type CopilotRuleInputDocs = Readonly<{
    copilotConfigs: CopilotConfigReference | readonly CopilotConfigReference[];
    description: string;
    frozen: boolean;
    recommended: boolean;
    requiresTypeChecking: boolean;
}>;

const baseRuleCreator: BaseRuleCreator =
    ESLintUtils.RuleCreator<CopilotRuleInputDocs>(createRuleDocsUrl);

const getCopilotConfigNameFromReference = (
    reference: CopilotConfigReference
): CopilotConfigName => {
    switch (reference) {
        case "copilot.configs.all": {
            return "all";
        }

        case "copilot.configs.minimal": {
            return "minimal";
        }

        case "copilot.configs.recommended": {
            return "recommended";
        }

        case "copilot.configs.strict": {
            return "strict";
        }

        default: {
            throw new TypeError(
                `Unsupported Copilot config reference: ${reference}`
            );
        }
    }
};

/** Normalize preset references into stable preset-name keys. */
const normalizeCopilotConfigNames: (
    value: CopilotConfigReference | readonly CopilotConfigReference[]
) => readonly CopilotConfigName[] = (
    value: CopilotConfigReference | readonly CopilotConfigReference[]
) => {
    const references = Array.isArray(value) ? value : [value];
    const normalizedNames = new Set<CopilotConfigName>();

    for (const reference of references) {
        normalizedNames.add(getCopilotConfigNameFromReference(reference));
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

    return {
        ...createdRule,
        meta: {
            ...createdRule.meta,
            docs,
        },
        name: ruleDefinition.name,
    } satisfies CopilotRuleModule;
};
