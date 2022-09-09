import {
  Button,
  Card,
  Grid,
  Box,
  CardContent,
  Typography,
  Avatar,
  Tooltip,
  CardActionArea,
  Icon,
  Link,
  TextField,
  InputLabel
} from '@mui/material';

import { styled } from '@mui/material/styles';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { p2pPlatforms } from '../../constants/common';
import { formatAmountAndCurrency } from 'src/utils/functions';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import { AppDispatch } from 'src/app/store';
import { useDispatch } from 'react-redux';
import { addAPR, changeP2PStatus, updateAPR } from './P2P/p2pSlice';

const AvatarAddWrapper = styled(Avatar)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        color: ${theme.colors.primary.main};
        width: ${theme.spacing(8)};
        height: ${theme.spacing(8)};
`
);

const CardAddAction = styled(Card)(
  ({ theme }) => `
        border: ${theme.colors.primary.main} dashed 1px;
        height: 100%;
        color: ${theme.colors.primary.main};
        
        .MuiCardActionArea-root {
          height: 100%;
          justify-content: center;
          align-items: center;
          display: flex;
        }
        
        .MuiTouchRipple-root {
          opacity: .2;
        }
        
        &:hover {
          border-color: ${theme.colors.alpha.black[100]};
        }
`
);

function Wallets({ assets }) {
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

  return (
    <>
      <Grid container spacing={3}>
        {assets?.stats?.map((asset, i) => {
          const p2pPlatform = p2pPlatforms.find(
            (platform) => platform.name === asset.name
          );
          const percentage = assets.percentages.find(
            (percentage) => percentage.name === asset.name
          );
          return (
            <Grid xs={12} sm={6} md={3} item key={i}>
              <Card sx={{ px: 1 }}>
                <CardContent>
                  <Icon sx={{ width: '100%', height: 50, textAlign: 'left' }}>
                    <img
                      style={{ width: '100%', height: 50 }}
                      alt="BTC"
                      src={p2pPlatform.logo}
                    />
                  </Icon>
                  {!p2pPlatform.logo && (
                    <Typography variant="h5" noWrap>
                      {asset.name}
                    </Typography>
                  )}
                  <Typography variant="subtitle1" noWrap>
                    <Link
                      color="inherit"
                      underline="none"
                      href={p2pPlatform.website}
                      target="_blank"
                    >
                      {p2pPlatform.website}
                    </Link>
                  </Typography>
                  <Box sx={{ pt: 3 }}>
                    <Typography variant="h3" gutterBottom noWrap>
                      {formatAmountAndCurrency(asset.totalSumInOriginalCurrency, 'EUR')}
                    </Typography>
                    <Typography variant="body1" gutterBottom fontSize={'1rem'}>
                      <Box sx={{ display: 'grid' }} alignItems="center">
                        <InputLabel sx={{ gridColumn: '1', mt: 1.1, mb: 1 }}>
                          APR:&nbsp;
                        </InputLabel>
                        <TextField
                          type="number"
                          id="outlined-basic"
                          size="small"
                          variant="outlined"
                          sx={{ gridColumn: '2', ml: 1 }}
                          defaultValue={percentage && percentage.apr}
                          onChange={(event) =>
                            handleAPRChange(
                              event.target.value,
                              asset.name,
                              percentage?.id
                            )
                          }
                        />
                        <InputLabel
                          sx={{ gridColumn: '3', mt: 1.1, mb: 1, ml: 1 }}
                        >
                          %
                        </InputLabel>
                      </Box>
                    </Typography>

                    <Button
                      size="small"
                      variant="contained"
                      sx={{ width: '100%', marginTop: '10px' }}
                      startIcon={<EditIcon fontSize="small" />}
                      disabled={platformAPR[asset.name]?.apr > 0 ? false : true}
                      onClick={() => handleAPRSave(percentage?.id, asset.name)}
                    >
                      Change APR
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
        <Grid xs={12} sm={6} md={3} item>
          <Tooltip arrow title="Click to add a new P2P Platform">
            <CardAddAction>
              <CardActionArea sx={{ px: 1 }}>
                <CardContent>
                  <AvatarAddWrapper>
                    <AddTwoToneIcon fontSize="large" />
                  </AvatarAddWrapper>
                </CardContent>
              </CardActionArea>
            </CardAddAction>
          </Tooltip>
        </Grid>
      </Grid>
    </>
  );
}

export default Wallets;
