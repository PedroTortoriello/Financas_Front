import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import DefaultLayout from '../../layout/DefaultLayout';
import { FaMinus } from "react-icons/fa";
import { MdDelete } from 'react-icons/md';
import ChartTwo from '../../components/Charts/ChartTwo';
import api from '../Authentication/api';
import './toast.css';
import './forms.css';
import float from './float-plus.svg';

const ECommerce: React.FC = () => {
  const { register, handleSubmit, reset } = useForm();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [incomeTotal, setIncomeTotal] = useState<number>(0);
  const [expenseTotal, setExpenseTotal] = useState<number>(0);
  const [chartData, setChartData] = useState<{
    month: string;
    totalIncome: number;
    totalExpense: number;
    transactions: Transaction[];
  }[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showExpenseModal, setShowExpenseModal] = useState<boolean>(false);
  const [transactionType, setTransactionType] = useState<string>("");
  const [userId, setUserId] = useState<string>(""); // Add userId state
  const [selectedModalMonth, setSelectedModalMonth] = useState<string>(new Date().toLocaleDateString('en-US', { month: 'long' }));

  interface Transaction {
    id: number;
    description: string;
    amount: number;
    date: Date; // Change this line to include date property
  }

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const headers = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        };
  
        const response = await api.get('/pags2', headers);
        console.log('Dados das transações recebidos:', response.data);
  
        let transactions: Transaction[] = [];
  
        if (Array.isArray(response.data)) {
          transactions = response.data.map(transaction => ({
            ...transaction,
            amount: parseFloat(transaction.amount),
            date: new Date(transaction.date)
          }));
        } else {
          transactions = [{
            ...response.data,
            amount: parseFloat(response.data.amount),
            date: new Date(response.data.date)
          }];
        }
  
        // Filtrar transações pelo mês selecionado
        const filteredTransactions = transactions.filter(transaction => {
          return transaction.month === selectedModalMonth;
        });
  
        const totalIncome = filteredTransactions
          .filter(transaction => transaction.amount > 0)
          .reduce((acc, transaction) => acc + transaction.amount, 0);
  
        const totalExpense = filteredTransactions
          .filter(transaction => transaction.amount < 0)
          .reduce((acc, transaction) => acc + Math.abs(transaction.amount), 0);
  
        setIncomeTotal(totalIncome);
        setExpenseTotal(totalExpense);
        setChartData([{ month: selectedModalMonth, totalIncome, totalExpense, transactions: filteredTransactions }]);
      } catch (error) {
        console.error('Erro ao buscar transações:', error);
      }
    };
  
    fetchTransactions();
  }, [selectedModalMonth]);
  
  

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMonth = event.target.value;
    setSelectedModalMonth(selectedMonth);
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      const headers = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
  
      await api.delete(`/pags2/${id}`, headers);
  
      console.log('Transação excluída com sucesso:', id);
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
    }
  };
  

  const handleAddTransaction = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const data = new FormData(event.target as HTMLFormElement);
      const headers = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      const month = selectedModalMonth;
      await api.post('/pags2', { ...Object.fromEntries(data), userId, month }, headers);
      console.log('Nova transação adicionada:', data);
      const newTransaction: Transaction = {
        description: data.get("description") as string,
        amount: Number(data.get("amount")),
        date: new Date(data.get("date") as string), // Change this line to convert date to Date object
      };
      setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
      reset();
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
    }
  };

  const handleOpenModal = () => { 
    setShowModal(true);
    setTransactionType("Receita"); 
  };

  const handleOpenExpenseModal = () => { 
    setShowExpenseModal(true);
    setTransactionType("Despesa");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowExpenseModal(false); 
  };


  return (
    <DefaultLayout>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <div className="card bg-white dark:bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold">Entradas</h3>
            <p id="incomeDisplay" className="text-xl font-bold text-green-500">
              $ {incomeTotal.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <div className="card bg-white dark:bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold">Saídas</h3>
            <p id="expenseDisplay" className="text-xl font-bold text-red-500">$ {expenseTotal.toFixed(2)}</p>
          </div>
        </div>
      </div>
      <div className="w-full mt-4">
        <div className="card bg-white dark:bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold">Total</h3>
          <p id="totalDisplay" className="text-xl font-bold">$ {(incomeTotal - expenseTotal).toFixed(2)}</p>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-center">Transações de  
          <select
            id="month"
            name="month"
            className="ml-2 w-30 p-1 border rounded-md"
            value={selectedModalMonth}
            onChange={handleMonthChange}
          >
            <option value="January">Janeiro</option>
            <option value="February">Fevereiro</option>
            <option value="March">Março</option>
            <option value="April">Abril</option>
            <option value="May">Maio</option>
            <option value="June">Junho</option>
            <option value="July">Julho</option>
            <option value="August">Agosto</option>
            <option value="September">Setembro</option>
            <option value="October">Outubro</option>
            <option value="November">Novembro</option>
            <option value="December">Dezembro</option>
          </select>
        </h2>
        {chartData.map(data => (
          <div key={data.month} className="mt-4">
            <table className="w-full mt-2 bg-white rounded-t-lg">
              <thead>
                <tr>
                  <th className="py-2 text-center">Descrição</th>
                  <th className="py-2 text-center">Valor</th>
                  <th className="py-2 text-center">Mês</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
              {data.transactions.map((transaction: Transaction, index) => (
                <tr key={index}>
                  <td className="description text-center text-[#5100ff]">{transaction.description}</td>
                  <td className={transaction.amount > 0 ? 'income text-center text-green-500' : 'expense text-center text-red-500'}>
                    {transaction.amount}
                  </td>
                  <td className="date text-center text-[#edc307]">
                    {transaction.month}
                  </td> {/* Adicionando verificação de existência de transaction.date aqui */}
                  <td>
                  <button onClick={() => {
                  if (transaction._id !== undefined) {
                      handleDeleteTransaction(transaction._id); // Aqui estou passando diretamente o _id
                  } else {
                      console.error('ID da transação é undefined');
                  }
              }} className='text-red-500 font-bold'><MdDelete /></button>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <br />
      <ChartTwo transactions={chartData.map(data => data.transactions).flat() || []} />
      {showModal && (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-25">
          <div className="modal bg-white dark:bg-gray-800 rounded-lg p-4 w-[400px]">
            <h2 className='text-center text-lg mt-0 mb-4 font-bold text-green-500'>Nova Receita</h2>
            {transactionType === "Receita" && (
              <form onSubmit={handleAddTransaction} className="mt-0">
                <div className="input-group mb-4">
                  <label htmlFor="description" className="sr-only">Descrição</label>
                  <input type="text" id="description"  name="description" placeholder="Descrição" className="w-full p-2 border rounded-md" />
                </div>
                <div className="input-group mb-4">
                  <label htmlFor="amount" className="sr-only">Valor</label>
                  <input type="number" id="amount" name="amount" placeholder="0,00" step="0.01" className="w-full p-2 border rounded-md" />
                </div>
                <small className="block mb-4">Use o sinal - (negativo) para despesas e , (vírgula) para casas decimais</small>
                <div className="input-group mb-4">
                  <label htmlFor="month" className="sr-only">Mês</label>
                  <select
                    id="month"
                    name="month"
                    className="w-full p-2 border rounded-md"
                    value={selectedModalMonth}
                    onChange={handleMonthChange}
                  >
                    <option value="January">Janeiro</option>
                    <option value="February">Fevereiro</option>
                    <option value="March">Março</option>
                    <option value="April">Abril</option>
                    <option value="May">Maio</option>
                    <option value="June">Junho</option>
                    <option value="July">Julho</option>
                    <option value="August">Agosto</option>
                    <option value="September">Setembro</option>
                    <option value="October">Outubro</option>
                    <option value="November">Novembro</option>
                    <option value="December">Dezembro</option>
                  </select>
                </div>
                <div className="input-group actions">
                  <button type="button" onClick={handleCloseModal} className="button cancel mr-2">Cancelar</button>
                  <button type="submit" className="button">Salvar</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {showExpenseModal && (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-25">
          <div className="modal bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="flex justify-center mb-4">
              <button onClick={() => setTransactionType("Despesa")} className="button text-red-500 font-bold">Despesa</button>
            </div>
            {transactionType === "Despesa" && (
              <form onSubmit={handleAddTransaction} className="mt-0">
                <div className="input-group mb-4">
                  <label htmlFor="description" className="sr-only">Descrição</label>
                  <input type="text" id="description" name="description" placeholder="Descrição" className="w-full p-2 border rounded-md" />
                </div>
                <div className="input-group mb-4">
                  <label htmlFor="amount" className="sr-only">Valor</label>
                  <input type="number" id="amount" name="amount" placeholder="0,00" step="0.01" className="w-full p-2 border rounded-md" />
                </div>
                <small className="block mb-4">Use o sinal - (negativo) para despesas e , (vírgula) para casas decimais</small>
                <div className="input-group mb-4">
                  <label htmlFor="month" className="sr-only">Mês</label>
                  <select
                    id="month"
                    name="month"
                    className="w-full p-2 border rounded-md"
                    value={selectedModalMonth}
                    onChange={handleMonthChange}
                  >
                    <option value="January">Janeiro</option>
                    <option value="February">Fevereiro</option>
                    <option value="March">Março</option>
                    <option value="April">Abril</option>
                    <option value="May">Maio</option>
                    <option value="June">Junho</option>
                    <option value="July">Julho</option>
                    <option value="August">Agosto</option>
                    <option value="September">Setembro</option>
                    <option value="October">Outubro</option>
                    <option value="November">Novembro</option>
                    <option value="December">Dezembro</option>
                  </select>
                </div>
                <div className="input-group actions">
                  <button type="button" onClick={handleCloseModal} className="button cancel mr-2">Cancelar</button>
                  <button type="submit" className="button">Salvar</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <div id="toast" className="fixed bottom-0 right-0 p-4 bg-white text-red-500">
        <div className="img"><h1>×</h1></div>
        <div className="description">Por favor, preencha todos os campos!</div>
      </div>

      <button onClick={handleOpenModal}>
        <div className="float-button fixed bottom-8 right-8 bg-green-500 w-16 h-16 flex items-center justify-center rounded-full shadow-md hover:bg-green-600 cursor-pointer">
          <img src={float} alt="Adicionar Renda" width="16px" />
        </div>
      </button>

      <button onClick={handleOpenExpenseModal}>
        <div className="float-button fixed bottom-8 right-24 bg-red-500 w-16 h-16 flex items-center justify-center rounded-full shadow-md hover:bg-red-600 cursor-pointer">
          <FaMinus color="white" size={16} />
        </div>
      </button>
    </DefaultLayout>
  );
};

export default ECommerce;
