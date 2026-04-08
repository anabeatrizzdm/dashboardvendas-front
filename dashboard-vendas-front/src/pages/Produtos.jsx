import { useEffect, useState } from "react";
import api from "../services/api";

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [form, setForm] = useState({ nome: "", preco: "", estoque: "" });

  async function carregarProdutos() {
    const response = await api.get("/produtos");
    setProdutos(response.data);
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function salvar(e) {
    e.preventDefault();
    await api.post("/produtos", {
      ...form,
      preco: Number(form.preco),
      estoque: Number(form.estoque)
    });
    setForm({ nome: "", preco: "", estoque: "" });
    carregarProdutos();
  }

  async function excluir(id) {
    await api.delete(`/produtos/${id}`);
    carregarProdutos();
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Produtos</h1>
      <p className="page-subtitle">Gerencie os produtos disponíveis para venda</p>

      <div className="grid grid-2">
        <div className="card">
          <h2 className="section-title">Novo produto</h2>

          <form className="inline-form" onSubmit={salvar}>
            <input
              className="form-input"
              placeholder="Nome do produto"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />
            <input
              className="form-input"
              placeholder="Preço"
              value={form.preco}
              onChange={(e) => setForm({ ...form, preco: e.target.value })}
            />
            <input
              className="form-input"
              placeholder="Estoque"
              value={form.estoque}
              onChange={(e) => setForm({ ...form, estoque: e.target.value })}
            />
            <button className="primary-btn" type="submit">Salvar produto</button>
          </form>
        </div>

        <div className="card">
          <h2 className="section-title">Lista de produtos</h2>

          {produtos.length === 0 ? (
            <p className="empty-state">Nenhum produto cadastrado.</p>
          ) : (
            <ul className="list">
              {produtos.map((p) => (
                <li className="list-item" key={p.id}>
                  <div className="item-info">
                    <span className="item-title">{p.nome}</span>
                    <span className="item-subtitle">Preço: R$ {Number(p.preco).toFixed(2)}</span>
                    <span className="item-subtitle">Estoque: {p.estoque}</span>
                  </div>

                  <button className="danger-btn" onClick={() => excluir(p.id)}>
                    Excluir
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}