import { FC } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { alpha, useTheme } from '@mui/material';
import { formatAmountAndCurrency } from 'src/utils/functions';
import { useTranslation } from 'react-i18next';

interface WatchListColumn1ChartProps {
  data: any[];
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

  const labelsTranslated = [];
  for (let label of labels) {
    if (typeof label === 'string' && label.match(/[0-9]{4}/g)) {
      const compositeLabel = label.split(' ');
      labelsTranslated.push(
        t(`${compositeLabel[0]} {{year}}`, { year: compositeLabel[1] })
      );
    } else {
      labelsTranslated.push(
        label !== '' && typeof label === 'string' ? t(label) : label
      );
    }
  }

  const data = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    const primaryGradient = ctx.createLinearGradient(6, 6, 6, 150);

    const gradientMainColor = skeleton ? '#e3e3e3' : theme.colors.primary.light;

    primaryGradient.addColorStop(0, alpha(gradientMainColor, 0.8));
    primaryGradient.addColorStop(0.8, theme.colors.alpha.white[10]);
    primaryGradient.addColorStop(1, theme.colors.alpha.white[100]);

    return {
      datasets: [
        {
          data: dataProp,
          borderWidth: 1,
          backgroundColor: primaryGradient,
          borderColor: !skeleton ? '#c0c0c0' : theme.colors.primary.main,
          pointBorderWidth: 0,
          pointRadius: 0,
          pointHoverRadius: 0
        }
      ],
      labels: labelsTranslated
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    layout: {
      padding: 0
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false,
            drawBorder: true
          },
          ticks: {
            display: true
          }
        }
      ],
      yAxes: [
        {
          gridLines: {
            display: false
          },
          ticks: {
            display: false
          }
        }
      ]
    },
    tooltips: {
      enabled: true,
      mode: 'nearest',
      intersect: false,
      caretSize: 6,
      displayColors: false,
      yPadding: 8,
      xPadding: 16,
      borderWidth: 4,
      borderColor: theme.palette.common.black,
      backgroundColor: theme.palette.common.black,
      titleFontColor: theme.palette.common.white,
      bodyFontColor: theme.palette.common.white,
      footerFontColor: theme.palette.common.white,
      callbacks: {
        title: (tooltipItem: any) => {
          if (labelsForTooltip && labelsForTooltip[tooltipItem[0].index]) {
            return labelsForTooltip[tooltipItem[0].index];
          }
        },
        label: (tooltipItem: any) => {
          return formatAmountAndCurrency(tooltipItem.yLabel);
        }
      }
    }
  };

  return (
    <div {...rest}>
      <Line data={data} options={options} />
    </div>
  );
};

WatchListColumn1Chart.propTypes = {
  data: PropTypes.array.isRequired,
  labels: PropTypes.array.isRequired
};

export default WatchListColumn1Chart;
