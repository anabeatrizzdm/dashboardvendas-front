import { Link, Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">Dashboard de Vendas</div>

          <nav className="nav-links">
            <Link className="nav-link" to="/dashboard">Dashboard</Link>
            <Link className="nav-link" to="/clientes">Clientes</Link>
            <Link className="nav-link" to="/produtos">Produtos</Link>
            <Link className="nav-link" to="/vendas">Vendas</Link>

            <button className="logout-btn" onClick={logout}>
              Sair
            </button>
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}