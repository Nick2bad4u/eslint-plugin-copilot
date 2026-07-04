/**
 * @packageDocumentation
 * Shared Copilot preset/config reference constants and type guards.
 */

import type { ArrayValues } from "type-fest";

/** Canonical flat-config preset keys exposed through `plugin.configs`. */
import { objectHasOwn } from "ts-extras";

/** Stable base preset names used across docs, README tables, and rule metadata. */
export const copilotBaseConfigNames = [
    "all",
    "minimal",
    "recommended",
    "strict",
] as const;

/** Preset variants for shareable configs that already register language plugins. */
export const copilotNoLanguagePluginConfigNames = [
    "all-without-language-plugins",
    "minimal-without-language-plugins",
    "recommended-without-language-plugins",
    "strict-without-language-plugins",
] as const;

/** Canonical flat-config preset keys exposed through `plugin.configs`. */
export const copilotConfigNames: readonly [
    ...typeof copilotBaseConfigNames,
    ...typeof copilotNoLanguagePluginConfigNames,
] = [...copilotBaseConfigNames, ...copilotNoLanguagePluginConfigNames];

/** Canonical base preset key type used by rule metadata and docs matrices. */
export type CopilotBaseConfigName = ArrayValues<typeof copilotBaseConfigNames>;

/** Metadata contract shared across preset wiring, docs, and README rendering. */
export type CopilotConfigMetadata = Readonly<{
    icon: string;
    presetName: `copilot:${CopilotBaseConfigName}`;
    readmeOrder: number;
    requiresTypeChecking: boolean;
}>;

/** Canonical flat-config preset key type exposed through `plugin.configs`. */
export type CopilotConfigName = ArrayValues<typeof copilotConfigNames>;

/** Fully-qualified preset reference lookup object shape. */
type CopilotConfigReferenceMap = Readonly<{
    "copilot.configs.all": "all";
    "copilot.configs.minimal": "minimal";
    "copilot.configs.recommended": "recommended";
    "copilot.configs.strict": "strict";
}>;

/** Canonical metadata for every exported `copilot` preset key. */
export const copilotConfigMetadataByName: Readonly<
    Record<CopilotBaseConfigName, CopilotConfigMetadata>
> = {
    all: {
        icon: "🟣",
        presetName: "copilot:all",
        readmeOrder: 4,
        requiresTypeChecking: false,
    },
    minimal: {
        icon: "🟢",
        presetName: "copilot:minimal",
        readmeOrder: 1,
        requiresTypeChecking: false,
    },
    recommended: {
        icon: "🟡",
        presetName: "copilot:recommended",
        readmeOrder: 2,
        requiresTypeChecking: false,
    },
    strict: {
        icon: "🔴",
        presetName: "copilot:strict",
        readmeOrder: 3,
        requiresTypeChecking: false,
    },
};

/** Stable README legend/rendering order for preset icons. */
export const copilotConfigNamesByReadmeOrder: readonly CopilotBaseConfigName[] =
    [
        "minimal",
        "recommended",
        "strict",
        "all",
    ];

/** Fully-qualified preset reference lookup used by rule docs metadata. */
export const copilotConfigReferenceToName: CopilotConfigReferenceMap = {
    "copilot.configs.all": "all",
    "copilot.configs.minimal": "minimal",
    "copilot.configs.recommended": "recommended",
    "copilot.configs.strict": "strict",
};

/** Fully-qualified preset reference type accepted in docs metadata. */
export type CopilotConfigReference = keyof typeof copilotConfigReferenceToName;

/** Check whether a string is a supported docs preset reference. */
export const isCopilotConfigReference: (
    value: string
) => value is CopilotConfigReference = (
    value
): value is CopilotConfigReference =>
    objectHasOwn(copilotConfigReferenceToName, value);
