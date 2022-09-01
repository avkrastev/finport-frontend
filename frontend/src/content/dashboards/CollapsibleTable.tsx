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
import Icon from 'react-crypto-icons';
import { formatAmountAndCurrency, roundNumber } from 'src/utils/functions';
import Text from 'src/components/Text';
import { getAssets } from 'src/utils/api/assetsApiFunction';
import { format } from 'date-fns';
import { transactionTypes } from 'src/constants/common';
import { useTheme } from '@mui/material';

function Row(props: { row: any }) {
  const { row } = props;
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [historyData, setHistoryData] = React.useState([]);

  const handleShowHistory = async (assetId) => {
    setOpen(!open);
    if (!open) {
      const params = new URLSearchParams({
        category: 'crypto',
        asset_id: assetId
      });

      const response = await getAssets(params.toString());
      if (response.status === 200) {
        setHistoryData(response.data.assets);
      }
    }
  };

  return (
    <React.Fragment>
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
            <Icon name={row.symbol.toLowerCase()} size={20} /> &nbsp; &nbsp;
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
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => handleShowHistory(row.assetId)}
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
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Price per asset</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Total cost ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {historyData.map((historyRow) => (
                    <TableRow key={historyRow.id}>
                      <TableCell component="th" scope="row">
                        {format(new Date(historyRow.date), 'dd MMM yyyy HH:ss')}
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          noWrap
                          color={
                            historyRow.type === 1 || historyRow.type === 3
                              ? theme.palette.error.main
                              : theme.palette.primary.main
                          }
                          gutterBottom
                        >
                          {
                            transactionTypes.find(
                              (type) => type.value === historyRow.type
                            )?.label
                          }
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {historyRow.quantity !== 0 && historyRow.price !== 0 ? (
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            noWrap
                          >
                            {formatAmountAndCurrency(
                              historyRow.price_usd /
                                Math.abs(historyRow.quantity),
                              'USD'
                            )}
                          </Typography>
                        ) : (
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            noWrap
                          >
                            N/A
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">{historyRow.quantity}</TableCell>
                      <TableCell align="right">
                        {formatAmountAndCurrency(historyRow.price_usd, 'USD')}
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

export default function CollapsibleTable({ crypto }) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell>Coin</TableCell>
            <TableCell align="right">Current Price</TableCell>
            <TableCell align="right">Average Net Cost</TableCell>
            <TableCell align="right">Holdings</TableCell>
            <TableCell align="right">P&amp;L</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {crypto.map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
