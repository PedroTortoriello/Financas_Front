import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaMoneyBillWave, FaChartPie, FaCogs, FaHome, FaBars, FaCreditCard } from "react-icons/fa";
import Logo from './Logo.png'; // Substitua pelo caminho correto para a imagem
interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col overflow-y-hidden bg-gradient-to-b from-blue-900 to-black shadow-lg duration-300 ease-in-out dark:bg-gray-900 lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* SIDEBAR HEADER */}
      <div className="flex items-center justify-between px-4 py-4">
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
          <img src={Logo} alt="Logo" style={{ maxWidth: "100%", height: "auto"}} />
        </div>
        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white lg:hidden"
        >
          <FaBars size={24} />
        </button>
      </div>
      {/* SIDEBAR HEADER */}

      <div className="no-scrollbar flex flex-col overflow-y-auto mt-5">
        {/* Sidebar Menu */}
        <nav className="mt-5 px-4">
          {/* Menu Group */}
          <div>
            <ul className="flex flex-col gap-6">
              {/* Menu Item Dashboard */}
              <li>
                <NavLink
                  to="/Principal/page"
                  className={({ isActive }) =>
                    'group flex items-center gap-4 rounded-md px-4 py-2 text-sm font-medium text-white duration-300 ease-in-out hover:bg-blue-700 ' +
                    (isActive && 'bg-blue-700')
                  }
                >
                  <FaHome size={20} />
                  {sidebarExpanded && <span>Dashboard</span>}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/Dashboard/ECommerce"
                  className={({ isActive }) =>
                    'group flex items-center gap-4 rounded-md px-4 py-2 text-sm font-medium text-white duration-300 ease-in-out hover:bg-blue-700 ' +
                    (isActive && 'bg-blue-700')
                  }
                >
                  <FaMoneyBillWave size={20} />
                  {sidebarExpanded && <span>Transações</span>}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/Investments/page"
                  className={({ isActive }) =>
                    'group flex items-center gap-4 rounded-md px-4 py-2 text-sm font-medium text-white duration-300 ease-in-out hover:bg-blue-700 ' +
                    (isActive && 'bg-blue-700')
                  }
                >
                  <FaChartPie size={20} />
                  {sidebarExpanded && <span>Investimentos</span>}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/CreditCard/page"
                  className={({ isActive }) =>
                    'group flex items-center gap-4 rounded-md px-4 py-2 text-sm font-medium text-white duration-300 ease-in-out hover:bg-blue-700 ' +
                    (isActive && 'bg-blue-700')
                  }
                >
                  <FaCreditCard size={20} />
                  {sidebarExpanded && <span>Cartões</span>}
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
        {/* Sidebar Menu */}
      </div>
    </aside>
  );
};

export default Sidebar;
