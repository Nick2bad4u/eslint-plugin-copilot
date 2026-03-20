/**
 * @packageDocumentation
 * Shared Copilot preset/config reference constants and type guards.
 */

/** Canonical flat-config preset keys exposed through `plugin.configs`. */
export const copilotConfigNames = [
    "all",
    "minimal",
    "recommended",
    "strict",
] as const;

/** Metadata contract shared across preset wiring, docs, and README rendering. */
export type CopilotConfigMetadata = Readonly<{
    icon: string;
    presetName: `copilot:${CopilotConfigName}`;
    readmeOrder: number;
    requiresTypeChecking: boolean;
}>;

/** Canonical flat-config preset key type exposed through `plugin.configs`. */
export type CopilotConfigName = (typeof copilotConfigNames)[number];

/** Fully-qualified preset reference lookup object shape. */
type CopilotConfigReferenceMap = Readonly<{
    "copilot.configs.all": "all";
    "copilot.configs.minimal": "minimal";
    "copilot.configs.recommended": "recommended";
    "copilot.configs.strict": "strict";
}>;

/** Canonical metadata for every exported `copilot` preset key. */
export const copilotConfigMetadataByName: Readonly<
    Record<CopilotConfigName, CopilotConfigMetadata>
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
export const copilotConfigNamesByReadmeOrder: readonly CopilotConfigName[] = [
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
    Object.hasOwn(copilotConfigReferenceToName, value);
