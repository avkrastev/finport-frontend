import { FC } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useTheme } from '@mui/material';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ChartProps {
  data: ChartData<'doughnut'>;
}

const AccountBalanceChart: FC<ChartProps> = ({ data: dataProp, ...rest }) => {
  const theme = useTheme();

  const data: ChartData<'doughnut'> = {
    datasets: dataProp.datasets.map((dataset) => ({
      ...dataset,
      borderWidth: 2,
      borderColor: theme.colors.alpha.white[100],
      hoverBorderColor: theme.colors.alpha.white[30],
    })),
    labels: dataProp.labels,
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: true,
    animation: false,
    cutout: '60%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        caretSize: 6,
        displayColors: false,
        mode: 'index',
        intersect: true,
        padding: {
          top: 8,
          bottom: 8,
          left: 8,
          right: 8,
        },
        borderWidth: 2,
        bodySpacing: 10,
        borderColor: theme.colors.alpha.black[30],
        backgroundColor: theme.palette.common.white,
        titleColor: theme.palette.common.black,
        bodyColor: theme.palette.common.black,
        footerColor: theme.palette.common.black,
        callbacks: {
          label(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}%`;
          },
        },
      },
    },
  };

  return <Doughnut data={data} options={options} {...rest} />;
};

export default AccountBalanceChart;
