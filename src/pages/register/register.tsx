import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { register } from '../../services/slices/authSlice';
import { selectAuthError } from '../../services/selectors/authSelectors';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const errorText = useSelector(selectAuthError) || '';

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(register({ email, password, name: userName })).then((res) => {
      if ((res as { type: string }).type.endsWith('/fulfilled')) {
        navigate('/', { replace: true });
      }
    });
  };

  return (
    <RegisterUI
      errorText={errorText}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
