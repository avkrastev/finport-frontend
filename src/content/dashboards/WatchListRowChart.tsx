import { FC } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { useTheme } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  ChartData,
  ChartOptions,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

interface WatchListRowChartProps {
  data: number[];
  labels: string[];
}

const WatchListRowChart: FC<WatchListRowChartProps> = ({
  data: dataProp,
  labels,
  ...rest
}) => {
  const theme = useTheme();

  // Chart data
  const data: ChartData<'line'> = {
    labels,
    datasets: [
      {
        data: dataProp,
        borderWidth: 3,
        backgroundColor: 'transparent',
        borderColor: theme.colors.primary.main,
        pointBorderWidth: 0,
        pointRadius: 0,
        pointHoverRadius: 0,
      },
    ],
  };

  // Chart options
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Disable the legend
      },
      tooltip: {
        enabled: true,
        mode: 'nearest',
        intersect: false,
        caretSize: 6,
        displayColors: false,
        padding: {
          top: 8,
          bottom: 8,
          left: 16,
          right: 16,
        },
        borderWidth: 4,
        borderColor: theme.palette.common.black,
        backgroundColor: theme.palette.common.black,
        titleColor: theme.palette.common.white,
        bodyColor: theme.palette.common.white,
        footerColor: theme.palette.common.white,
        callbacks: {
          title: () => '', // Empty title
          label: (context) => `Price: $${context.raw}`, // Custom label
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          display: true,
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
    },
    layout: {
      padding: 5,
    },
  };

  return (
    <div {...rest}>
      <Line data={data} options={options} />
    </div>
  );
};

WatchListRowChart.propTypes = {
  data: PropTypes.array.isRequired,
  labels: PropTypes.array.isRequired,
};

export default WatchListRowChart;