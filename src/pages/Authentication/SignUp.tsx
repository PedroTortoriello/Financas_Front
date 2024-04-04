import React, { useState, useEffect } from 'react';
import { MdMailOutline, MdPersonOutline } from "react-icons/md";
import { useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from './api';
import Button from './Button';
import Image from './Image';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo.png'
import { ResponseMessage } from './ResponseMessage';
import './StyleSignUp.css';

const UserFormSchema = z.object({
  email: z.string().email({ message: "O email é inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  confirmpassword: z.string(),
}).refine(data => data.password === data.confirmpassword, { message: "As senhas não coincidem" });

type SignUpFormData = z.infer<typeof UserFormSchema>;

const SignUp: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({
    message: "",
    type: "",
  });

  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
    resolver: zodResolver(UserFormSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true);
    try {
      const response = await api.post("/novoUsuario", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("authenticate", response.data.authenticate);
    
      if (response.data.result === "Usuário já existe na base.") {
        setResponse({ message: response.data.result, type: "error" });
        setTimeout(() => setResponse({ message: "", type: "" }), 2100);
      } else {
        localStorage.setItem("userEmail", data.email);
        navigate("/Dashboard/ECommerce"); // Redireciona para a página de login após o cadastro bem-sucedido
      }
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', (error as Error).message);
      setResponse({ message: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="flex justify-center items-center">
        <div className='boxLeft'>
          <form onSubmit={handleSubmit(onSubmit)}>

            <div className="input-box">
              <label htmlFor="email">Email<i>*</i></label>
              <MdMailOutline id="icon" className="material-icons" />
              <input
                className="input"
                {...register("email")}
                id="email"
                type="email"
                placeholder="Digite seu email"
              />
              {errors.email && <p className="error-message">{errors.email.message}</p>}
            </div>

            <div className="input-box">
              <label htmlFor="password">Senha<i>*</i></label>
              <MdPersonOutline id="icon" className="material-icons" />
              <input
                className="input"
                {...register("password")}
                id="password"
                type="password"
                placeholder="Digite sua senha"
              />
              {errors.password && <p className="error-message">{errors.password.message}</p>}
            </div>

            <div className="input-box">
              <label htmlFor="confirmpassword">Confirmar Senha<i>*</i></label>
              <MdPersonOutline id="icon" className="material-icons" />
              <input
                className="input"
                {...register("confirmpassword")}
                id="confirmpassword"
                type="password"
                placeholder="Confirme sua senha"
              />
              {errors.confirmpassword && <p className="error-message">{errors.confirmpassword.message}</p>}
            </div>

            {response.message !== "" && (
              <ResponseMessage message={response.message} type={response.type} />
            )}

            <div className="button-container">
              <Button
                name='button'
                id='button'
                type='submit'
                content={loading ? "Aguarde..." : "Cadastrar"}
                disabled={loading}
              />
            </div>

            <div className="signup-link">
              <p>Já possui uma conta? <Link to="/login" className='text-[#177357] font-bold'>Faça login</Link></p>
            </div>
          </form>
        </div>

        <div className="boxRight hidden md:block">
          <Image imageLink={Logo}  />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
