import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography
} from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

function WalletsSkeleton() {
  return (
    <>
      <Grid container spacing={3}>
        {Array(6)
          .fill(0)
          .map((n, i) => {
            return (
              <Grid xs={12} sm={6} md={3} item key={i}>
                <Card sx={{ px: 1 }}>
                  <CardContent>
                    <Skeleton variant="text" sx={{ fontSize: '3rem' }} />
                    <Typography variant="subtitle1" noWrap>
                      <Skeleton
                        variant="text"
                        sx={{ fontSize: '0.5rem' }}
                        width={'80%'}
                      />
                    </Typography>
                    <Box sx={{ pt: 3 }}>
                      <Typography
                        variant="body1"
                        gutterBottom
                        fontSize={'1rem'}
                      >
                        <Box sx={{ display: 'grid' }} alignItems="center">
                          <Skeleton
                            variant="text"
                            sx={{ fontSize: '1rem', gridColumn: '1'}}
                          />
                          <Skeleton
                            variant="text"
                            sx={{ fontSize: '1rem', gridColumn: '2', ml: 1 }}
                          />
                        </Box>
                      </Typography>
                      <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
      </Grid>
    </>
  );
}

export default WalletsSkeleton;
