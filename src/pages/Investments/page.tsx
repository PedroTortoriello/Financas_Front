import React, { useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';

const InvestmentManagement: React.FC = () => {
  // Suponha que haja um estado inicial para investimentos
  const [investments, setInvestments] = useState<any[]>([]);
  const [investmentName, setInvestmentName] = useState('');
  const [amount, setAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [error, setError] = useState('');
  
  const handleAddInvestment = () => {
    if (!investmentName || !amount || !startDate) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    // Lógica para adicionar o investimento
    // ...
    setError('');
    // Limpar os campos após adicionar
    setInvestmentName('');
    setAmount('');
    setStartDate('');
  };


  return (
    <DefaultLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 text-center">Gerenciamento de Investimentos</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {investments.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">Opa! Você ainda não possui investimentos cadastrados.</h2>
              <p>Comece adicionando novos investimentos para acompanhar seu progresso.</p>
              <button className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition duration-300 mt-4">
                Adicionar Investimento
              </button>
            </div>
          ) : (
            investments.map((investment) => (
              <div key={investment.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">{investment.name}</h2>
                <p>Valor investido: R$ {investment.amount}</p>
                <p>Data de início: {new Date(investment.startDate).toLocaleDateString()}</p>
                {/* Adicione mais detalhes sobre o investimento */}
              </div>
            ))
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default InvestmentManagement;
