import { AuthContext } from '@/context/authContext';
import { FC, useContext } from 'react';

interface IAuthGuardProps {
	authComponent: JSX.Element;
	unAuthComponent: JSX.Element;
}

const AuthGuard: FC<IAuthGuardProps> = ({ authComponent: Auth, unAuthComponent: UnAuth }) => {
	const { user } = useContext(AuthContext);
	if (user) return Auth;
	return UnAuth;
};

export default AuthGuard;
