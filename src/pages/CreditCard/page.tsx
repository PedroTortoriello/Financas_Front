import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Modal from 'react-modal';
import { MenuItem, TextField, InputAdornment, Chip } from '@mui/material';
import { useForm } from 'react-hook-form';
import { MasterCardIcon, VisaIcon } from './CardIcons';
import { MdAttachMoney, MdDateRange } from 'react-icons/md';
import api from '../Authentication/api';

Modal.setAppElement('#root');

const AddCreditCard: React.FC = () => {
  const [cards, setCards] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      name: '',
      limite: 0,
      type: '',
      closingDay: 1,
      dueDay: 5
    }
  });

  const handleAddCard = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
  };

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await api.get('/cartoes', {
          withCredentials: true,
        });
    
        if (response.status === 200) {
          setCards(response.data);
        } else {
          console.error('Erro ao buscar os cartões');
        }
      } catch (error) {
        console.error('Erro na requisição', error);
      }
    };

    fetchCards();
  }, []);

  const handleSaveCard = async (data: any) => {
    try {
      const token = localStorage.getItem("token"); // Certifique-se de que o token está sendo armazenado corretamente
  
      const response = await api.post('/cartoes', data, {
        headers: {
          'Authorization': `Bearer ${token}`, // Adiciona o token ao cabeçalho
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 201) {
        const result = response.data;
        setCards([...cards, result]); // Adiciona o novo cartão ao array existente
        handleCloseModal(); // Fecha o modal após salvar
      } else {
        console.error('Erro ao salvar o cartão');
      }
    } catch (error) {
      console.error('Erro na requisição', error);
    }
  };
  

  const cardTypeIcon = (type: string) => {
    switch (type) {
      case 'Visa':
        return <VisaIcon className="text-blue-600 h-6 w-6" />;
      case 'MasterCard':
        return <MasterCardIcon className="text-red-600 h-6 w-6" />;
      default:
        return null;
    }
  };

  return (
    <DefaultLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-extrabold mb-6 text-center">Gerenciar Cartões de Crédito</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cards.length === 0 ? (
            <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-xl font-bold mb-4">Nenhum cartão cadastrado</h2>
            </div>
          ) : (
            cards.map((card) => (
              <div key={card.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex items-center">
                <div className="text-4xl mr-4">
                  {cardTypeIcon(card.type)}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-1">{card.name}</h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400">Limite: R$ {card.limite}</p>
                  <p className="text-lg text-gray-600 dark:text-gray-400">Data de Fechamento: {card.closingDay}</p>
                  <p className="text-lg text-gray-600 dark:text-gray-400">Data de Vencimento: {card.dueDay}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Botão para adicionar novo cartão */}
        <div className="mt-6 text-center">
          <button
            className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition duration-300"
            onClick={handleAddCard}
          >
            Novo Cartão de Crédito
          </button>
        </div>

        {/* Modal para adicionar novo cartão */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          contentLabel="Adicionar Novo Cartão de Crédito"
          className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg mx-auto mt-20 max-w-lg"
        >
          <h2 className="text-3xl font-bold mb-6">Novo Cartão de Crédito</h2>
          <form onSubmit={handleSubmit(handleSaveCard)}>
            {/* Campos do formulário */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700 dark:text-gray-300">Nome</label>
              <TextField
                fullWidth
                variant="standard"
                {...register("name", { required: true })}
              />
              {errors.name && <span className="text-red-500">Campo obrigatório</span>}
            </div>
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700 dark:text-gray-300">Limite</label>
              <TextField
                fullWidth
                type="number"
                variant="standard"
                {...register("limite", { required: true })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MdAttachMoney className="text-gray-500" />
                    </InputAdornment>
                  ),
                }}
              />
              {errors.limite && <span className="text-red-500">Campo obrigatório</span>}
            </div>
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700 dark:text-gray-300">Tipo</label>
              <TextField
                fullWidth
                select
                variant="standard"
                {...register("type", { required: true })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {cardTypeIcon('')}
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="Visa">
                  <Chip icon={<VisaIcon />} label="Visa" />
                </MenuItem>
                <MenuItem value="MasterCard">
                  <Chip icon={<MasterCardIcon />} label="MasterCard" />
                </MenuItem>
              </TextField>
              {errors.type && <span className="text-red-500">Campo obrigatório</span>}
            </div>
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700 dark:text-gray-300">Fechamento</label>
              <TextField
                fullWidth
                type="number"
                variant="standard"
                {...register("closingDay", { required: true })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MdDateRange className="text-gray-500" />
                    </InputAdornment>
                  ),
                }}
              />
              {errors.closingDay && <span className="text-red-500">Campo obrigatório</span>}
            </div>
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700 dark:text-gray-300">Vencimento da Fatura</label>
              <TextField
                fullWidth
                type="number"
                variant="standard"
                {...register("dueDay", { required: true })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MdDateRange className="text-gray-500" />
                    </InputAdornment>
                  ),
                }}
              />
              {errors.dueDay && <span className="text-red-500">Campo obrigatório</span>}
            </div>

            <button
              type="submit"
              className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition duration-300"
            >
              Salvar
            </button>
          </form>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default AddCreditCard;
