import { Card, Box, Typography, Icon } from '@mui/material';

import { styled } from '@mui/material/styles';
import Label from 'src/components/Label';
import Text from 'src/components/Text';
import { formatAmountAndCurrency } from 'src/utils/functions';
import WatchListColumn1Chart from './WatchListColumn1Chart';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { monthNames } from 'src/constants/common';

const WatchListColumn1ChartWrapper = styled(WatchListColumn1Chart)(
  () => `
        height: 130px;
`
);

function WatchListColumn2(props) {
  const { year, totalInvested, totalTransactions, monthlySpent } = props;

  return (
    <Card>
      <Box sx={{ p: 3 }}>
        <Box display="flex" alignItems="center">
          <Icon sx={{ mr: 1 }} component={CalendarMonthIcon} />
          <Box>
            <Typography variant="h4" noWrap>
              {year}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            pt: 3
          }}
        >
          <Typography variant="h2" sx={{ pr: 1, mb: 1 }}>
            {formatAmountAndCurrency(totalInvested, 'USD')}
          </Typography>
          <Text color="black">total invested</Text>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start'
          }}
        >
          <Label color="info">{totalTransactions}</Label>
          <Typography variant="body2" color="text.secondary" sx={{ pl: 1 }}>
            transactions
          </Typography>
        </Box>
      </Box>
      <Box height={130} sx={{ ml: -1.5 }}>
        <WatchListColumn1ChartWrapper
          data={[...monthlySpent]}
          labels={monthNames}
        />
      </Box>
    </Card>
  );
}

export default WatchListColumn2;
