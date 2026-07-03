import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

type SidebarCategoryConfig = Readonly<{
    className?: string;
    collapsed: boolean;
    collapsible: boolean;
    items: readonly SidebarConfigItem[];
    label: string;
    type: "category";
}>;

type SidebarConfigItem = SidebarCategoryConfig | SidebarDocConfig;

type SidebarDocConfig = Readonly<{
    className?: string;
    id: string;
    label: string;
    type: "doc";
}>;

const topDoc = (
    id: string,
    label: string,
    className: string
): SidebarDocConfig => ({
    className,
    id,
    label,
    type: "doc",
});

const category = (
    label: string,
    className: string,
    items: readonly SidebarConfigItem[]
): SidebarCategoryConfig => ({
    className,
    collapsed: false,
    collapsible: true,
    items,
    label,
    type: "category",
});

const presetDoc = (id: string, label: string, className: string) =>
    topDoc(id, label, `sidebar-doc sidebar-doc--preset ${className}`);

let nextRuleNumber = 1;

const ruleDoc = (id: string, label: string, className: string) =>
    topDoc(
        id,
        `${String(nextRuleNumber++).padStart(2, "0")} ${label}`,
        `sidebar-doc sidebar-doc--rule ${className}`
    );

const promptRuleDoc = (id: string, label: string) =>
    ruleDoc(id, label, "sidebar-doc--rule-prompts");

const agentRuleDoc = (id: string, label: string) =>
    ruleDoc(id, label, "sidebar-doc--rule-agents");

const skillRuleDoc = (id: string, label: string) =>
    ruleDoc(id, label, "sidebar-doc--rule-skills");

const hookRuleDoc = (id: string, label: string) =>
    ruleDoc(id, label, "sidebar-doc--rule-hooks");

