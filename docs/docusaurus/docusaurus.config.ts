import { themes as prismThemes } from "prism-react-renderer";
import { createRequire } from "node:module";

import type { Options as DocsPluginOptions } from "@docusaurus/plugin-content-docs";
import type * as Preset from "@docusaurus/preset-classic";
import type { Config, PluginModule } from "@docusaurus/types";

const organizationName = "Nick2bad4u";
const projectName = "eslint-plugin-copilot";
const baseUrl = process.env["DOCUSAURUS_BASE_URL"] ?? "/eslint-plugin-copilot/";
const siteOrigin = "https://nick2bad4u.github.io";
const siteUrl = `${siteOrigin}${baseUrl}`;
const siteDescription =
    "ESLint plugin for linting GitHub Copilot repository customization files.";
const socialCardImagePath = "img/logo.png";
const socialCardImageUrl = new URL(socialCardImagePath, siteUrl).toString();
const pwaThemeColor = "#312E81";
const pwaTileColor = "#312E81";
const pwaMaskIconColor = "#312E81";

/** Local require helper rooted at the docs workspace config file location. */
const requireFromDocsWorkspace = createRequire(import.meta.url);

/** Resolve an optional module specifier without throwing when absent. */
const resolveOptionalModule = (moduleSpecifier: string): string | undefined => {
    try {
        return requireFromDocsWorkspace.resolve(moduleSpecifier);
    } catch {
        return undefined;
    }
};

/**
 * Optional ESM entry used to avoid webpack warnings from VS Code CSS language
 * service packages.
 */
const vscodeCssLanguageServiceEsmEntry = resolveOptionalModule(
    "vscode-css-languageservice/lib/esm/cssLanguageService.js"
);

/**
 * Optional ESM entry used to avoid webpack warnings from VS Code language
 * server type packages.
 */
const vscodeLanguageServerTypesEsmEntry = resolveOptionalModule(
    "vscode-languageserver-types/lib/esm/main.js"
);

/**
 * Alias VS Code language-service packages to their ESM entries when they are
 * present and suppress known third-party webpack warning noise.
 */
const suppressKnownWebpackWarningsPlugin: PluginModule = () => {
    return {
        configureWebpack() {
            return {
                ignoreWarnings: [
                    (warning: unknown) => {
                        const warningRecord = warning as
                            | Readonly<Record<string, unknown>>
                            | undefined;
                        const warningMessage = warningRecord?.["message"];

                        return (
                            typeof warningMessage === "string" &&
                            warningMessage.includes(
                                "Critical dependency: require function is used in a way in which dependencies cannot be statically extracted"
                            )
                        );
                    },
                ],
                resolve: {
                    alias: {
                        ...(vscodeCssLanguageServiceEsmEntry === undefined
                            ? {}
                            : {
                                  "vscode-css-languageservice$":
                                      vscodeCssLanguageServiceEsmEntry,
                              }),
                        ...(vscodeLanguageServerTypesEsmEntry === undefined
                            ? {}
                            : {
                                  "vscode-languageserver-types$":
                                      vscodeLanguageServerTypesEsmEntry,
                                  "vscode-languageserver-types/lib/umd/main.js$":
                                      vscodeLanguageServerTypesEsmEntry,
                              }),
                    },
                },
            };
        },
        name: "suppress-known-webpack-warnings",
    };
};

/** Obfuscated key for the v4 legacy post-build head attribute removal flag. */
const removeHeadAttrFlagKey = [
    "remove",
    "Le",
    "gacyPostBuildHeadAttribute",
].join("");

/** Opt-in flag for experimental Docusaurus performance features. */
const enableExperimentalFaster =
    process.env["DOCUSAURUS_ENABLE_EXPERIMENTAL"] === "true";

/** Docusaurus future flags, including optional experimental fast path. */
const futureConfig = {
    ...(enableExperimentalFaster
        ? {
              faster: {
                  mdxCrossCompilerCache: true,
                  rspackBundler: true,
                  rspackPersistentCache: true,
                  ssgWorkerThreads: true,
              },
          }
        : {}),
    v4: {
        [removeHeadAttrFlagKey]: true,
        // NOTE: Enabling cascade layers currently breaks our production CSS output
        // (CssMinimizer parsing errors -> large chunks of CSS dropped), which
        // makes many Infima (--ifm-*) variables undefined across the site.
        // Re-enable only after verifying the build output CSS is valid.
        siteStorageNamespacing: true,
        fasterByDefault: true,
        removeLegacyPostBuildHeadAttribute: true,
        mdx1CompatDisabledByDefault: true,
        useCssCascadeLayers: false,
    },
} satisfies Config["future"];

