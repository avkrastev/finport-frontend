import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import ConfirmDialog from './ConfirmDialog';

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
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const handleClose = (): void => setOpenConfirmModal(false);

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
          bulkDelete={true}
          open={openConfirmModal}
          close={handleClose}
          title="Are you sure you want to delete these transactions?"
          selectedIds={selectedIds}
          cleanSelection={cleanSelection}
        />
      </Box>
    </>
  );
}

export default BulkActions;
