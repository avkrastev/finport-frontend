import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import { Box, Card } from '@mui/material';
import styled from '@emotion/styled';
import WatchListColumn1Chart from './WatchListColumn1Chart';
import { shortDayNames } from 'src/constants/common';

const WatchListColumn1ChartWrapper = styled(WatchListColumn1Chart)(
  ({ theme }) => `
        height: 130px;
        padding: 0 20px 10px;
`
);

export default function WatchListColumnSkeleton() {
  const todayDayName = new Date().getDay();
  const labels = shortDayNames
    .slice(todayDayName)
    .concat(shortDayNames.slice(0, todayDayName));

  const price = {
    week: {
      labels,
      data: [55.701, 57.598, 48.607, 46.439, 58.755, 46.978, 58.16]
    }
  };

  return (
    <Card>
      <Box sx={{ p: 3 }}>
        <Box display="flex" alignItems="center">
          <Skeleton variant="circular" width={30} height={30} />
          <Box>
            <Skeleton
              variant="text"
              width={80}
              style={{ fontSize: '1rem', marginLeft: '10px' }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            pt: 3
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
      <Box height={130}>
        <WatchListColumn1ChartWrapper
          data={price.week.data}
          labels={price.week.labels}
          skeleton
        />
      </Box>
    </Card>
  );
}
