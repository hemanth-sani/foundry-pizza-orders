import { NavLink } from "react-router-dom";
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
          <h1>🍕 Hemanth's Pizza</h1>
        </div>

        <nav className={css.nav}>
          <NavLink to="/" className={({ isActive }) => isActive ? css.active : ""}>
            Home
          </NavLink>
          <NavLink to="/menu" className={({ isActive }) => isActive ? css.active : ""}>
            Menu
          </NavLink>
          <NavLink to="/orders" className={({ isActive }) => isActive ? css.active : ""}>
            Orders
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => isActive ? css.active : ""}>
          Cart
          </NavLink>
          <NavLink to="/inventory" className={({ isActive }) => isActive ? css.active : ""}>
          Inventory
          </NavLink>
          <NavLink to="/suppliers" className={({ isActive }) => isActive ? css.active : ""}>
          Suppliers
          </NavLink>
          <NavLink to="/analytics" className={({ isActive }) => isActive ? css.active : ""}>
          Analytics
          </NavLink>
        
        </nav>
      </header>

      <main className={css.content}>{children}</main>

      <footer className={css.footer}>
        <p>Built with ❤️ using React + Ontology SDK</p>
      </footer>
    </div>
  );
}
