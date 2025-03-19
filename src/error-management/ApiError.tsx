import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import extractError from './errorMessagesMap';
import clearApiError from './clearApiError';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

// Define the shape of the details prop
export interface ApiErrorDetails {
  url?: string;
  method?: string;
  statusCode?: number;
}

interface ApiErrorProps {
  details: ApiErrorDetails;
}

export default function ApiError({ details }: ApiErrorProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { url, method, statusCode } = details;

  const apiErrorObject = extractError(url, method, statusCode);

  const redirectToContactPage = () => {
    clearApiError();
    navigate('/contact-us');
  };

  return (
    <Dialog
      fullWidth
      open={true}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{ fontSize: '2rem', textAlign: 'center' }}
      >
        {t('We are sorry about this!')}
      </DialogTitle>
      <DialogContent
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}
      >
        <DialogContentText
          id="alert-dialog-description"
          sx={{ fontSize: '1rem', textAlign: 'center' }}
        >
          {t(apiErrorObject.content)}
        </DialogContentText>

        <SentimentVeryDissatisfiedIcon
          sx={{ fontSize: 80, mt: 2 }}
          color="error"
        />
      </DialogContent>
      <DialogActions style={{ justifyContent: 'center' }}>
        <Button size="large" onClick={redirectToContactPage} autoFocus>
          {t('Contact us')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
