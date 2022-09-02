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
import AccountBalanceChart from './AccountBalanceChart';
import Text from 'src/components/Text';
import { formatAmountAndCurrency, roundNumber } from 'src/utils/functions';
import Icon from 'react-crypto-icons';

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

function AccountBalance({ crypto, asset }) {
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
  for (let coin of crypto.stats) {
    const percent = (coin.holdingValue / crypto.sums.holdingValue) * 100;
    percentages.push(parseFloat(percent.toFixed(2)));
    names.push(coin.name);
  }

  const cryptoBalance = {
    datasets: [
      {
        data: percentages,
        backgroundColor: colors
      }
    ],
    labels: names
  };
  console.log(crypto);
  return (
    <Card>
      <Grid spacing={0} container>
        <Grid item xs={12} md={5}>
          <Box p={4}>
            <Typography sx={{ pb: 3 }} variant="h4">
              Account Balance / Total Invested
            </Typography>
            <Box>
              <Typography variant="h1" gutterBottom>
                {formatAmountAndCurrency(crypto?.sums?.holdingValue, 'USD')}
                &nbsp;/&nbsp;
                {formatAmountAndCurrency(crypto?.sums?.totalSum, 'USD')}
              </Typography>
              {crypto?.sums?.sumsInDifferentCurrencies?.map((item) => {
                return (
                  <Typography
                    sx={{mb: 1}}
                    key={item.currency}
                    variant="h4"
                    fontWeight="normal"
                    color="text.secondary"
                  >
                    {formatAmountAndCurrency(item.holdingAmount, item.currency)}
                    &nbsp;/&nbsp;
                    {formatAmountAndCurrency(item.totalAmount, item.currency)}
                  </Typography>
                );
              })}

              {asset === 'crypto' && (
                <Typography
                  variant="h4"
                  fontWeight="normal"
                  color="text.secondary"
                >
                  {crypto?.sums?.inBitcoin} BTC
                </Typography>
              )}
              <Box display="flex" sx={{ py: 4 }} alignItems="center">
                {crypto?.sums?.difference > 0 ? (
                  <AvatarSuccess sx={{ mr: 2 }} variant="rounded">
                    <TrendingUp fontSize="large" />
                  </AvatarSuccess>
                ) : (
                  <AvatarFail sx={{ mr: 2 }} variant="rounded">
                    <TrendingDown fontSize="large" />
                  </AvatarFail>
                )}
                <Box>
                  <Typography variant="h4">
                    {formatAmountAndCurrency(crypto?.sums?.difference, 'USD')}
                  </Typography>
                  <Typography variant="subtitle2" noWrap align="right">
                    {roundNumber(crypto?.sums?.differenceInPercents)} %
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid
          sx={{ position: 'relative' }}
          display="flex"
          alignItems="center"
          item
          xs={12}
          md={7}
        >
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
                  <AccountBalanceChartWrapper data={cryptoBalance} />
                </Box>
              </Grid>
              <Grid xs={12} sm={7} item display="flex" alignItems="center">
                <List disablePadding sx={{ width: '100%' }}>
                  {crypto.stats.slice(0, 5).map((coin, i) => {
                    return (
                      <ListItem disableGutters key={i}>
                        {asset === 'crypto' && (
                          <ListItemAvatar
                            sx={{
                              minWidth: '46px',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <Icon name={coin.symbol.toLowerCase()} size={25} />
                          </ListItemAvatar>
                        )}
                        <ListItemText
                          primary={coin.symbol}
                          primaryTypographyProps={{
                            variant: 'h5',
                            noWrap: true
                          }}
                          secondary={coin.name}
                          secondaryTypographyProps={{
                            variant: 'subtitle2',
                            noWrap: true
                          }}
                        />
                        <Box>
                          <Typography align="right" variant="h4" noWrap>
                            {percentages[i]}%
                          </Typography>
                          <Typography align="right" variant="subtitle2" noWrap>
                            {coin.differenceInPercents >= 0 ? (
                              <Text color="success">
                                {roundNumber(coin.differenceInPercents)}%
                              </Text>
                            ) : (
                              <Text color="error">
                                {roundNumber(coin.differenceInPercents)}%
                              </Text>
                            )}
                          </Typography>
                        </Box>
                      </ListItem>
                    );
                  })}
                </List>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
}

export default AccountBalance;
