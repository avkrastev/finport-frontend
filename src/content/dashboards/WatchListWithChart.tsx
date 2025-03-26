import { Grid } from '@mui/material';
import AccountBalance from './AccountBalance';
import { useTranslation } from 'react-i18next';

function WatchListWithChart(props) {
  const { t } = useTranslation();

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="stretch"
      spacing={3}
    >
      <Grid item lg={12} xs={12}>
        <AccountBalance t={t} {...props} />
      </Grid>
    </Grid>
  );
}

export default WatchListWithChart;
