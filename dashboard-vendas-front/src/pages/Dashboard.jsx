import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import {
  DollarSign,
  ShoppingCart,
  Users,
  Package
} from "lucide-react";

import {
  Line
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [dados, setDados] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/dashboard")
      .then((res) => setDados(res.data))
      .catch(() => {
        setDados({
          totalVendas: 0,
          quantidadeVendas: 0,
          totalClientes: 0,
          totalProdutos: 0
        });
      });
  }, []);

  if (!dados) return <p className="page-container">Carregando...</p>;

  const chartData = {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
    datasets: [
      {
        label: "Vendas",
        data: [10, 20, 15, 30, 25, 40],
        borderWidth: 2,
        tension: 0.4
      }
    ]
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Visão geral do sistema</p>

      {/* CARDS */}
      <div className="grid grid-4">
        <div className="card stat-card">
          <DollarSign size={28} />
          <h3>Total vendas</h3>
          <p>R$ {Number(dados.totalVendas).toFixed(2)}</p>
        </div>

        <div className="card stat-card">
          <ShoppingCart size={28} />
          <h3>Vendas</h3>
          <p>{dados.quantidadeVendas}</p>
        </div>

        <div className="card stat-card">
          <Users size={28} />
          <h3>Clientes</h3>
          <p>{dados.totalClientes}</p>
        </div>

        <div className="card stat-card">
          <Package size={28} />
          <h3>Produtos</h3>
          <p>{dados.totalProdutos}</p>
        </div>
      </div>

      {/* GRÁFICO */}
      <div className="card" style={{ marginTop: 30 }}>
        <h2 className="section-title">📈 Evolução de vendas</h2>
        <Line data={chartData} />
      </div>

      {/* AÇÕES */}
      <div style={{ marginTop: 30 }} className="grid grid-3">
        <div className="card">
          <h3>Clientes</h3>
          <p>Gerencie seus clientes</p>
          <button className="primary-btn" onClick={() => navigate("/clientes")}>
            Acessar
          </button>
        </div>

        <div className="card">
          <h3>Produtos</h3>
          <p>Controle seus produtos</p>
          <button className="primary-btn" onClick={() => navigate("/produtos")}>
            Acessar
          </button>
        </div>

        <div className="card">
          <h3>Vendas</h3>
          <p>Registre suas vendas</p>
          <button className="primary-btn" onClick={() => navigate("/vendas")}>
            Acessar
          </button>
        </div>
      </div>
    </div>
  );
}