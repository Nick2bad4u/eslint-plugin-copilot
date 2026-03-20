import { themes as prismThemes } from "prism-react-renderer";

import type { Options as DocsPluginOptions } from "@docusaurus/plugin-content-docs";
import type { Config } from "@docusaurus/types";

const organizationName = "Nick2bad4u";
const projectName = "eslint-plugin-copilot";
const baseUrl = process.env["DOCUSAURUS_BASE_URL"] ?? "/eslint-plugin-copilot/";

const config: Config = {
    baseUrl,
    favicon: "img/logo.svg",
    future: {
        ...(process.env["DOCUSAURUS_ENABLE_EXPERIMENTAL"] === "true"
            ? {
                  experimental_faster: {
                      mdxCrossCompilerCache: true,
                      rspackBundler: true,
                      rspackPersistentCache: true,
                      ssgWorkerThreads: true,
                  },
              }
            : {}),
    },
    i18n: {
        defaultLocale: "en",
        locales: ["en"],
    },
    markdown: {
        anchors: {
            maintainCase: true,
        },
        emoji: true,
        format: "detect",
    },
    onBrokenLinks: "warn",
    onDuplicateRoutes: "warn",
    organizationName,
    plugins: [
        [
            "@docusaurus/plugin-content-docs",
            {
                editUrl: `https://github.com/${organizationName}/${projectName}/blob/main/docs/`,
                id: "rules",
                path: "../rules",
                routeBasePath: "docs/rules",
                showLastUpdateAuthor: true,
                showLastUpdateTime: true,
                sidebarPath: "./sidebars.rules.ts",
            } satisfies DocsPluginOptions,
        ],
    ],
    presets: [
        [
            "classic",
            {
                blog: false,
                docs: false,
                pages: {
                    editUrl: `https://github.com/${organizationName}/${projectName}/blob/main/docs/docusaurus/`,
                    exclude: [
                        // Declarations (often generated next to CSS modules)
                        // must never become routable pages.
                        "**/*.d.ts",
                        "**/*.d.tsx",
                    ],
                },
                theme: {
                    customCss: "./src/css/custom.css",
                },
            },
        ],
    ],
    projectName,
    tagline:
        "Lint GitHub Copilot repository instructions, prompt files, custom agents, legacy chat modes, and related customization assets.",
    themeConfig: {
        colorMode: {
            respectPrefersColorScheme: true,
        },
        footer: {
            copyright:
                `© ${new Date().getFullYear()} ` +
                '<a href="https://github.com/Nick2bad4u" target="_blank" rel="noopener noreferrer">Nick2bad4u</a>.',
            links: [
                {
                    items: [
                        {
                            label: "Overview",
                            to: "/docs/rules/overview",
                        },
                        {
                            label: "Presets",
                            to: "/docs/rules/presets",
                        },
                    ],
                    title: "Docs",
                },
                {
                    items: [
                        {
                            href: `https://github.com/${organizationName}/${projectName}`,
                            label: "GitHub",
                        },
                        {
                            href: "https://www.npmjs.com/package/eslint-plugin-copilot",
                            label: "npm",
                        },
                    ],
                    title: "Project",
                },
            ],
        },
        image: "img/logo.svg",
        navbar: {
            items: [
                {
                    label: "Rules",
                    to: "/docs/rules",
                },
                {
                    label: "Presets",
                    to: "/docs/rules/presets",
                },
                {
                    href: `https://github.com/${organizationName}/${projectName}`,
                    label: "GitHub",
                    position: "right",
                },
                {
                    href: "https://www.npmjs.com/package/eslint-plugin-copilot",
                    label: "npm",
                    position: "right",
                },
            ],
            logo: {
                alt: "eslint-plugin-copilot logo",
                src: "img/logo.svg",
            },
            title: "eslint-plugin-copilot",
        },
        prism: {
            darkTheme: prismThemes.vsDark,
            theme: prismThemes.github,
        },
    },
    title: "eslint-plugin-copilot",
    trailingSlash: false,
    url: "https://nick2bad4u.github.io",
};

export default config;
