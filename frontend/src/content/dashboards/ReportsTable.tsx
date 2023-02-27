import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { monthNames, transactionTypes } from 'src/constants/common';
import { formatAmountAndCurrency } from 'src/utils/functions';
import { format } from 'date-fns';
import { useTheme } from '@mui/material';

function Row(props) {
  const { history, count, total, month, year } = props;
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell component="th" scope="row">
          <Typography
            variant="body1"
            fontWeight="bold"
            color="text.primary"
            noWrap
          >
            {month ? monthNames[month - 1] : year}
          </Typography>
        </TableCell>
        <TableCell align="right">{count}</TableCell>
        <TableCell align="right">
          <Typography variant="body1" color="text.primary" noWrap>
            {formatAmountAndCurrency(total)}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell component="th" scope="row">
                        {format(new Date(row.date), 'dd MMM yyyy HH:mm')}
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          noWrap
                          color={
                            row.type === 1 || row.type === 3
                              ? theme.palette.error.main
                              : theme.palette.primary.main
                          }
                          gutterBottom
                        >
                          {
                            transactionTypes.find(
                              (type) => type.key === row.type
                            )?.label
                          }
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{row.quantity}</TableCell>
                      <TableCell align="right">
                        {formatAmountAndCurrency(row.price)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function ReportsTable(props) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table" size="small">
        <TableHead>
          <TableRow>
            <TableCell>Year {props.year}</TableCell>
            <TableCell align="right">Number of Transactions</TableCell>
            <TableCell align="right">Total Spent ($)</TableCell>
            <TableCell align="right" />
          </TableRow>
        </TableHead>
        <TableBody>
          {props.months &&
            props.months.map((row, i) => (
              <Row
                key={i}
                month={row._id.month}
                year={row._id.year}
                count={row.count}
                total={row.totalPriceInUSD}
                history={row.transactions}
              />
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
