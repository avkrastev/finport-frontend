import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import { Box, Card, Grid } from '@mui/material';
import styled from '@emotion/styled';
import WatchListColumn1Chart from './WatchListColumn1Chart';

const WatchListColumn1ChartWrapper = styled(WatchListColumn1Chart)(
  ({ theme }) => `
        height: 210px;
        padding: 0 20px 10px;
`
);

export default function BalanceSkeleton() {
  const labels = Array(7).fill('');

  const price = {
    week: {
      labels,
      data: [55.701, 57.598, 48.607, 46.439, 58.755, 46.978, 58.16]
    }
  };

  return (
    <Grid item xs={12}>
      <Card>
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start'
            }}
          >
            <Skeleton variant="text" width={100} sx={{ fontSize: '1.5rem' }} />
            <Skeleton
              variant="text"
              width={40}
              style={{ fontSize: '0.5rem', marginLeft: '10px' }}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start'
            }}
          >
            <Skeleton variant="text" width={40} sx={{ fontSize: '1.5rem' }} />
            <Skeleton
              variant="text"
              width={40}
              style={{ fontSize: '0.5rem', marginLeft: '10px' }}
            />
          </Box>
        </Box>
        <Box height={210}>
          <WatchListColumn1ChartWrapper
            data={price.week.data}
            labels={price.week.labels}
            skeleton
          />
        </Box>
      </Card>
    </Grid>
  );
}
