import { useCallback, useEffect, useState, ReactNode } from 'react';
import ApiError, { ApiErrorDetails } from './ApiError';

// Type for the component props
interface CustomErrorBoundaryProps {
  children: ReactNode;
}

// Define the shape of the details object
interface ErrorDetails {
  // Add properties based on the structure of customEvent.detail
  [key: string]: any; // This can be more specific depending on your API error details
}

export default function CustomErrorBoundary({
  children
}: CustomErrorBoundaryProps) {
  const [hasError, setHasError] = useState<boolean>(false);
  const [details, setDetails] = useState<ApiErrorDetails>({});

  // Handle the custom event when an error occurs
  const handleError = useCallback((customEvent: CustomEvent<ErrorDetails>) => {
    setHasError(true);
    setDetails(customEvent.detail); // Set the error details from the customEvent
  }, []);

  const clearError = () => {
    setHasError(false);
    setDetails({}); // Clear the error details
  };

  useEffect(() => {
    // Add event listeners for error and clear-error events
    window.addEventListener('ast-error', handleError as EventListener);
    window.addEventListener('clear-ast-error', clearError);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener('ast-error', handleError as EventListener);
      window.removeEventListener('clear-ast-error', clearError);
    };
  }, [handleError]);

  return hasError ? <ApiError details={details} /> : <>{children}</>;
}
