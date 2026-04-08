import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: ""
  });

  const [errors, setErrors] = useState({});
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function validate() {
    const newErrors = {};

    if (!form.nome) newErrors.nome = "Nome obrigatório";

    if (!form.email) {
      newErrors.email = "E-mail obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "E-mail inválido";
    }

    if (!form.senha) {
      newErrors.senha = "Senha obrigatória";
    } else if (form.senha.length < 6) {
      newErrors.senha = "Mínimo 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function getPasswordStrength() {
    if (form.senha.length < 6) return "fraca";
    if (form.senha.length < 8) return "media";
    return "forte";
  }

  async function handleRegister(e) {
    e.preventDefault();
    setMensagem("");

    if (!validate()) return;

    setLoading(true);

    try {
      await api.post("/auth/register", form);
      navigate("/");
    } catch (error) {
      setMensagem(
        error.response?.data?.message || "Erro ao cadastrar usuário"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Criar conta</h1>
        <p className="auth-subtitle">Comece agora mesmo a mexer no dashboard de vendas🚀</p>

        <form onSubmit={handleRegister}>

          {/* NOME */}
          <div className="form-group">
            <label className="form-label">Nome</label>
            <input
              className={`form-input ${errors.nome ? "input-error" : ""}`}
              placeholder="Digite seu nome"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />
            {errors.nome && <span className="error-text">{errors.nome}</span>}
          </div>

          {/* EMAIL */}
          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input
              className={`form-input ${errors.email ? "input-error" : ""}`}
              placeholder="Digite seu e-mail"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* SENHA */}
          <div className="form-group">
            <label className="form-label">Senha</label>

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-input ${errors.senha ? "input-error" : ""}`}
                placeholder="Crie uma senha"
                value={form.senha}
                onChange={(e) => setForm({ ...form, senha: e.target.value })}
              />

              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>

            {/* força da senha */}
            {form.senha && (
              <div className={`password-strength ${getPasswordStrength()}`}>
                {getPasswordStrength()}
              </div>
            )}

            {errors.senha && <span className="error-text">{errors.senha}</span>}
          </div>

          <button className="primary-btn" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        {mensagem && <div className="message-error">{mensagem}</div>}

        <p className="auth-footer">
          Já tem conta? <Link to="/">Entrar</Link>
        </p>
      </div>
    </div>
  );
}