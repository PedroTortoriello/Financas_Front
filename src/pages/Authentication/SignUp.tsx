import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import api from './api';
import Logo from './Logo.png'; // Substitua pelo caminho correto para a imagem

const RegisterUserFormSchema = z.object({
  userName: z.string().min(3, { message: "Nome de usuário deve ter no mínimo 3 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres" }),
});

type RegisterUserFormData = z.infer<typeof RegisterUserFormSchema>;

const SignUp: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterUserFormData>({
    resolver: zodResolver(RegisterUserFormSchema),
  });

  async function registerUser(data: RegisterUserFormData) {
    setLoading(true);

    try {
      const headers = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };

      // Enviar os dados para o back-end
      const response = await api.post("/newUsers", {
        email: data.email,
        password: data.password,
        userName: data.userName, // Mapeia username para userName
      }, headers);

      const { userId } = response.data;

      // Agora você pode usar o userId conforme necessário
      console.log("User ID:", userId);
      navigate("/auth/signin");
    } catch (error) {
      setError(error.message);
      setTimeout(() => setError(""), 2100);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="register-page"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #1f2a3c, #0b0e11)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#fff"
      }}
    >
      <div
        className="register-form"
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "2rem",
          backgroundColor: "#2a2f3a",
          borderRadius: "10px",
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
          animation: "fadeIn 0.5s ease-in-out"
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
          <img src={Logo} alt="Logo" style={{ maxWidth: "60%", height: "120px"}} />
        </div>
        <form onSubmit={handleSubmit(registerUser)} style={{ display: "flex", flexDirection: "column" }}>
          <div className="form-group" style={{ marginBottom: "1.5rem" }}>
            <label htmlFor="username" style={{ color: "#A0AEC0", marginBottom: "0.5rem" }}>Nome de Usuário</label>
            <input
              id="username"
              type="text"
              {...register("userName")}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #3a3f4a",
                backgroundColor: "#3a3f4a",
                color: "#fff",
                outline: "none",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = "#00BFFF"}
              onBlur={(e) => e.target.style.borderColor = "#3a3f4a"}
            />
            {errors.username && <p style={{ color: "#F56565", marginTop: "0.5rem" }}>{errors.username.message}</p>}
          </div>

          <div className="form-group" style={{ marginBottom: "1.5rem" }}>
            <label htmlFor="email" style={{ color: "#A0AEC0", marginBottom: "0.5rem" }}>E-mail</label>
            <input
              id="email"
              type="email"
              {...register("email")}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #3a3f4a",
                backgroundColor: "#3a3f4a",
                color: "#fff",
                outline: "none",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = "#00BFFF"}
              onBlur={(e) => e.target.style.borderColor = "#3a3f4a"}
            />
            {errors.email && <p style={{ color: "#F56565", marginTop: "0.5rem" }}>{errors.email.message}</p>}
          </div>

          <div className="form-group" style={{ marginBottom: "1.5rem" }}>
            <label htmlFor="password" style={{ color: "#A0AEC0", marginBottom: "0.5rem" }}>Senha</label>
            <input
              id="password"
              type="password"
              {...register("password")}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #3a3f4a",
                backgroundColor: "#3a3f4a",
                color: "#fff",
                outline: "none",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = "#00BFFF"}
              onBlur={(e) => e.target.style.borderColor = "#3a3f4a"}
            />
            {errors.password && <p style={{ color: "#F56565", marginTop: "0.5rem" }}>{errors.password.message}</p>}
          </div>

          {error && <p style={{ color: "#F56565", marginBottom: "1.5rem", textAlign: "center" }}>{error}</p>}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.75rem",
              background: "linear-gradient(90deg, #00BFFF, #00A3CC)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background 0.3s"
            }}
            onMouseEnter={(e) => e.target.style.background = "linear-gradient(90deg, #00A3CC, #0096BB)"}
            onMouseLeave={(e) => e.target.style.background = "linear-gradient(90deg, #00BFFF, #00A3CC)"}
            disabled={loading}
          >
            {loading ? "Carregando..." : "Registrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
