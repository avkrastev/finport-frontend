import {
  Card,
  Box,
  Grid,
  Typography,
  Hidden,
  Avatar,
  Divider,
  ListItem,
  ListItemText,
  List,
  ListItemAvatar
} from '@mui/material';

import { styled } from '@mui/material/styles';
import TrendingUp from '@mui/icons-material/TrendingUp';
import TrendingDown from '@mui/icons-material/TrendingDown';
import TrendingFlat from '@mui/icons-material/TrendingFlat';
import AccountBalanceChart from './AccountBalanceChart';
import Text from 'src/components/Text';
import { formatAmountAndCurrency, roundNumber } from 'src/utils/functions';
import Icon from 'react-crypto-icons';
import AccountBalanceSkeleton from './AccountBalanceSkeleton';

const AccountBalanceChartWrapper = styled(AccountBalanceChart)(
  () => `
      width: 100%;
      height: 100%;
`
);
const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.success.main};
      color: ${theme.palette.success.contrastText};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      box-shadow: ${theme.colors.shadows.success};
`
);

const AvatarFail = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.error.main};
      color: ${theme.palette.error.contrastText};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      box-shadow: ${theme.colors.shadows.error};
`
);

const AvatarEqual = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.alpha.white};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
`
);

function AccountBalance({ assets, category, loading, ...rest }) {
  let percentages = [];
  let names = [];
  let colors = [
    '#ee9b00',
    '#005f73',
    '#e9d8a6',
    '#94d2bd',
    '#9b2226',
    '#0a9396',
    '#bb3e03',
    '#001219',
    '#9b2226',
    '#ca6702'
  ];

  for (let asset of assets.stats) {
    const percent = (asset.holdingValue / assets.sums.holdingValue) * 100;
    if (!isNaN(percent)) {
      percentages.push(parseFloat(percent.toFixed(2)));
    }
    names.push(asset.name);
  }
  const assetsBalance = {
    datasets: [
      {
        data: percentages,
        backgroundColor: colors
      }
    ],
    labels: names
  };

  const assetsSlice = category === '' ? assets.stats : assets.stats.slice(0, 5);

  const difference = rest.totalDifference
    ? rest.totalDifference
    : assets?.sums?.difference;

  let differenceInPercents = assets.sums.differenceInPercents;
  if (rest.totalDifference) {
    differenceInPercents = (rest.totalDifference / assets.sums.totalSum) * 100;
  }

  let sumsInDifferentCurrencies = assets.sums.sumsInDifferentCurrencies;
  if (rest.totalSumsInDifferentInCurrencies) {
    sumsInDifferentCurrencies = rest.totalSumsInDifferentInCurrencies;
  }

  if (loading !== 'succeeded') {
    return <AccountBalanceSkeleton />;
  }

  return (
    <Card>
      <Grid spacing={0} container>
        <Grid item xs={12} md={6}>
          <Box p={4}>
            <Typography sx={{ pb: 3 }} variant="h4">
              Account Balance / Total Invested
            </Typography>
            <Box>
              <Typography variant="h1" gutterBottom>
                {rest.totalBalance
                  ? formatAmountAndCurrency(rest.totalBalance, 'USD')
                  : formatAmountAndCurrency(assets.sums.holdingValue, 'USD')}
                &nbsp;/&nbsp;
                {formatAmountAndCurrency(assets.sums.totalSum, 'USD')}
              </Typography>
              
              {sumsInDifferentCurrencies
                .filter((item) => item.currency !== 'USD')
                .map((item, i) => {
                  return (
                    <Typography
                      sx={{ mb: 1 }}
                      key={i}
                      variant="h4"
                      fontWeight="normal"
                      color="text.secondary"
                    >
                      {formatAmountAndCurrency(
                        item.holdingAmount,
                        item.currency
                      )}
                      &nbsp;/&nbsp;
                      {formatAmountAndCurrency(item.totalAmount, item.currency)}
                    </Typography>
                  );
                })}

              {category === 'crypto' && (
                <Typography
                  variant="h4"
                  fontWeight="normal"
                  color="text.secondary"
                >
                  {assets?.sums?.inBitcoin} BTC
                </Typography>
              )}
              <Box display="flex" sx={{ py: 4 }} alignItems="center">
                {difference > 0 && (
                  <AvatarSuccess sx={{ mr: 2 }} variant="rounded">
                    <TrendingUp fontSize="large" />
                  </AvatarSuccess>
                )}
                {difference < 0 && (
                  <AvatarFail sx={{ mr: 2 }} variant="rounded">
                    <TrendingDown fontSize="large" />
                  </AvatarFail>
                )}
                {difference === 0 && (
                  <AvatarEqual sx={{ mr: 2 }} variant="rounded">
                    <TrendingFlat fontSize="large" />
                  </AvatarEqual>
                )}
                <Box>
                  <Typography variant="h4">
                    {formatAmountAndCurrency(difference, 'USD')}
                  </Typography>
                  <Typography variant="subtitle2" noWrap align="right">
                    {differenceInPercents !== null
                      ? roundNumber(differenceInPercents)
                      : 0}{' '}
                    %
                  </Typography>
                </Box>
              </Box>
              {category === 'p2p' && (
                <Typography variant="h5">
                  * The compound interest calculations are based on the best
                  case scenario. Therefore the data is approximate.
                </Typography>
              )}
            </Box>
          </Box>
        </Grid>
        <Grid
          sx={{ position: 'relative' }}
          display="flex"
          alignItems="center"
          item
          xs={12}
          md={6}
        >
          {percentages.length > 0 && (
            <>
              <Hidden mdDown>
                <Divider absolute orientation="vertical" />
              </Hidden>
              <Box p={4} flex={1}>
                <Grid container spacing={0}>
                  <Grid
                    xs={12}
                    sm={5}
                    item
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Box>
                      <AccountBalanceChartWrapper data={assetsBalance} />
                    </Box>
                  </Grid>
                  <Grid xs={12} sm={7} item display="flex" alignItems="center">
                    <List disablePadding sx={{ width: '100%' }}>
                      {assetsSlice.map((asset, i) => {
                        return (
                          <ListItem disableGutters key={i}>
                            {category === 'crypto' && (
                              <ListItemAvatar
                                sx={{
                                  minWidth: '46px',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                <Icon
                                  name={asset.symbol.toLowerCase()}
                                  size={25}
                                />
                              </ListItemAvatar>
                            )}
                            <ListItemText
                              primary={asset.symbol}
                              primaryTypographyProps={{
                                variant: 'h5',
                                noWrap: true
                              }}
                              secondary={asset.name}
                              secondaryTypographyProps={{
                                variant: 'subtitle2',
                                noWrap: true
                              }}
                            />
                            <Box>
                              <Typography align="right" variant="h4" noWrap>
                                {percentages[i]}%
                              </Typography>
                              {category !== '' && (
                                <Typography
                                  align="right"
                                  variant="subtitle2"
                                  noWrap
                                >
                                  {asset.differenceInPercents >= 0 ? (
                                    <Text color="success">
                                      {roundNumber(asset.differenceInPercents)}%
                                    </Text>
                                  ) : (
                                    <Text color="error">
                                      {roundNumber(asset.differenceInPercents)}%
                                    </Text>
                                  )}
                                </Typography>
                              )}
                            </Box>
                          </ListItem>
                        );
                      })}
                    </List>
                  </Grid>
                </Grid>
              </Box>
            </>
          )}
        </Grid>
      </Grid>
    </Card>
  );
}

export default AccountBalance;
