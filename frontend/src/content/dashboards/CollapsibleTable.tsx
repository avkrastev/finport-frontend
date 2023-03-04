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
import {
  formatAmountAndCurrency,
  getCryptoIcon,
  roundNumber
} from 'src/utils/functions';
import Text from 'src/components/Text';
import { format } from 'date-fns';
import { transactionTypes } from 'src/constants/common';
import { Tooltip, useTheme } from '@mui/material';
import CollapsibleTableSkeleton from './CollapsibleTableSkeleton';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import ConfirmDialog from '../applications/Transactions/ConfirmDialog';
import {
  fetchFilteredTransactions,
  getSelectedTransaction,
  selectFilteredTransactions
} from '../applications/Transactions/transactionSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'src/app/store';
import { useTranslation, Trans } from 'react-i18next';
import { AuthContext } from 'src/utils/context/authContext';

function Row(props: {
  row: any;
  category: string;
  identifier: string;
  openedRows: any;
  handleShowHistory: any;
  openEditModal: any;
  openDeleteModal: any;
  currency: string;
}) {
  const {
    row,
    category,
    identifier,
    openedRows,
    handleShowHistory,
    openEditModal,
    openDeleteModal,
    currency
  } = props;
  const theme = useTheme();

  const open = Object.keys(openedRows).includes(row[identifier]);
  const quantity = roundNumber(row.holdingQuantity);
  const mustExchange = row.currency !== currency;

  return (
    <React.Fragment>
      <TableRow
        key={row.key}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell component="th" scope="row">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              flexWrap: 'wrap'
            }}
          >
            {category === 'crypto' && (
              <Box sx={{ mr: 1, lineHeight: 'normal' }}>
                <img
                  src={getCryptoIcon(row.symbol.toLowerCase())}
                  width="25"
                  height="25"
                />
              </Box>
            )}
            <Typography
              variant="body1"
              fontWeight="bold"
              color="text.primary"
              noWrap
            >
              {category !== 'commodities' ? (
                row.name
              ) : (
                <Trans i18nKey={row.name}>{row.name}</Trans>
              )}
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
              {formatAmountAndCurrency(
                row.currentPrice,
                row.currency,
                mustExchange
              )}
            </Typography>
          </TableCell>
        )}
        <TableCell align="right">
          <Typography variant="body1" color="text.primary" noWrap>
            {category !== 'p2p'
              ? formatAmountAndCurrency(
                  row.averageNetCost,
                  row.currency,
                  mustExchange
                )
              : formatAmountAndCurrency(
                  row.totalInvested,
                  row.currency,
                  mustExchange
                )}
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
              ? formatAmountAndCurrency(
                  row.holdingValue,
                  row.currency,
                  mustExchange
                )
              : formatAmountAndCurrency(
                  row.totalSumInOriginalCurrency,
                  row.currency,
                  mustExchange
                )}
          </Typography>
          {category !== 'p2p' && category !== 'misc' && (
            <Typography variant="body2" noWrap gutterBottom>
              {category !== 'commodities' ? (
                `${row.holdingQuantity} ${row.symbol}`
              ) : (
                <Trans i18nKey={'quantityToz'} quantity={quantity}>
                  {{ quantity }} oz t.
                </Trans>
              )}
            </Typography>
          )}
          {category === 'misc' && (
            <Typography variant="body2" noWrap gutterBottom>
              <Trans i18nKey={'no.'} quantity={quantity}>
                {{ quantity }} no.
              </Trans>
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
            {formatAmountAndCurrency(
              row.difference,
              row.currency,
              mustExchange
            )}
          </Typography>
          {/* {row.currency !== 'USD' && (
            <Typography variant="subtitle1">
              ({formatAmountAndCurrency(row.differenceInUSD, 'USD', false)})
            </Typography>
          )} */}
          {category !== 'misc' && (
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
          )}
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
                <Trans i18nKey={'History'}>History</Trans>
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Trans i18nKey={'Date'}>Date</Trans>
                    </TableCell>
                    <TableCell>
                      <Trans i18nKey={'Type'}>Type</Trans>
                    </TableCell>
                    {category !== 'p2p' && (
                      <TableCell align="right">
                        <Trans i18nKey={'Price per asset'}>
                          Price per asset
                        </Trans>
                      </TableCell>
                    )}
                    {category !== 'p2p' && (
                      <TableCell align="right">
                        <Trans i18nKey={'Quantity'}>Quantity</Trans>
                      </TableCell>
                    )}
                    <TableCell align="right">
                      <Trans i18nKey={'Total cost'}>Total cost</Trans>
                    </TableCell>
                    <TableCell align="right">
                      <Trans i18nKey={'Actions'}>Actions</Trans>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {openedRows[row[identifier]]?.assets?.map((historyRow) => {
                    const typeOfTransaction = transactionTypes.find(
                      (type) => type.key === historyRow.type
                    )?.value;
                    return (
                      <TableRow key={historyRow.id}>
                        <TableCell component="th" scope="row">
                          {format(
                            new Date(historyRow.date),
                            'dd MMM yyyy HH:mm'
                          )}
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
                            <Trans i18nKey={typeOfTransaction}>
                              {typeOfTransaction}
                            </Trans>
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
                                  row.currency,
                                  true
                                )}
                              </Typography>
                            ) : (
                              <Typography
                                variant="body1"
                                color="text.secondary"
                                noWrap
                              >
                                <Trans i18nKey={'N/A'}>N/A</Trans>
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
                          {formatAmountAndCurrency(
                            historyRow.price_usd,
                            historyRow.currency
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip
                            title={
                              <Trans i18nKey={'Edit Transaction'}>
                                Edit Transaction
                              </Trans>
                            }
                            arrow
                          >
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
                          <Tooltip
                            title={
                              <Trans i18nKey={'Delete Transaction'}>
                                Delete Transaction
                              </Trans>
                            }
                            arrow
                          >
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
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function CollapsibleTable({
  assets,
  category,
  loading,
  selectedTransaction,
  openModal,
  clearOpenedRow
}) {
  const { authUserData } = React.useContext(AuthContext);
  const dispatch: AppDispatch = useDispatch();
  const historyData = useSelector(selectFilteredTransactions);
  const [openedRows, setOpenedRows] = React.useState({});
  const [assetId, setAssetId] = React.useState(null);
  const [identifier, setIdentifier] = React.useState(null);
  const lastSelectedTransaction = useSelector(getSelectedTransaction);
  const [openConfirmModal, setOpenConfirmModal] = React.useState(false);
  const [clickedTransactionId, setClickedTransactionId] = React.useState(null);
  const [selectedRow, setSelectedRow] = React.useState(null);

  const handleCloseConfirmModal = () => setOpenConfirmModal(false);

  const { t } = useTranslation();

  React.useEffect(() => {
    if (clearOpenedRow) {
      setOpenedRows({});
    }
  }, [clearOpenedRow]); // eslint-disable-line

  React.useEffect(() => {
    async function fetchHistory() {
      await showHistory(selectedRow);
    }

    if (
      lastSelectedTransaction &&
      lastSelectedTransaction.name === selectedRow?.name
    ) {
      fetchHistory();
    }
  }, [lastSelectedTransaction, selectedRow?.name]); // eslint-disable-line

  const handleShowHistory = async (row) => {
    if (Object.keys(openedRows).includes(row[identifier])) {
      const openedRowsCopy = { ...openedRows };
      delete openedRowsCopy[row[identifier]];
      setOpenedRows(openedRowsCopy);
    } else {
      setSelectedRow(row);
      await showHistory(row);
    }
  };

  const openEditModal = (row) => {
    selectedTransaction({ ...row });
    openModal(true);
  };

  const openDeleteModal = (id) => {
    setClickedTransactionId(id);
    setOpenConfirmModal(true);
  };

  React.useEffect(() => {
    if (assetId) {
      setOpenedRows({
        ...openedRows,
        [assetId]: historyData
      });
    }
  }, [historyData]); // eslint-disable-line

  if (loading !== 'succeeded') {
    return <CollapsibleTableSkeleton />;
  }

  const showHistory = async (row) => {
    let params;
    switch (category) {
      case 'crypto':
        params = new URLSearchParams({
          category,
          asset_id: row.assetId
        });
        setAssetId(row.assetId);
        setIdentifier('assetId');
        break;
      case 'stocks':
      case 'etf':
        params = new URLSearchParams({
          category,
          symbol: row.symbol
        });
        setAssetId(row.symbol);
        setIdentifier('symbol');
        break;
      case 'commodities':
      case 'misc':
      case 'p2p':
        params = new URLSearchParams({
          category,
          name: row.name
        });
        setAssetId(row.name);
        setIdentifier('name');
        break;
      default:
        params = '';
    }

    dispatch(fetchFilteredTransactions(params.toString()));
  };

  const currency = authUserData.currency;

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell>{t('Asset')}</TableCell>
            {category !== 'p2p' && (
              <TableCell align="right">{t('Current Price')}</TableCell>
            )}
            <TableCell align="right">
              {category !== 'p2p' ? t('Average Net Cost') : t('Total Invested')}
            </TableCell>
            <TableCell align="right">{t('Holdings')}</TableCell>
            <TableCell align="right">{t('P&L')}</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {assets.map((row, i) => (
            <Row
              key={i}
              row={row}
              openedRows={openedRows}
              category={category}
              identifier={identifier}
              handleShowHistory={handleShowHistory}
              openEditModal={openEditModal}
              openDeleteModal={openDeleteModal}
              currency={currency}
            />
          ))}
        </TableBody>
      </Table>
      <ConfirmDialog
        open={openConfirmModal}
        close={handleCloseConfirmModal}
        title="Are you sure you want to delete this transaction?"
        transactionId={clickedTransactionId}
        category={category}
      />
    </TableContainer>
  );
}
