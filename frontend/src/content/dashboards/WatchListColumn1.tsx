import { Card, Box, Typography, Avatar, SvgIcon } from '@mui/material';

import { styled } from '@mui/material/styles';
import Label from 'src/components/Label';
import Text from 'src/components/Text';
import { formatAmountAndCurrency, roundNumber } from 'src/utils/functions';
import WatchListColumn1Chart from './WatchListColumn1Chart';
import WatchListColumnSkeleton from './WatchListColumnSkeleton';
import CurrencyBitcoinTwoToneIcon from '@mui/icons-material/CurrencyBitcoinTwoTone';
import AgricultureTwoToneIcon from '@mui/icons-material/AgricultureTwoTone';
import AutoGraphTwoToneIcon from '@mui/icons-material/AutoGraphTwoTone';
import AddchartTwoToneIcon from '@mui/icons-material/AddchartTwoTone';
import GroupTwoToneIcon from '@mui/icons-material/GroupTwoTone';
import ShowChartTwoToneIcon from '@mui/icons-material/ShowChartTwoTone';

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
        background: transparent;
        margin-right: ${theme.spacing(0.5)};
`
);

const WatchListColumn1ChartWrapper = styled(WatchListColumn1Chart)(
  ({ theme }) => `
        height: 130px;
`
);

function WatchListColumn1({
  category,
  crypto,
  cryptoLoading,
  stocks,
  stocksLoading,
  p2p,
  p2pLoading,
  etf,
  etfLoading,
  misc,
  miscLoading,
  commodities,
  commoditiesLoading
}) {
  const price = {
    week: {
      labels: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
      data: [55.701, 57.598, 48.607, 46.439, 58.755, 46.978, 58.16]
    }
  };

  let holdingValue;
  let difference;
  let differenceInPercents;
  let loading;
  let icon;
  switch (category.alias) {
    case 'crypto':
      holdingValue = crypto.holdingValue;
      difference = crypto.difference;
      differenceInPercents = roundNumber(crypto.differenceInPercents);
      icon = CurrencyBitcoinTwoToneIcon;
      loading = cryptoLoading;
      break;
    case 'stocks':
      holdingValue = stocks.holdingValue;
      difference = stocks.difference;
      differenceInPercents = roundNumber(stocks.differenceInPercents);
      icon = ShowChartTwoToneIcon;
      loading = stocksLoading;
      break;
    case 'p2p':
      holdingValue = p2p.holdingValue;
      difference = p2p.difference;
      differenceInPercents = roundNumber(p2p.differenceInPercents);
      icon = GroupTwoToneIcon;
      loading = p2pLoading;
      break;
    case 'etf':
      holdingValue = etf.holdingValue;
      difference = etf.difference;
      differenceInPercents = roundNumber(etf.differenceInPercents);
      icon = AddchartTwoToneIcon;
      loading = etfLoading;
      break;
    case 'misc':
      holdingValue = misc.holdingValue;
      difference = misc.difference;
      differenceInPercents = roundNumber(misc.differenceInPercents);
      icon = AutoGraphTwoToneIcon;
      loading = miscLoading;
      break;
    case 'commodities':
      holdingValue = commodities.holdingValue;
      difference = commodities.difference;
      differenceInPercents = roundNumber(commodities.differenceInPercents);
      icon = AgricultureTwoToneIcon;
      loading = commoditiesLoading;
      break;
    default:
      holdingValue = 0;
      difference = 0;
      differenceInPercents = roundNumber(0);
      loading = 'succeeded';
      break;
  }

  if (loading !== 'succeeded') {
    return <WatchListColumnSkeleton />;
  }

  return (
    <Card>
      <Box sx={{ p: 3 }}>
        <Box display="flex" alignItems="center">
          <AvatarWrapper>
            <SvgIcon color="primary" fontSize="large" component={icon} />
          </AvatarWrapper>
          <Box>
            <Typography variant="h4" noWrap>
              {category.name}
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
            {formatAmountAndCurrency(holdingValue, 'USD')}
          </Typography>
          {parseInt(differenceInPercents) >= 0 ? (
            <Text color="success">
              <b>+{differenceInPercents}%</b>
            </Text>
          ) : (
            <Text color="error">
              <b>{differenceInPercents}%</b>
            </Text>
          )}
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start'
          }}
        >
          {parseInt(difference) >= 0 ? (
            <Label color="success">+{formatAmountAndCurrency(difference, 'USD')}</Label>
          ) : (
            <Label color="error">{formatAmountAndCurrency(difference, 'USD')}</Label>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ pl: 1 }}>
            since start
          </Typography>
        </Box>
      </Box>
      <Box height={130} sx={{ ml: -1.5 }}>
        <WatchListColumn1ChartWrapper
          data={price.week.data}
          labels={price.week.labels}
          skeleton={true}
        />
      </Box>
    </Card>
  );
}

export default WatchListColumn1;
