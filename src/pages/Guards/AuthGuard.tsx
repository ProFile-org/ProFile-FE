import { AuthContext } from '@/context/authContext';
import { FC, useContext } from 'react';

interface IAuthGuardProps {
	authComponent: JSX.Element;
	unAuthComponent: JSX.Element;
}

const AuthGuard: FC<IAuthGuardProps> = ({ authComponent: Auth, unAuthComponent: UnAuth }) => {
	const { user } = useContext(AuthContext);
	if (!user) return UnAuth;
	if (user.role === 'staff' && !user.roomId) {
		return (
			<div>You have not yet been assigned a room, please contact admin for more information</div>
		);
	}
	return Auth;
};

export default AuthGuard;
