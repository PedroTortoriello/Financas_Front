import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';
import { CiLogout } from 'react-icons/ci';
import { CgProfile } from 'react-icons/cg';
import api from '../../pages/Authentication/api';

interface HeaderProps {
  headerOpen: boolean;
  setHeaderOpen: (arg: boolean) => void;
}

const Header = ({ headerOpen, setHeaderOpen }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  const header = useRef<any>(null);

  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsAuthorized(false);
          return;
        }

        const headers = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await api.post('/authorizedUsers', {}, headers);
        setIsAuthorized(response.data.isAuth);
      } catch (error) {
        console.error('Erro ao verificar autorização:', error);
        setIsAuthorized(false);
      }
    };

    checkAuthorization();
  }, [pathname]);

  const handleMenuToggle = () => {
    setHeaderOpen(!headerOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth/signin');
  };

  return (
    <header
      ref={header}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-blue-900 text-white shadow-lg px-6 py-2"
    >
      <div className="flex items-center space-x-4">
        <h1 className="text-md lg:text-2xl font-bold">Binance X</h1>
      </div>

      <nav
        className={`flex-grow flex justify-center items-center space-x-8 ${
          headerOpen ? '' : 'hidden'
        } lg:flex`}
      >
        <div className="flex space-x-4">
          {/* Menu Group para telas menores */}
          <div className="relative group lg:hidden">
            <div className="flex items-center text-sm font-medium cursor-pointer hover:text-gray-300">
              Menu <FiChevronDown className="ml-1" />
            </div>
            <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all duration-300 ease-out">
              <NavLink
                to="/Dashboard/ECommerce"
                className="hover:bg-blue-900/20 block px-4 py-2 text-sm text-blue-900 transition-colors duration-150"
              >
                Transações
              </NavLink>
              <NavLink
                to="/Principal/page"
                className="hover:bg-blue-900/20 block px-4 py-2 text-sm text-blue-900 transition-colors duration-150"
              >
                Dashboard
              </NavLink>
              {/*<NavLink
                to="/Investments/page"
                className="hover:bg-blue-900/20 block px-4 py-2 text-sm text-blue-900 transition-colors duration-150"
              >
                Investimentos
              </NavLink>*/}
            {/*<NavLink
              to="/CreditCard/page"
              className="hover:bg-white hover:text-black px-4 py-2 text-sm font-medium rounded transition-colors duration-200"
            >
              Cartões
            </NavLink>*/}
            </div>
          </div>

          {/* NavLinks para telas grandes */}
          <div className="hidden lg:flex space-x-16">
            <NavLink
              to="/Dashboard/ECommerce"
              className="hover:bg-white hover:text-black px-4 py-2 text-sm font-medium rounded transition-colors duration-200"
            >
              Transações
            </NavLink>
            <NavLink
              to="/Principal/page"
              className="hover:bg-white hover:text-black px-4 py-2 text-sm font-medium rounded transition-colors duration-200"
            >
              Dashboard
            </NavLink>
           {/*<NavLink
                to="/Investments/page"
                className="hover:bg-blue-900/20 block px-4 py-2 text-sm text-blue-900 transition-colors duration-150"
              >
                Investimentos
              </NavLink>*/}
            {/*<NavLink
              to="/CreditCard/page"
              className="hover:bg-white hover:text-black px-4 py-2 text-sm font-medium rounded transition-colors duration-200"
            >
              Cartões
            </NavLink>*/}
          </div>

        </div>
      </nav>

      {/* Profile Group - Posicionado no fim do Header */}
      <div className="relative group">
        <div className="ml-10 flex justify-end items-center text-sm font-medium cursor-pointer hover:text-gray-300">
          <CgProfile className="mr-1" /> Perfil
          <FiChevronDown className="ml-1" />
        </div>
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all duration-300 ease-out">
          {/*<NavLink
            to="/Profile"
            className="hover:bg-blue-900/20 block px-4 py-2 text-sm text-blue-900 transition-colors duration-150"
          >
            Meu Perfil
          </NavLink>*/}
          <button
            onClick={handleLogout}
            className="hover:bg-blue-900/20 block w-full text-left px-4 py-2 text-sm text-blue-900 transition-colors duration-150"
          >
            <CiLogout className="inline mr-2" /> Sair
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
