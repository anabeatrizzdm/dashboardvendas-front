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
  const [loading, setLoading] = useState(false);

  async function carregarDados() {
    try {
      const clientesRes = await api.get("/clientes");
      setClientes(clientesRes.data);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      console.error("Resposta clientes:", error.response?.data);
      setClientes([]);
    }

    try {
      const produtosRes = await api.get("/produtos");
      setProdutos(produtosRes.data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      console.error("Resposta produtos:", error.response?.data);
      setProdutos([]);
    }

    try {
      const vendasRes = await api.get("/vendas");
      console.log("VENDAS:", vendasRes.data);
      setVendas(vendasRes.data);
    } catch (error) {
      console.error("Erro ao carregar vendas:", error);
      console.error("Resposta vendas:", error.response?.data);
      setVendas([]);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  function adicionarItem() {
    setMensagem("");

    if (!produtoId) {
      setMensagem("Selecione um produto.");
      return;
    }

    if (!quantidade || Number(quantidade) <= 0) {
      setMensagem("Informe uma quantidade válida.");
      return;
    }

    const produto = produtos.find((p) => p.id === Number(produtoId));

    if (!produto) {
      setMensagem("Produto não encontrado.");
      return;
    }

    const itemExistente = itens.find(
      (item) => item.produtoId === Number(produtoId)
    );

    if (itemExistente) {
      const novosItens = itens.map((item) =>
        item.produtoId === Number(produtoId)
          ? {
              ...item,
              quantidade: item.quantidade + Number(quantidade)
            }
          : item
      );

      setItens(novosItens);
    } else {
      setItens([
        ...itens,
        {
          produtoId: Number(produtoId),
          quantidade: Number(quantidade),
          nome: produto.nome
        }
      ]);
    }

    setProdutoId("");
    setQuantidade("");
  }

  function removerItem(index) {
    const novosItens = itens.filter((_, i) => i !== index);
    setItens(novosItens);
  }

  async function salvarVenda(e) {
    e.preventDefault();
    setMensagem("");

    if (!clienteId) {
      setMensagem("Selecione um cliente.");
      return;
    }

    if (itens.length === 0) {
      setMensagem("Adicione pelo menos um item à venda.");
      return;
    }

    try {
      setLoading(true);

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

      await carregarDados();
    } catch (error) {
      console.error("Erro ao salvar venda:", error);
      console.error("Resposta do backend:", error.response?.data);
      setMensagem(error.response?.data?.message || "Erro ao salvar venda.");
    } finally {
      setLoading(false);
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
                type="number"
                min="1"
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
              <ul className="list scroll-card">
                {itens.map((item, i) => (
                  <li className="list-item" key={i}>
                    <div>
                      <strong>{item.nome}</strong>
                      <div className="item-subtitle">
                        Quantidade: {item.quantidade}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="danger-btn"
                      onClick={() => removerItem(i)}
                    >
                      Remover
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <button className="primary-btn" disabled={loading}>
              {loading ? "Salvando..." : "Salvar venda"}
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="section-title">Histórico</h2>

          {vendas.length === 0 ? (
            <p className="empty-state">Nenhuma venda</p>
          ) : (
            <ul className="list scroll-card">
              {vendas.map((v) => (
                <li className="list-item" key={v.id}>
                  <div>
                    <strong>
                      Venda #{v.id} - {v.cliente?.nome || "Cliente"}
                    </strong>

                    <div className="item-subtitle">
                      Total: R$ {Number(v.valorTotal).toFixed(2)}
                    </div>

                    {v.itens?.length > 0 ? (
                      v.itens.map((item) => (
                        <div key={item.id} className="item-subtitle">
                          • {item.produto?.nome || "Produto"} (x{item.quantidade})
                        </div>
                      ))
                    ) : (
                      <div className="item-subtitle">Sem itens carregados</div>
                    )}
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
            <ul className="list scroll-card">
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
            <ul className="list scroll-card">
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