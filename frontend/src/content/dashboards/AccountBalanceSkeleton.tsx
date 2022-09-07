import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import {
  Box,
  Card,
  Divider,
  Grid,
  Hidden,
  List,
  ListItem,
  ListItemText
} from '@mui/material';

export default function AccountBalanceSkeleton() {
  return (
    <Card>
      <Grid spacing={0} container>
        <Grid item xs={12} md={6}>
          <Box p={4}>
            <Stack spacing={1}>
              <Skeleton variant="text" width={240} sx={{ fontSize: '1rem' }} />
              <Skeleton
                variant="text"
                width={300}
                style={{ fontSize: '1.5rem', marginTop: '10px' }}
              />
              <Skeleton
                variant="text"
                width={140}
                style={{ fontSize: '0.5rem' }}
              />
              <Skeleton
                variant="text"
                width={140}
                sx={{ fontSize: '0.5rem' }}
              />
              <Skeleton
                variant="text"
                width={140}
                sx={{ fontSize: '0.5rem' }}
              />
              <Box display="flex" sx={{ py: 4 }} alignItems="center">
                <Skeleton
                  variant="rectangular"
                  style={{
                    fontSize: '0.5rem'
                  }}
                  width={60}
                  height={60}
                />
                <Box>
                  <Skeleton
                    variant="text"
                    width={80}
                    sx={{ fontSize: '1rem', marginLeft: '20px' }}
                  />
                  <Skeleton
                    variant="text"
                    width={80}
                    sx={{ fontSize: '0.5rem', marginLeft: '20px' }}
                  />
                </Box>
              </Box>
            </Stack>
          </Box>
        </Grid>
        <Grid
          sx={{ position: 'relative' }}
          display="flex"
          alignItems="center"
          item
          xs={12}
          md={6}
        >
          <>
            <Hidden mdDown>
              <Divider absolute orientation="vertical" />
            </Hidden>
            <Box p={4} flex={1}>
              <Grid container spacing={0}>
                <Grid
                  xs={12}
                  sm={5}
                  item
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Box>
                    <Skeleton variant="circular" width={160} height={160} />
                  </Box>
                </Grid>

                <Grid xs={12} sm={7} item display="flex" alignItems="center">
                  <List disablePadding sx={{ width: '100%' }}>
                    {Array(5)
                      .fill(0)
                      .map((n, i) => {
                        return (
                          <ListItem disableGutters key={i}>
                            <ListItemText
                              primary={
                                <Skeleton
                                  variant="text"
                                  width={40}
                                  sx={{ fontSize: '1rem' }}
                                />
                              }
                              primaryTypographyProps={{
                                variant: 'h5',
                                noWrap: true
                              }}
                              secondary={
                                <Skeleton
                                  variant="text"
                                  width={80}
                                  sx={{ fontSize: '0.5rem' }}
                                />
                              }
                              secondaryTypographyProps={{
                                variant: 'subtitle2',
                                noWrap: true
                              }}
                            />
                            <Box>
                              <Skeleton
                                variant="text"
                                width={50}
                                sx={{ fontSize: '1rem' }}
                              />
                              <Skeleton
                                variant="text"
                                width={50}
                                sx={{ fontSize: '0.5rem' }}
                              />
                            </Box>
                          </ListItem>
                        );
                      })}
                  </List>
                </Grid>
              </Grid>
            </Box>
          </>
        </Grid>
      </Grid>
    </Card>
  );
}
