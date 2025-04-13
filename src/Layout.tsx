import palantirLogo from "/palantir.svg";
import reactLogo from "/react.svg";
import React from "react";
import css from "./Layout.module.css";

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={css.wrapper}>
      <header className={css.header}>
        <div className={css.brand}>
          <h1>🍕 Plato’s Pizza</h1>
        </div>
        <div className={css.links}>
          <a
            href="https://www.palantir.com/docs/foundry/ontology-sdk/overview/"
            target="_blank"
            rel="noreferrer"
          >
            <img src={palantirLogo} className={css.logo} alt="Palantir logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noreferrer">
            <img src={reactLogo} className={css.logo} alt="React logo" />
          </a>
        </div>
      </header>

      <main className={css.content}>{children}</main>

      <footer className={css.footer}>
        <p>Built with ❤️ on Foundry using React + Ontology SDK</p>
      </footer>
    </div>
  );
}
