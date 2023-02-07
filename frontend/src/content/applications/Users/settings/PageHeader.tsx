import { Typography } from '@mui/material';

function PageHeader(props) {
  return (
    <>
      <Typography variant="h3" component="h3" gutterBottom>
        {props.i18n('User Settings')}
      </Typography>
    </>
  );
}

export default PageHeader;
