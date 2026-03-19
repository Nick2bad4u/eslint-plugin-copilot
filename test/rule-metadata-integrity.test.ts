import * as fs from "node:fs";
import * as path from "node:path";

import { describe, expect, it } from "vitest";

import { createRuleDocsUrl } from "../src/_internal/rule-docs-url";
import copilotPlugin from "../src/plugin";

const getRuleSourceFileNames = (): readonly string[] => {
    const rulesDirectory = path.join(process.cwd(), "src", "rules");

    return fs
        .readdirSync(rulesDirectory)
        .filter((entry) => entry.endsWith(".ts"))
        .map((entry) => entry.replace(/\.ts$/v, ""))
        .toSorted((left, right) => left.localeCompare(right));
};

describe("rule metadata integrity", () => {
    it("registers one runtime rule per source file", () => {
        expect(Object.keys(copilotPlugin.rules).toSorted()).toEqual(
            getRuleSourceFileNames()
        );
    });

    it("keeps canonical docs metadata on every rule", () => {
        for (const [ruleName, ruleModule] of Object.entries(
            copilotPlugin.rules
        )) {
            expect(ruleModule.meta.docs.url).toBe(createRuleDocsUrl(ruleName));
            expect(ruleModule.meta.docs.ruleId).toMatch(/^R\d{3}$/v);
            expect(ruleModule.meta.docs.ruleNumber).toBeGreaterThan(0);
            expect(
                ruleModule.meta.docs.copilotConfigNames.length
            ).toBeGreaterThan(0);
        }
    });
});
