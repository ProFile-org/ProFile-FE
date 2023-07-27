import clsx from 'clsx';
import Overlay from '../Overlay/Overlay.component';
import MenuItem from './MenuItem.component';
import { Role, SIDEBAR_ROLES } from '@/types/roles';
import { AuthContext } from '@/context/authContext';
import { Dispatch, FC, SetStateAction, useContext } from 'react';

interface IMobileSideBarProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
}

const MobileSideBar: FC<IMobileSideBarProps> = ({ setOpen, open }) => {
	const { user } = useContext(AuthContext);
	const role = user?.role || 'employee';
	const items = SIDEBAR_ROLES[role as Role];
	return (
		<>
			<Overlay
				onExit={() => setOpen(false)}
				className={clsx('lg:hidden z-10', !open && 'invisible w-0 h-0')}
			/>
			<nav
				className={clsx(
					'flex flex-col gap-5 basis-2/12 transition-all lg:hidden bg-neutral-900 h-full fixed top-0 pl-3 pr-5 pt-[78px] z-10 overflow-y-auto',
					open ? 'left-0' : '-left-full'
				)}
				style={{
					width: 'max(45%,200px)',
				}}
				onClick={(e) => e.stopPropagation()}
			>
				{items.map((item, index) => (
					<MenuItem item={item} key={item.label} index={index} />
				))}
			</nav>{' '}
		</>
	);
};

export default MobileSideBar;
