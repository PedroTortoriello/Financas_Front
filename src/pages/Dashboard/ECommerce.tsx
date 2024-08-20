import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import DefaultLayout from '../../layout/DefaultLayout';
import { FaEdit, FaMinus, FaPencilAlt, FaPencilRuler } from "react-icons/fa";
import { MdDelete } from 'react-icons/md';
import api from '../Authentication/api';
import './toast.css';
import './forms.css';
import './date.css';
import float from './float-plus.svg';
import DatePicker from 'react-datepicker';
import DatePicker2 from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { addMonths, format, startOfYear } from 'date-fns';

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
  const [selectedModalMonth, setSelectedModalMonth] = useState<string>(new Date().toLocaleDateString('en-US', { month: 'long' }));
  const [showNewCategoryInput, setShowNewCategoryInput] = useState<boolean>(false); // Novo estado para mostrar o input de nova categoria
  const [total, setTotal] = useState<number>(0); // Novo estado para o total combinado
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [tableDate, setTableDate] = useState<Date | null>(new Date());

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
  
        if (Array.isArray(response.data)) {
          transactions = response.data.map(transaction => ({
            ...transaction,
            amount: parseFloat(transaction.amount),
            month: transaction.month // Use month em vez de date
          }));
        } else {
          transactions = [{
            ...response.data,
            amount: parseFloat(response.data.amount),
            month: response.data.month // Use month em vez de date
          }];
        }
  
        const filteredTransactions = transactions.filter(transaction => {
          const monthMatches = transaction.month === selectedModalMonth;
          const categoryMatches = selectedCategory ? transaction.category === selectedCategory : true;
          return monthMatches && categoryMatches;
        });
  
        const totalIncome = filteredTransactions
          .filter(transaction => transaction.amount > 0)
          .reduce((acc, transaction) => acc + transaction.amount, 0);
  
        const totalExpense = filteredTransactions
          .filter(transaction => transaction.amount < 0)
          .reduce((acc, transaction) => acc + Math.abs(transaction.amount), 0);
  
        const total = totalIncome - totalExpense; // Calcular o total combinado
        setIncomeTotal(totalIncome);
        setExpenseTotal(totalExpense);
        setTotal(total); // Atualizar o total combinado
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
  
      await api.delete(`/financas/${id}`, headers);
  
      setTransactions(prevTransactions =>
        prevTransactions.filter(transaction => transaction.id !== id) // Atualize para usar `id`
      );
  
      console.log('Transação excluída com sucesso:', id);
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
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
  
      setTransactions(prevTransactions => 
        prevTransactions.map(transaction => 
          transaction.id === id ? { ...transaction, ...transactionData } : transaction
        )
      );
  
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
    }
  };

  const handleEditTransaction = async (id: string) => {
    const transactionToEdit = transactions.find(transaction => transaction.id === id);
  
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
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <div className="card bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-semibold">Entradas</h3>
            <p id="incomeDisplay" className="text-xl font-bold text-green-500">
              $ {incomeTotal.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <div className="card bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-semibold">Saídas</h3>
            <p id="expenseDisplay" className="text-xl font-bold text-red-500">$ {expenseTotal.toFixed(2)}</p>
          </div>
        </div>
        <div className="w-full md:w-1/3">
          <div className="card bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-semibold">Total</h3>
            <p id="totalDisplay" className={`text-xl font-bold ${total >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              $ {total.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="card mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
        <h3 className="text-lg font-semibold">Transações</h3>
        <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <label className="mr-2 font-medium">Filtrar por categoria:</label>
          <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="p-2 rounded-md border border-gray-300"
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
                  showFullMonthYearPicker
                  className="date-picker-input"
                  calendarClassName="custom-calendar"
                  wrapperClassName="date-picker-wrapper"
                  popperClassName="custom-popper"
                  disabledKeyboardNavigation
                  placeholderText="Selecione um mês"
          />
        </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="p-2 border-b">Descrição</th>
              <th className="p-2 border-b">Valor</th>
              <th className="p-2 border-b">Mês</th>
              <th className="p-2 border-b">Categoria</th>
              <th className="p-2 border-b">Ação</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
                <tr
                 key={index}
                 className={`${
                   transaction.amount < 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                 }`}
               >
                <td className="p-2 border-b">{transaction.description}</td>
                <td className="p-2 border-b">{transaction.amount.toFixed(2)}</td>
                <td className="p-2 border-b">{monthMapping[transaction.month] || transaction.month}</td> {/* Convertendo mês para português */}
                <td className="p-2 border-b">{transaction.category}</td>
                <td className="p-2 border-b">
                  <button
                    className="hover:text-black mr-2"
                    onClick={() => handleEditTransaction(transaction.id)} // Ação de editar
                  >
                    <FaEdit /> 
                  </button>
                  <button
                    className="hover:text-black"
                    onClick={() => handleDeleteTransaction(transaction.id)} // Atualize para usar `id`
                  >
                    <MdDelete />
                  </button>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="fixed bottom-16 right-8 flex space-x-4">
        <button onClick={handleOpenExpenseModal} className="fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-red-500 text-white py-2 px-4 rounded-full shadow-md hover:bg-red-600">
          Adicionar Despesa
        </button>

        <button onClick={handleOpenModal} className="fixed bottom-16 left-1/2 transform translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-full shadow-md hover:bg-green-600">
          Adicionar Receita
        </button>
      </div>

      {showModal && (
        <TransactionModal
          title="Adicionar Receita"
          onClose={handleCloseModal}
          onSubmit={handleSubmit(handleAddTransaction)}
          register={register}
          errors={errors}
          transactionType="Receita"
          setValue={setValue}
          showNewCategoryInput={showNewCategoryInput}
          categories={categories}
          monthMapping={monthMapping2} // Passe o monthMapping para o modal
          selectedDate={selectedDate} // Pass selectedDate
          setSelectedDate={setSelectedDate} // Pass setSelectedDate
        />
      )}

      {showExpenseModal && (
        <TransactionModal
          title="Adicionar Despesa"
          onClose={handleCloseModal}
          onSubmit={handleSubmit(handleAddTransaction)}
          register={register}
          errors={errors}
          transactionType="Despesa"
          setValue={setValue}
          showNewCategoryInput={showNewCategoryInput}
          categories={categories}
          monthMapping={monthMapping2} // Passe o monthMapping para o modal
          selectedDate={selectedDate} // Pass selectedDate
          setSelectedDate={setSelectedDate} // Pass setSelectedDate
        />
      )}
    </DefaultLayout>
  );
};

interface TransactionModalProps {
  title: string;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => void;
  register: any;
  errors: any;
  transactionType: string;
  setValue: (name: string, value: any) => void;
  categories: string[];
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  title,
  onClose,
  onSubmit,
  register,
  errors,
  setValue,
  categories,
  selectedDate,
  setSelectedDate
}) => {
  // Estado para controlar a exibição do input de nova categoria
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      setValue("month", format(selectedDate, "MMMM")); // Define o mês
      setValue("year", format(selectedDate, "yyyy"));   // Define o ano
    }
  }, [selectedDate, setValue]);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setValue("month", format(date, "MMMM")); // Define o mês
      setValue("year", format(date, "yyyy"));   // Define o ano
    }
    setSelectedDate(date); // Atualiza selectedDate
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Descrição</label>
            <input
              type="text"
              {...register("description", { required: true })}
              className="w-full p-2 rounded-md border border-gray-300"
            />
            {errors.description && <span className="text-red-500">Campo obrigatório</span>}
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Valor</label>
            <input
              type="number"
              step="0.01"
              {...register("amount", { required: true })}
              className="w-full p-2 rounded-md border border-gray-300"
            />
            {errors.amount && <span className="text-red-500">Campo obrigatório</span>}
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Data</label>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="MMMM yyyy"
              showMonthYearPicker
              showFullMonthYearPicker
              className="date-picker-input"
              calendarClassName="custom-calendar"
              wrapperClassName="date-picker-wrapper"
              popperClassName="custom-popper"
              disabledKeyboardNavigation
              placeholderText="Selecione um mês"
            />
            {errors.month && <span className="text-red-500">Campo obrigatório</span>}
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Categoria</label>
            <select
              {...register("category", { required: true })}
              className="w-full p-2 rounded-md border border-gray-300"
              defaultValue={register("category").value || ""}
              onChange={handleCategoryChange} // Altere aqui
            >
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
              <option value="Outros">Outros</option>
            </select>
            {errors.category && <span className="text-red-500">Campo obrigatório</span>}
            {showNewCategoryInput && (
              <input
                type="text"
                placeholder="Nova categoria"
                {...register("newCategory", { required: showNewCategoryInput })}
                className="w-full p-2 rounded-md border border-gray-300 mt-2"
              />
            )}
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-gray-600">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Adicionar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ECommerce;