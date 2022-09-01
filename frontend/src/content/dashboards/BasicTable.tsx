import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { formatAmountAndCurrency, roundNumber } from 'src/utils/functions';
import Icon from 'react-crypto-icons';
import { Typography } from '@mui/material';
import Text from 'src/components/Text';

export default function BasicTable({ crypto }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Coin</TableCell>
            <TableCell align="right">Current Price</TableCell>
            <TableCell align="right">Average Net Cost</TableCell>
            <TableCell align="right">Holdings</TableCell>
            <TableCell align="right">P&amp;L</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {crypto?.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                  }}
                >
                  <Icon name={row.symbol.toLowerCase()} size={20} /> &nbsp;
                  &nbsp;
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    color="text.primary"
                    noWrap
                  >
                    {row.name}
                  </Typography>
                  &nbsp;&nbsp;
                  <Typography variant="body1" color="text.secondary" noWrap>
                    {row.symbol}
                  </Typography>
                </div>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body1" color="text.primary" noWrap>
                  {formatAmountAndCurrency(row.currentPrice, 'USD')}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body1" color="text.primary" noWrap>
                  {formatAmountAndCurrency(row.averageNetCost, 'USD')}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="text.primary"
                  noWrap
                >
                  {formatAmountAndCurrency(row.holdingValue, 'USD')}
                </Typography>
                <Typography variant="body2" noWrap gutterBottom>
                  {row.holdingQuantity} {row.symbol}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="text.primary"
                  noWrap
                >
                  {formatAmountAndCurrency(row.difference, 'USD')}
                </Typography>
                <Typography variant="body2" noWrap gutterBottom>
                  {row.differenceInPercents >= 0 ? (
                    <Text color="success">
                      {roundNumber(row.differenceInPercents)}%
                    </Text>
                  ) : (
                    <Text color="error">
                      {roundNumber(row.differenceInPercents)}%
                    </Text>
                  )}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
