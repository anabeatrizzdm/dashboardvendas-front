import { useEffect, useState } from "react";
import api from "../services/api";

export default function Vendas() {
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [vendas, setVendas] = useState([]);

  const [clienteId, setClienteId] = useState("");
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [itens, setItens] = useState([]);
  const [mensagem, setMensagem] = useState("");

  async function carregarDados() {
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

  useEffect(() => {
    carregarDados();
  }, []);

  function adicionarItem() {
    if (!produtoId || !quantidade) return;

    const produto = produtos.find((p) => p.id === Number(produtoId));

    setItens([
      ...itens,
      {
        produtoId: Number(produtoId),
        quantidade: Number(quantidade),
        nome: produto?.nome
      }
    ]);

    setProdutoId("");
    setQuantidade("");
  }

  async function salvarVenda(e) {
    e.preventDefault();
    setMensagem("");

    try {
      await api.post("/vendas", {
        clienteId: Number(clienteId),
        itens: itens.map((i) => ({
          produtoId: i.produtoId,
          quantidade: i.quantidade
        }))
      });

      setClienteId("");
      setProdutoId("");
      setQuantidade("");
      setItens([]);
      setMensagem("Venda salva com sucesso.");

      carregarDados();
    } catch (error) {
      console.error("Erro ao salvar venda:", error);
      setMensagem(error.response?.data?.message || "Erro ao salvar venda.");
    }
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Vendas</h1>
      <p className="page-subtitle">Registre e acompanhe vendas</p>

      {mensagem && <div className="message-error">{mensagem}</div>}

      <div className="grid grid-2">
        <div className="card">
          <h2 className="section-title">Nova venda</h2>

          <form className="inline-form" onSubmit={salvarVenda}>
            <label className="form-label">Cliente</label>
            <select
              className="form-select"
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
            >
              <option value="">Selecione o cliente</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>

            <div className="row">
              <select
                className="form-select"
                value={produtoId}
                onChange={(e) => setProdutoId(e.target.value)}
              >
                <option value="">Produto</option>
                {produtos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>

              <input
                className="form-input"
                placeholder="Qtd"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="secondary-btn"
              onClick={adicionarItem}
            >
              + Adicionar item
            </button>

            {itens.length > 0 && (
              <ul className="list">
                {itens.map((item, i) => (
                  <li className="list-item" key={i}>
                    <div>
                      <strong>{item.nome}</strong>
                      <div className="item-subtitle">
                        Quantidade: {item.quantidade}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <button className="primary-btn">Salvar venda</button>
          </form>
        </div>

        <div className="card">
          <h2 className="section-title">Histórico</h2>

          {vendas.length === 0 ? (
            <p className="empty-state">Nenhuma venda</p>
          ) : (
            <ul className="list">
              {vendas.map((v) => (
                <li className="list-item" key={v.id}>
                  <div>
                    <strong>
                      Venda #{v.id} - {v.cliente?.nome}
                    </strong>

                    <div className="item-subtitle">
                      Total: R$ {Number(v.valorTotal).toFixed(2)}
                    </div>

                    {v.itens?.map((item) => (
                      <div key={item.id} className="item-subtitle">
                        • {item.produto?.nome} (x{item.quantidade})
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div style={{ marginTop: 30 }} className="grid grid-2">
        <div className="card">
          <h2 className="section-title">👥 Clientes cadastrados</h2>

          {clientes.length === 0 ? (
            <p className="empty-state">Nenhum cliente</p>
          ) : (
            <ul className="list">
              {clientes.map((c) => (
                <li className="list-item" key={c.id}>
                  <div>
                    <strong>{c.nome}</strong>
                    <div className="item-subtitle">{c.email}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h2 className="section-title">🛒 Produtos cadastrados</h2>

          {produtos.length === 0 ? (
            <p className="empty-state">Nenhum produto</p>
          ) : (
            <ul className="list">
              {produtos.map((p) => (
                <li className="list-item" key={p.id}>
                  <div>
                    <strong>{p.nome}</strong>
                    <div className="item-subtitle">
                      R$ {Number(p.preco).toFixed(2)} | Estoque: {p.estoque}
                    </div>
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