/**
 * @packageDocumentation
 * Lightweight Markdown frontmatter helpers for Copilot customization files.
 */

/** Parsed frontmatter field variants supported by this plugin. */
export type FrontmatterField =
    | Readonly<{
          kind: "list";
          values: readonly string[];
      }>
    | Readonly<{
          kind: "scalar";
          value: string;
      }>;

/** Parsed frontmatter bundle extracted from the start of a Markdown document. */
export type FrontmatterDocument = Readonly<{
    body: string;
    content: string;
    fields: ReadonlyMap<string, FrontmatterField>;
}>;

/** Parsed object entry from a supported nested frontmatter list block. */
export type FrontmatterObjectListEntry = Readonly<Record<string, string>>;

/** Parsed nested object-list groups keyed by a frontmatter subfield name. */
export type FrontmatterObjectListGroupMap = ReadonlyMap<
    string,
    readonly FrontmatterObjectListEntry[]
>;

const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u;
const TOP_LEVEL_FIELD_PATTERN = /^([A-Za-z][A-Za-z0-9-]*)\s*:\s*(.*)$/u;
const BLOCK_LIST_ITEM_PATTERN = /^\s*-\s*(.+)$/u;
const NESTED_OBJECT_FIELD_PATTERN = /^([A-Za-z][A-Za-z0-9-]*)\s*:\s*(.*)$/u;

/** Count leading spaces or tabs for indentation-sensitive YAML subsets. */
const getIndentationWidth = (line: string): number => {
    let width = 0;

    for (const character of line) {
        if (character === " ") {
            width += 1;
            continue;
        }

        if (character === "\t") {
            width += 4;
            continue;
        }

        break;
    }

    return width;
};

/** Remove balanced single or double quotes from a scalar YAML value. */
const stripQuotes = (value: string): string => {
    if (value.length >= 2) {
        const firstCharacter = value.at(0);
        const lastCharacter = value.at(-1);

        if (
            (firstCharacter === '"' && lastCharacter === '"') ||
            (firstCharacter === "'" && lastCharacter === "'")
        ) {
            return value.slice(1, -1);
        }
    }

    return value;
};

/** Normalize a scalar-like YAML token into a trimmed string value. */
const normalizeScalarValue = (value: string): string =>
    stripQuotes(value.trim()).trim();

/** Parse a one-line YAML flow sequence such as `["a", "b"]`. */
const parseInlineList = (value: string): readonly string[] => {
    const trimmedValue = value.trim();

    if (!trimmedValue.startsWith("[") || !trimmedValue.endsWith("]")) {
        return [];
    }

    const innerValue = trimmedValue.slice(1, -1).trim();

    if (innerValue.length === 0) {
        return [];
    }

    return innerValue
        .split(",")
        .map((item) => normalizeScalarValue(item))
        .filter((item) => item.length > 0);
};

/** Parse an indented YAML block list of scalar strings. */
const parseBlockList = (lines: readonly string[]): readonly string[] =>
    lines
        .map((line) => {
            const listItemMatch = BLOCK_LIST_ITEM_PATTERN.exec(line);

            if (listItemMatch === null) {
                return "";
            }

            const rawValue = listItemMatch[1];

            if (rawValue === undefined) {
                return "";
            }

            return normalizeScalarValue(rawValue);
        })
        .filter((value) => value.length > 0);

/** Parse the supported subset of YAML frontmatter fields used by Copilot. */
const parseFrontmatterFields = (
    content: string
): ReadonlyMap<string, FrontmatterField> => {
    const lines = content.replaceAll("\r\n", "\n").split("\n");
    const fields = new Map<string, FrontmatterField>();

    for (let index = 0; index < lines.length; index += 1) {
        const currentLine = lines[index]?.trimEnd() ?? "";

        if (currentLine.trim().length === 0) {
            continue;
        }

        const fieldMatch = TOP_LEVEL_FIELD_PATTERN.exec(
            currentLine.trimStart()
        );

        if (fieldMatch === null) {
            continue;
        }

        const key = fieldMatch[1];
        const rawValue = fieldMatch[2];

        if (key === undefined || rawValue === undefined) {
            continue;
        }

        const normalizedValue = rawValue.trim();

        if (normalizedValue.length > 0) {
            const inlineList = parseInlineList(normalizedValue);

            if (inlineList.length > 0) {
                fields.set(key, {
                    kind: "list",
                    values: inlineList,
                });
                continue;
            }

            fields.set(key, {
                kind: "scalar",
                value: normalizeScalarValue(normalizedValue),
            });
            continue;
        }

        const blockLines: string[] = [];

        for (
            let nextIndex = index + 1;
            nextIndex < lines.length;
            nextIndex += 1
        ) {
            const nextLine = lines[nextIndex] ?? "";

            if (
                nextLine.trim().length > 0 &&
                !nextLine.startsWith(" ") &&
                !nextLine.startsWith("\t")
            ) {
                break;
            }

            if (nextLine.trim().length > 0) {
                blockLines.push(nextLine);
            }

            index = nextIndex;
        }

        const parsedBlockValues = parseBlockList(blockLines);

        if (parsedBlockValues.length > 0) {
            fields.set(key, {
                kind: "list",
                values: parsedBlockValues,
            });
            continue;
        }

        fields.set(key, {
            kind: "scalar",
            value: "",
        });
    }

    return fields;
};

