import { FC, ChangeEvent, useState, useContext } from 'react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
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
  CardHeader
} from '@mui/material';

import { Asset } from 'src/models/assets';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import BulkActions from './BulkActions';
import { AuthContext } from '../../../utils/context/authContext';
import { transactionTypes } from '../../../constants/common';
import { formatAmountAndCurrency } from '../../../utils/functions';

interface RecentOrdersTableProps {
  assets: Asset[];
  openDeleteModal: any;
  openEditModal: any;
}

interface Filters {
  category?: string;
}

const applyFilters = (assets: Asset[], filters: Filters): Asset[] => {
  return assets.filter((asset) => {
    let matches = true;

    if (filters.category && asset.category !== filters.category) {
      matches = false;
    }

    return matches;
  });
};

const applyPagination = (
  assets: Asset[],
  page: number,
  limit: number
): Asset[] => {
  return assets.slice(page * limit, page * limit + limit);
};

const RecentOrdersTable: FC<RecentOrdersTableProps> = ({
  assets,
  openDeleteModal,
  openEditModal
}) => {
  const { authUserData } = useContext(AuthContext);

  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);

  const selectedBulkActions = selectedAssets.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({
    category: null
  });

  const categoryOptions = [
    { value: 'All', key: 'all' },
    ...authUserData.categories.filter((category: any) => category.show === true)
  ];

  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>): void => {
    let value = null;

    if (e.target.value !== 'all') {
      value = e.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      category: value
    }));
  };

  const handleSelectAllAssets = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedAssets(
      event.target.checked ? assets.map((asset) => asset.id) : []
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

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredAssets = applyFilters(assets, filters);
  const paginatedAssets = applyPagination(filteredAssets, page, limit);
  const selectedSomeAssets =
    selectedAssets.length > 0 && selectedAssets.length < assets.length;
  const selectedAllAssets = selectedAssets.length === assets.length;
  const theme = useTheme();

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
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.category || 'all'}
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
          title="Recent Transactions"
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
              <TableCell>Transaction Details</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Price per asset</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAssets.map((asset) => {
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
                          width: '25em'
                        }}
                      >
                        {asset.name}{' '}
                        {asset.symbol ? '(' + asset.symbol + ')' : ''}
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
                      {
                        transactionTypes.find((type) => type.key === asset.type)
                          ?.label
                      }
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" color="text.secondary" noWrap>
                      {
                        authUserData.categories.find(
                          (category) => category.key === asset.category
                        )?.value
                      }
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {asset.quantity !== 0 && asset.price !== 0 ? (
                      <Typography variant="body1" color="text.secondary" noWrap>
                        {formatAmountAndCurrency(
                          asset.price_usd / Math.abs(asset.quantity),
                          'USD'
                        )}
                      </Typography>
                    ) : (
                      <Typography variant="body1" color="text.secondary" noWrap>
                        N/A
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
                          N/A
                        </Typography>
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {asset.price === 0 ? (
                      <Typography variant="body1" color="text.secondary" noWrap>
                        N/A
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
                          {formatAmountAndCurrency(asset.price, asset.currency)}
                        </Typography>

                        <Typography
                          variant="body1"
                          color="text.secondary"
                          noWrap
                        >
                          {formatAmountAndCurrency(asset.price_usd, 'USD')}
                        </Typography>
                      </>
                    )}
                  </TableCell>

                  <TableCell align="right">
                    <Tooltip title="Edit Transaction" arrow>
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
                    <Tooltip title="Delete Transaction" arrow>
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
          count={filteredAssets.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
  );
};

RecentOrdersTable.propTypes = {
  assets: PropTypes.array.isRequired
};

RecentOrdersTable.defaultProps = {
  assets: []
};

export default RecentOrdersTable;
