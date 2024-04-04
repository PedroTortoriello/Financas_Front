import React, { useState, useEffect } from 'react';
import { MdMailOutline, MdPersonOutline } from "react-icons/md";
import { useForm } from 'react-hook-form';
import { AuthUserFormSchema } from './schemas';
import api from './api';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from './Button';
import Image from './Image';
import './StyleLogin.css';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo.png';
import { useMediaQuery } from 'react-responsive';

type AuthUserFormData = z.infer<typeof AuthUserFormSchema>;

const SignIn: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loggedInEmail, setLoggedInEmail] = useState("");
  const navigate = useNavigate(); // Use React Router's useHistory hook

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, // Add setValue function from useForm
  } = useForm<AuthUserFormData>({
    resolver: zodResolver(AuthUserFormSchema),
  });

  useEffect(() => {
    // Set value for email field when loggedInEmail changes
    setValue('email', loggedInEmail);
  }, [loggedInEmail, setValue]);

  async function AuthUser(data: AuthUserFormData) {
    setLoading(true);

    try {
      const response = await api.post("/autenticacao", data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("authenticate", response.data.authenticate);

      const authString = localStorage.getItem("authenticate");

      if (authString !== null) {
        const auth = JSON.parse(authString);

        if (auth === false) {
          setError("Usuário ou senha incorreta!");
          setTimeout(() => setError(""), 2100);
        } else {
          setLoggedInEmail(data.email);
          localStorage.setItem("userEmail", data.email); // Store the email in localStorage
          console.log("loggedInEmail antes de navegar:", data.email); // Adicione esta linha
          navigate("/Dashboard/ECommerce", { state: { loggedInEmail: data.email } });
        }
        
      } else {
        setError("Erro ao obter informações de autenticação.");
        setTimeout(() => setError(""), 2100);
      }
    } catch (error) {
      setError(error.message);
      setTimeout(() => setError(""), 2100);
    } finally {
      setLoading(false);
    }
  }  

  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div className="login-page">
      <div className="flex justify-center items-center bg-[#011e36]">
        <div className='boxLeft'>
          <form onSubmit={handleSubmit(AuthUser)}>
            <div className="boxRight md:hidden w-50 h-10 items-center justify-center ">
              {!isMobile && <Image imageLink={Logo} />}
            </div>

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
            </div>

            <div className="input-box">
              <label htmlFor="pswd">Senha<i>*</i></label>
              <MdPersonOutline id="icon" className="material-icons" />
              <input
                className="input"
                {...register("password")}
                id="pswd"
                type="password"
                placeholder='Digite sua Senha'
              />
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="button-container">
              {loggedInEmail ? ( // Render Link if loggedInEmail exists
                <Link to="/Table/Table">
                  <Button
                    name='button'
                    id='button'
                    type='button' // Change type to button
                    content="Login"
                    disabled={loading}
                  />
                </Link>
              ) : (
                <Button
                  name='button'
                  id='button'
                  type='submit' 
                  content={loading ? "Aguarde..." : "Login"}
                  disabled={loading}
                />
              )}
            </div>

            <div className="signup-link">
              <p>Ainda não possui conta? <Link to="/auth/signup" className='text-[#011e36] font-bold'>Cadastre-se</Link></p>
            </div>
          </form>
        </div>

        <div className="boxRight hidden md:block bg-[#011e36]">
          {!isMobile && <Image imageLink={Logo} />}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
