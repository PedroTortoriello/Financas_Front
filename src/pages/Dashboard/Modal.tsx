import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';

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
  showNewCategoryInput: boolean; // Adicionado para passar o estado de exibição do input de nova categoria
  setShowNewCategoryInput: (show: boolean) => void; // Adicionado para atualizar o estado de exibição do input de nova categoria
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
  setSelectedDate,
  showNewCategoryInput,
  setShowNewCategoryInput,
}) => {
  useEffect(() => {
    if (selectedDate) {
      setValue("month", format(selectedDate, "MMMM"));
      setValue("year", format(selectedDate, "yyyy"));
    }
  }, [selectedDate, setValue]);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      console.log("handleDateChange - month:", format(date, "MMMM"), "year:", format(date, "yyyy"));
      setValue("month", format(date, "MMMM"));
      setValue("year", format(date, "yyyy"));
    }
    setSelectedDate(date);
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
        setCategories([...categories, category]); // Adiciona a nova categoria na lista de categorias
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
  
      await api.post('/financas', transactionData, headers);
      console.log('Nova transação adicionada:', transactionData);
  
      const newTransaction: Transaction = {
        id: new Date().toISOString(),
        description: data.description,
        amount: amount,
        month: data.month,
        category: category,
        userId,
      };
      setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
  
      reset();
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
    }
  };
  
  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === "Outros") {
      setShowNewCategoryInput(true);
    } else {
      setShowNewCategoryInput(false);
    }
  };

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
              onChange={handleCategoryChange}
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
                className="w-full p-2 mt-2 rounded-md border border-gray-300"
              />
            )}
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-4">
              Cancelar
            </button>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
