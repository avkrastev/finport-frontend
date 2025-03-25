import { useState, useContext } from 'react';
import { Typography, Button, Grid } from '@mui/material';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { AuthContext } from '../../../utils/context/authContext';
import TransactionModal from '../../../components/TransactionModal';
import { Trans } from 'react-i18next';

function PageHeader() {
  const { authUserData } = useContext(AuthContext);
  const [openModal, setOpenModal] = useState(false);

  const handleClickOpen = () => {
    setOpenModal(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'backdropClick') {
      return;
    }
    setOpenModal(false);
  };

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          <Trans i18nKey={'Transactions'}>Transactions</Trans>
        </Typography>
      </Grid>
      <Grid item>
        <Button
          size="large"
          onClick={handleClickOpen}
          sx={{ mt: { xs: 2, md: 0 } }}
          variant="contained"
          startIcon={<AddTwoToneIcon fontSize="small" />}
        >
          <Trans i18nKey={'Add transaction'}>Add transaction</Trans>
        </Button>
        <TransactionModal
          open={openModal}
          close={handleClose}
          categories={authUserData.categories}
          tabs={true}
        />
      </Grid>
    </Grid>
  );
}

export default PageHeader;
