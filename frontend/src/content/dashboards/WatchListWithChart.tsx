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
import { HistoryOutlined } from '@mui/icons-material';
import BalanceSkeleton from './BalanceSkeleton';

const EmptyResultsWrapper = styled('img')(
  ({ theme }) => `
        max-width: 100%;
        width: ${theme.spacing(66)};
        height: ${theme.spacing(34)};
  `
);

function WatchListWithChart(props) {
  const [tabs, setTab] = useState<string | null>('watch_list_columns');
  const dispatch: AppDispatch = useDispatch();
  const history = useSelector(selectAllHistorySinceStart);
  const historyStatus = useSelector(getHistoryStatus);
  const handleViewOrientation = (
    event: MouseEvent<HTMLElement>,
    newValue: string | null
  ) => {
    setTab(newValue);
  };

  useEffect(() => {
    if (tabs === 'watch_list_rows') {
      dispatch(fetchHistorySinceStart(props.category));
    }
  }, [tabs, dispatch, props.category]);

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ pb: 3 }}
      >
        <Typography variant="h3"></Typography>
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
            <AccountBalance {...props} />
          </Grid>
        )}

        {tabs === 'watch_list_rows' && historyStatus !== 'succeeded' && (
          <BalanceSkeleton />
        )}

        {tabs === 'watch_list_rows' &&
          (props?.category === history?.category ? (
            <Grid item xs={12}>
              <BalanceChart
                assets={props.assets}
                category={props.category}
                history={history}
                loading={historyStatus}
              />
            </Grid>
          ) : (
            <Grid item xs={12}>
              <BalanceChart assets={props.assets} category={props.category} />
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
    </>
  );
}

export default WatchListWithChart;