/** Extract top-of-file YAML frontmatter when present. */
export const extractFrontmatter = (
    text: string
): FrontmatterDocument | null => {
    const frontmatterMatch = FRONTMATTER_PATTERN.exec(text);

    if (frontmatterMatch === null) {
        return null;
    }

    const rawFrontmatter = frontmatterMatch[0];
    const content = frontmatterMatch[1];

    if (rawFrontmatter === undefined || content === undefined) {
        return null;
    }

    return {
        body: text.slice(rawFrontmatter.length),
        content,
        fields: parseFrontmatterFields(content),
    };
};

/** Read a non-empty scalar frontmatter value. */
export const getFrontmatterScalar = (
    document: FrontmatterDocument,
    key: string
): string | undefined => {
    const field = document.fields.get(key);

    return field?.kind === "scalar" && field.value.length > 0
        ? field.value
        : undefined;
};

/** Read a non-empty list of scalar frontmatter values. */
export const getFrontmatterList = (
    document: FrontmatterDocument,
    key: string
): readonly string[] | undefined => {
    const field = document.fields.get(key);

    return field?.kind === "list" && field.values.length > 0
        ? field.values
        : undefined;
};

/** Determine whether a field exists but is empty or unparsable for our subset. */
export const hasFrontmatterField = (
    document: FrontmatterDocument,
    key: string
): boolean => document.fields.has(key);

/** Read a supported YAML object-list block such as `handoffs:` entries. */
export const getFrontmatterObjectList = (
    document: FrontmatterDocument,
    key: string
): readonly FrontmatterObjectListEntry[] | undefined => {
    const lines = document.content.replaceAll("\r\n", "\n").split("\n");

    for (let index = 0; index < lines.length; index += 1) {
        const currentLine = lines[index] ?? "";

        if (currentLine.startsWith(" ") || currentLine.startsWith("\t")) {
            continue;
        }

        const fieldMatch = TOP_LEVEL_FIELD_PATTERN.exec(currentLine.trimEnd());

        if (fieldMatch === null) {
            continue;
        }

        const fieldKey = fieldMatch[1];
        const rawValue = fieldMatch[2]?.trim() ?? "";

        if (fieldKey !== key) {
            continue;
        }

        if (rawValue === "[]") {
            return [];
        }

        if (rawValue.length > 0) {
            return undefined;
        }

        const blockLines: string[] = [];

        for (
            let nextIndex = index + 1;
            nextIndex < lines.length;
            nextIndex += 1
        ) {
            const nextLine = lines[nextIndex] ?? "";

            if (
                nextLine.trim().length > 0 &&
                !nextLine.startsWith(" ") &&
                !nextLine.startsWith("\t")
            ) {
                break;
            }

            if (nextLine.trim().length > 0) {
                blockLines.push(nextLine);
            }

            index = nextIndex;
        }

        const entries: Record<string, string>[] = [];
        let currentEntry: Record<string, string> | null = null;

        const setEntryField = (
            target: Record<string, string>,
            source: string
        ): void => {
            const propertyMatch = NESTED_OBJECT_FIELD_PATTERN.exec(
                source.trim()
            );

            if (propertyMatch === null) {
                return;
            }

            const propertyKey = propertyMatch[1];
            const propertyValue = propertyMatch[2];

            if (propertyKey === undefined || propertyValue === undefined) {
                return;
            }

            target[propertyKey] = normalizeScalarValue(propertyValue);
        };

        for (const blockLine of blockLines) {
            const listItemMatch = /^\s*-\s*(.*)$/u.exec(blockLine);

            if (listItemMatch !== null) {
                if (currentEntry !== null) {
                    entries.push(currentEntry);
                }

                currentEntry = {};

                const inlineProperty = listItemMatch[1]?.trim() ?? "";

                if (inlineProperty.length > 0) {
                    setEntryField(currentEntry, inlineProperty);
                }

                continue;
            }

            if (currentEntry === null) {
                continue;
            }

            setEntryField(currentEntry, blockLine);
        }

        if (currentEntry !== null) {
            entries.push(currentEntry);
        }

        return entries;
    }

    return undefined;
};

