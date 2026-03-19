import process from "node:process";

import { ESLint } from "eslint";
import pc from "picocolors";

import plugin from "../plugin.mjs";

/**
 * @typedef {Readonly<{
 *     configName: "all" | "minimal";
 *     expectedMaximumMessages?: number;
 *     expectedMinimumMessages: number;
 *     filePath: string;
 *     name: string;
 *     ruleId: string;
 *     text: string;
 * }>} Scenario
 */

const expectedEslintMajorArgumentPrefix = "--expect-eslint-major=";

/**
 * @param {readonly string[]} argv
 *
 * @returns {number | undefined}
 */
const parseExpectedEslintMajor = (argv) => {
    const matchingArgument = argv.find((argument) =>
        argument.startsWith(expectedEslintMajorArgumentPrefix)
    );

    if (matchingArgument === undefined) {
        return undefined;
    }

    const majorString = matchingArgument.slice(
        expectedEslintMajorArgumentPrefix.length
    );

    if (majorString.length === 0) {
        throw new Error(
            `Missing ESLint major value in argument: ${matchingArgument}`
        );
    }

    const majorValue = Number.parseInt(majorString, 10);

    if (Number.isNaN(majorValue)) {
        throw new Error(
            `Invalid ESLint major value in argument: ${matchingArgument}`
        );
    }

    return majorValue;
};

/**
 * @param {number | undefined} expectedMajor
 */
const assertEslintMajor = (expectedMajor) => {
    const runtimeVersion = ESLint.version;

    if (typeof runtimeVersion !== "string" || runtimeVersion.length === 0) {
        throw new Error(
            `Unable to determine ESLint runtime version: ${String(runtimeVersion)}`
        );
    }

    const [runtimeMajorText] = runtimeVersion.split(".", 1);

    if (runtimeMajorText === undefined || runtimeMajorText.length === 0) {
        throw new Error(
            `Unable to parse ESLint runtime version: ${runtimeVersion}`
        );
    }

    const runtimeMajor = Number.parseInt(runtimeMajorText, 10);

    if (Number.isNaN(runtimeMajor)) {
        throw new Error(
            `Unable to parse ESLint runtime version: ${runtimeVersion}`
        );
    }

    if (expectedMajor !== undefined && runtimeMajor !== expectedMajor) {
        throw new Error(
            `Expected ESLint major ${expectedMajor}, but detected ${runtimeVersion}.`
        );
    }

    console.log(
        `${pc.green("✓")}` +
            ` ESLint runtime ${pc.bold(runtimeVersion)} detected for compatibility smoke checks.`
    );
};

/**
 * @param {"all" | "minimal"} configName
 *
 * @returns {import("eslint").Linter.Config[]}
 */
const createCompatibilityConfig = (configName) => {
    const baseConfig = plugin.configs?.[configName];

    if (baseConfig === undefined) {
        throw new Error(
            `Plugin ${configName} config is unavailable. Compatibility smoke test cannot continue.`
        );
    }

    const configEntries = Array.isArray(baseConfig) ? baseConfig : [baseConfig];

    return configEntries.map((configEntry, index) => {
        const normalizedConfigEntry =
            /** @type {import("eslint").Linter.Config} */ (
                /** @type {unknown} */ (configEntry)
            );

        return {
            ...normalizedConfigEntry,
            name:
                index === 0
                    ? `compat-smoke:${configName}`
                    : `compat-smoke:${configName}:${index + 1}`,
        };
    });
};

/**
 * @param {Scenario} scenario
 */
const runScenario = async ({
    configName,
    expectedMaximumMessages,
    expectedMinimumMessages,
    filePath,
    name,
    ruleId,
    text,
}) => {
    const eslint = new ESLint({
        ignore: false,
        overrideConfig: createCompatibilityConfig(configName),
        overrideConfigFile: true,
    });

    const lintResults = await eslint.lintText(text, { filePath });

    const fatalMessages = lintResults.flatMap((result) =>
        result.messages.filter((message) => message.fatal === true)
    );

    if (fatalMessages.length > 0) {
        throw new Error(
            `${name}: encountered fatal parse/runtime diagnostics (${fatalMessages.length}).`
        );
    }

    const matchingMessages = lintResults.flatMap((result) =>
        result.messages.filter((message) => message.ruleId === ruleId)
    );

    if (matchingMessages.length < expectedMinimumMessages) {
        throw new Error(
            `${name}: expected at least ${expectedMinimumMessages} ${ruleId} message(s), received ${matchingMessages.length}.`
        );
    }

    if (
        expectedMaximumMessages !== undefined &&
        matchingMessages.length > expectedMaximumMessages
    ) {
        throw new Error(
            `${name}: expected at most ${expectedMaximumMessages} ${ruleId} message(s), received ${matchingMessages.length}.`
        );
    }

    console.log(
        `${pc.green("✓")}` +
            ` ${pc.bold(name)} ${pc.gray("->")} ${pc.bold(ruleId)} (${configName}) produced ${pc.magenta(
                String(matchingMessages.length)
            )} message(s).`
    );
};

const scenarios = /** @type {const} */ ([
    {
        configName: "minimal",
        expectedMinimumMessages: 1,
        filePath: ".github/prompts/review.prompt.md",
        name: "prompt-agent-required",
        ruleId: "copilot/require-prompt-file-metadata",
        text: "---\ndescription: Review the repository\n---\nReview the repository for stale configuration and docs drift.\n",
    },
    {
        configName: "all",
        expectedMinimumMessages: 1,
        filePath: ".github/prompts/review.prompt.md",
        name: "prompt-tools-qualified",
        ruleId: "copilot/prefer-qualified-tools",
        text: "---\ndescription: Review the repository\nagent: agent\ntools: [file_search]\n---\nReview the repository for stale configuration and docs drift.\n",
    },
    {
        configName: "minimal",
        expectedMinimumMessages: 1,
        filePath: ".github/instructions/typescript.instructions.md",
        name: "instructions-apply-to-required",
        ruleId: "copilot/require-instructions-apply-to",
        text: "---\ndescription: TypeScript defaults\n---\nPrefer explicit return types for exported helpers.\n",
    },
]);

console.log(pc.bold(pc.cyan("Running ESLint 9 compatibility smoke checks...")));

const expectedEslintMajor = parseExpectedEslintMajor(process.argv.slice(2));
assertEslintMajor(expectedEslintMajor);

for (const scenario of scenarios) {
    await runScenario(scenario);
}

console.log(pc.bold(pc.green("ESLint 9 compatibility smoke checks passed.")));
