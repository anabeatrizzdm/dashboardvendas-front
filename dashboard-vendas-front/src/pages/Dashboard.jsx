import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { DollarSign, ShoppingCart, Users, Package } from "lucide-react";

export default function Dashboard() {
  const [dados, setDados] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [vendas, setVendas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function carregarDados() {
      try {
        const dashboardRes = await api.get("/dashboard");
        setDados(dashboardRes.data);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
        setDados({
          totalVendas: 0,
          quantidadeVendas: 0,
          totalClientes: 0,
          totalProdutos: 0
        });
      }

      try {
        const clientesRes = await api.get("/clientes");
        setClientes(clientesRes.data);
      } catch (error) {
        console.error("Erro ao carregar clientes:", error);
        setClientes([]);
      }

      try {
        const produtosRes = await api.get("/produtos");
        setProdutos(produtosRes.data);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        setProdutos([]);
      }

      try {
        const vendasRes = await api.get("/vendas");
        setVendas(vendasRes.data);
      } catch (error) {
        console.error("Erro ao carregar vendas:", error);
        setVendas([]);
      }
    }

    carregarDados();
  }, []);

  if (!dados) {
    return <p className="page-container">Carregando...</p>;
  }

  const produtosBaixoEstoque = produtos.filter((p) => p.estoque <= 5);
  const ultimasVendas = vendas.slice(0, 5);
  const clientesRecentes = clientes.slice(0, 5);

  return (
    <div className="page-container">
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Visão geral do sistema</p>

      <div className="grid grid-4">
        <div className="card stat-card">
          <DollarSign size={28} />
          <h3>Total de vendas</h3>
          <p>R$ {Number(dados.totalVendas).toFixed(2)}</p>
        </div>

        <div className="card stat-card">
          <ShoppingCart size={28} />
          <h3>Vendas realizadas</h3>
          <p>{dados.quantidadeVendas}</p>
        </div>

        <div className="card stat-card">
          <Users size={28} />
          <h3>Clientes cadastrados</h3>
          <p>{dados.totalClientes}</p>
        </div>

        <div className="card stat-card">
          <Package size={28} />
          <h3>Produtos cadastrados</h3>
          <p>{dados.totalProdutos}</p>
        </div>
      </div>

      <div style={{ marginTop: "30px" }} className="grid grid-3">
        <div className="card">
          <h2 className="section-title">🚀 Ações rápidas</h2>
          <div className="grid" style={{ gap: "12px" }}>
            <button className="primary-btn" onClick={() => navigate("/clientes")}>
              Cadastrar cliente
            </button>
            <button className="secondary-btn" onClick={() => navigate("/produtos")}>
              Cadastrar produto
            </button>
            <button className="secondary-btn" onClick={() => navigate("/vendas")}>
              Registrar venda
            </button>
          </div>
        </div>

        <div className="card">
          <h2 className="section-title">📌 Status do sistema</h2>
          <div className="grid" style={{ gap: "10px", color: "#cbd5e1" }}>
            <div>Clientes ativos: {clientes.length}</div>
            <div>Produtos ativos: {produtos.length}</div>
            <div>Vendas registradas: {vendas.length}</div>
            <div>Produtos com estoque baixo: {produtosBaixoEstoque.length}</div>
          </div>
        </div>

        <div className="card">
          <h2 className="section-title">📦 Estoque baixo</h2>
          {produtosBaixoEstoque.length === 0 ? (
            <p className="empty-state">Nenhum produto com estoque baixo.</p>
          ) : (
            <div className="preview-list">
              {produtosBaixoEstoque.slice(0, 5).map((produto) => (
                <div key={produto.id} className="preview-item">
                  <div className="preview-title">{produto.nome}</div>
                  <div className="preview-subtitle">
                    Estoque: {produto.estoque}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: "30px" }} className="grid grid-2">
        <div className="card">
          <h2 className="section-title">🧾 Últimas vendas</h2>
          {ultimasVendas.length === 0 ? (
            <p className="empty-state">Nenhuma venda registrada.</p>
          ) : (
            <ul className="list scroll-card">
              {ultimasVendas.map((venda) => (
                <li key={venda.id} className="list-item">
                  <div className="item-info">
                    <span className="item-title">
                      Venda #{venda.id} - {venda.cliente?.nome || "Cliente"}
                    </span>
                    <span className="item-subtitle">
                      Total: R$ {Number(venda.valorTotal).toFixed(2)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h2 className="section-title">👥 Clientes recentes</h2>
          {clientesRecentes.length === 0 ? (
            <p className="empty-state">Nenhum cliente cadastrado.</p>
          ) : (
            <ul className="list scroll-card">
              {clientesRecentes.map((cliente) => (
                <li key={cliente.id} className="list-item">
                  <div className="item-info">
                    <span className="item-title">{cliente.nome}</span>
                    <span className="item-subtitle">{cliente.email}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}