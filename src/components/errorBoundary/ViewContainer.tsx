// ViewContainer.tsx
// Sử dụng: import ViewContainer from '@/components/ViewContainer';
// Bọc màn hình: <ViewContainer goBack> <YourScreen /> </ViewContainer>

import React from 'react';
import ErrorBoundary from 'react-native-error-boundary';
import FallbackComponent from './FallbackComponent';

export type ErrorBoundaryWithGoBackProps = {
  children: React.ReactNode;
  goBack?: boolean;
};

const ViewContainer = ({ children, goBack }: ErrorBoundaryWithGoBackProps) => (
  <ErrorBoundary FallbackComponent={props => <FallbackComponent {...props} goBack={goBack} />}>
    {children}
  </ErrorBoundary>
);

export default ViewContainer;
