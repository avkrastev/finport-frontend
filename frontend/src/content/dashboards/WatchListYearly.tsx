import { Card, Box, Typography } from '@mui/material';

import { styled } from '@mui/material/styles';
import Label from 'src/components/Label';
import Text from 'src/components/Text';
import { formatAmountAndCurrency } from 'src/utils/functions';
import WatchListColumn1Chart from './WatchListColumn1Chart';

const WatchListColumn1ChartWrapper = styled(WatchListColumn1Chart)(
  () => `
        height: 130px;
`
);

function WatchListYearly(props) {
  const { totalInvested, totalTransactions, yearlySpent, yearsLabels } = props;

  return (
    <Card>
      <Box sx={{ p: 3 }}>
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
          <Text color="black">invested</Text>
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
        <WatchListColumn1ChartWrapper data={[...yearlySpent]} labels={yearsLabels} />
      </Box>
    </Card>
  );
}

export default WatchListYearly;
