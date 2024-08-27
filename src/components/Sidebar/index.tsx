import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaMoneyBillWave, FaChartPie, FaCreditCard, FaHome, FaBars } from "react-icons/fa";
import { FiChevronDown } from 'react-icons/fi';
import Logo from './Logo.png';
import api from '../../pages/Authentication/api';
import { CiLogout } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";

interface HeaderProps {
  headerOpen: boolean;
  setHeaderOpen: (arg: boolean) => void;
}

const Header = ({ headerOpen, setHeaderOpen }: HeaderProps) => {
  const location = useLocation();
  const { pathname } = location;

  const header = useRef<any>(null);

  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsAuthorized(false);
          return;
        }

        const headers = {
          headers: {
            "Content-Type": "application/json",
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

  return (
    <header
      ref={header}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-blue-900 text-white shadow-lg px-6 py-2"
    >
      {/* Logotipo e botão do menu */}
      <div className="flex items-center">
        <img src={Logo} alt="Logo" className="w-24 h-auto mr-4" />
      </div>

      <nav className={`flex-grow flex justify-center items-center space-x-8 ${headerOpen ? '' : 'hidden'} lg:flex`}>
        <div className="flex space-x-4 mr-5 ">
          {/* Grupo Menu */}
          <div className="relative group ">
            <div className="flex mr-10 items-center text-sm font-medium cursor-pointer hover:text-gray-300">
              Menu <FiChevronDown className="ml-1" />
            </div>
            <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all duration-300 ease-out">
              <NavLink to="/Dashboard/ECommerce" className="hover:bg-blue-900/20 block px-4 py-2 text-sm text-blue-900 hover:bg-gray-100 hover:text-blue-900 transition-colors duration-150">Transações</NavLink>
              <NavLink to="/Principal/page" className="hover:bg-blue-900/20 block px-4 py-2 text-sm text-blue-900 hover:bg-gray-100 hover:text-blue-900 transition-colors duration-150">Dashboard</NavLink>
            </div>
          </div>

          {/* Grupo Vendas */}
          <div className="relative group ">
            <div className="flex mr-10 items-center text-sm font-medium cursor-pointer hover:text-gray-300">
              Vendas <FiChevronDown className="ml-1" />
            </div>
            <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all duration-300 ease-out">
              <NavLink to="/Investments/page" className="hover:bg-blue-900/20 block px-4 py-2 text-sm text-blue-900 hover:bg-gray-100 hover:text-blue-900 transition-colors duration-150">Investimentos</NavLink>
              <NavLink to="/CreditCard/page" className="hover:bg-blue-900/20 block px-4 py-2 text-sm text-blue-900 hover:bg-gray-100 hover:text-blue-900 transition-colors duration-150">Cartões</NavLink>
            </div>
          </div>
          </div>
        </nav>
    </header>
  );
};

export default Header;
