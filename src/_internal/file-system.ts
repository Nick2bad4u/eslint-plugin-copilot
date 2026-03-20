/**
 * @packageDocumentation
 * Shared filesystem helpers for Copilot repository rule implementations.
 */
import * as fs from "node:fs";
import * as path from "node:path";

const WINDOWS_ABSOLUTE_PATH_PATTERN = /^[A-Za-z]:[/\\]/u;
const URI_SCHEME_PATTERN = /^[A-Za-z][+\-.0-9A-Za-z]*:/u;

/** Normalize a path to absolute slash-separated form. */
export const normalizeAbsolutePath = (filePath: string): string =>
    path.resolve(filePath).replaceAll("\\", "/");

/** Determine whether an absolute or relative path currently exists on disk. */
export const pathExists = (filePath: string): boolean =>
    fs.existsSync(filePath);

/** Remove `#fragment` and `?query` suffixes from a Markdown-style path target. */
export const stripPathFragmentAndQuery = (value: string): string => {
    const queryIndex = value.indexOf("?");
    const fragmentIndex = value.indexOf("#");
    const cutIndexCandidates = [queryIndex, fragmentIndex].filter(
        (index) => index >= 0
    );

    if (cutIndexCandidates.length === 0) {
        return value;
    }

    return value.slice(0, Math.min(...cutIndexCandidates));
};

/** Determine whether a string is a Windows absolute path such as `C:\repo`. */
export const isWindowsAbsolutePath = (value: string): boolean =>
    WINDOWS_ABSOLUTE_PATH_PATTERN.test(value);

/** Determine whether a string starts with a URI-like scheme such as `https:`. */
export const hasUriScheme = (value: string): boolean =>
    !isWindowsAbsolutePath(value) && URI_SCHEME_PATTERN.test(value);

/** Determine whether a path token is obviously non-relative for workspace use. */
export const isNonRelativeWorkspacePath = (value: string): boolean => {
    const trimmedValue = value.trim();
    const lowercaseValue = trimmedValue.toLowerCase();

    if (trimmedValue.length === 0 || trimmedValue.startsWith("#")) {
        return false;
    }

    if (
        lowercaseValue.startsWith("/") ||
        lowercaseValue.startsWith("\\") ||
        lowercaseValue.startsWith("~/") ||
        lowercaseValue.startsWith("~\\") ||
        lowercaseValue.startsWith("file:")
    ) {
        return true;
    }

    return isWindowsAbsolutePath(trimmedValue);
};

/** Determine whether a value is a workspace-relative path-like reference. */
export const isRelativeWorkspacePath = (value: string): boolean => {
    const trimmedValue = value.trim();

    return (
        trimmedValue.length > 0 &&
        !trimmedValue.startsWith("#") &&
        !hasUriScheme(trimmedValue) &&
        !isNonRelativeWorkspacePath(trimmedValue)
    );
};

/** Resolve a workspace-relative path from the current file location. */
export const resolveRelativeWorkspacePath = (
    currentFilePath: string,
    relativePath: string
): string =>
    path.resolve(
        path.dirname(currentFilePath),
        stripPathFragmentAndQuery(relativePath)
    );

/** Resolve a repository-root-relative path token. */
export const resolveRepositoryRelativePath = (
    repositoryRootPath: string,
    relativePath: string
): string =>
    path.resolve(repositoryRootPath, stripPathFragmentAndQuery(relativePath));

/** Recursively list files under a directory when it exists. */
export const listFilesRecursively = (
    directoryPath: string,
    predicate?: (absoluteFilePath: string) => boolean
): readonly string[] => {
    if (!pathExists(directoryPath)) {
        return [];
    }

    const discoveredFiles: string[] = [];
    const pendingDirectories = [directoryPath];

    while (pendingDirectories.length > 0) {
        const currentDirectory = pendingDirectories.pop();

        if (currentDirectory === undefined) {
            continue;
        }

        for (const entry of fs.readdirSync(currentDirectory, {
            withFileTypes: true,
        })) {
            const absoluteEntryPath = path.join(currentDirectory, entry.name);

            if (entry.isDirectory()) {
                pendingDirectories.push(absoluteEntryPath);
                continue;
            }

            if (!entry.isFile()) {
                continue;
            }

            if (predicate !== undefined && !predicate(absoluteEntryPath)) {
                continue;
            }

            discoveredFiles.push(absoluteEntryPath);
        }
    }

    return discoveredFiles.toSorted((left, right) => left.localeCompare(right));
};