/** Read nested YAML mappings of object lists such as `hooks: Event: - ...`. */
export const getFrontmatterObjectListGroups = (
    document: FrontmatterDocument,
    key: string
): FrontmatterObjectListGroupMap | undefined => {
    const lines = document.content.replaceAll("\r\n", "\n").split("\n");

    for (let index = 0; index < lines.length; index += 1) {
        const currentLine = lines[index] ?? "";

        if (currentLine.startsWith(" ") || currentLine.startsWith("\t")) {
            continue;
        }

        const fieldMatch = TOP_LEVEL_FIELD_PATTERN.exec(currentLine.trimEnd());

        if (fieldMatch === null) {
            continue;
        }

        const fieldKey = fieldMatch[1];
        const rawValue = fieldMatch[2]?.trim() ?? "";

        if (fieldKey !== key) {
            continue;
        }

        if (rawValue.length > 0) {
            return undefined;
        }

        const blockLines: string[] = [];

        for (
            let nextIndex = index + 1;
            nextIndex < lines.length;
            nextIndex += 1
        ) {
            const nextLine = lines[nextIndex] ?? "";

            if (
                nextLine.trim().length > 0 &&
                !nextLine.startsWith(" ") &&
                !nextLine.startsWith("\t")
            ) {
                break;
            }

            if (nextLine.trim().length > 0) {
                blockLines.push(nextLine);
            }

            index = nextIndex;
        }

        const groups = new Map<string, FrontmatterObjectListEntry[]>();
        let currentGroupName: string | null = null;
        let currentEntry: Record<string, string> | null = null;

        const setEntryField = (
            target: Record<string, string>,
            source: string
        ): void => {
            const propertyMatch = NESTED_OBJECT_FIELD_PATTERN.exec(
                source.trim()
            );

            if (propertyMatch === null) {
                return;
            }

            const propertyKey = propertyMatch[1];
            const propertyValue = propertyMatch[2];

            if (propertyKey === undefined || propertyValue === undefined) {
                return;
            }

            target[propertyKey] = normalizeScalarValue(propertyValue);
        };

        const flushCurrentEntry = (): void => {
            if (currentGroupName === null || currentEntry === null) {
                return;
            }

            const groupEntries = groups.get(currentGroupName) ?? [];
            groupEntries.push(currentEntry);
            groups.set(currentGroupName, groupEntries);
            currentEntry = null;
        };

        for (const blockLine of blockLines) {
            const indentationWidth = getIndentationWidth(blockLine);
            const trimmedLine = blockLine.trim();

            if (trimmedLine.length === 0) {
                continue;
            }

            if (!trimmedLine.startsWith("-") && indentationWidth <= 4) {
                flushCurrentEntry();

                const groupMatch = TOP_LEVEL_FIELD_PATTERN.exec(trimmedLine);

                if (groupMatch === null) {
                    currentGroupName = null;
                    continue;
                }

                currentGroupName = groupMatch[1] ?? null;

                if (
                    currentGroupName !== null &&
                    !groups.has(currentGroupName)
                ) {
                    groups.set(currentGroupName, []);
                }

                continue;
            }

            if (trimmedLine.startsWith("-")) {
                flushCurrentEntry();

                if (currentGroupName === null) {
                    continue;
                }

                currentEntry = {};
                const inlineProperty = trimmedLine.slice(1).trim();

                if (inlineProperty.length > 0) {
                    setEntryField(currentEntry, inlineProperty);
                }

                continue;
            }

            if (currentEntry === null) {
                continue;
            }

            setEntryField(currentEntry, trimmedLine);
        }

        flushCurrentEntry();

        return groups;
    }

    return undefined;
};

/** Remove HTML comments before checking whether Markdown body content exists. */
export const getMeaningfulMarkdownBody = (text: string): string =>
    text.replaceAll(/<!--([\s\S]*?)-->/gu, "").trim();
