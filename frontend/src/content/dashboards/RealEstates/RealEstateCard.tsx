import {
  Button,
  Card,
  Grid,
  Box,
  CardContent,
  Typography,
  Tooltip,
  Icon,
  TextField,
  InputLabel
} from '@mui/material';

import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import { AppDispatch } from 'src/app/store';
import { useDispatch } from 'react-redux';
import { addAPR, changeP2PStatus, updateAPR } from '../P2P/p2pSlice';
import WalletsSkeleton from '../WalletsSkeleton';
import { useTranslation } from 'react-i18next';
import { currencies, propertyTypes } from 'src/constants/common';
import Selector from 'src/components/FormElements/Selector';

function RealEstateCard({ assets, status }) {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();

  const [platformAPR, setPlatformAPR] = useState({});

  const handleAPRChange = (value, name, id) => {
    setPlatformAPR((prevState) => {
      return {
        ...prevState,
        [name]: {
          name,
          apr: value,
          id: id ? id : null
        }
      };
    });
  };

  const handleAPRSave = (id, name) => {
    if (id) {
      dispatch(updateAPR(platformAPR[name]));
    } else {
      dispatch(addAPR(platformAPR[name]));
    }

    setPlatformAPR((prevState) => {
      return {
        ...prevState,
        [name]: undefined
      };
    });
    dispatch(changeP2PStatus('idle'));
  };

  if (status !== 'succeeded') {
    return <WalletsSkeleton />;
  }

  return (
    <Grid container spacing={3}>
      {assets?.stats?.map((asset, i) => {
        return (
          <Grid xs={12} sm={6} md={4} item key={i}>
            <Card sx={{ px: 1 }}>
              <CardContent>
                <Typography variant="h5" noWrap>
                  {asset.name}
                  <Box sx={{ float: 'right' }}>
                    {asset.property_type > 0
                      ? t('Not rented out')
                      : t('Rented out')}
                  </Box>
                </Typography>
                <Typography variant="subtitle1" noWrap>
                  {asset.property_type &&
                    propertyTypes.find(
                      (type) => type.key === asset.property_type
                    ).value}
                </Typography>
                <Box sx={{ pt: 3 }}>
                  <Typography variant="body1" gutterBottom fontSize={'1rem'}>
                    <Box sx={{ display: 'grid' }} alignItems="center">
                      <InputLabel sx={{ gridColumn: '1', mt: 1.1, mb: 1 }}>
                        {t('Rent')}
                      </InputLabel>
                      <Tooltip
                        title={t(
                          'If there is a value here the system will automatically show the monthly payments on all related reports.'
                        )}
                        arrow
                      >
                        <Icon
                          component={HelpOutlineRoundedIcon}
                          sx={{ gridColumn: '2', ml: 0.3 }}
                          fontSize="small"
                        />
                      </Tooltip>
                      <Selector
                        required
                        showKey
                        size="small"
                        id="currency"
                        options={currencies}
                        //label={t('Currency')}
                        sx={{ gridColumn: '3', mt: 1, mb: 1, ml: 1 }}
                        //onInput={inputHandler}
                        //{...formState.inputs.currency}
                      />
                      <TextField
                        type="number"
                        id="outlined-basic"
                        size="small"
                        variant="outlined"
                        sx={{ gridColumn: '4' }}
                        //defaultValue={percentage && percentage.apr}
                        onChange={(event) => {}}
                      />
                      <InputLabel
                        sx={{ gridColumn: '5', mt: 1.1, mb: 1, ml: 1 }}
                      >
                        ({t('per month')})
                      </InputLabel>
                    </Box>
                  </Typography>

                  <Button
                    size="small"
                    variant="contained"
                    sx={{ width: '100%', marginTop: '10px' }}
                    startIcon={<EditIcon fontSize="small" />}
                    //disabled={platformAPR[asset.name]?.apr > 0 ? false : true}
                    //onClick={() => handleAPRSave(percentage?.id, asset.name)}
                  >
                    {t('Change rent')}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default RealEstateCard;