const config = {
    storage: {
        namespace: true,
        type: "localStorage",
    },
    baseUrl,
    baseUrlIssueBanner: true,
    deploymentBranch: "gh-pages",
    favicon: "img/favicon.ico",
    future: futureConfig,
    headTags: [
        {
            attributes: {
                href: siteOrigin,
                rel: "preconnect",
            },
            tagName: "link",
        },
        {
            attributes: {
                href: "https://github.com",
                rel: "preconnect",
            },
            tagName: "link",
        },
        {
            attributes: {
                type: "application/ld+json",
            },
            innerHTML: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                description: siteDescription,
                image: socialCardImageUrl,
                name: "eslint-plugin-copilot",
                publisher: {
                    "@type": "Person",
                    name: "Nick2bad4u",
                    url: "https://github.com/Nick2bad4u",
                },
                url: siteUrl,
            }),
            tagName: "script",
        },
    ],
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
        hooks: {
            onBrokenMarkdownImages: "warn",
            onBrokenMarkdownLinks: "warn",
        },
        mermaid: true,
    },
    noIndex: false,
    onBrokenAnchors: "warn",
    onBrokenLinks: "warn",
    onDuplicateRoutes: "warn",
    organizationName,
    plugins: [
        suppressKnownWebpackWarningsPlugin,
        "docusaurus-plugin-image-zoom",
        [
            "@docusaurus/plugin-pwa",
            {
                debug: process.env["DOCUSAURUS_PWA_DEBUG"] === "true",
                offlineModeActivationStrategies: [
                    "appInstalled",
                    "standalone",
                    "queryString",
                ],
                pwaHead: [
                    {
                        href: `${baseUrl}manifest.json`,
                        rel: "manifest",
                        tagName: "link",
                    },
                    {
                        content: pwaThemeColor,
                        name: "theme-color",
                        tagName: "meta",
                    },
                    {
                        content: "yes",
                        name: "apple-mobile-web-app-capable",
                        tagName: "meta",
                    },
                    {
                        content: "default",
                        name: "apple-mobile-web-app-status-bar-style",
                        tagName: "meta",
                    },
                    {
                        href: `${baseUrl}img/logo_192x192.png`,
                        rel: "apple-touch-icon",
                        tagName: "link",
                    },
                    {
                        color: pwaMaskIconColor,
                        href: `${baseUrl}img/logo.svg`,
                        rel: "mask-icon",
                        tagName: "link",
                    },
                    {
                        content: `${baseUrl}img/logo_192x192.png`,
                        name: "msapplication-TileImage",
                        tagName: "meta",
                    },
                    {
                        content: pwaTileColor,
                        name: "msapplication-TileColor",
                        tagName: "meta",
                    },
                ],
            },
        ],
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
        "@docusaurus/theme-live-codeblock",
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
                    exclude: [
                        "**/*.d.ts",
                        "**/*.d.tsx",
                        "**/__tests__/**",
                        "**/*.test.{js,jsx,ts,tsx}",
                        "**/*.spec.{js,jsx,ts,tsx}",
                    ],
                    include: ["**/*.{js,jsx,ts,tsx,md,mdx}"],
                    mdxPageComponent: "@theme/MDXPage",
                },
                sitemap: {
                    filename: "sitemap.xml",
                    ignorePatterns: ["/tests/**"],
                    lastmod: "datetime",
                },
                theme: {
                    customCss: "./src/css/custom.css",
                },
            } satisfies Preset.Options,
        ],
    ],
    projectName,
    tagline:
        "Lint GitHub Copilot repository instructions, prompt files, custom agents, legacy chat modes, and related customization assets.",
    themeConfig: {
        colorMode: {
            defaultMode: "dark",
            disableSwitch: false,
            respectPrefersColorScheme: true,
        },
        liveCodeBlock: {
            playgroundPosition: "bottom",
        },
        metadata: [
            {
                content:
                    "eslint, eslint-plugin, github-copilot, repository-instructions, prompts, agent-metadata, static-analysis",
                name: "keywords",
            },
            {
                content: "summary_large_image",
                name: "twitter:card",
            },
            {
                content: "eslint-plugin-copilot",
                property: "og:site_name",
            },
        ],
        footer: {
            copyright:
                `© ${new Date().getFullYear()} ` +
                '<a href="https://github.com/Nick2bad4u" target="_blank" rel="noopener noreferrer">Nick2bad4u</a>.',
            links: [
                {
                    items: [
                        {
                            className: "footer-link--overview",
                            label: "\uead3 Getting started",
                            to: "/docs/rules/getting-started",
                        },
                        {
                            className: "footer-link--rules",
                            label: "\uea96 Rule overview",
                            to: "/docs/rules/overview",
                        },
                        {
                            className: "footer-link--presets",
                            label: "\ue690 Presets",
                            to: "/docs/rules/presets",
                        },
                        {
                            className: "footer-link--reference",
                            label: "\ud83e\udde9 Customization files",
                            to: "/docs/rules/guides/copilot-customization-files",
                        },
                    ],
                    title: "Docs",
                },
                {
                    items: [
                        {
                            className: "footer-link--github",
                            href: `https://github.com/${organizationName}/${projectName}`,
                            label: "\uf09b GitHub",
                        },
                        {
                            className: "footer-link--npm",
                            href: "https://www.npmjs.com/package/eslint-plugin-copilot",
                            label: "\uf1fa npm package",
                        },
                        {
                            className: "footer-link--releases",
                            href: `https://github.com/${organizationName}/${projectName}/releases`,
                            label: "\uf0c5 Releases",
                        },
                        {
                            className: "footer-link--changelog",
                            href: `https://github.com/${organizationName}/${projectName}/blob/main/CHANGELOG.md`,
                            label: "\uf0f6 Changelog",
                        },
                    ],
                    title: "Project",
                },
                {
                    items: [
                        {
                            className: "footer-link--developer",
                            label: "\uf121 Developer guide",
                            to: "/developer",
                        },
                        {
                            className: "footer-link--adrs",
                            label: "\uf02d ADRs",
                            to: "/developer/adrs",
                        },
                        {
                            className: "footer-link--contributing",
                            href: `https://github.com/${organizationName}/${projectName}/blob/main/CONTRIBUTING.md`,
                            label: "\uf0c0 Contributing",
                        },
                        {
                            className: "footer-link--support",
                            href: `https://github.com/${organizationName}/${projectName}/blob/main/SUPPORT.md`,
                            label: "\uf1cd Support",
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
            hideOnScroll: true,
            style: "dark",
            items: [
                {
                    className: "navbar-link--overview",
                    label: "Get started",
                    to: "/docs/rules/getting-started",
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
                height: 32,
                href: baseUrl,
                src: "img/logo.svg",
                width: 32,
            },
            title: "eslint-plugin-copilot",
        },
        prism: {
            additionalLanguages: [
                "bash",
                "json",
                "yaml",
                "typescript",
            ],
            defaultLanguage: "typescript",
            darkTheme: prismThemes.vsDark,
            theme: prismThemes.github,
        },
        tableOfContents: {
            maxHeadingLevel: 4,
            minHeadingLevel: 2,
        },
        zoom: {
            background: {
                dark: "rgb(50, 50, 50)",
                light: "rgb(255, 255, 255)",
            },
            config: {},
            selector: ".markdown > img",
        },
    } satisfies Preset.ThemeConfig,
    title: "eslint-plugin-copilot",
    themes: [
        "@docusaurus/theme-mermaid",
        [
            "@easyops-cn/docusaurus-search-local",
            {
                docsDir: ["../rules", "./site-docs/developer"],
                docsPluginIdForPreferredVersion: "rules",
                docsRouteBasePath: ["docs/rules", "developer"],
                explicitSearchResultPath: true,
                forceIgnoreNoIndex: true,
                hashed: true,
                hideSearchBarWithNoSearchContext: false,
                highlightSearchTermsOnTargetPage: true,
                indexBlog: false,
                indexDocs: true,
                indexPages: true,
                language: ["en"],
                removeDefaultStemmer: true,
                removeDefaultStopWordFilter: false,
                searchBarPosition: "right",
                searchBarShortcut: true,
                searchBarShortcutHint: true,
                searchBarShortcutKeymap: "ctrl+k",
                searchResultContextMaxLength: 96,
                searchResultLimits: 10,
                useAllContextsWithNoSearchContext: false,
            },
        ],
    ],
    trailingSlash: true,
    url: siteOrigin,
} satisfies Config;

export default config;
