import { useCallback, useEffect, useState } from 'react';
import ApiError from './ApiError';

export default function CustomErrorBoundary(props) {
  const [hasError, setHasError] = useState(false);
  const [details, setDetails] = useState({});

  const handleError = useCallback((customEvent) => {
    setHasError(true);
    setDetails(customEvent.detail);
  }, []);

  const clearError = () => {
    setHasError(false);
    setDetails({});
  };

  useEffect(() => {
    window.addEventListener('ast-error', handleError);
    window.addEventListener('clear-ast-error', clearError);
    return () => {
      window.removeEventListener('ast-error', handleError);
      window.removeEventListener('clear-ast-error', clearError);
    };
  }, [handleError]);

  return hasError ? <ApiError details={details} /> : props.children;
}
