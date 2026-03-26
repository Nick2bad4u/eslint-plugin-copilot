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
        [
            "@docusaurus/plugin-content-docs",
            {
                editUrl: `https://github.com/${organizationName}/${projectName}/blob/main/docs/docusaurus/`,
                id: "developer",
                path: "./site-docs/developer",
                routeBasePath: "developer",
                showLastUpdateAuthor: true,
                showLastUpdateTime: true,
                sidebarPath: "./sidebars.developer.ts",
            } satisfies DocsPluginOptions,
        ],
    ],
    presets: [
        [
            "classic",
            {
                blog: false,
                docs: false,
                googleTagManager: {
                    containerId: "GTM-T8J6HPLF",
                },
                gtag: {
                    trackingID: "G-18DR1S6R1T",
                },
                pages: {
                    editUrl: `https://github.com/${organizationName}/${projectName}/blob/main/docs/docusaurus/`,
                    exclude: ["**/*.d.ts", "**/*.d.tsx"],
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
    themes: [
        [
            "@easyops-cn/docusaurus-search-local",
            {
                docsDir: ["../rules", "./site-docs/developer"],
                docsPluginIdForPreferredVersion: "rules",
                docsRouteBasePath: ["docs/rules", "developer"],
                explicitSearchResultPath: true,
                hashed: true,
                highlightSearchTermsOnTargetPage: true,
                indexBlog: false,
                indexDocs: true,
                indexPages: true,
                language: ["en"],
                searchBarPosition: "right",
                searchResultLimits: 10,
            },
        ],
    ],
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
                            className: "footer-link--overview",
                            label: "Getting started",
                            to: "/docs/rules/getting-started",
                        },
                        {
                            className: "footer-link--rules",
                            label: "Rule overview",
                            to: "/docs/rules/overview",
                        },
                        {
                            className: "footer-link--presets",
                            label: "Presets",
                            to: "/docs/rules/presets",
                        },
                        {
                            className: "footer-link--reference",
                            label: "Rule reference",
                            to: "/docs/rules/overview",
                        },
                    ],
                    title: "Docs",
                },
                {
                    items: [
                        {
                            className: "footer-link--github",
                            href: `https://github.com/${organizationName}/${projectName}`,
                            label: "GitHub",
                        },
                        {
                            className: "footer-link--npm",
                            href: "https://www.npmjs.com/package/eslint-plugin-copilot",
                            label: "npm package",
                        },
                        {
                            className: "footer-link--releases",
                            href: `https://github.com/${organizationName}/${projectName}/releases`,
                            label: "Releases",
                        },
                        {
                            className: "footer-link--changelog",
                            href: `https://github.com/${organizationName}/${projectName}/blob/main/CHANGELOG.md`,
                            label: "Changelog",
                        },
                    ],
                    title: "Project",
                },
                {
                    items: [
                        {
                            className: "footer-link--developer",
                            label: "Developer guide",
                            to: "/developer",
                        },
                        {
                            className: "footer-link--adrs",
                            label: "ADRs",
                            to: "/developer/adrs",
                        },
                        {
                            className: "footer-link--resources",
                            label: "Resources",
                            to: "/resources",
                        },
                        {
                            className: "footer-link--project-page",
                            label: "Project page",
                            to: "/project",
                        },
                        {
                            className: "footer-link--contributing",
                            href: `https://github.com/${organizationName}/${projectName}/blob/main/CONTRIBUTING.md`,
                            label: "Contributing",
                        },
                        {
                            className: "footer-link--support",
                            href: `https://github.com/${organizationName}/${projectName}/blob/main/SUPPORT.md`,
                            label: "Support",
                        },
                    ],
                    title: "Developer",
                },
            ],
            logo: {
                alt: "GitHub Copilot footer logo",
                href: baseUrl,
                src: "img/github-copilot-footer-light.png",
            },
            style: "dark",
        },
        image: "img/logo.png",
        navbar: {
            items: [
                {
                    className: "navbar-link--overview",
                    label: "Get started",
                    to: "/docs/rules/overview",
                },
                {
                    className: "navbar-link--presets",
                    label: "Presets",
                    to: "/docs/rules/presets",
                },
                {
                    className: "navbar-link--rules",
                    label: "Rules",
                    to: "/docs/rules/overview",
                },
                {
                    className: "navbar-link--developer",
                    label: "Developer",
                    position: "right",
                    to: "/developer",
                },
                {
                    className: "navbar-link--github",
                    href: `https://github.com/${organizationName}/${projectName}`,
                    label: "GitHub",
                    position: "right",
                },
                {
                    className: "navbar-link--search",
                    position: "right",
                    type: "search",
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
