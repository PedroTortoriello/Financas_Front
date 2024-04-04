import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import DefaultLayout from '../../layout/DefaultLayout';
import minus from './minus.svg';
import float from './float-plus.svg';
import './toast.css';
import './forms.css';
import api from '../Authentication/api';
import { FaMinus } from "react-icons/fa";
import ChartTwo from '../../components/Charts/ChartTwo';
import { MdDelete } from 'react-icons/md';

const ECommerce: React.FC = () => {
  const { register, handleSubmit, reset } = useForm();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [incomeTotal, setIncomeTotal] = useState<number>(0);
  const [expenseTotal, setExpenseTotal] = useState<number>(0);
  const [currentMonth, setCurrentMonth] = useState<string>(new Date().toLocaleDateString('en-US', { month: 'long' }));
  const [chartData, setChartData] = useState<{
    transactions: any; month: string; totalIncome: number; totalExpense: number 
  }[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showExpenseModal, setShowExpenseModal] = useState<boolean>(false);
  const [transactionType, setTransactionType] = useState<string>("");
  const [amount, setAmount] = useState<string>("-");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [userId, setUserId] = useState<string>(""); // Add userId state

  interface Transaction {
    id: number;
    description: string;
    amount: number;
    date: string;
  }

  useEffect(() => {
    const fetchTransactions = async (selectedDate: Date) => {
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
            amount: parseFloat(transaction.amount)
          }));
        } else {
          transactions = [{
            ...response.data,
            amount: parseFloat(response.data.amount)
          }];
        }
  
        const filteredTransactions = transactions.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return transactionDate.getMonth() === selectedDate.getMonth() &&
                 transactionDate.getFullYear() === selectedDate.getFullYear();
        });
  
        setTransactions(filteredTransactions);
        const groupedTransactions = groupTransactionsByMonth(transactions, selectedDate);
        console.log("Grouped Transactions:", groupedTransactions);
  
        const chartDataArray = Object.keys(groupedTransactions).map(month => {
          let totalIncome = 0;
          let totalExpense = 0;
  
          groupedTransactions[month].forEach(transaction => {
            if (transaction.amount > 0) {
              totalIncome += transaction.amount;
            } else {
              totalExpense -= transaction.amount;
            }
          });
  
          return {
            month,
            totalIncome,
            totalExpense,
            transactions: groupedTransactions[month]
          };
        });
  
        setChartData(chartDataArray);
      } catch (error) {
        console.error('Erro ao buscar transações:', error);
      }
    };
  
    fetchTransactions(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(transaction => {
      if (transaction.amount > 0) {
        totalIncome += transaction.amount;
      } else {
        totalExpense -= transaction.amount;
      }
    });

    console.log('Total de entradas:', totalIncome);
    console.log('Total de saídas:', totalExpense);

    setIncomeTotal(totalIncome);
    setExpenseTotal(totalExpense);
  }, [transactions]);
  
  const groupTransactionsByMonth = (transactions: Transaction[], selectedDate: Date) => {
    const groupedTransactions: { [key: string]: Transaction[] } = {};
    
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      const month = transactionDate.toLocaleDateString('en-US', { month: 'long' });
    
      if (transactionDate.getMonth() === selectedDate.getMonth() && transactionDate.getFullYear() === selectedDate.getFullYear()) {
        if (!groupedTransactions[month]) {
          groupedTransactions[month] = [];
        }
    
        groupedTransactions[month].push(transaction);
      }
    });
    
    return groupedTransactions;
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
  
      await api.post('/pags2', { ...Object.fromEntries(data), userId }, headers); // Include userId when adding transaction
      console.log('Nova transação adicionada:', data);
  
      const newTransaction: Transaction = {
        description: data.get("description") as string,
        amount: Number(data.get("amount")),
        date: data.get("date") as string,
      };
  
      setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
  
      reset(); // Reset form fields
  
      // Feche o modal após adicionar a transação
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

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    // Check if the value is a valid number
    if (!isNaN(parseFloat(value))) {
      // If the value is a valid number, update the state
      setAmount(value);
    }
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMonth = parseInt(event.target.value, 10); // Índice baseado em zero do mês selecionado
    const currentYear = new Date().getFullYear(); // Captura o ano atual
    const selectedDate = new Date(currentYear, selectedMonth - 1, 1); // Constrói a data com o mês selecionado
    setSelectedDate(selectedDate); // Atualiza o estado com a nova data selecionada
    console.log('Nova data selecionada:', selectedDate);
  };

  const currentYear = new Date().getFullYear();
  const months = Array.from({ length: 12 }, (_, index) => {
    const monthIndex = index + 1;
    const date = new Date(currentYear, index, 1);
    return date.toLocaleDateString('en-US', { month: 'long' });
  });
  
  const monthOptions = [
    { value: '01', label: 'Janeiro' },
    { value: '02', label: 'Fevereiro' },
    { value: '03', label: 'Março' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Maio' },
    { value: '06', label: 'Junho' },
    { value: '07', label: 'Julho' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' },
  ];
  

  const handleDeleteTransaction = async (id: number) => {
    try {
      const headers = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
  
      await api.delete(`/pags2/${id}`, headers); // Chama o endpoint para excluir a transação
  
      // Atualize os dados da tabela após a exclusão bem-sucedida
      setTransactions(prevTransactions => prevTransactions.filter(transaction => transaction.id !== id));
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
    }
  };

  const handleAddExpense = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const data = new FormData(event.target as HTMLFormElement);
  
      const headers = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
  
      await api.post('/pags2', data, headers);
      console.log('Nova transação adicionada:', data);
  
      const newTransaction: Transaction = {
        description: data.get("description") as string,
        amount: -Math.abs(Number(data.get("amount"))), // Convert to negative value
        date: data.get("date") as string,
      };
  
      setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
  
      reset(); // Reset form fields
  
      // Feche o modal após adicionar a transação
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
    }
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
          <select value={`${selectedDate.getMonth() + 1}`.padStart(2, '0')} onChange={handleMonthChange} className="ml-2">
            {monthOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </h2>
        {chartData && chartData.map(data => (
          data.transactions.some(transaction => new Date(transaction.date).getMonth() === selectedDate.getMonth()) ?
            <div key={data.month} className="mt-4">
              <table className="w-full mt-2 bg-white rounded-t-lg">
                <thead>
                  <tr>
                    <th className="py-2 text-center">Descrição</th>
                    <th className="py-2 text-center">Valor</th>
                    <th className="py-2 text-center">Data</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.transactions && data.transactions.map((transaction: Transaction, index) => (
                    <tr key={index}>
                      <td className="description text-center text-[#5100ff]">{transaction.description}</td>
                      <td className={transaction.amount > 0 ? 'income text-center text-green-500' : 'expense text-center text-red-500'}>
                        {transaction.amount}
                      </td>
                      <td className="date text-center text-[#edc307]">{transaction.date}</td>
                      <td>
                        <button onClick={() => handleDeleteTransaction(transaction._id)} className='text-red-500 font-bold'><MdDelete /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          : null
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
                {/* Formulário para nova receita */}
              </form>
            )}
          </div>
        </div>
      )}
      {showExpenseModal && (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-25">
          <div className="modal bg-white dark:bg-gray-800 rounded-lg p-4 w-[400px]">
            <h2 className='text-center text-lg mt-0 mb-4 font-bold text-red-500'>Nova Despesa</h2>
            {transactionType === "Despesa" && (
              <form onSubmit={handleAddExpense} className="mt-0">
                {/* Formulário para nova despesa */}
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
        <div className="float-button fixed bottom-8 right-24 bg-red-500 mr-5 w-16 h-16 flex items-center justify-center rounded-full shadow-md hover:bg-red-600 cursor-pointer">
          <FaMinus color="white" size={16} />
        </div>
      </button>
    </DefaultLayout>
  );
};

export default ECommerce;