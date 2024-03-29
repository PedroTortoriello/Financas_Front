import { ApexOptions } from 'apexcharts';
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

// Opções do gráfico
const options: ApexOptions = {
  colors: ['#3C50E0', '#80CAEE'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    type: 'bar',
    height: 335,
    stacked: true,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  responsive: [
    {
      breakpoint: 1536,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: '25%',
          },
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 0,
      columnWidth: '25%',
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'last',
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: ['J', 'F', 'M', 'A', 'J', 'JL', 'A', 'S', 'N', 'D'],
  },
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
  fill: {
    opacity: 1,
  },
};

interface ChartTwoState {
  series: {
    name: string;
    data: number[];
  }[];
}

const ChartTwo: React.FC = () => {
  const [state, setState] = useState<ChartTwoState>({
    series: [
      {
        name: 'Compras',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0 , 0, 0],
      },
      {
        name: 'Economias',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0 , 0, 0],
      },
    ],
  });

  const handleAddGasto = (valor: number, data: Date, totalGastos: number) => {
    const month = data.getMonth();
    const updatedSeries = state.series.map((item) => {
      const newData = [...item.data];
      newData[month] += totalGastos;
      return { ...item, data: newData };
    });
    setState({ series: updatedSeries });
  };

  const handleReset = () => {
    setState({
      series: [
        {
          name: 'Compras',
          data: [100, 0, 0, 0, 0, 0, 0],
        },
        {
          name: 'Economias',
          data: [2, 0, 0, 0, 0, 0, 0],
        },
      ],
    });
  };

  return (
    <div>
      <ReactApexChart options={options} series={state.series} type="bar" height={350} width={550} />
    </div>
  );
};

export default ChartTwo;
