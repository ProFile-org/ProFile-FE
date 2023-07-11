import { AUTH_ROUTES } from '@/constants/routes';
import { IDrive } from '@/types/item';
import clsx from 'clsx';
import { PrimeIcons } from 'primereact/api';
import { Link } from 'react-router-dom';
import { useState, MouseEvent } from 'react';

const Folder = ({
	currentPath,
	folder,
	shared = false,
	onContextMenu,
}: {
	currentPath: string;
	folder: IDrive;
	shared?: boolean;
	onContextMenu: (value: string, e: MouseEvent, type: 'folder') => void;
}) => {
	const [hover, setHover] = useState(false);
	const link = `${shared ? AUTH_ROUTES.DRIVE_SHARED : AUTH_ROUTES.DRIVE}?path=${encodeURIComponent(
		currentPath
	)}${encodeURIComponent(`${shared ? folder.id : `/${folder.name}`}`)}`;

	return (
		<>
			<Link
				to={link}
				className='group'
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
				onContextMenu={(e) => {
					onContextMenu(folder.id, e, 'folder');
				}}
			>
				<div className='flex flex-col items-center w-full bg-neutral-900 p-3 rounded-lg'>
					<div className='p-5 bg-neutral-800 rounded-lg transition-colors'>
						{hover ? (
							<i
								className={clsx(
									PrimeIcons.FOLDER_OPEN,
									'text-7xl group-hover:text-primary transition-colors'
								)}
							/>
						) : (
							<i
								className={clsx(
									PrimeIcons.FOLDER,
									'text-7xl group-hover:text-primary transition-colors'
								)}
							/>
						)}
					</div>
					<h3 className='text-center text-lg font-medium mt-2'>{folder.name}</h3>
				</div>
			</Link>
		</>
	);
};

export default Folder;
