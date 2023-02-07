import { Card, Box, Typography } from '@mui/material';

import { styled } from '@mui/material/styles';
import Label from 'src/components/Label';
import Text from 'src/components/Text';
import { formatAmountAndCurrency, roundNumber } from 'src/utils/functions';
import WatchListColumn1Chart from './WatchListColumn1Chart';
import { format } from 'date-fns';

const WatchListColumn1ChartWrapper = styled(WatchListColumn1Chart)(
  ({ theme }) => `
        height: 220px;
        padding: 0 20px 10px;
`
);

function BalanceChart(props) {
  let prices = [];
  let labelsForTooltip = [];
  let labels = [];
  const differenceInPercents =
    props.history && props.history.differenceInPercents
      ? props.history.differenceInPercents
      : 0;
  const difference =
    props.history && props.history.difference ? props.history.difference : 0;

  if (props.history) {
    for (let date in props.history.historyData) {
      if (props.category !== '') {
        prices.push(
          roundNumber(props.history.historyData[date].categories[0].balance)
        );
      } else {
        prices.push(roundNumber(props.history.historyData[date].balance));
      }
    }

    for (
      let dt = new Date(props.history.historyData[0]._id.date);
      dt <= new Date();
      dt.setDate(dt.getDate() + 1)
    ) {
      labelsForTooltip.push(format(new Date(dt), 'dd MMM yyyy'));
    }
    labels = Array(prices.length).fill('');
    if (labels.length > 0) {
      labels[0] = format(
        new Date(props.history.historyData[0]._id.date),
        'MMM yyyy'
      );
      labels[labels.length - 1] = 'Today';
    }
  }

  return (
    <Card>
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start'
          }}
        >
          <Typography variant="h2" sx={{ pr: 1, mb: 1 }}>
            {formatAmountAndCurrency(prices[prices.length - 1], 'USD')}
          </Typography>
          {differenceInPercents >= 0 ? (
            <Text color="success">{roundNumber(differenceInPercents)}%</Text>
          ) : (
            <Text color="error">{roundNumber(differenceInPercents)}%</Text>
          )}
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start'
          }}
        >
          {difference >= 0 ? (
            <Label color="success">
              {formatAmountAndCurrency(difference, 'USD')}
            </Label>
          ) : (
            <Label color="error">
              {formatAmountAndCurrency(difference, 'USD')}
            </Label>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ pl: 1 }}>
            {props.t('last 24h')}
          </Typography>
        </Box>
      </Box>
      <Box height={220}>
        <WatchListColumn1ChartWrapper
          data={prices}
          labels={labels}
          labelsForTooltip={labelsForTooltip}
        />
      </Box>
    </Card>
  );
}

export default BalanceChart;
