import React, { useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';

const AddInvestment: React.FC = () => {
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
        <h1 className="text-3xl font-bold mb-4 text-center">Adicionar Novo Investimento</h1>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-md mx-auto">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="investmentName">
              Nome do Investimento
            </label>
            <input
              type="text"
              id="investmentName"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              value={investmentName}
              onChange={(e) => setInvestmentName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="amount">
              Valor Investido (R$)
            </label>
            <input
              type="number"
              id="amount"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="startDate">
              Data de Início
            </label>
            <input
              type="date"
              id="startDate"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <button
            className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition duration-300 w-full"
            onClick={handleAddInvestment}
          >
            Adicionar Investimento
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AddInvestment;
