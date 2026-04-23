import { useEffect, useState } from "react";
import api from "../services/api";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ nome: "", email: "", telefone: "" });

  async function carregarClientes() {
    const response = await api.get("/clientes");
    setClientes(response.data);
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  async function salvar(e) {
    e.preventDefault();
    await api.post("/clientes", form);
    setForm({ nome: "", email: "", telefone: "" });
    carregarClientes();
  }

  async function excluir(id) {
    await api.delete(`/clientes/${id}`);
    carregarClientes();
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Clientes</h1>
      <p className="page-subtitle">Cadastre e gerencie os clientes do sistema</p>

      <div className="grid grid-2">
        <div className="card">
          <h2 className="section-title">Novo cliente</h2>

          <form className="inline-form" onSubmit={salvar}>
            <input
              className="form-input"
              placeholder="Nome"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />
            <input
              className="form-input"
              placeholder="E-mail"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              className="form-input"
              placeholder="Telefone"
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: e.target.value })}
            />
            <button className="primary-btn" type="submit">Salvar cliente</button>
          </form>
        </div>

        <div className="card">
          <h2 className="section-title">Lista de clientes</h2>

          {clientes.length === 0 ? (
            <p className="empty-state">Nenhum cliente cadastrado.</p>
          ) : (
            <ul className="list scroll-card">
              {clientes.map((c) => (
                <li className="list-item" key={c.id}>
                  <div className="item-info">
                    <span className="item-title">{c.nome}</span>
                    <span className="item-subtitle">{c.email}</span>
                    <span className="item-subtitle">{c.telefone}</span>
                  </div>

                  <button className="danger-btn" onClick={() => excluir(c.id)}>
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