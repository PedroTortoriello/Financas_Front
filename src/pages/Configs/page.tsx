import React, { useState, useEffect } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import api from '../Authentication/api';
import './settings.css';

const Settings: React.FC = () => {
  const [userInfo, setUserInfo] = useState({ username: '', email: '', password: '' });
  const [notificationSettings, setNotificationSettings] = useState({ emailNotifications: true, smsNotifications: false });
  const [preferences, setPreferences] = useState({ currency: 'USD', language: 'en', theme: 'light' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const response = await api.get('/user-info', {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const { username, email, notificationSettings, preferences } = response.data;
        setUserInfo({ username, email, password: '' });
        setNotificationSettings(notificationSettings);
        setPreferences(preferences);
      } catch (error) {
        console.error('Erro ao buscar informações do usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await api.put('/update-profile', userInfo, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessage('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setMessage('Erro ao atualizar perfil.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationSettings({
      ...notificationSettings,
      [e.target.name]: e.target.checked,
    });
  };

  const handlePreferencesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPreferences({
      ...preferences,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <DefaultLayout>
      <div className="settings-container">
        <h1 className="page-title">Configurações de Perfil</h1>
        {message && <div className="alert">{message}</div>}
        
        <section className="card">
          <h2 className="card-title">Informações de Perfil</h2>
          <form onSubmit={handleProfileUpdate} className="form">
            <div className="form-group">
              <label htmlFor="username">Nome de Usuário</label>
              <input
                type="text"
                id="username"
                name="username"
                value={userInfo.username}
                onChange={handleInputChange}
                disabled={loading}
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={userInfo.email}
                onChange={handleInputChange}
                disabled={loading}
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                name="password"
                value={userInfo.password}
                onChange={handleInputChange}
                disabled={loading}
                className="input-field"
                placeholder="Deixe em branco para manter a senha atual"
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </form>
        </section>

        <section className="card">
          <h2 className="card-title">Configurações de Notificação</h2>
          <div className="notification-settings">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={notificationSettings.emailNotifications}
                onChange={handleNotificationChange}
                className="checkbox-input"
              />
              Notificações por Email
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="smsNotifications"
                checked={notificationSettings.smsNotifications}
                onChange={handleNotificationChange}
                className="checkbox-input"
              />
              Notificações por SMS
            </label>
          </div>
        </section>

        <section className="card">
          <h2 className="card-title">Preferências Gerais</h2>
          <div className="preferences">
            <div className="form-group">
              <label htmlFor="currency">Moeda</label>
              <select
                id="currency"
                name="currency"
                value={preferences.currency}
                onChange={handlePreferencesChange}
                className="input-field"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="BRL">BRL</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="language">Idioma</label>
              <select
                id="language"
                name="language"
                value={preferences.language}
                onChange={handlePreferencesChange}
                className="input-field"
              >
                <option value="en">Inglês</option>
                <option value="pt">Português</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="theme">Tema</label>
              <select
                id="theme"
                name="theme"
                value={preferences.theme}
                onChange={handlePreferencesChange}
                className="input-field"
              >
                <option value="light">Claro</option>
                <option value="dark">Escuro</option>
              </select>
            </div>
          </div>
        </section>

        <section className="card">
          <h2 className="card-title">Gerenciamento de Conta</h2>
          <button className="btn btn-danger">Excluir Conta</button>
          <button className="btn btn-secondary">Alterar Senha</button>
          <button className="btn btn-secondary">Conectar Redes Sociais</button>
        </section>

        <section className="card">
          <h2 className="card-title">Segurança</h2>
          <button className="btn btn-secondary">Configurar 2FA</button>
          <button className="btn btn-secondary">Ver Histórico de Login</button>
          <button className="btn btn-secondary">Gerenciar Dispositivos Conectados</button>
        </section>
      </div>
    </DefaultLayout>
  );
};

export default Settings;
