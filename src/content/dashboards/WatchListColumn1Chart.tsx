import { FC } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { alpha, useTheme } from '@mui/material';
import { formatAmountAndCurrency } from 'src/utils/functions';
import { useTranslation } from 'react-i18next';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  ChartData,
  ChartOptions,
  ScriptableContext,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

interface WatchListColumn1ChartProps {
  data: number[];
  labels: string[];
  skeleton?: boolean;
  labelsForTooltip?: string[];
}

const WatchListColumn1Chart: FC<WatchListColumn1ChartProps> = ({
  data: dataProp,
  labels,
  skeleton,
  labelsForTooltip,
  ...rest
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  // Translate labels
  const labelsTranslated = labels.map((label) => {
    if (typeof label === 'string' && label.match(/[0-9]{4}/g)) {
      const compositeLabel = label.split(' ');
      return t(`${compositeLabel[0]} {{year}}`, { year: compositeLabel[1] });
    } else {
      return label !== '' && typeof label === 'string' ? t(label) : label;
    }
  });

  // Create gradient for the chart
  const primaryGradient = (context: ScriptableContext<'line'>) => {
    const ctx = context.chart.ctx;
    const gradient = ctx.createLinearGradient(6, 6, 6, 150);
    const gradientMainColor = skeleton ? '#e3e3e3' : theme.colors.primary.light;
    gradient.addColorStop(0, alpha(gradientMainColor, 0.8));
    gradient.addColorStop(0.8, theme.colors.alpha.white[10]);
    gradient.addColorStop(1, theme.colors.alpha.white[100]);
    return gradient;
  };

  // Chart data
  const data: ChartData<'line'> = {
    labels: labelsTranslated,
    datasets: [
      {
        data: dataProp,
        borderWidth: 1,
        backgroundColor: primaryGradient, // Use the gradient
        borderColor: !skeleton ? '#c0c0c0' : theme.colors.primary.main,
        pointBorderWidth: 0,
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: true, // Enable filling under the line
      },
    ],
  };

  // Chart options
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 0,
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: true,
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
          title: (context) => {
            if (labelsForTooltip && labelsForTooltip[context[0].dataIndex]) {
              return labelsForTooltip[context[0].dataIndex];
            }
            return '';
          },
          label: (context) => formatAmountAndCurrency(context.raw as number),
        },
      },
    },
  };

  return (
    <div {...rest}>
      <Line data={data} options={options} />
    </div>
  );
};

WatchListColumn1Chart.propTypes = {
  data: PropTypes.array.isRequired,
  labels: PropTypes.array.isRequired,
};

export default WatchListColumn1Chart;