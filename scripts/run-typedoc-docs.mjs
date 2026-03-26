import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { basename, dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const typedocPackageJsonPath = require.resolve("typedoc/package.json");
const typedocCliPath = resolve(
    dirname(typedocPackageJsonPath),
    "bin",
    "typedoc"
);

/**
 * Parse a `--config FILE` (or `--options FILE`) argument from CLI args.
 *
 * @param {readonly string[]} cliArgs - Raw process arguments after the script
 *   path.
 *
 * @returns {string} TypeDoc options file name to pass to `typedoc --options`.
 */
function getConfigFileName(cliArgs) {
    for (let index = 0; index < cliArgs.length; index += 1) {
        const argument = cliArgs[index];
        if (argument !== "--config" && argument !== "--options") {
            continue;
        }

        const nextIndex = index + 1;
        if (nextIndex >= cliArgs.length) {
            throw new Error(`Missing value for CLI argument: ${argument}`);
        }

        const nextValue = cliArgs[nextIndex];
        if (typeof nextValue !== "string" || nextValue.length === 0) {
            throw new Error(`Missing value for CLI argument: ${argument}`);
        }

        return nextValue;
    }

    return "typedoc.config.json";
}

/**
 * Resolve the nearest hoisted/local TypeDoc CLI executable by walking up from
 * cwd.
 *
 * @param {string} cwd - Starting directory for lookup.
 *
 * @returns {string} Path to a TypeDoc CLI script.
 */
function resolveTypedocCliFromCwd(cwd) {
    let currentPath = cwd;

    while (true) {
        const candidatePath = resolve(
            currentPath,
            "node_modules",
            "typedoc",
            "bin",
            "typedoc"
        );

        if (existsSync(candidatePath)) {
            return candidatePath;
        }

        const parentPath = dirname(currentPath);

        if (parentPath === currentPath) {
            break;
        }

        currentPath = parentPath;
    }

    return typedocCliPath;
}

/**
 * Execute TypeDoc with the provided options file in a specific working
 * directory.
 *
 * @param {string} cwd - Working directory for the TypeDoc process.
 * @param {string} configFile - TypeDoc options file to pass to `--options`.
 */
function runTypedoc(cwd, configFile) {
    const resolvedTypedocCliPath = resolveTypedocCliFromCwd(cwd);

    execFileSync(
        process.execPath,
        [
            resolvedTypedocCliPath,
            "--options",
            configFile,
        ],
        {
            cwd,
            stdio: "inherit",
        }
    );
}

/**
 * Collect all markdown files under a directory recursively.
 *
 * @param {string} directoryPath - Root directory to walk.
 *
 * @returns {string[]} Absolute markdown file paths.
 */
function collectMarkdownFiles(directoryPath) {
    /** @type {string[]} */
    const markdownFilePaths = [];

    for (const directoryEntry of readdirSync(directoryPath, {
        withFileTypes: true,
    })) {
        const absoluteEntryPath = resolve(directoryPath, directoryEntry.name);

        if (directoryEntry.isDirectory()) {
            markdownFilePaths.push(...collectMarkdownFiles(absoluteEntryPath));
            continue;
        }

        if (absoluteEntryPath.endsWith(".md")) {
            markdownFilePaths.push(absoluteEntryPath);
        }
    }

    return markdownFilePaths;
}

/**
 * Create a stable frontmatter block for generated API docs.
 *
 * @param {string} filePath - Absolute markdown file path.
 * @param {string} apiDocsRootDirectory - Absolute generated API docs directory.
 *
 * @returns {string} YAML frontmatter block including trailing blank line.
 */
function createGeneratedApiFrontMatter(filePath, apiDocsRootDirectory) {
    const relativePath = relative(apiDocsRootDirectory, filePath);
    const isReadme = relativePath === "README.md";
    const title = isReadme ? "API reference" : basename(filePath, ".md");

    return [
        "---",
        `title: ${title}`,
        isReadme
            ? "description: Generated API reference for the public eslint-plugin-copilot plugin surface."
            : `description: Generated API reference page for ${title}.`,
        isReadme ? "sidebar_label: API overview" : null,
        "hide_title: true",
        "---",
        "",
    ]
        .filter((line) => line !== null)
        .join("\n");
}

/**
 * Normalize generated markdown so Docusaurus renders a single clean title.
 *
 * @param {string} markdownSourceText - Raw generated markdown.
 *
 * @returns {string} Cleaned markdown without duplicate TypeDoc banner text.
 */
function normalizeGeneratedMarkdown(markdownSourceText) {
    const withoutFrontMatter = markdownSourceText.replace(
        /^---\r?\n[\s\S]*?\r?\n---\r?\n\r?\n/u,
        ""
    );

    return withoutFrontMatter.replace(
        /^(?:\[\*\*.*?\*\*\]\([^)]+\)|\*\*.*?\*\*)\r?\n\r?\n---\r?\n\r?\n/u,
        ""
    );
}

