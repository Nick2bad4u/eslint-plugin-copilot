/**
 * @packageDocumentation
 * Lightweight Markdown frontmatter helpers for Copilot customization files.
 */

/** Parsed frontmatter bundle extracted from the start of a Markdown document. */
import { isDefined, stringSplit } from "ts-extras";

/** Parsed frontmatter document extracted from the top of a Markdown file. */
export type FrontmatterDocument = Readonly<{
    body: string;
    content: string;
    fields: ReadonlyMap<string, FrontmatterField>;
}>;

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

/** Parsed object entry from a supported nested frontmatter list block. */
export type FrontmatterObjectListEntry = Readonly<Record<string, string>>;

/** Parsed nested object-list groups keyed by a frontmatter subfield name. */
export type FrontmatterObjectListGroupMap = ReadonlyMap<
    string,
    readonly FrontmatterObjectListEntry[]
>;

/** Determine whether a character is an ASCII letter. */
const isAsciiLetter = (character: string): boolean =>
    (character >= "A" && character <= "Z") ||
    (character >= "a" && character <= "z");

/** Determine whether a character is valid after the first YAML field letter. */
const isYamlIdentifierCharacter = (character: string): boolean =>
    isAsciiLetter(character) ||
    (character >= "0" && character <= "9") ||
    character === "-";

/** Validate the limited frontmatter field names this plugin supports. */
const isSupportedFrontmatterFieldName = (value: string): boolean => {
    if (value.length === 0 || !isAsciiLetter(value.at(0) ?? "")) {
        return false;
    }

    for (const character of value.slice(1)) {
        if (!isYamlIdentifierCharacter(character)) {
            return false;
        }
    }

    return true;
};

/** Parse a supported `key: value` frontmatter line. */
const parseFieldLine = (
    line: string
): null | Readonly<{ key: string; value: string }> => {
    const separatorIndex = line.indexOf(":");

    if (separatorIndex <= 0) {
        return null;
    }

    const key = line.slice(0, separatorIndex).trim();

    if (!isSupportedFrontmatterFieldName(key)) {
        return null;
    }

    return {
        key,
        value: line.slice(separatorIndex + 1),
    };
};

/** Read a single line and its ending index from a source string. */
const readLine = (
    text: string,
    startIndex: number
): Readonly<{ line: string; nextIndex: number }> => {
    const lineFeedIndex = text.indexOf("\n", startIndex);

    if (lineFeedIndex === -1) {
        return {
            line: text.endsWith("\r")
                ? text.slice(startIndex, -1)
                : text.slice(startIndex),
            nextIndex: text.length,
        };
    }

    const lineEndIndex =
        text[lineFeedIndex - 1] === "\r" ? lineFeedIndex - 1 : lineFeedIndex;

    return {
        line: text.slice(startIndex, lineEndIndex),
        nextIndex: lineFeedIndex + 1,
    };
};

/** Remove one trailing CRLF or LF sequence when present. */
const trimTrailingLineBreak = (value: string): string => {
    if (value.endsWith("\r\n")) {
        return value.slice(0, -2);
    }

    if (value.endsWith("\n")) {
        return value.slice(0, -1);
    }

    return value;
};

/** Collect an indented frontmatter block after a top-level field. */
const collectIndentedBlockLines = (
    lines: readonly string[],
    startIndex: number
): Readonly<{ blockLines: readonly string[]; nextIndex: number }> => {
    const blockLines: string[] = [];
    let nextIndex = startIndex;

    while (nextIndex < lines.length) {
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

        nextIndex += 1;
    }

    return {
        blockLines,
        nextIndex,
    };
};

/** Strip balanced HTML comments from Markdown body text. */
const stripHtmlComments = (text: string): string => {
    let result = "";
    let searchIndex = 0;

    while (searchIndex < text.length) {
        const commentStartIndex = text.indexOf("<!--", searchIndex);

        if (commentStartIndex === -1) {
            result += text.slice(searchIndex);
            break;
        }

        result += text.slice(searchIndex, commentStartIndex);

        const commentEndIndex = text.indexOf("-->", commentStartIndex + 4);

        if (commentEndIndex === -1) {
            result += text.slice(commentStartIndex);
            break;
        }

        searchIndex = commentEndIndex + 3;
    }

    return result;
};

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
function normalizeScalarValue(value: string): string {
    return stripQuotes(value.trim()).trim();
}

/** Assign a parsed YAML `key: value` pair into an object-list entry. */
const withObjectEntryField = (
    target: Readonly<Record<string, string>>,
    source: string
): Record<string, string> => {
    const property = parseFieldLine(source.trim());

    if (property === null) {
        return { ...target };
    }

    return {
        ...target,
        [property.key]: normalizeScalarValue(property.value),
    };
};

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

    return stringSplit(innerValue, ",")
        .map((item) => normalizeScalarValue(item))
        .filter((item) => item.length > 0);
};

