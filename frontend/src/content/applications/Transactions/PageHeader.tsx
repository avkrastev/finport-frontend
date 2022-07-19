import { useState, useContext } from 'react';
import { Typography, Button, Grid } from '@mui/material';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { AuthContext } from '../../../utils/context/authContext';
import Modal from 'src/components/Modal';

function PageHeader() {
  const { authUserData } = useContext(AuthContext);
  const [openModal, setOpenModal] = useState(false);

  const handleClickOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const modalContent = [
    {
      id: "category",
      label: "Category",
      type: "text",
      autofocus: true
    },  
    {
      id: "asset",
      label: "Asset",
      type: "text",
      autofocus: false
    }, 
    {      
      id: "price",
      label: "Price",
      type: "number",
      autofocus: false 
    },
    {      
      id: "quantity",
      label: "Quantity",
      type: "number",
      autofocus: false
    },
    {      
      id: "date",
      label: "Date",
      type: "date",
      autofocus: false 
    }
  ];

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Transactions
        </Typography>
        <Typography variant="subtitle2">
          {authUserData.name}, these are your recent transactions
        </Typography>
      </Grid>
      <Grid item>
        <Button
          onClick={handleClickOpen}
          sx={{ mt: { xs: 2, md: 0 } }}
          variant="contained"
          startIcon={<AddTwoToneIcon fontSize="small" />}
        >
          Create transaction
        </Button>
        <Modal
          open={openModal}
          close={handleClose}
          title="New transaction"
          content={modalContent}
          categories={authUserData.categories}
        />
      </Grid>
    </Grid>
  );
}

export default PageHeader;
