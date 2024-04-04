import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

interface Transaction {
  description: string;
  amount: number;
  date: string;
}

interface ChartTwoProps {
  transactions: Transaction[][];
}

interface ChartTwoState {
  totalIncome: number;
  totalExpense: number;
}

const ChartTwo: React.FC<ChartTwoProps> = ({ transactions }) => {
  const [state, setState] = useState<ChartTwoState>({
    totalIncome: 0,
    totalExpense: 0,
  });

  useEffect(() => {
    if (transactions) {
      let totalIncome = 0;
      let totalExpense = 0;

      transactions.forEach(transaction => {
        if (transaction.amount > 0) {
          totalIncome += transaction.amount;
        } else {
          totalExpense -= transaction.amount;
        }
      });

      setState({ totalIncome, totalExpense });
    }
  }, [transactions]);

  const options: ApexOptions = {
    colors: ['#00ff04', '#ff0000'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'pie',
      height: 335,
    },
    labels: ['Entradas', 'Saídas'],
    responsive: [
      {
        breakpoint: 1536,
        options: {
          chart: {
            width: 400,
          },
        },
      },
    ],
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      fontFamily: 'Satoshi',
      fontWeight: 500,
      fontSize: '14px',
      markers: {
        radius: 99,
      },
    },
  };

  return (
    <div>
      <ReactApexChart options={options} series={[state.totalIncome, state.totalExpense]} type="pie" height={350} width={550} />
    </div>
  );
};

export default ChartTwo;
