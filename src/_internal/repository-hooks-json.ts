/**
 * @packageDocumentation
 * Shared JSON helpers for repository hook configuration rules.
 */

/** Read-only JSON array value. */
export type JsonArray = readonly JsonValue[];
/** Read-only JSON object value. */
export interface JsonObject {
    readonly [key: string]: JsonValue;
}
/** JSON primitive scalar value. */
export type JsonPrimitive = boolean | null | number | string;
/** Any supported JSON value. */
export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

/** Repository hook entry paired with its source event name and array index. */
export type RepositoryHookEntry = Readonly<{
    eventName: string;
    hook: JsonObject;
    index: number;
}>;

/** Supported repository hook event names. */
export type RepositoryHookEventName =
    | "agentStop"
    | "errorOccurred"
    | "postToolUse"
    | "preToolUse"
    | "sessionEnd"
    | "sessionStart"
    | "subagentStop"
    | "userPromptSubmitted";

/** Supported repository hook transport types. */
export type RepositoryHookType = "command" | "prompt";

/** Default repository hook timeout used by GitHub Copilot. */
export const DEFAULT_REPOSITORY_HOOK_TIMEOUT_SECONDS = 30;

/** Known valid repository hook event names. */
export const VALID_REPOSITORY_HOOK_EVENT_NAMES: ReadonlySet<RepositoryHookEventName> =
    new Set([
        "agentStop",
        "errorOccurred",
        "postToolUse",
        "preToolUse",
        "sessionEnd",
        "sessionStart",
        "subagentStop",
        "userPromptSubmitted",
    ]);

/** Known valid repository hook types. */
export const VALID_REPOSITORY_HOOK_TYPES: ReadonlySet<RepositoryHookType> =
    new Set(["command", "prompt"]);

/** Determine whether a string is a supported repository hook event name. */
export const isRepositoryHookEventName = (
    value: string
): value is RepositoryHookEventName =>
    VALID_REPOSITORY_HOOK_EVENT_NAMES.has(value as RepositoryHookEventName);

/** Determine whether a string is a supported repository hook type. */
export const isRepositoryHookType = (
    value: string
): value is RepositoryHookType =>
    VALID_REPOSITORY_HOOK_TYPES.has(value as RepositoryHookType);

/** Determine whether a parsed JSON value is an object. */
export const isJsonObject = (
    value: JsonValue | undefined
): value is JsonObject =>
    typeof value === "object" && value !== null && !Array.isArray(value);

/** Determine whether a parsed JSON value is an array. */
export const isJsonArray = (value: JsonValue | undefined): value is JsonArray =>
    Array.isArray(value);

/** Determine whether a parsed JSON value is a string. */
export const isJsonString = (value: JsonValue | undefined): value is string =>
    typeof value === "string";

/** Determine whether a parsed JSON value is a finite number. */
export const isJsonNumber = (value: JsonValue | undefined): value is number =>
    typeof value === "number" && Number.isFinite(value);

/** Safely parse JSON source text. */
export const parseJsonText = (text: string): JsonValue | undefined => {
    try {
        return JSON.parse(text) as JsonValue;
    } catch {
        return undefined;
    }
};

/** Get the top-level `hooks` value when present. */
export const getRepositoryHooksValue = (
    root: JsonValue | undefined
): JsonValue | undefined => (isJsonObject(root) ? root["hooks"] : undefined);

/** Get the top-level `version` value when present. */
export const getRepositoryHooksVersionValue = (
    root: JsonValue | undefined
): JsonValue | undefined => (isJsonObject(root) ? root["version"] : undefined);

/** Get key/value entries from the `hooks` object when present. */
export const getRepositoryHookEventEntries = (
    root: JsonValue | undefined
): readonly (readonly [string, JsonValue])[] => {
    const hooksValue = getRepositoryHooksValue(root);

    return isJsonObject(hooksValue) ? Object.entries(hooksValue) : [];
};

/** Collect object-shaped hook entries from hook arrays. */
export const getRepositoryHookObjects = (
    root: JsonValue | undefined
): readonly RepositoryHookEntry[] => {
    const hookEntries: RepositoryHookEntry[] = [];

    for (const [eventName, eventValue] of getRepositoryHookEventEntries(root)) {
        if (!isJsonArray(eventValue)) {
            continue;
        }

        for (const [index, hookValue] of eventValue.entries()) {
            if (!isJsonObject(hookValue)) {
                continue;
            }

            hookEntries.push({
                eventName,
                hook: hookValue,
                index,
            });
        }
    }

    return hookEntries;
};

/** Format a parsed JSON value for diagnostic messages. */
export const formatJsonValue = (value: JsonValue | undefined): string => {
    if (value === undefined) {
        return "(missing)";
    }

    if (typeof value === "string") {
        return value;
    }

    return JSON.stringify(value);
};
