import * as React from 'react';
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
import { Skeleton } from '@mui/material';

function Row() {
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
            <Skeleton variant="text" width={'100%'} sx={{ fontSize: '1rem' }} />
          </Typography>
        </TableCell>
        <TableCell align="right">
          <Skeleton variant="text" width={'100%'} sx={{ fontSize: '1rem' }} />
        </TableCell>
        <TableCell align="right">
          <Typography variant="body1" color="text.primary" noWrap>
            <Skeleton variant="text" width={'100%'} sx={{ fontSize: '1rem' }} />
          </Typography>
        </TableCell>
        <TableCell align="right">
          <IconButton aria-label="expand row" size="small">
            <KeyboardArrowDownIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow></TableRow>
    </React.Fragment>
  );
}

export default function ReportsTableSkeleton() {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table" size="small">
        <TableHead>
          <TableRow>
            <TableCell>Year</TableCell>
            <TableCell align="right">Number of Transactions</TableCell>
            <TableCell align="right">Total Spent ($)</TableCell>
            <TableCell align="right" />
          </TableRow>
        </TableHead>
        <TableBody>
          {Array(12)
            .fill(0)
            .map((row, i) => (
              <Row key={i} />
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
