import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { getCookie } from '../../utils/cookie';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactElement;
};

export const ProtectedRoute: FC<TProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const location = useLocation();
  const isAuth = Boolean(
    getCookie('accessToken') || localStorage.getItem('refreshToken')
  );

  if (onlyUnAuth && isAuth) {
    const from = (location.state as { from?: { pathname?: string } })?.from;
    return <Navigate to={from?.pathname || '/'} replace />;
  }

  if (!onlyUnAuth && !isAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
