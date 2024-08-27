import React, { useState, ReactNode } from 'react';
import Headbar from '../components/Sidebar';

const DefaultLogin: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [headbarOpen, setHeadbarOpen] = useState(true);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">

      
      <div className="flex flex-col h-screen overflow-hidden">
        
        <Headbar headerOpen={headbarOpen} setHeaderOpen={setHeadbarOpen} />

        {/* Área de conteúdo principal */}
        <div className="flex flex-1 flex-col overflow-x-hidden mt-35"> {/* Adicionei mt-16 para compensar a altura da Headbar */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DefaultLogin;
