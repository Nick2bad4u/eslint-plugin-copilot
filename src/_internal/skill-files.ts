/**
 * @packageDocumentation
 * Shared skill-file helpers for Copilot skill rules.
 */
import * as path from "node:path";

import type { FrontmatterDocument } from "./frontmatter.js";

import { normalizeAbsolutePath } from "./file-system.js";
import { hasFrontmatterField } from "./frontmatter.js";

const VALID_SKILL_FILE_LOCATION_PATTERN =
    /\/(?:\.github|\.claude)\/skills\/[^/]+\/SKILL\.md$/u;

/** Determine whether a file path is at a documented project-skill location. */
export const isValidSkillDefinitionLocation = (filePath: string): boolean =>
    VALID_SKILL_FILE_LOCATION_PATTERN.test(normalizeAbsolutePath(filePath));

/** Determine whether a Markdown file looks like a skill definition draft. */
export const looksLikeSkillDefinitionDocument = (
    frontmatter: FrontmatterDocument | null
): boolean =>
    frontmatter !== null &&
    (hasFrontmatterField(frontmatter, "name") ||
        hasFrontmatterField(frontmatter, "description") ||
        hasFrontmatterField(frontmatter, "license"));

/** Get the markdown basename for a skill-related file. */
export const getSkillFileBasename = (filePath: string): string =>
    path.basename(filePath);
