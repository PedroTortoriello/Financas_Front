import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import DefaultLayout from '../../layout/DefaultLayout';
import api from '../Authentication/api';
import { saveAs } from 'file-saver';

const ComparisonPage: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [currentMonth, ] = useState<string>(new Date().toLocaleDateString('en-US', { month: 'long' }));
  const [currentYear, ] = useState<number>(new Date().getFullYear());

  const defaultCategories = ["Alimentação", "Transporte", "Educação", "Saúde", "Salário"];

  const monthMappingPT: { [key: string]: string } = {
    'January': 'Janeiro',
    'February': 'Fevereiro',
    'March': 'Março',
    'April': 'Abril',
    'May': 'Maio',
    'June': 'Junho',
    'July': 'Julho',
    'August': 'Agosto',
    'September': 'Setembro',
    'October': 'Outubro',
    'November': 'Novembro',
    'December': 'Dezembro',
  };

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

  const fetchTransactions = async () => {
    try {
      const headers = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };

      const response = await api.get('/financas', headers);
      const allTransactions = response.data;
      setTransactions(allTransactions);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Helper function to extract the numeric value from amount
  const getAmountValue = (amount: any) => {
    if (amount && typeof amount === 'object' && amount.$numberDecimal) {
      return parseFloat(amount.$numberDecimal);
    }
    return parseFloat(amount || '0');
  };

  // Filtragem para o mês atual
  const currentMonthTransactions = transactions.filter(transaction => {
    const month = transaction.month;
    const year = parseInt(transaction.year, 10); // Converter para número
    return month === currentMonth && year === currentYear;
  });

  const totalCurrentMonth = currentMonthTransactions.reduce((sum, transaction) => sum + getAmountValue(transaction.amount), 0);

  // Cálculo dos totais dos últimos 6 meses
  const groupedTransactions: { [key: string]: number } = transactions.reduce((acc, transaction) => {
    const month = transaction.month;
    const year = parseInt(transaction.year, 10); // Converter para número
    const monthYear = `${month} ${year}`;
    acc[monthYear] = acc[monthYear] || 0;
    acc[monthYear] += getAmountValue(transaction.amount);
    return acc;
  }, {});

  // Ordenar os últimos 6 meses
  const sortedMonths = Object.keys(groupedTransactions).sort((a, b) => {
    const [aMonth, aYear] = a.split(' ');
    const [bMonth, bYear] = b.split(' ');
    const aDate = new Date(`${aMonth} 1, ${aYear}`);
    const bDate = new Date(`${bMonth} 1, ${bYear}`);
    return bDate.getTime() - aDate.getTime();
  }).slice(0, 6);

  const trendData = {
    labels: sortedMonths.map(month => `${monthMappingPT[month.split(' ')[0]] || month.split(' ')[0]} - ${month.split(' ')[1]}`),
    datasets: [
      {
        label: 'Gastos Mensais',
        data: sortedMonths.map(month => Math.abs(groupedTransactions[month] || 0)),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        barThickness: 20,
      },
    ],
  };

  const trendChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: number) {
            return Math.abs(value);
          },
        },
        reverse: false,
      },
      x: {
        stacked: true,
      }
    },
  };

  // Análise de Categorias de Despesas
  const filteredCategories = categories.length ? categories : defaultCategories;

  const categoriesAnalysis = transactions.reduce((acc, transaction) => {
    const category = transaction.category || 'Outros';
    if (filteredCategories.includes(category)) {
      acc[category] = acc[category] || 0;
      acc[category] += getAmountValue(transaction.amount);
    }
    return acc;
  }, {});

  const categoryLabels = Object.keys(categoriesAnalysis);
  const categoryData = {
    labels: categoryLabels,
    datasets: [
      {
        label: 'Despesas por Categoria',
        data: categoryLabels.map(category => Math.abs(categoriesAnalysis[category])),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        barThickness: 20,
      },
    ],
  };

  const categoryChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: number) {
            return Math.abs(value);
          },
        },
        reverse: false,
      },
      x: {
        stacked: false,
      }
    },
  };

  // Função para exportar para Excel
  const exportToExcel = async () => {
    try {
      const response = await api.post('/exportExcel', {
        transactions,
        selectedMonth: currentMonth,
        selectedYear: currentYear,
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        responseType: 'blob',
      });

      if (response.status !== 200) {
        const errorText = await response.text();
        console.error('Falha ao exportar para Excel:', errorText);
        throw new Error(`Falha ao exportar para Excel: ${response.statusText}`);
      }

      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'Orcamento_Mensal.xlsx');
    } catch (error) {
      console.error('Erro ao exportar para Excel:', error);
      alert(`Erro ao exportar para Excel: ${error.message}`);
    }
  };

  return (
    <DefaultLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 text-center">Comparação de Gastos: Mês Atual</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Tendência de Gastos Mensais</h2>
            <Bar data={trendData} options={trendChartOptions} />
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Análise de Categorias de Despesas</h2>
            <Bar data={categoryData} options={categoryChartOptions} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 mt-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Resumo</h2>
          <p>Total de Gastos no Mês Atual: R$ {Math.abs(totalCurrentMonth).toFixed(2)}</p>
          <h3 className="text-lg font-semibold mt-4">Economia dos Últimos 6 Meses</h3>
          {sortedMonths.map(month => (
            <p key={month}>{`${monthMappingPT[month.split(' ')[0]] || month.split(' ')[0]} - ${month.split(' ')[1]}`}: R$ {Math.abs(groupedTransactions[month] || 0).toFixed(2)}</p>
          ))}
        </div>
        <div className="flex justify-end items-center mb-6 mt-5">
          <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700" onClick={exportToExcel}>
            Exportar para Excel
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ComparisonPage;
