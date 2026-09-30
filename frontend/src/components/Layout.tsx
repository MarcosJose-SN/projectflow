import { NavLink, Outlet } from "react-router-dom";
import "../App.css";

function Layout() {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <span>◆</span>
          ProjectFlow
        </div>

        <nav>
          <NavLink to="/" end>
            Dashboard
          </NavLink>

          <NavLink to="/projetos">
            Projetos
          </NavLink>

          <NavLink to="/tarefas">
            Tarefas
          </NavLink>

          <NavLink to="/relatorios">
            Relatórios
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <p>ProjectFlow</p>
          <small>v1.0.0</small>
        </div>
      </aside>

      <main className="main">
        <header className="header">
          <div>
            <h1>ProjectFlow</h1>
            <p>Gestão de projetos e tarefas.</p>
          </div>

          <div className="user">
            <div className="avatar">MJ</div>

            <div>
              <strong>Marcos José</strong>
              <small>Administrador</small>
            </div>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}

export default Layout;