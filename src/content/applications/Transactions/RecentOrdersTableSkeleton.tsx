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
  useTheme,
  CardHeader,
  Skeleton
} from '@mui/material';

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { useTranslation } from 'react-i18next';

const RecentOrdersTableSkeleton = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader
        action={
          <Box width={150}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>{t('Category')}</InputLabel>
              <Select label="Category" disabled autoWidth></Select>
            </FormControl>
          </Box>
        }
        title={t('Recent Transactions')}
      />
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox color="primary" disabled />
              </TableCell>
              <TableCell>{t('Transaction Details')}</TableCell>
              <TableCell>{t('Category')}</TableCell>
              <TableCell align="right">{t('Price per asset')}</TableCell>
              <TableCell align="right">{t('Quantity')}</TableCell>
              <TableCell align="right">{t('Amount')}</TableCell>
              <TableCell align="right">{t('Actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array(5)
              .fill(0)
              .map((n, i) => {
                return (
                  <TableRow hover key={i}>
                    <TableCell padding="checkbox">
                      <Checkbox color="primary" disabled />
                    </TableCell>
                    <TableCell>
                      <Skeleton
                        variant="text"
                        width={250}
                        sx={{ fontSize: '1.5rem' }}
                      />
                      <Skeleton
                        variant="text"
                        width={150}
                        sx={{ fontSize: '0.7rem' }}
                      />
                      <Skeleton
                        variant="text"
                        width={100}
                        sx={{ fontSize: '0.7rem' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Skeleton
                        variant="text"
                        width={'100%'}
                        sx={{ fontSize: '1.5rem' }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton
                        variant="text"
                        width={'100%'}
                        sx={{ fontSize: '1.5rem' }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton
                        variant="text"
                        width={'100%'}
                        sx={{ fontSize: '1.5rem' }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton
                        variant="text"
                        width={'100%'}
                        sx={{ fontSize: '1.5rem' }}
                      />
                    </TableCell>

                    <TableCell align="right">
                      <Tooltip title={t('Edit Transaction')} arrow>
                        <IconButton
                          sx={{
                            color: '#aaa'
                          }}
                          color="inherit"
                          size="small"
                        >
                          <EditTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('Delete Transaction')} arrow>
                        <IconButton
                          sx={{
                            color: '#aaa'
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
          count={0}
          onPageChange={() => {}}
          onRowsPerPageChange={() => {}}
          page={0}
          rowsPerPage={5}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
  );
};

export default RecentOrdersTableSkeleton;
