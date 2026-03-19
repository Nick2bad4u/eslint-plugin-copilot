/**
 * @packageDocumentation
 * Path classification helpers for GitHub Copilot repository customization files.
 */
import * as fs from "node:fs";
import * as path from "node:path";

/** Supported GitHub Copilot repository file categories. */
export type CopilotFileKind =
    | "agent-instructions"
    | "chatmode"
    | "instructions"
    | "prompt"
    | "repository-instructions";

/** Normalize a path to slash-separated form for pattern checks. */
const normalizeFilePath = (filePath: string): string =>
    path.resolve(filePath).replaceAll("\\", "/");

/** Check whether a path points to a legacy workspace chat mode file. */
export const isLegacyChatmodeFilePath = (filePath: string): boolean => {
    const normalizedFilePath = normalizeFilePath(filePath);
    const basename = path.posix.basename(normalizedFilePath);

    return (
        normalizedFilePath.includes("/.github/chatmodes/") &&
        basename.endsWith(".chatmode.md")
    );
};

/** Check whether a path points to a workspace-level custom agent file. */
export const isCustomAgentFilePath = (filePath: string): boolean => {
    const normalizedFilePath = normalizeFilePath(filePath);
    const basename = path.posix.basename(normalizedFilePath);

    return (
        normalizedFilePath.includes("/.github/agents/") &&
        basename.endsWith(".agent.md")
    );
};

/** Check whether a basename is one of the supported agent instruction names. */
const isAgentInstructionsBasename = (basename: string): boolean =>
    basename === "AGENTS.md" ||
    basename === "CLAUDE.md" ||
    basename === "GEMINI.md";

/** Derive the Copilot customization file kind for an absolute or relative path. */
export const getCopilotFileKind = (
    filePath: string
): CopilotFileKind | null => {
    const normalizedFilePath = normalizeFilePath(filePath);
    const basename = path.posix.basename(normalizedFilePath);

    if (normalizedFilePath.endsWith("/.github/copilot-instructions.md")) {
        return "repository-instructions";
    }

    if (
        normalizedFilePath.includes("/.github/instructions/") &&
        basename.endsWith(".instructions.md")
    ) {
        return "instructions";
    }

    if (
        normalizedFilePath.includes("/.github/prompts/") &&
        basename.endsWith(".prompt.md")
    ) {
        return "prompt";
    }

    if (
        isLegacyChatmodeFilePath(normalizedFilePath) ||
        isCustomAgentFilePath(normalizedFilePath)
    ) {
        return "chatmode";
    }

    return isAgentInstructionsBasename(basename) ? "agent-instructions" : null;
};

/** Discover the repository root for the current file path. */
export const findRepositoryRoot = (filePath: string): string => {
    const normalizedFilePath = path.resolve(filePath);
    const pathSegments = normalizeFilePath(normalizedFilePath).split("/");
    const githubDirectoryIndex = pathSegments.lastIndexOf(".github");

    if (githubDirectoryIndex > 0) {
        const rootSegments = pathSegments.slice(0, githubDirectoryIndex);
        const candidateRoot = rootSegments.join(path.sep);

        if (candidateRoot.length > 0) {
            return candidateRoot;
        }
    }

    let currentDirectory = path.dirname(normalizedFilePath);

    while (true) {
        const packageJsonPath = path.join(currentDirectory, "package.json");
        const eslintConfigPath = path.join(
            currentDirectory,
            "eslint.config.mjs"
        );
        const gitDirectoryPath = path.join(currentDirectory, ".git");

        if (
            fs.existsSync(packageJsonPath) ||
            fs.existsSync(eslintConfigPath) ||
            fs.existsSync(gitDirectoryPath)
        ) {
            return currentDirectory;
        }

        const parentDirectory = path.dirname(currentDirectory);

        if (parentDirectory === currentDirectory) {
            return path.dirname(normalizedFilePath);
        }

        currentDirectory = parentDirectory;
    }
};

/** Resolve the canonical repository custom instructions file path. */
export const getRepositoryInstructionsPath = (filePath: string): string =>
    path.join(
        findRepositoryRoot(filePath),
        ".github",
        "copilot-instructions.md"
    );