/** Parse an indented YAML block list of scalar strings. */
const parseBlockList = (lines: readonly string[]): readonly string[] =>
    lines
        .map((line) => {
            const trimmedLine = line.trim();

            if (!trimmedLine.startsWith("-")) {
                return "";
            }

            return normalizeScalarValue(trimmedLine.slice(1));
        })
        .filter((value) => value.length > 0);

/** Parse the supported subset of YAML frontmatter fields used by Copilot. */
const parseFrontmatterFields = (
    content: string
): ReadonlyMap<string, FrontmatterField> => {
    const lines = stringSplit(content.replaceAll("\r\n", "\n"), "\n");
    const fields = new Map<string, FrontmatterField>();
    let index = 0;

    while (index < lines.length) {
        const currentLine = lines[index]?.trimEnd() ?? "";

        if (currentLine.trim().length === 0) {
            index += 1;
            continue;
        }

        const field = parseFieldLine(currentLine.trimStart());

        if (field === null) {
            index += 1;
            continue;
        }

        const normalizedValue = field.value.trim();

        if (normalizedValue.length > 0) {
            const inlineList = parseInlineList(normalizedValue);

            if (inlineList.length > 0) {
                fields.set(field.key, {
                    kind: "list",
                    values: inlineList,
                });
                index += 1;
                continue;
            }

            fields.set(field.key, {
                kind: "scalar",
                value: normalizeScalarValue(normalizedValue),
            });
            index += 1;
            continue;
        }

        const { blockLines, nextIndex } = collectIndentedBlockLines(
            lines,
            index + 1
        );

        const parsedBlockValues = parseBlockList(blockLines);

        if (parsedBlockValues.length > 0) {
            fields.set(field.key, {
                kind: "list",
                values: parsedBlockValues,
            });
            index = nextIndex;
            continue;
        }

        fields.set(field.key, {
            kind: "scalar",
            value: "",
        });

        index = nextIndex;
    }

    return fields;
};

