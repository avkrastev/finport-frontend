import { Alert, Link } from '@mui/material';

function MissingApiKeyMessage(props) {
  return (
    <Alert sx={{ mb: 3 }} variant="outlined" severity="info">
      {props.text}{' '}
      <Link href="/management/profile/settings#stocks-api-key" underline="none">
        here
      </Link>
      .
    </Alert>
  );
}

export default MissingApiKeyMessage;
