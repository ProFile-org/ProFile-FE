import { useContext } from 'react';
import MenuItem from './MenuItem.component';
import { AuthContext } from '@/context/authContext';
import { Role, SIDEBAR_ROLES } from '@/types/roles';

const Sidebar = () => {
	const { user } = useContext(AuthContext);
	const role = user?.role || 'employee';
	const items = SIDEBAR_ROLES[role as Role];

	return (
		<nav className='lg:flex flex-col gap-5 basis-2/12 hidden'>
			{items.map((item, index) => (
				<MenuItem item={item} key={item.label} index={index} />
			))}
		</nav>
	);
};

export default Sidebar;
