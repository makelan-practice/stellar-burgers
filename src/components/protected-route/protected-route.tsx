import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { Preloader } from '@ui';
import { useSelector } from '../../services/store';
import {
  selectIsAuthChecked,
  selectIsAuthenticated
} from '../../services/selectors/authSelectors';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactElement;
};

export const ProtectedRoute: FC<TProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const location = useLocation();
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const isAuth = useSelector(selectIsAuthenticated);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && isAuth) {
    const from = (location.state as { from?: { pathname?: string } })?.from;
    return <Navigate to={from?.pathname || '/'} replace />;
  }

  if (!onlyUnAuth && !isAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
