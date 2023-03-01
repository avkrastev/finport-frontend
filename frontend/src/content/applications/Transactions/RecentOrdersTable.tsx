import { FC, ChangeEvent, useState, useContext } from 'react';
import { format } from 'date-fns';
import {
  Tooltip,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Select,
  MenuItem,
  Typography,
  useTheme,
  CardHeader,
  TableSortLabel
} from '@mui/material';

import { visuallyHidden } from '@mui/utils';

import { Asset } from 'src/models/assets';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import BulkActions from './BulkActions';
import { AuthContext } from '../../../utils/context/authContext';
import { transactionTypes } from '../../../constants/common';
import {
  deserializeFilters,
  formatAmountAndCurrency,
  serializeFilters,
  serializeSort
} from '../../../utils/functions';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTransactions,
  getTransactionAddStatus,
  getTransactionDeleteStatus,
  getTransactionsStatus,
  getTransactionUpdateStatus
} from './transactionSlice';
import { AppDispatch } from 'src/app/store';
import useUpdateEffect from 'src/utils/hooks/update-effect-hook';
import RecentOrdersTableSkeleton from './RecentOrdersTableSkeleton';

interface Assets {
  assets: Asset[];
  records: number;
  page: number;
  limit: number;
  filter: string;
  sort: string;
}

interface RecentOrdersTableProps {
  assets: Assets;
  openDeleteModal: any;
  openEditModal: any;
}

