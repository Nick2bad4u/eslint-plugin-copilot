import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";

import styles from "./index.module.css";

const featureCards = [
    {
        description:
            "Lint repository instructions, path-specific instructions, prompt files, custom chat modes, and agent instructions.",
        title: "Repository customization focus",
        to: "/docs/rules/overview",
    },
    {
        description:
            "Start with a minimal metadata baseline or opt into stricter repository setup guarantees.",
        title: "Practical presets",
        to: "/docs/rules/presets",
    },
    {
        description:
            "Every rule includes targeted examples and links back to the canonical docs route used in runtime metadata.",
        title: "Consistent rule docs",
        to: "/docs/rules",
    },
] as const;

export default function Home(): React.JSX.Element {
    return (
        <Layout
            title="eslint-plugin-copilot docs"
            description="Documentation for eslint-plugin-copilot"
        >
            <main className={styles.page}>
                <section className={styles.hero}>
                    <div className="container">
                        <p className={styles.kicker}>
                            GitHub Copilot repository linting
                        </p>
                        <h1 className={styles.title}>eslint-plugin-copilot</h1>
                        <p className={styles.subtitle}>
                            Lint GitHub Copilot repository instructions, prompt
                            files, chat modes, and related markdown-first
                            customization surfaces.
                        </p>
                        <div className={styles.actions}>
                            <Link
                                className="button button--primary button--lg"
                                to="/docs/rules/getting-started"
                            >
                                Get started
                            </Link>
                            <Link
                                className="button button--secondary button--lg"
                                to="/docs/rules/presets"
                            >
                                Compare presets
                            </Link>
                        </div>
                    </div>
                </section>
                <section className={`container ${styles.cards}`}>
                    {featureCards.map((card) => (
                        <article key={card.title} className={styles.card}>
                            <h2 className={styles.cardTitle}>{card.title}</h2>
                            <p className={styles.cardDescription}>
                                {card.description}
                            </p>
                            <Link className={styles.cardLink} to={card.to}>
                                Open docs →
                            </Link>
                        </article>
                    ))}
                </section>
            </main>
        </Layout>
    );
}
