import { Card, Box, Typography, Avatar, SvgIcon, Link } from '@mui/material';

import { styled } from '@mui/material/styles';
import Label from 'src/components/Label';
import Text from 'src/components/Text';
import {
  formatAmountAndCurrency,
  padArrayStart,
  roundNumber
} from 'src/utils/functions';
import WatchListColumn1Chart from './WatchListColumn1Chart';
import WatchListColumnSkeleton from './WatchListColumnSkeleton';
import CurrencyBitcoinTwoToneIcon from '@mui/icons-material/CurrencyBitcoinTwoTone';
import AgricultureTwoToneIcon from '@mui/icons-material/AgricultureTwoTone';
import AutoGraphTwoToneIcon from '@mui/icons-material/AutoGraphTwoTone';
import AddchartTwoToneIcon from '@mui/icons-material/AddchartTwoTone';
import GroupTwoToneIcon from '@mui/icons-material/GroupTwoTone';
import ShowChartTwoToneIcon from '@mui/icons-material/ShowChartTwoTone';
import { shortDayNames } from 'src/constants/common';

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
        background: transparent;
        margin-right: ${theme.spacing(0.5)};
`
);

const WatchListColumn1ChartWrapper = styled(WatchListColumn1Chart)(
  ({ theme }) => `
        height: 150px;
        padding: 0 20px 10px;
`
);

function WatchListColumn1({ category, t, ...rest }) {
  let prices = [];
  let categories = {};
  const todayDayName = new Date().getDay();
  const labels = shortDayNames
    .slice(todayDayName)
    .concat(shortDayNames.slice(0, todayDayName));

  for (let i = rest.history.length - 1; i >= 0; i--) {
    const categoryDate = rest.history[i].categories.find(
      (item) => item.category === category.alias
    );
    if (categoryDate) {
      prices.push(roundNumber(categoryDate.balance));
    }
  }

  categories[category.alias] = padArrayStart(prices, 7, 0);

  let holdingValue;
  let difference;
  let differenceInPercents;
  let loading;
  let icon;
  switch (category.alias) {
    case 'crypto':
      holdingValue = rest.crypto.holdingValue;
      difference = rest.crypto.difference;
      differenceInPercents = roundNumber(rest.crypto.differenceInPercents);
      icon = CurrencyBitcoinTwoToneIcon;
      loading = rest.cryptoLoading;
      break;
    case 'stocks':
      holdingValue = rest.stocks.holdingValue;
      difference = rest.stocks.difference;
      differenceInPercents = roundNumber(rest.stocks.differenceInPercents);
      icon = ShowChartTwoToneIcon;
      loading = rest.stocksLoading;
      break;
    case 'p2p':
      holdingValue = rest.p2p.holdingValue;
      difference = rest.p2p.difference;
      differenceInPercents = roundNumber(rest.p2p.differenceInPercents);
      icon = GroupTwoToneIcon;
      loading = rest.p2pLoading;
      break;
    case 'etf':
      holdingValue = rest.etf.holdingValue;
      difference = rest.etf.difference;
      differenceInPercents = roundNumber(rest.etf.differenceInPercents);
      icon = AddchartTwoToneIcon;
      loading = rest.etfLoading;
      break;
    case 'misc':
      holdingValue = rest.misc.holdingValue;
      difference = rest.misc.difference;
      differenceInPercents = roundNumber(rest.misc.differenceInPercents);
      icon = AutoGraphTwoToneIcon;
      loading = rest.miscLoading;
      break;
    case 'commodities':
      holdingValue = rest.commodities.holdingValue;
      difference = rest.commodities.difference;
      differenceInPercents = rest.commodities.differenceInPercents
        ? roundNumber(rest.commodities.differenceInPercents)
        : 0;
      icon = AgricultureTwoToneIcon;
      loading = rest.commoditiesLoading;
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
    <Link href={`/dashboards/${category.alias}`} underline="none">
      <Card>
        <Box sx={{ p: 3 }}>
          <Box display="flex" alignItems="center">
            <AvatarWrapper>
              <SvgIcon color="primary" fontSize="large" component={icon} />
            </AvatarWrapper>
            <Box>
              <Typography variant="h4" noWrap>
                {t(category.name)}
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
              <Label color="success">
                +{formatAmountAndCurrency(difference, 'USD')}
              </Label>
            ) : (
              <Label color="error">
                {formatAmountAndCurrency(difference, 'USD')}
              </Label>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ pl: 1 }}>
              {t('since start')}
            </Typography>
          </Box>
        </Box>
        <Box height={150}>
          <WatchListColumn1ChartWrapper
            data={categories[category.alias]}
            labels={[...labels]}
          />
        </Box>
      </Card>
    </Link>
  );
}

export default WatchListColumn1;
