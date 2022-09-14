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
import { format } from 'date-fns';
import { transactionTypes } from 'src/constants/common';
import { Tooltip, useTheme } from '@mui/material';
import CollapsibleTableSkeleton from './CollapsibleTableSkeleton';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import ConfirmDialog from '../applications/Transactions/ConfirmDialog';
import {
  changeTransactionStatus,
  deleteTransaction,
  fetchFilteredTransactions,
  selectFilteredTransactions
} from '../applications/Transactions/transactionSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'src/app/store';
import TransactionModal from 'src/components/TransactionModal';
import { changeCryptoStatus } from './Crypto/cryptoSlice';

function Row(props: { row: any; category: string }) {
  const dispatch: AppDispatch = useDispatch();
  const historyData = useSelector(selectFilteredTransactions);
  const { row, category } = props;
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [openTransactionModal, setOpenTransactionModal] = React.useState(false);
  const [selectedTransaction, setSelectedTransaction] = React.useState({});
  const [openConfirmModal, setOpenConfirmModal] = React.useState(false);
  const [clickedTransactionId, setClickedTransactionId] = React.useState(null);

  const handleCloseConfirmModal = () => setOpenConfirmModal(false);

  const handleShowHistory = async (row) => {
    setOpen(!open);
    if (!open) {
      let params;
      switch (category) {
        case 'crypto':
          params = new URLSearchParams({
            category,
            asset_id: row.assetId
          });
          break;
        case 'stocks':
        case 'etf':
          params = new URLSearchParams({
            category,
            symbol: row.symbol
          });
          break;
        case 'commodities':
        case 'misc':
        case 'p2p':
          params = new URLSearchParams({
            category,
            name: row.name
          });
          break;
        default:
          params = '';
      }

      dispatch(fetchFilteredTransactions(params.toString()));
    }
  };

  const handleCloseTransactionModal = () => {
    setOpenTransactionModal(false);
  };

  const openEditModal = (row) => {
    setSelectedTransaction({ ...row });
    setOpenTransactionModal(true);
  };

  const openDeleteModal = (id) => {
    setClickedTransactionId(id);
    setOpenConfirmModal(true);
  };

  const handleDeleteTransaction = () => {
    try {
      if (clickedTransactionId)
        dispatch(deleteTransaction(clickedTransactionId))
          .unwrap()
          .then(() => {
            dispatch(changeTransactionStatus('idle'));
            dispatch(changeCryptoStatus('idle'));
          });
      handleCloseConfirmModal();
    } catch (err) {
      console.error('Failed to delete the transaction', err);
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
            {category === 'crypto' && (
              <Box sx={{ mr: 1, lineHeight: 'normal' }}>
                <Icon name={row.symbol.toLowerCase()} size={20} />
              </Box>
            )}
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
        {category !== 'p2p' && (
          <TableCell align="right">
            <Typography variant="body1" color="text.primary" noWrap>
              {formatAmountAndCurrency(row.currentPrice, 'USD')}
            </Typography>
          </TableCell>
        )}
        <TableCell align="right">
          <Typography variant="body1" color="text.primary" noWrap>
            {category !== 'p2p'
              ? formatAmountAndCurrency(row.averageNetCost, 'USD')
              : formatAmountAndCurrency(row.totalInvested, 'EUR')}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <Typography
            variant="body1"
            fontWeight="bold"
            color="text.primary"
            noWrap
          >
            {category !== 'p2p'
              ? formatAmountAndCurrency(row.holdingValue, 'USD')
              : formatAmountAndCurrency(row.totalSumInOriginalCurrency, 'EUR')}
          </Typography>
          {category !== 'p2p' && (
            <Typography variant="body2" noWrap gutterBottom>
              {row.holdingQuantity} {row.symbol}
            </Typography>
          )}
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
        <TableCell align="right">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => handleShowHistory(row)}
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
                    {category !== 'p2p' && (
                      <TableCell align="right">Price per asset</TableCell>
                    )}
                    {category !== 'p2p' && (
                      <TableCell align="right">Quantity</TableCell>
                    )}
                    <TableCell align="right">Total cost</TableCell>
                    <TableCell align="right">Actions</TableCell>
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
                      {category !== 'p2p' && (
                        <TableCell align="right">
                          {historyRow.quantity !== 0 &&
                          historyRow.price !== 0 ? (
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
                      )}
                      {category !== 'p2p' && (
                        <TableCell align="right">
                          {historyRow.quantity}
                        </TableCell>
                      )}
                      <TableCell align="right">
                        {category !== 'p2p'
                          ? formatAmountAndCurrency(historyRow.price_usd, 'USD')
                          : formatAmountAndCurrency(
                              historyRow.price,
                              historyRow.currency
                            )}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit Transaction" arrow>
                          <IconButton
                            onClick={() => openEditModal(historyRow)}
                            sx={{
                              '&:hover': {
                                background: theme.colors.primary.lighter
                              },
                              color: theme.palette.primary.main
                            }}
                            color="inherit"
                            size="small"
                          >
                            <EditTwoToneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Transaction" arrow>
                          <IconButton
                            onClick={() => openDeleteModal(historyRow.id)}
                            sx={{
                              '&:hover': {
                                background: theme.colors.error.lighter
                              },
                              color: theme.palette.error.main
                            }}
                            color="inherit"
                            size="small"
                          >
                            <DeleteTwoToneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <TransactionModal
        transaction={selectedTransaction}
        open={openTransactionModal}
        close={handleCloseTransactionModal}
        tabs={true}
      />
      <ConfirmDialog
        click={handleDeleteTransaction}
        open={openConfirmModal}
        close={handleCloseConfirmModal}
        title="Are you sure you want to delete this transaction?"
        transactionId={clickedTransactionId}
      />
    </React.Fragment>
  );
}

export default function CollapsibleTable({ assets, category, loading }) {
  if (loading !== 'succeeded') {
    return <CollapsibleTableSkeleton />;
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell>Asset</TableCell>
            {category !== 'p2p' && (
              <TableCell align="right">Current Price</TableCell>
            )}
            <TableCell align="right">
              {category !== 'p2p' ? 'Average Net Cost' : 'Total Invested'}
            </TableCell>
            <TableCell align="right">Holdings</TableCell>
            <TableCell align="right">P&amp;L</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {assets.map((row) => (
            <Row key={row.name} row={row} category={category} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
