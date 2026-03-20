/**
 * @packageDocumentation
 * Shared naming helpers for prompt, agent, and skill customization files.
 */
import * as path from "node:path";

import type { FrontmatterDocument } from "./frontmatter.js";

import { getFrontmatterScalar } from "./frontmatter.js";

const normalizeSlashName = (value: string): string => value.trim();

const getOptionalFrontmatterScalar = (
    frontmatter: FrontmatterDocument | null,
    key: string
): string | undefined =>
    frontmatter === null ? undefined : getFrontmatterScalar(frontmatter, key);

/** Normalize a command or display name for duplicate comparisons. */
export const normalizeNameForComparison = (value: string): string =>
    normalizeSlashName(value).toLowerCase();

/** Determine whether a skill identifier matches the documented lowercase-hyphen
form. */
export const isValidSkillIdentifier = (value: string): boolean =>
    /^[0-9a-z]+(?:-[0-9a-z]+)*$/u.test(value.trim());

/** Get the default prompt name derived from a `.prompt.md` file name. */
export const getDefaultPromptName = (filePath: string): string =>
    path.basename(filePath).replace(/\.prompt\.md$/u, "");

/** Get the effective prompt slash-command name. */
export const getPromptName = (
    filePath: string,
    frontmatter: FrontmatterDocument | null
): string =>
    normalizeSlashName(
        getOptionalFrontmatterScalar(frontmatter, "name") ??
            getDefaultPromptName(filePath)
    );

/** Get the default custom-agent name derived from the file name. */
export const getDefaultAgentName = (filePath: string): string =>
    path
        .basename(filePath)
        .replace(/\.agent\.md$/u, "")
        .replace(/\.md$/u, "");

/** Get the effective custom-agent name. */
export const getAgentName = (
    filePath: string,
    frontmatter: FrontmatterDocument | null
): string =>
    normalizeSlashName(
        getOptionalFrontmatterScalar(frontmatter, "name") ??
            getDefaultAgentName(filePath)
    );

/** Get the parent directory name for a skill file. */
export const getSkillDirectoryName = (filePath: string): string =>
    path.basename(path.dirname(filePath));

/** Get the effective skill name when declared. */
export const getSkillName = (
    filePath: string,
    frontmatter: FrontmatterDocument | null
): string =>
    normalizeSlashName(
        getOptionalFrontmatterScalar(frontmatter, "name") ??
            getSkillDirectoryName(filePath)
    );
