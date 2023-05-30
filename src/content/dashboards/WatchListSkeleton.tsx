import { Card, Box, Skeleton } from '@mui/material';

function WatchListSkeleton() {
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
      <Box height={130}></Box>
    </Card>
  );
}

export default WatchListSkeleton;