const sidebars = {
    rules: [
        topDoc("overview", "📘 Overview", "sidebar-doc sidebar-doc--overview"),
        topDoc(
            "getting-started",
            "🚀 Getting started",
            "sidebar-doc sidebar-doc--getting-started"
        ),
        category("🧭 Guides", "sidebar-category sidebar-category--guides", [
            topDoc(
                "guides/copilot-customization-files",
                "Copilot customization files",
                "sidebar-doc sidebar-doc--guide"
            ),
        ]),
        category("📦 Presets", "sidebar-category sidebar-category--presets", [
            topDoc(
                "presets/index",
                "Overview",
                "sidebar-doc sidebar-doc--preset-overview"
            ),
            presetDoc(
                "presets/minimal",
                "🟢 Minimal",
                "sidebar-doc--preset-minimal"
            ),
            presetDoc(
                "presets/recommended",
                "🟡 Recommended",
                "sidebar-doc--preset-recommended"
            ),
            presetDoc(
                "presets/strict",
                "🔴 Strict",
                "sidebar-doc--preset-strict"
            ),
            presetDoc("presets/all", "🟣 All", "sidebar-doc--preset-all"),
        ]),
        category(
            "📝 Repository instructions & prompts",
            "sidebar-category sidebar-category--prompts",
            [
                promptRuleDoc(
                    "require-instructions-apply-to",
                    "Require instructions applyTo"
                ),
                promptRuleDoc(
                    "require-valid-instructions-apply-to-globs",
                    "Require valid instructions applyTo globs"
                ),
                promptRuleDoc(
                    "require-prompt-file-metadata",
                    "Require prompt file metadata"
                ),
                promptRuleDoc(
                    "require-chatmode-file-metadata",
                    "Require chatmode file metadata"
                ),
                promptRuleDoc(
                    "no-blank-repository-instructions",
                    "No blank repository instructions"
                ),
                promptRuleDoc(
                    "no-blank-customization-body",
                    "No blank customization body"
                ),
                promptRuleDoc(
                    "require-repository-instructions-file",
                    "Require repository instructions file"
                ),
                promptRuleDoc(
                    "prefer-custom-instructions-under-code-review-limit",
                    "Prefer shorter custom instructions"
                ),
                promptRuleDoc(
                    "require-relative-prompt-links",
                    "Require relative prompt links"
                ),
                promptRuleDoc(
                    "require-relative-instructions-links",
                    "Require relative instructions links"
                ),
                promptRuleDoc(
                    "require-existing-relative-prompt-links",
                    "Require existing relative prompt links"
                ),
                promptRuleDoc(
                    "require-existing-relative-instructions-links",
                    "Require existing relative instructions links"
                ),
                promptRuleDoc(
                    "require-valid-prompt-name",
                    "Require valid prompt name"
                ),
                promptRuleDoc(
                    "require-valid-prompt-argument-hint",
                    "Require valid prompt argument hint"
                ),
                promptRuleDoc(
                    "require-valid-prompt-model",
                    "Require valid prompt model"
                ),
                promptRuleDoc(
                    "require-valid-prompt-tools",
                    "Require valid prompt tools"
                ),
                promptRuleDoc(
                    "no-duplicate-prompt-names",
                    "No duplicate prompt names"
                ),
            ]
        ),
        category(
            "🤖 Custom agents & chat modes",
            "sidebar-category sidebar-category--agents",
            [
                agentRuleDoc(
                    "prefer-qualified-tools",
                    "Prefer qualified tools"
                ),
                agentRuleDoc(
                    "no-deprecated-agent-infer",
                    "No deprecated agent infer"
                ),
                agentRuleDoc(
                    "require-agent-tool-for-subagents",
                    "Require agent tool for subagents"
                ),
                agentRuleDoc(
                    "no-legacy-chatmode-files",
                    "No legacy chatmode files"
                ),
                agentRuleDoc(
                    "require-valid-agent-name",
                    "Require valid agent name"
                ),
                agentRuleDoc(
                    "require-valid-agent-argument-hint",
                    "Require valid agent argument hint"
                ),
                agentRuleDoc(
                    "require-valid-agent-model",
                    "Require valid agent model"
                ),
                agentRuleDoc(
                    "require-valid-agent-target",
                    "Require valid agent target"
                ),
                agentRuleDoc(
                    "require-valid-agent-tools",
                    "Require valid agent tools"
                ),
                agentRuleDoc(
                    "require-valid-agent-subagents",
                    "Require valid agent subagents"
                ),
                agentRuleDoc(
                    "require-valid-agent-invocation-controls",
                    "Require valid agent invocation controls"
                ),
                agentRuleDoc(
                    "require-valid-agent-hooks",
                    "Require valid agent hooks"
                ),
                agentRuleDoc(
                    "require-valid-agent-hook-events",
                    "Require valid agent hook events"
                ),
                agentRuleDoc(
                    "require-valid-agent-hook-timeouts",
                    "Require valid agent hook timeouts"
                ),
                agentRuleDoc(
                    "require-relative-agent-hook-cwd",
                    "Require relative agent hook cwd"
                ),
                agentRuleDoc(
                    "require-existing-agent-hook-cwd",
                    "Require existing agent hook cwd"
                ),
                agentRuleDoc(
                    "require-relative-agent-links",
                    "Require relative agent links"
                ),
                agentRuleDoc(
                    "require-existing-relative-agent-links",
                    "Require existing relative agent links"
                ),
                agentRuleDoc(
                    "require-valid-agent-handoffs",
                    "Require valid agent handoffs"
                ),
                agentRuleDoc(
                    "require-valid-agent-handoff-send",
                    "Require valid agent handoff send"
                ),
                agentRuleDoc(
                    "require-qualified-agent-handoff-models",
                    "Require qualified agent handoff models"
                ),
                agentRuleDoc(
                    "require-valid-agent-mcp-servers",
                    "Require valid agent MCP servers"
                ),
                agentRuleDoc(
                    "require-github-copilot-target-for-mcp-servers",
                    "Require GitHub Copilot target for MCP servers"
                ),
                agentRuleDoc(
                    "require-json-agent-mcp-servers",
                    "Require JSON agent MCP servers"
                ),
                agentRuleDoc(
                    "require-existing-agent-mcp-servers",
                    "Require existing agent MCP servers"
                ),
                agentRuleDoc(
                    "require-agents-md-for-cross-surface-agent-instructions",
                    "Require AGENTS.md for cross-surface agent instructions"
                ),
                agentRuleDoc(
                    "no-duplicate-agent-names",
                    "No duplicate agent names"
                ),
            ]
        ),
        category("🧠 Skills", "sidebar-category sidebar-category--skills", [
            skillRuleDoc(
                "require-skill-file-location",
                "Require skill file location"
            ),
            skillRuleDoc(
                "require-skill-file-metadata",
                "Require skill file metadata"
            ),
            skillRuleDoc("no-blank-skill-body", "No blank skill body"),
            skillRuleDoc(
                "require-valid-skill-name",
                "Require valid skill name"
            ),
            skillRuleDoc(
                "require-valid-skill-directory-name",
                "Require valid skill directory name"
            ),
            skillRuleDoc(
                "require-skill-name-match-directory",
                "Require skill name match directory"
            ),
            skillRuleDoc(
                "require-valid-skill-license",
                "Require valid skill license"
            ),
            skillRuleDoc(
                "require-relative-skill-links",
                "Require relative skill links"
            ),
            skillRuleDoc(
                "require-existing-relative-skill-links",
                "Require existing relative skill links"
            ),
            skillRuleDoc(
                "no-duplicate-skill-names",
                "No duplicate skill names"
            ),
            skillRuleDoc(
                "require-skill-md-filename",
                "Require SKILL.md filename"
            ),
        ]),
        category(
            "🪝 Repository hooks & automation",
            "sidebar-category sidebar-category--hooks",
            [
                hookRuleDoc(
                    "require-valid-repository-hook-version",
                    "Require valid repository hook version"
                ),
                hookRuleDoc(
                    "require-repository-hooks-object",
                    "Require repository hooks object"
                ),
                hookRuleDoc(
                    "require-repository-hook-arrays",
                    "Require repository hook arrays"
                ),
                hookRuleDoc(
                    "require-valid-repository-hook-events",
                    "Require valid repository hook events"
                ),
                hookRuleDoc(
                    "require-valid-repository-hook-command-type",
                    "Require valid repository hook command type"
                ),
                hookRuleDoc(
                    "require-repository-hook-command-shell",
                    "Require repository hook command shell"
                ),
                hookRuleDoc(
                    "require-relative-repository-hook-cwd",
                    "Require relative repository hook cwd"
                ),
                hookRuleDoc(
                    "require-existing-repository-hook-cwd",
                    "Require existing repository hook cwd"
                ),
                hookRuleDoc(
                    "require-valid-repository-hook-timeouts",
                    "Require valid repository hook timeouts"
                ),
                hookRuleDoc(
                    "require-valid-repository-hook-env",
                    "Require valid repository hook env"
                ),
                hookRuleDoc(
                    "require-string-repository-hook-env-values",
                    "Require string repository hook env values"
                ),
                hookRuleDoc(
                    "no-empty-repository-hook-arrays",
                    "No empty repository hook arrays"
                ),
                hookRuleDoc(
                    "prefer-fast-repository-hooks",
                    "Prefer fast repository hooks"
                ),
                hookRuleDoc(
                    "no-duplicate-slash-command-names",
                    "No duplicate slash-command names"
                ),
            ]
        ),
    ],
} as unknown as SidebarsConfig;

export default sidebars;
