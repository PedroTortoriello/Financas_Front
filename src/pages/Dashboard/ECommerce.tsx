import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import DefaultLayout from '../../layout/DefaultLayout';
import { FaBars, FaEdit, FaMinus, FaPencilAlt, FaPencilRuler } from "react-icons/fa";
import { MdDelete } from 'react-icons/md';
import api from '../Authentication/api';
import './toast.css';
import './forms.css';
import './date.css';
import float from './float-plus.svg';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { addMonths, format, startOfYear } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

const ECommerce: React.FC = () => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
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
  const [userId, setUserId] = useState<string>(""); 
  const [selectedModalMonth, setSelectedModalMonth] = useState(new Date().toLocaleDateString('en-US', { month: 'long' }));
  const [showNewCategoryInput, setShowNewCategoryInput] = useState<boolean>(false); // Novo estado para mostrar o input de nova categoria
  const [total, setTotal] = useState<number>(0); // Novo estado para o total combinado
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [tableDate, setTableDate] = useState<Date | null>(new Date());
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const handleTableDateChange = (date: Date | null) => {
    if (date) {
      const month = format(date, "MMMM");
      setSelectedModalMonth(month);
      setTableDate(date);
    }
  };
  interface Transaction {
    id: string;
    description: string;
    amount: number;
    month: string; // Substitua date por month
    category: string;
    userId: string;
  }
  
  const handleDateChange = (date) => {
    setSelectedDate(date);
  
    // Atualiza o selectedModalMonth com o novo mês selecionado
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    setSelectedModalMonth(month); // Chama a função passada como prop
  };

  useEffect(() => {
    if (selectedDate) {
      setValue("month", format(selectedDate, "MMMM")); // Define o mês
      setValue("year", format(selectedDate, "yyyy"));   // Define o ano
    }
  }, [selectedDate, setValue]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const headers = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        };

        const response = await api.get('/financas', headers);
        console.log('Dados das transações recebidos:', response.data);

        let transactions: Transaction[] = [];

        // Verifique se a resposta é uma array ou um único objeto
        if (Array.isArray(response.data)) {
          transactions = response.data.map(transaction => ({
            ...transaction,
            amount: parseFloat(transaction.amount.$numberDecimal), // Acesse o valor correto e converta para número
            month: transaction.month // Use month em vez de date
          }));
        } else {
          transactions = [{
            ...response.data,
            amount: parseFloat(response.data.amount.$numberDecimal), // Acesse o valor correto e converta para número
            month: response.data.month // Use month em vez de date
          }];
        }

        // Filtre as transações conforme o mês e a categoria selecionados
        const filteredTransactions = transactions.filter(transaction => {
          const monthMatches = transaction.month === selectedModalMonth;
          const categoryMatches = selectedCategory ? transaction.category === selectedCategory : true;
          return monthMatches && categoryMatches;
        });

        // Calcule os totais
        const totalIncome = filteredTransactions
          .filter(transaction => transaction.amount > 0)
          .reduce((acc, transaction) => acc + transaction.amount, 0);

        const totalExpense = filteredTransactions
          .filter(transaction => transaction.amount < 0)
          .reduce((acc, transaction) => acc + Math.abs(transaction.amount), 0);

        const total = totalIncome - totalExpense;

        setIncomeTotal(totalIncome);
        setExpenseTotal(totalExpense);
        setTotal(total);
        setChartData([{ month: selectedModalMonth, totalIncome, totalExpense, transactions: filteredTransactions }]);
        setTransactions(filteredTransactions);
      } catch (error) {
        console.error('Erro ao buscar transações:', error);
      }
    };

    fetchTransactions();
  }, [selectedModalMonth, selectedCategory]);
  
  const monthMapping: { [key: string]: string } = {
    January: 'Janeiro',
    February: 'Fevereiro',
    March: 'Março',
    April: 'Abril',
    May: 'Maio',
    June: 'Junho',
    July: 'Julho',
    August: 'Agosto',
    September: 'Setembro',
    October: 'Outubro',
    November: 'Novembro',
    December: 'Dezembro',
  };

  const monthMapping2: { [key: string]: string } = {
    January: 'Janeiro',
    February: 'Fevereiro',
    March: 'Março',
    April: 'Abril',
    May: 'Maio',
    June: 'Junho',
    July: 'Julho',
    August: 'Agosto',
    September: 'Setembro',
    October: 'Outubro',
    November: 'Novembro',
    December: 'Dezembro',
  };

  
  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModalMonth(event.target.value);
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    if (selectedCategory === 'Outros') {
      setShowNewCategoryInput(true);
    } else {
      setShowNewCategoryInput(false);
    }
  };

  console.log(transactions);

  const handleDeleteTransaction = async (id: string) => {
    console.log('ID da transação a ser excluída:', id); // Adicione esta linha para depuração
  
    if (!id) {
      console.error('ID da transação é indefinido.');
      return;
    }
  
    try {
      const headers = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
  
      // Solicita a exclusão da transação pelo ID
      await api.delete(`/financas/${id}`, headers);
  
      // Atualiza o estado local removendo a transação excluída
      setTransactions(prevTransactions =>
        prevTransactions.filter(transaction => transaction.id !== id)
      );
  
      console.log('Transação excluída com sucesso:', id);
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
    }
  };
  

  const handleAddTransaction = async (data: any) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('Erro: userId não definido.');
        return;
      }
      
      const headers = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
  
      // Verifica se o usuário selecionou "Outros" e preencheu a nova categoria
      let category = data.category;
      if (category === "Outros" && data.newCategory) {
        category = data.newCategory;
        await api.post('/category', { category }, headers); // Salva a nova categoria na rota /category
        setCategories(prevCategories => [...prevCategories, category]); // Adiciona a nova categoria na lista de categorias
      }
  
      const amount = transactionType === "Receita"
        ? parseFloat(data.amount)
        : -parseFloat(data.amount);
  
      const transactionData = {
        ...data,
        userId,
        amount,
        category,
        month: selectedModalMonth,
        year: data.year,
      };
  
      // Adiciona a nova transação
      const response = await api.post('/financas', transactionData, headers);
      
      // Supondo que a resposta contenha o novo ID gerado
      const { id } = response.data;
  
      console.log('Nova transação adicionada:', { ...transactionData, id });
  
      // Atualiza o estado com a nova transação e seu ID
      setTransactions(prevTransactions => [
        ...prevTransactions, 
        { ...transactionData, id }
      ]);
  
      reset();
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
    }
  };
  
  const handleOpenModal = () => { 
    setSelectedDate(new Date()); // Configura a data atual
    setShowModal(true);
    setTransactionType("Receita"); 
  };
  
  const handleOpenExpenseModal = () => { 
    setSelectedDate(new Date()); // Configura a data atual
    setShowExpenseModal(true);
    setTransactionType("Despesa");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowExpenseModal(false);
    setShowNewCategoryInput(false); // Resetar o estado do input de nova categoria
  };

  const defaultCategories = ["Alimentação", "Transporte", "Educação", "Saúde", "Salário"];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const headers = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        };
        const response = await api.get('/category', headers);
        console.log('Categorias recebidas:', response.data);

        if (Array.isArray(response.data)) {
          const allCategories = [...defaultCategories, ...response.data];
          setCategories(allCategories);
          console.log('Estado categories atualizado:', allCategories);
        } else {
          console.error('A resposta da API não é uma lista de categorias.');
        }
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleUpdateTransaction = async (id: string, data: any) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('Erro: userId não definido.');
        return;
      }
  
      const headers = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
  
      const amount = transactionType === "Receita"
        ? parseFloat(data.amount)
        : -parseFloat(data.amount);
  
      const transactionData = {
        ...data,
        userId,
        amount,
        category: data.category,
        month: data.month,
        year: data.year,
      };
  
      await api.put(`/financas/${id}`, transactionData, headers);
      console.log('Transação atualizada:', transactionData);
  
      setTransactions((prevTransactions) =>
        prevTransactions.filter((transaction) => transaction.id !== id)
      );
  
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
    }
  };

  const handleEditTransaction = async (index: Number) => {
    const transactionToEdit = transactions.find(transaction => transaction.index === index);
  
    if (transactionToEdit) {
      setValue('description', transactionToEdit.description);
      setValue('amount', transactionToEdit.amount);
      setValue('month', transactionToEdit.month);
      setValue('year', transactionToEdit.year);
      setValue('category', transactionToEdit.category);
      setTransactionType(transactionToEdit.amount > 0 ? 'Receita' : 'Despesa');
  
      setShowModal(true);
    }
  };



  return (
    <DefaultLayout>
      <>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2 lg:w-1/3">
            <div className="card bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Entradas</h3>
              <p id="incomeDisplay" className="text-2xl font-bold text-green-500">
                R$ {incomeTotal.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/3">
            <div className="card bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Saídas</h3>
              <p id="expenseDisplay" className="text-2xl font-bold text-red-500">
                R$ {expenseTotal.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/3 lg:w-1/3">
            <div className="card bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Total</h3>
              <p
                id="totalDisplay"
                className={`text-2xl font-bold ${
                  total >= 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                R$ {total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
  
        <div className="card mt-6 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4">Transações</h3>
          <div className="mb-4 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-2 md:mb-0">
              <label className="mr-2 font-medium">Filtrar por categoria:</label>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600"
              >
                <option value="">Todas</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <label className="mr-2 font-medium">Mês:</label>
              <DatePicker
                selected={tableDate}
                onChange={handleTableDateChange}
                dateFormat="MMMM yyyy"
                showMonthYearPicker
                className="date-picker-input"
                calendarClassName="custom-calendar"
                wrapperClassName="date-picker-wrapper"
                popperClassName="custom-popper"
                disabledKeyboardNavigation
                placeholderText="Selecione um mês"
                locale={ptBR}
              />
            </div>
          </div>
          <table className="w-full text-left border-separate" style={{ borderSpacing: '0 10px' }}>
            <thead>
              <tr>
                <th className="p-3 bg-gray-100 dark:bg-gray-700 rounded-tl-lg rounded-bl-lg">
                  Descrição
                </th>
                <th className="p-3 bg-gray-100 dark:bg-gray-700">Valor</th>
                <th className="p-3 bg-gray-100 dark:bg-gray-700">Mês</th>
                <th className="p-3 bg-gray-100 dark:bg-gray-700">Categoria</th>
                <th className="p-3 bg-gray-100 dark:bg-gray-700 rounded-tr-lg rounded-br-lg">
                  Ação
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr
                  key={index}
                  className={`${
                    transaction.amount < 0
                      ? 'bg-red-100 dark:bg-red-900'
                      : 'bg-green-100 dark:bg-green-900'
                  } rounded-lg`}
                >
                  <td className="p-3 border-b border-gray-200 dark:border-gray-600 rounded-l-lg">
                    {transaction.description}
                  </td>
                  <td className="p-3 border-b border-gray-200 dark:border-gray-600">
                    {Math.abs(transaction.amount).toFixed(2)}
                  </td>
                  <td className="p-3 border-b border-gray-200 dark:border-gray-600">
                    {monthMapping[transaction.month] || transaction.month}
                  </td>
                  <td className="p-3 border-b border-gray-200 dark:border-gray-600">
                    {transaction.category}
                  </td>
                  <td className="p-3 border-b border-gray-200 dark:border-gray-600 rounded-r-lg">
                    <button
                      className="hover:text-black mr-2"
                      onClick={() => handleEditTransaction(index)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="hover:text-black"
                      onClick={() => handleDeleteTransaction(transaction.id)}
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        <div className="absolute mt-5 flex flex-col items-start">
  <div
    className={`flex items-center transition-all duration-300 ${
      isExpanded ? 'space-x-2' : 'space-x-0'
    }`}
  >
    {isExpanded && (
      <>
        <button
          onClick={handleOpenModal}
          className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg transition-transform duration-300"
          aria-label="Adicionar Receita"
        >
          Adicionar Receita
        </button>
        <button
          onClick={handleOpenExpenseModal}
          className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg transition-transform duration-300"
          aria-label="Adicionar Despesa"
        >
          Adicionar Despesa
        </button>
      </>
    )}
    <button
      onClick={toggleExpand}
      className="p-2 rounded-full h-10 w-10 bg-blue-500 hover:bg-blue-600 text-white shadow-lg transition-all duration-300"
      aria-label={isExpanded ? 'Fechar' : 'Abrir'}
    >
      <img
        src={float}
        alt="Botão flutuante"
        className={`transform transition-transform ${
          isExpanded ? 'rotate-45' : 'rotate-0'
        }`}
      />
    </button>
  </div>
</div>
  
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80">
              <h2 className="text-xl font-semibold mb-4">Adicionar Transação</h2>
              <form onSubmit={handleSubmit(handleAddTransaction)}>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Descrição</label>
                  <input
                    type="text"
                    {...register('description', { required: true })}
                    className="w-full p-2 rounded-md border border-gray-300"
                  />
                  {errors.description && (
                    <span className="text-red-500">Campo obrigatório</span>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Valor</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('amount', { required: true })}
                    className="w-full p-2 rounded-md border border-gray-300"
                  />
                  {errors.amount && (
                    <span className="text-red-500">Campo obrigatório</span>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Categoria</label>
                  <select
                    {...register('category', { required: true })}
                    className="w-full p-2 rounded-md border border-gray-300"
                    onChange={handleCategoryChange}
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="Outros">Outros</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <span className="text-red-500">Campo obrigatório</span>
                  )}
                </div>
                {showNewCategoryInput && (
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Nova Categoria</label>
                  <input
                    type="text"
                    {...register("category", { required: showNewCategoryInput })}
                    className="w-full p-2 rounded-md border border-gray-300"
                  />
                  {errors.newCategory && <span className="text-red-500">Campo obrigatório</span>}
                </div>
              )}
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Mês</label>
                  <DatePicker
                    selected={tableDate}
                    onChange={handleDateChange}
                    dateFormat="MMMM yyyy"
                    showMonthYearPicker
                    className="date-picker-input"
                    calendarClassName="custom-calendar"
                    wrapperClassName="date-picker-wrapper"
                    popperClassName="custom-popper"
                    disabledKeyboardNavigation
                    placeholderText="Selecione um mês"
                    locale={ptBR}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="mr-2 px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Adicionar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
  
        {showExpenseModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80">
              <h2 className="text-xl font-semibold mb-4">Adicionar Despesa</h2>
              <form onSubmit={handleSubmit(handleAddTransaction)}>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Descrição</label>
                  <input
                    type="text"
                    {...register('description', { required: true })}
                    className="w-full p-2 rounded-md border border-gray-300"
                  />
                  {errors.description && (
                    <span className="text-red-500">Campo obrigatório</span>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Valor</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('amount', { required: true })}
                    className="w-full p-2 rounded-md border border-gray-300"
                  />
                  {errors.amount && (
                    <span className="text-red-500">Campo obrigatório</span>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Categoria</label>
                  <select
                    {...register('category', { required: true })}
                    className="w-full p-2 rounded-md border border-gray-300"
                    onChange={handleCategoryChange}
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="Outros">Outros</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <span className="text-red-500">Campo obrigatório</span>
                  )}
                </div>
                {showNewCategoryInput && (
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Nova Categoria</label>
                  <input
                    type="text"
                    {...register("category", { required: showNewCategoryInput })}
                    className="w-full p-2 rounded-md border border-gray-300"
                  />
                  {errors.newCategory && <span className="text-red-500">Campo obrigatório</span>}
                </div>
              )}
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Mês</label>
                  <DatePicker
                    selected={tableDate}
                    onChange={handleDateChange}
                    dateFormat="MMMM yyyy"
                    showMonthYearPicker
                    className="date-picker-input"
                    calendarClassName="custom-calendar"
                    wrapperClassName="date-picker-wrapper"
                    popperClassName="custom-popper"
                    disabledKeyboardNavigation
                    placeholderText="Selecione um mês"
                    locale={ptBR}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="mr-2 px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Adicionar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    </DefaultLayout>
  );
};

export default ECommerce;