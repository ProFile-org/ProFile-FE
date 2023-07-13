import { useContext } from 'react';
import MenuItem from './MenuItem.component';
import { AuthContext } from '@/context/authContext';
import { Role, SIDEBAR_ROLES } from '@/types/roles';
import clsx from 'clsx';

const Sidebar = ({ open = false }) => {
	const { user } = useContext(AuthContext);
	const role = user?.role || 'employee';
	const items = SIDEBAR_ROLES[role as Role];

	return (
		<nav
			className={clsx(
				'lg:flex flex-col gap-5 transition-all hidden lg:fixed overflow-y-auto max-h-[80vh]',
				open ? 'w-[200px] mr-5 sm:mr-8 opacity-100' : 'w-0 overflow-hidden opacity-0'
			)}
		>
			{items.map((item, index) => (
				<MenuItem item={item} key={item.label} index={index} />
			))}
		</nav>
	);
};

export default Sidebar;
