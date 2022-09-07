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
  Link
} from '@mui/material';

import { styled } from '@mui/material/styles';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { p2pPlatforms } from '../../constants/common';
import { formatAmountAndCurrency } from 'src/utils/functions';

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
        background: transparent;
        margin-left: -${theme.spacing(0.5)};
        margin-bottom: ${theme.spacing(1)};
        margin-top: ${theme.spacing(2)};
`
);

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
  return (
    <>
      {/* <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ pb: 3 }}
      >
        <Typography variant="h3">Wallets</Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<AddTwoToneIcon fontSize="small" />}
        >
          Add new wallet
        </Button>
      </Box> */}
      <Grid container spacing={3}>
        {assets?.stats?.map((asset) => {
          const p2pPlatform = p2pPlatforms.find(
            (platform) => platform.name === asset.name
          );
          return (
            <Grid xs={12} sm={6} md={3} item key={asset.name}>
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
                      {formatAmountAndCurrency(asset.totalSum, 'USD')}
                    </Typography>
                    {/* <Typography variant="subtitle2" noWrap>
                      1.25843 BTC
                    </Typography> */}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
        {/* <Grid xs={12} sm={6} md={3} item>
          <Tooltip arrow title="Click to add a new wallet">
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
        </Grid> */}
      </Grid>
    </>
  );
}

export default Wallets;