/**
 * Postprocess the generated developer API markdown for Docusaurus docs output.
 *
 * @param {string} apiDocsRootDirectory - Absolute generated API docs directory.
 */
function postprocessGeneratedDeveloperApiDocs(apiDocsRootDirectory) {
    if (!existsSync(apiDocsRootDirectory)) {
        return;
    }

    for (const markdownFilePath of collectMarkdownFiles(apiDocsRootDirectory)) {
        const markdownSourceText = readFileSync(markdownFilePath, "utf8");
        const normalizedMarkdown =
            normalizeGeneratedMarkdown(markdownSourceText);
        const frontMatter = createGeneratedApiFrontMatter(
            markdownFilePath,
            apiDocsRootDirectory
        );

        writeFileSync(
            markdownFilePath,
            `${frontMatter}${normalizedMarkdown}`,
            "utf8"
        );
    }
}

/**
 * Pick an unused drive letter suitable for a temporary `subst` mapping.
 *
 * @returns {string} Drive letter (without colon).
 */
function getTemporaryDriveLetter() {
    const candidateLetters = [
        "Z",
        "Y",
        "X",
        "W",
        "V",
        "U",
        "T",
        "S",
        "R",
    ];

    for (const letter of candidateLetters) {
        if (!existsSync(`${letter}:\\`)) {
            return letter;
        }
    }

    throw new Error(
        "No free temporary drive letter was found for TypeDoc subst mapping."
    );
}

/**
 * Run TypeDoc from a temporary subst drive to avoid escaped-parentheses path
 * bugs on Windows.
 *
 * @param {string} repositoryRoot - Absolute repository root directory.
 * @param {string} docsWorkspaceRelativePath - Docs workspace relative path from
 *   the repository root.
 * @param {string} configFile - TypeDoc options file name to use.
 */
function runViaTemporaryDrive(
    repositoryRoot,
    docsWorkspaceRelativePath,
    configFile
) {
    const driveLetter = getTemporaryDriveLetter();
    const driveRoot = `${driveLetter}:`;

    execFileSync("subst", [driveRoot, repositoryRoot], {
        stdio: "ignore",
    });

    try {
        const mappedDocsWorkspaceDirectory = resolve(
            `${driveRoot}\\`,
            docsWorkspaceRelativePath
        );
        runTypedoc(mappedDocsWorkspaceDirectory, configFile);
    } finally {
        execFileSync("subst", [driveRoot, "/d"], {
            stdio: "ignore",
        });
    }
}

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "..");
const docsWorkspaceDirectory = resolve(repositoryRoot, "docs", "docusaurus");
const docsWorkspaceRelativePath = relative(
    repositoryRoot,
    docsWorkspaceDirectory
);
const developerApiDocsDirectory = resolve(
    docsWorkspaceDirectory,
    "site-docs",
    "developer",
    "api"
);
const configFile = getConfigFileName(process.argv.slice(2));

if (process.platform === "win32" && /[()]/u.test(repositoryRoot)) {
    runViaTemporaryDrive(repositoryRoot, docsWorkspaceRelativePath, configFile);
} else {
    runTypedoc(docsWorkspaceDirectory, configFile);
}

postprocessGeneratedDeveloperApiDocs(developerApiDocsDirectory);
