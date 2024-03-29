import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import DefaultLayout from '../../layout/DefaultLayout';
import minus from './minus.svg';
import float from './float-plus.svg';
import './toast.css';
import './forms.css';
import api from '../Authentication/api';

const ECommerce: React.FC = () => {
  const { register, handleSubmit, reset } = useForm();
  const [transactions, setTransactions] = useState([]); 
  const [incomeTotal, setIncomeTotal] = useState(0); 
  const [expenseTotal, setExpenseTotal] = useState(0); 
  const [showModal, setShowModal] = useState(false); 

  useEffect(() => {
    // Calcula os totais de entrada e saída sempre que o array de transações mudar
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(transaction => {
      if (transaction.amount > 0) {
        totalIncome += transaction.amount;
      } else {
        totalExpense -= transaction.amount; // convertendo para positivo para calcular total
      }
    });

    setIncomeTotal(totalIncome);
    setExpenseTotal(totalExpense);
  }, [transactions]);

  useEffect(() => {
    // Função assíncrona para buscar as transações da API
    const fetchTransactions = async () => {
      try {
        const headers = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };


        const response = await api.get('/pags', headers); // Rota GET para recuperar as transações
        setTransactions(response.data);
      } catch (error) {
        console.error('Erro ao buscar transações:', error);
      }
    };

    fetchTransactions(); // Chame a função para buscar as transações quando o componente for montado
  }, []);

  // Função para remover transação
  const handleRemoveTransaction = (index: number) => {
    const updatedTransactions = [...transactions];
    updatedTransactions.splice(index, 1);
    setTransactions(updatedTransactions);
  };

  // Função para adicionar nova transação
  const handleAddTransaction = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Evita o comportamento padrão de envio do formulário

    // Extrair os dados do formulário
    const formData = new FormData(event.currentTarget);
    const data = {
      description: formData.get('description') as string,
      amount: parseFloat(formData.get('amount') as string),
      date: formData.get('date') as string
    };

    try {
      const headers = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };


      // Enviar os dados para o endpoint de adicionar transação
      await api.post('/pags', data, headers); // Endpoint para adicionar transação
      
      // Adicionar a nova transação ao estado local
      setTransactions([...transactions, data]); // supondo que os dados da transação são passados diretamente
      
      // Limpar o formulário após adicionar a transação
      reset(); 
      // Fechar o modal após adicionar a transação
      handleCloseModal(); 
    } catch (error) {
      // Exibir o erro no console
      console.error('Erro ao adicionar transação:', error);
    }
  };

  // Função para abrir o modal
  const handleOpenModal = () => {
    setShowModal(true);
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <DefaultLayout>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <div className="card bg-white dark:bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold">Entradas</h3>
            <p id="incomeDisplay" {...register('entradas')} className="text-xl font-bold text-green-500">R$ {incomeTotal.toFixed(2)}</p>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <div className="card bg-white dark:bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold">Saídas</h3>
            <p id="expenseDisplay" {...register('saidas')} className="text-xl font-bold text-red-500">R$ {expenseTotal.toFixed(2)}</p>
          </div>
        </div>
      </div>
      <div className="w-full mt-4">
        <div className="card bg-white dark:bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold">Total</h3>
          <p id="totalDisplay" {...register('total')} className="text-xl font-bold">R$ {(incomeTotal - expenseTotal).toFixed(2)}</p>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Transações</h2>
        <table id="data-table" className="w-full mt-4 bg-white" {...register('transacoes')}>
          <thead>
            <tr>
              <th className="py-2 text-center">Descrição</th>
              <th className="py-2 text-center">Valor</th>
              <th className="py-2 text-center">Data</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td className="description text-center">{transaction.description}</td>
                <td className={transaction.amount > 0 ? 'income text-center' : 'expense text-center'}>
                  {transaction.amount}
                </td>
                <td className="date text-center">{transaction.date}</td>
                <td>
                  <img
                    onClick={() => handleRemoveTransaction(index)}
                    src={minus}
                    className="remove"
                    alt="Remover Transação"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Nova Transação */}
      {showModal && (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-25">
          <div className="modal bg-white dark:bg-gray-800 rounded-lg p-4">
            <div id="form">
              <h2>Nova Transação</h2>
              <form onSubmit={handleAddTransaction}>
                <div className="input-group">
                  <label htmlFor="description" className="sr-only">Descrição</label>
                  <input type="text" id="description" name="description" placeholder="Descrição" />
                </div>
                <div className="input-group">
                  <label htmlFor="amount" className="sr-only">Valor</label>
                  <input type="number" id="amount" name="amount" placeholder="0,00" step="0.01" />
                </div>
                <small className="help-for-modal">Use o sinal - (negativo) para despesas e , (vírgula) para casas decimais</small>
                <div className="input-group">
                  <label htmlFor="date" className="sr-only">Data</label>
                  <input type="date" id="date" name="date" />
                </div>
                <div className="input-group actions">
                  <button type="button" onClick={handleCloseModal} className="button cancel">Cancelar</button>
                  <button type="submit">Salvar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div id="toast" className="fixed bottom-0 right-0 p-4 bg-white text-red-500">
        <div className="img"><h1>×</h1></div>
        <div className="description">Por favor, preencha todos os campos!</div>
      </div>

      {/* Float Button */}
      <button onClick={handleOpenModal}>
        <div className="float-button fixed bottom-8 right-8 bg-green-500 w-16 h-16 flex items-center justify-center rounded-full shadow-md hover:bg-green-600 cursor-pointer">
            <img src={float} alt="Adicionar" width="16px" />
        </div>
      </button>
    </DefaultLayout>
  );
};

export default ECommerce;
