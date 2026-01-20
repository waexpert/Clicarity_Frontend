import React from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import CustomTable from './CustomTable';

/**
 * Custom Table with Error Boundary Wrapper
 * Safe wrapper that catches errors
 */
const CustomTableWithErrorBoundary = (props) => {
  return (
    <ErrorBoundary>
      <CustomTable {...props} />
    </ErrorBoundary>
  );
};

export default CustomTableWithErrorBoundary;