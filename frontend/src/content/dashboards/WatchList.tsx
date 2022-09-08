import { Box, Grid, Typography } from '@mui/material';
import WatchListColumn1 from './WatchListColumn1';

function WatchList({
  categories,
  crypto,
  cryptoLoading,
  stocks,
  stocksLoading,
  p2p,
  p2pLoading,
  etf,
  etfLoading,
  misc,
  miscLoading,
  commodities,
  commoditiesLoading,
}) {
  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ pb: 3 }}
      >
        <Typography variant="h3">Daily Trends</Typography>
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
                  crypto={crypto.sums}
                  cryptoLoading={cryptoLoading}
                  stocks={stocks.sums}
                  stocksLoading={stocksLoading}
                  p2p={p2p.sums}
                  p2pLoading={p2pLoading}
                  etf={etf.sums}
                  etfLoading={etfLoading}
                  misc={misc.sums}
                  miscLoading={miscLoading}
                  commodities={commodities.sums}
                  commoditiesLoading={commoditiesLoading}
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
