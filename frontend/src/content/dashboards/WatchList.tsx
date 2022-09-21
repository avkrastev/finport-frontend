import { Box, Grid, Typography } from '@mui/material';
import WatchListColumn1 from './WatchListColumn1';

function WatchList({ categories, ...rest }) {

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
