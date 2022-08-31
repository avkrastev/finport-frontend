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

export default function BasicTable({ crypto }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Coin</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Holdings</TableCell>
            <TableCell align="right">P&amp;L</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {crypto.map((row) => (
            <TableRow
              key={row._id.name}
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
                  <Icon name={row._id.symbol.toLowerCase()} size={20} /> &nbsp;
                  &nbsp;
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    color="text.primary"
                    noWrap
                  >
                    {row._id.name}
                  </Typography>
                  &nbsp;&nbsp;
                  <Typography variant="body1" color="text.secondary" noWrap>
                    {row._id.symbol}
                  </Typography>
                </div>
              </TableCell>
              <TableCell align="right">
                {formatAmountAndCurrency(row.totalSum, 'USD')}
              </TableCell>
              <TableCell align="right">
                {roundNumber(row.totalQuantity).toFixed(2)}
              </TableCell>
              <TableCell align="right">Soon</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
