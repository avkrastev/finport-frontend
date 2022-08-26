import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import ConfirmDialog from './ConfirmDialog';
import { AppDispatch } from 'src/app/store';
import { deleteTransactions } from './transactionSlice';

const ButtonError = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
     }
    `
);

function BulkActions({ selectedIds, cleanSelection }) {
  const dispatch: AppDispatch = useDispatch();
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const handleClose = (): void => setOpenConfirmModal(false);

  const handleBulkDeleteButton = () => {
    try {
      dispatch(deleteTransactions(selectedIds)).unwrap();
    } catch (err) {
      console.error('Failed to delete the transaction', err);
    }
    setOpenConfirmModal(false);
    cleanSelection();
  };

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <Typography variant="h5" color="text.secondary">
            Bulk actions:
          </Typography>
          <ButtonError
            onClick={() => {
              setOpenConfirmModal(true);
            }}
            sx={{ ml: 1 }}
            startIcon={<DeleteTwoToneIcon />}
            variant="contained"
          >
            Delete
          </ButtonError>
        </Box>
        <ConfirmDialog
          click={handleBulkDeleteButton}
          open={openConfirmModal}
          close={handleClose}
          title="Are you sure you want to delete these transactions?"
        />
      </Box>
    </>
  );
}

export default BulkActions;