/** Extract top-of-file YAML frontmatter when present. */
export const extractFrontmatter = (
    text: string
): FrontmatterDocument | null => {
    if (!text.startsWith("---")) {
        return null;
    }

    const openingLine = readLine(text, 0);

    if (openingLine.line !== "---" || openingLine.nextIndex >= text.length) {
        return null;
    }

    let lineStartIndex = openingLine.nextIndex;

    while (lineStartIndex < text.length) {
        const currentLine = readLine(text, lineStartIndex);

        if (currentLine.line === "---") {
            const content = trimTrailingLineBreak(
                text.slice(openingLine.nextIndex, lineStartIndex)
            );

            return {
                body: text.slice(currentLine.nextIndex),
                content,
                fields: parseFrontmatterFields(content),
            };
        }

        lineStartIndex = currentLine.nextIndex;
    }

    return null;
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

/** Read normalized frontmatter content lines from a parsed document. */
const getFrontmatterContentLines = (
    document: FrontmatterDocument
): readonly string[] =>
    stringSplit(document.content.replaceAll("\r\n", "\n"), "\n");

/**
 * Find a top-level frontmatter field block and return its scalar text plus
 * lines.
 */
const getTopLevelFrontmatterFieldBlock = (
    document: FrontmatterDocument,
    key: string
):
    | Readonly<{ blockLines: readonly string[]; rawValue: string }>
    | undefined => {
    const lines = getFrontmatterContentLines(document);

    for (const [index, currentLine] of lines.entries()) {
        if (currentLine.startsWith(" ") || currentLine.startsWith("\t")) {
            continue;
        }

        const field = parseFieldLine(currentLine.trimEnd());

        if (field?.key !== key) {
            continue;
        }

        return {
            blockLines: collectIndentedBlockLines(lines, index + 1).blockLines,
            rawValue: field.value.trim(),
        };
    }

    return undefined;
};

/** Parse a YAML object-list block such as `handoffs:` into entry objects. */
const parseFrontmatterObjectListEntries = (
    blockLines: readonly string[]
): readonly FrontmatterObjectListEntry[] => {
    const entries: Record<string, string>[] = [];
    let currentEntry: null | Record<string, string> = null;

    for (const blockLine of blockLines) {
        const trimmedLine = blockLine.trim();

        if (trimmedLine.startsWith("-")) {
            if (currentEntry !== null) {
                entries.push(currentEntry);
            }

            const inlineProperty = trimmedLine.slice(1).trim();
            currentEntry =
                inlineProperty.length === 0
                    ? {}
                    : withObjectEntryField({}, inlineProperty);
            continue;
        }

        if (currentEntry === null) {
            continue;
        }

        currentEntry = withObjectEntryField(currentEntry, trimmedLine);
    }

    if (currentEntry !== null) {
        entries.push(currentEntry);
    }

    return entries;
};

type GroupedObjectListParseState = Readonly<{
    currentEntry: null | Record<string, string>;
    currentGroupName: null | string;
}>;

/** Flush the current grouped entry into its active group when present. */
const flushGroupedObjectListEntry = (
    groups: Map<string, FrontmatterObjectListEntry[]>,
    state: GroupedObjectListParseState
): GroupedObjectListParseState => {
    if (state.currentGroupName === null || state.currentEntry === null) {
        return state;
    }

    const groupEntries = groups.get(state.currentGroupName) ?? [];
    groupEntries.push(state.currentEntry);
    groups.set(state.currentGroupName, groupEntries);

    return {
        ...state,
        currentEntry: null,
    };
};

/** Determine whether a line starts a named grouped object-list section. */
const isGroupedObjectListHeaderLine = (
    indentationWidth: number,
    trimmedLine: string
): boolean => !trimmedLine.startsWith("-") && indentationWidth <= 4;

/** Build a new grouped object-list entry from one `- key: value` line. */
const createGroupedObjectListEntry = (
    trimmedLine: string
): Record<string, string> => {
    const inlineProperty = trimmedLine.slice(1).trim();

    return inlineProperty.length === 0
        ? {}
        : withObjectEntryField({}, inlineProperty);
};

/** Switch the parser state to a new grouped object-list section. */
const handleGroupedObjectListHeaderLine = (
    groups: Map<string, FrontmatterObjectListEntry[]>,
    state: GroupedObjectListParseState,
    trimmedLine: string
): GroupedObjectListParseState => {
    const flushedState = flushGroupedObjectListEntry(groups, state);
    const groupField = parseFieldLine(trimmedLine);

    if (groupField === null) {
        return {
            ...flushedState,
            currentGroupName: null,
        };
    }

    groups.set(groupField.key, groups.get(groupField.key) ?? []);

    return {
        ...flushedState,
        currentGroupName: groupField.key,
    };
};

/** Start a new entry within the current grouped object-list section. */
const handleGroupedObjectListEntryStartLine = (
    groups: Map<string, FrontmatterObjectListEntry[]>,
    state: GroupedObjectListParseState,
    trimmedLine: string
): GroupedObjectListParseState => {
    const flushedState = flushGroupedObjectListEntry(groups, state);

    if (flushedState.currentGroupName === null) {
        return flushedState;
    }

    return {
        ...flushedState,
        currentEntry: createGroupedObjectListEntry(trimmedLine),
    };
};

/** Append one property line to the current grouped object-list entry. */
const handleGroupedObjectListPropertyLine = (
    state: GroupedObjectListParseState,
    trimmedLine: string
): GroupedObjectListParseState => {
    if (state.currentEntry === null) {
        return state;
    }

    return {
        ...state,
        currentEntry: withObjectEntryField(state.currentEntry, trimmedLine),
    };
};

/** Parse grouped YAML object-list mappings such as `hooks: event: - ...`. */
const parseFrontmatterObjectListGroups = (
    blockLines: readonly string[]
): FrontmatterObjectListGroupMap => {
    const groups = new Map<string, FrontmatterObjectListEntry[]>();
    let state: GroupedObjectListParseState = {
        currentEntry: null,
        currentGroupName: null,
    };

    for (const blockLine of blockLines) {
        const indentationWidth = getIndentationWidth(blockLine);
        const trimmedLine = blockLine.trim();

        if (trimmedLine.length === 0) {
            continue;
        }

        if (isGroupedObjectListHeaderLine(indentationWidth, trimmedLine)) {
            state = handleGroupedObjectListHeaderLine(
                groups,
                state,
                trimmedLine
            );
            continue;
        }

        if (trimmedLine.startsWith("-")) {
            state = handleGroupedObjectListEntryStartLine(
                groups,
                state,
                trimmedLine
            );
            continue;
        }

        state = handleGroupedObjectListPropertyLine(state, trimmedLine);
    }

    flushGroupedObjectListEntry(groups, state);

    return groups;
};

/** Read a supported YAML object-list block such as `handoffs:` entries. */
export const getFrontmatterObjectList = (
    document: FrontmatterDocument,
    key: string
): readonly FrontmatterObjectListEntry[] | undefined => {
    const fieldBlock = getTopLevelFrontmatterFieldBlock(document, key);

    if (!isDefined(fieldBlock)) {
        return undefined;
    }

    if (fieldBlock.rawValue === "[]") {
        return [];
    }

    if (fieldBlock.rawValue.length > 0) {
        return undefined;
    }

    return parseFrontmatterObjectListEntries(fieldBlock.blockLines);
};

/** Read nested YAML mappings of object lists such as `hooks: Event: - ...`. */
export const getFrontmatterObjectListGroups = (
    document: FrontmatterDocument,
    key: string
): FrontmatterObjectListGroupMap | undefined => {
    const fieldBlock = getTopLevelFrontmatterFieldBlock(document, key);

    if (!isDefined(fieldBlock)) {
        return undefined;
    }

    if (fieldBlock.rawValue.length > 0) {
        return undefined;
    }

    return parseFrontmatterObjectListGroups(fieldBlock.blockLines);
};

/** Remove HTML comments before checking whether Markdown body content exists. */
export const getMeaningfulMarkdownBody = (text: string): string =>
    stripHtmlComments(text).trim();