const RecentOrdersTable: FC<RecentOrdersTableProps> = ({
  assets,
  openDeleteModal,
  openEditModal
}) => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const transactionStatus = useSelector(getTransactionsStatus);
  const transactionAddStatus = useSelector(getTransactionAddStatus);
  const transactionUpdateStatus = useSelector(getTransactionUpdateStatus);
  const transactionDeleteStatus = useSelector(getTransactionDeleteStatus);

  const { authUserData } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const selectedBulkActions = selectedAssets.length > 0;

  const categoryOptions = [
    { value: t('All'), key: 'all' },
    ...authUserData.categories
      .filter((category: any) => category.show === true)
      .map((category) => ({ value: t(category.value), key: category.key }))
  ];

  useUpdateEffect(() => {
    const params = new URLSearchParams(location.search);

    dispatch(fetchTransactions(params.toString()));
  }, [location.search]);

  useUpdateEffect(() => {
    if (
      transactionAddStatus === 'succeeded' ||
      transactionUpdateStatus === 'succeeded' ||
      transactionDeleteStatus === 'succeeded'
    )
      dispatch(fetchTransactions(''));
  }, [transactionAddStatus, transactionUpdateStatus, transactionDeleteStatus]);

  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>): void => {
    let value = null;

    if (e.target.value !== 'all') {
      value = e.target.value;
    }

    const filters = [
      {
        columnField: 'category',
        value
      }
    ];

    let search = `?p=0&l=${assets.limit}`;

    if (value) {
      const serialized = serializeFilters(filters);
      search = `?p=0&l=${assets.limit}&f=${serialized}`;
    }

    navigate({
      pathname: location.pathname,
      search
    });
  };

  const handleSelectAllAssets = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedAssets(
      event.target.checked ? assets?.assets?.map((asset) => asset.id) : []
    );
  };

  const handleSelectOneCryptoOrder = (
    event: ChangeEvent<HTMLInputElement>,
    assetId: string
  ): void => {
    if (!selectedAssets.includes(assetId)) {
      setSelectedAssets((prevSelected) => [...prevSelected, assetId]);
    } else {
      setSelectedAssets((prevSelected) =>
        prevSelected.filter((id) => id !== assetId)
      );
    }
  };

  const handlePageChange = (event: any, newPage: number) => {
    let search = `?p=${newPage}&l=${assets.limit}`;
    if (assets.filter) {
      search = `?p=${newPage}&l=${assets.limit}&f=${assets.filter}`;
    }
    navigate({
      pathname: location.pathname,
      search
    });
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    let search = `?p=0&l=${parseInt(event.target.value)}`;
    if (assets.filter) {
      search = `?p=0&l=${parseInt(event.target.value)}&f=${assets.filter}`;
    }
    navigate({
      pathname: location.pathname,
      search
    });
  };

  const selectedSomeAssets =
    selectedAssets.length > 0 && selectedAssets.length < assets?.assets?.length;
  const selectedAllAssets = selectedAssets.length === assets?.assets?.length;

  const currentFilter = assets.filter
    ? deserializeFilters(assets.filter)?.category
    : 'all';

  const currentSortColumn = assets.sort ? assets.sort.split(':')[0] : 'date';
  const currentSortDirection = assets.sort ? assets.sort.split(':')[1] : 'desc';

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const onRequestSort = (event, property) => {
    const isAsc =
      currentSortColumn === property && currentSortDirection === 'asc';

    const sortBy = [
      {
        field: property,
        sort: isAsc ? 'desc' : 'asc'
      }
    ];

    const serializedSort = serializeSort(sortBy);

    let search = `?p=0&l=${assets.limit}&s=${serializedSort}`;
    if (assets.filter) {
      search = `?p=0&l=${assets.limit}&f=${assets.filter}&s=${serializedSort}`;
    }
    navigate({
      pathname: location.pathname,
      search
    });
  };

  if (transactionStatus !== 'succeeded') {
    return <RecentOrdersTableSkeleton />;
  }

  return (
    <Card>
      {selectedBulkActions && (
        <Box flex={1} p={2}>
          <BulkActions
            selectedIds={selectedAssets}
            cleanSelection={() => {
              setSelectedAssets([]);
            }}
          />
        </Box>
      )}
      {!selectedBulkActions && (
        <CardHeader
          action={
            <Box width={150}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>{t('Category')}</InputLabel>
                <Select
                  value={currentFilter}
                  onChange={handleCategoryChange}
                  label="Category"
                  autoWidth
                >
                  {categoryOptions.map((categoryOption) => (
                    <MenuItem
                      key={categoryOption.key}
                      value={categoryOption.key}
                    >
                      {categoryOption.value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          }
          title={t('Recent Transactions')}
        />
      )}
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectedAllAssets}
                  indeterminate={selectedSomeAssets}
                  onChange={handleSelectAllAssets}
                />
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={currentSortColumn === 'date'}
                  direction={
                    currentSortColumn === 'date' &&
                    currentSortDirection === 'desc'
                      ? 'desc'
                      : 'asc'
                  }
                  onClick={createSortHandler('date')}
                >
                  {t('Transaction Details')}
                  {currentSortColumn === 'date' ? (
                    <Box component="span" sx={visuallyHidden}>
                      {currentSortDirection === 'desc'
                        ? 'sorted descending'
                        : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
              <TableCell>{t('Category')}</TableCell>
              <TableCell align="right">{t('Price per asset')}</TableCell>
              <TableCell align="right">{t('Quantity')}</TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={currentSortColumn === 'price_usd'}
                  direction={
                    currentSortColumn === 'price_usd' &&
                    currentSortDirection === 'desc'
                      ? 'desc'
                      : 'asc'
                  }
                  onClick={createSortHandler('price_usd')}
                >
                  {t('Amount')}
                  {currentSortColumn === 'price_usd' ? (
                    <Box component="span" sx={visuallyHidden}>
                      {currentSortDirection === 'desc'
                        ? 'sorted descending'
                        : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">{t('Actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assets?.assets?.map((asset) => {
              const mustExchange = asset.currency !== authUserData.currency;
              const isCryptoOrderSelected = selectedAssets.includes(asset.id);
              return (
                <TableRow hover key={asset.id} selected={isCryptoOrderSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isCryptoOrderSelected}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleSelectOneCryptoOrder(event, asset.id)
                      }
                      value={isCryptoOrderSelected}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                    >
                      <p
                        title={
                          asset.symbol
                            ? asset.name + '(' + asset.symbol + ')'
                            : asset.name
                        }
                        style={{
                          padding: 0,
                          margin: 0,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          width: '20em'
                        }}
                      >
                        {asset.name}{' '}
                        {asset.category !== 'crypto' &&
                        asset.category !== 'stocks' &&
                        asset.symbol
                          ? '(' + asset.symbol + ')'
                          : ''}
                      </p>
                    </Typography>
                    <Typography variant="body1" color="text.secondary" noWrap>
                      {format(new Date(asset.date), 'MMMM dd yyyy')}
                    </Typography>
                    <Typography
                      variant="body2"
                      noWrap
                      color={
                        asset.type === 1 || asset.type === 3
                          ? theme.palette.error.main
                          : theme.palette.primary.main
                      }
                      gutterBottom
                    >
                      {t(
                        transactionTypes.find((type) => type.key === asset.type)
                          ?.value
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" color="text.secondary" noWrap>
                      {t(
                        authUserData.categories.find(
                          (category) => category.key === asset.category
                        )?.value
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {asset.quantity !== 0 && asset.price !== 0 ? (
                      <Typography variant="body1" color="text.secondary" noWrap>
                        {formatAmountAndCurrency(
                          asset.price_usd / Math.abs(asset.quantity)
                        )}
                      </Typography>
                    ) : (
                      <Typography variant="body1" color="text.secondary" noWrap>
                        {t('N/A')}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {asset.quantity !== 0 ? (
                        asset.quantity
                      ) : (
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          noWrap
                        >
                          {t('N/A')}
                        </Typography>
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {asset.price === 0 ? (
                      <Typography variant="body1" color="text.secondary" noWrap>
                        {t('N/A')}
                      </Typography>
                    ) : (
                      <>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color="text.primary"
                          gutterBottom
                          noWrap
                        >
                          {formatAmountAndCurrency(
                            asset.price,
                            asset.currency,
                            mustExchange
                          )}
                        </Typography>

                        <Typography
                          variant="body1"
                          color="text.secondary"
                          noWrap
                        >
                          {formatAmountAndCurrency(
                            asset.price_usd,
                            'USD',
                            false
                          )}
                        </Typography>
                      </>
                    )}
                  </TableCell>

                  <TableCell align="right">
                    <Tooltip title={t('Edit Transaction')} arrow>
                      <IconButton
                        onClick={() => openEditModal(asset.id)}
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
                    <Tooltip title={t('Delete Transaction')} arrow>
                      <IconButton
                        onClick={() => openDeleteModal(asset.id)}
                        sx={{
                          '&:hover': { background: theme.colors.error.lighter },
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
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={assets.records}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={assets.page}
          rowsPerPage={assets.limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
  );
};

RecentOrdersTable.defaultProps = {
  assets: { assets: [], page: 0, limit: 5, records: 0, filter: '', sort: '' }
};

export default RecentOrdersTable;
