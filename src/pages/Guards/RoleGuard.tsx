import { FC, useContext } from 'react';
import { AuthContext } from '@/context/authContext';
import { Navigate } from 'react-router';
import { UNAUTH_ROUTES } from '@/constants/routes';
import { ROLE_MAPPER } from './RoleMapper';
import { Role } from '@/types/roles';

interface IRoleGuardProps {
	route: string;
}

const RoleGuard: FC<IRoleGuardProps> = ({ route }) => {
	const { user } = useContext(AuthContext);
	const role = user?.role;

	if (!role) return <Navigate to={UNAUTH_ROUTES.AUTH} />;

	if (!ROLE_MAPPER[route]) return <Navigate to={UNAUTH_ROUTES.AUTH} />;

	if (!ROLE_MAPPER[route][role as Role]) return <Navigate to={UNAUTH_ROUTES.AUTH} />;

	const Component = ROLE_MAPPER[route][role as Role];

	return Component ? <Component /> : <Navigate to={UNAUTH_ROUTES.AUTH} />;
};

export default RoleGuard;
