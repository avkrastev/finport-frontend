import { Box, Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import WatchListColumn1 from './WatchListColumn1';

function WatchList({ categories, ...rest }) {
  const { t } = useTranslation();
  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ pb: 3 }}
      >
        <Typography variant="h3">{t('Daily Trends')}</Typography>
      </Box>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        <>
          {categories.map((category) => {
            return (
              <Grid item lg={4} xs={12} key={category.alias}>
                <WatchListColumn1
                  category={category}
                  t={t}
                  {...rest}
                />
              </Grid>
            );
          })}
        </>
      </Grid>
    </>
  );
}

export default WatchList;
