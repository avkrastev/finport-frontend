import {
  Box,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  Card,
  Button
} from '@mui/material';
import { useState, MouseEvent, useEffect } from 'react';
import DataSaverOffIcon from '@mui/icons-material/DataSaverOff';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import BalanceChart from './BalanceChart';
import { styled } from '@mui/material/styles';
import AccountBalance from './AccountBalance';
import { AppDispatch } from 'src/app/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchHistorySinceStart,
  getHistoryStatus,
  selectAllHistorySinceStart
} from '../overview/summarySlice';
import BalanceSkeleton from './BalanceSkeleton';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { assetIcons } from 'src/constants/common';
import CommoditiesModal from '../dialogs/commodities';

const EmptyResultsWrapper = styled('img')(
  ({ theme }) => `
        max-width: 100%;
        width: ${theme.spacing(66)};
        height: ${theme.spacing(34)};
  `
);

function WatchListWithChart(props) {
  const { t } = useTranslation();
  const location = useLocation();
  const [tabs, setTab] = useState<string | null>('watch_list_columns');
  const [openModal, setOpenModal] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const history = useSelector(selectAllHistorySinceStart);
  const historyStatus = useSelector(getHistoryStatus);
  const handleViewOrientation = (
    event: MouseEvent<HTMLElement>,
    newValue: string | null
  ) => {
    setTab(newValue);
  };

  const currentPath = location.pathname.split('/')[2];

  const Icon = assetIcons[currentPath];

  const modals = {
    crypto: CommoditiesModal,
    stocks: CommoditiesModal,
    p2p: CommoditiesModal,
    etf: CommoditiesModal,
    misc: CommoditiesModal,
    commodities: CommoditiesModal
  };

  const Modal = modals[currentPath];

  useEffect(() => {
    if (tabs === 'watch_list_rows') {
      dispatch(fetchHistorySinceStart(props.category));
    }
  }, [tabs, dispatch, props.category]);

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
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ pb: 3 }}
      >
        {assetIcons[currentPath] ? (
          <Button
            onClick={handleClickOpen}
            size="large"
            sx={{ mt: { xs: 2, md: 0 } }}
            variant="contained"
            startIcon={<Icon />}
          >
            {t('Add transaction')}
          </Button>
        ) : (
          <Typography></Typography>
        )}

        <ToggleButtonGroup
          value={tabs}
          exclusive
          onChange={handleViewOrientation}
        >
          <ToggleButton disableRipple value="watch_list_columns">
            <DataSaverOffIcon />
          </ToggleButton>
          <ToggleButton disableRipple value="watch_list_rows">
            <QueryStatsIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        {tabs === 'watch_list_columns' && (
          <Grid item lg={12} xs={12}>
            <AccountBalance t={t} {...props} />
          </Grid>
        )}

        {tabs === 'watch_list_rows' &&
          history &&
          historyStatus !== 'succeeded' && <BalanceSkeleton />}

        {tabs === 'watch_list_rows' &&
          (props?.category === history?.category ? (
            <Grid item xs={12}>
              <BalanceChart
                assets={props.assets}
                category={props.category}
                history={history}
                loading={historyStatus}
                t={t}
              />
            </Grid>
          ) : (
            <Grid item xs={12}>
              <BalanceChart
                assets={props.assets}
                category={props.category}
                t={t}
              />
            </Grid>
          ))}

        {!tabs && (
          <Grid item xs={12}>
            <Card sx={{ textAlign: 'center', p: 3 }}>
              <EmptyResultsWrapper src="/static/images/placeholders/illustrations/1.svg" />

              <Typography
                align="center"
                variant="h2"
                fontWeight="normal"
                color="text.secondary"
                sx={{ mt: 3 }}
                gutterBottom
              >
                Click something, anything!
              </Typography>
              <Button variant="contained" size="large" sx={{ mt: 4 }}>
                Maybe, a button?
              </Button>
            </Card>
          </Grid>
        )}
      </Grid>
      {modals[currentPath] && (
        <Modal
          open={openModal}
          close={handleClose}
          categories={[]}
          tabs={true}
          {...props}
        />
      )}
    </>
  );
}

export default WatchListWithChart;
