import { Typography, Grid } from '@mui/material';

function PageHeader(props) {
  return (
    <Grid container alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          {props.title}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
