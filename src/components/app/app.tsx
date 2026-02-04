import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  IngredientDetailsPage,
  Login,
  NotFound404,
  OrderInfoPage,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import '../../index.css';
import styles from './app.module.css';

import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute
} from '@components';
import { useDispatch } from '../../services/store';
import { checkUserAuth } from '../../services/slices/authSlice';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const backgroundLocation = (
    location.state as { background?: ReturnType<typeof useLocation> } | null
  )?.background;

  const closeModal = () => navigate(-1);

  useEffect(() => {
    dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        {/* detail pages (direct navigation) */}
        <Route path='/ingredients/:id' element={<IngredientDetailsPage />} />
        <Route path='/feed/:number' element={<OrderInfoPage />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfoPage />
            </ProtectedRoute>
          }
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={closeModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title='Информация о заказе' onClose={closeModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title='Информация о заказе' onClose={closeModal}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
