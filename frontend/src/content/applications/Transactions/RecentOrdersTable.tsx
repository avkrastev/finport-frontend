import { FC, ChangeEvent, useState, useContext } from 'react';
import { format } from 'date-fns';
import numeral from 'numeral';
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

interface RecentOrdersTableProps {
  assets: Asset[];
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

const RecentOrdersTable: FC<RecentOrdersTableProps> = ({ assets }) => {
  const { authUserData } = useContext(AuthContext);

  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);

  const selectedBulkActions = selectedAssets.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({
    category: null
  });

  const categoryOptions = [
    { name: 'All', alias: 'all' },
    ...authUserData.categories.filter((category: any) => category.show === true)
  ];

  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>): void => {
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
          <BulkActions />
        </Box>
      )}
      {!selectedBulkActions && (
        <CardHeader
          action={
            <Box width={150}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.category || 'all'}
                  onChange={handleStatusChange}
                  label="Category"
                  autoWidth
                >
                  {categoryOptions.map((categoryOption) => (
                    <MenuItem
                      key={categoryOption.alias}
                      value={categoryOption.alias}
                    >
                      {categoryOption.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          }
          title="Recent Orders"
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
              <TableCell>Order Details</TableCell>
              {/* <TableCell>Symbol</TableCell> */}
              <TableCell>Category</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Price</TableCell>
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
                      noWrap
                    >
                      {asset.name}{' '}
                      {asset.symbol ? '(' + asset.symbol + ')' : ''}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {/* {format(asset.date, 'MMMM dd yyyy')} */}
                      {asset.date}
                    </Typography>
                  </TableCell>
                  {/* <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {asset.name}
                    </Typography>
                  </TableCell> */}
                  <TableCell>{asset.category}</TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {asset.quantity}
                    </Typography>
                    {/* <Typography variant="body2" color="text.secondary" noWrap>
                      {asset.name}
                    </Typography> */}
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {numeral(asset.price).format(`${asset.currency}0,0.00`)}{' '}
                      &nbsp;
                      {asset.currency}
                    </Typography>
                    {/* <Typography variant="body2" color="text.secondary" noWrap>
                      {numeral(asset.price).format(
                        `${asset.currency}0,0.00`
                      )}
                    </Typography> */}
                  </TableCell>

                  <TableCell align="right">
                    <Tooltip title="Edit Order" arrow>
                      <IconButton
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
                    <Tooltip title="Delete Order" arrow>
                      <IconButton
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
