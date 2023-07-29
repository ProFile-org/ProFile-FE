import { AUTH_ROUTES } from '@/constants/routes';
import { IDrive } from '@/types/item';
import clsx from 'clsx';
import { PrimeIcons } from 'primereact/api';
import { useState, MouseEvent, useRef } from 'react';
import { useNavigate } from 'react-router';

const Folder = ({
	currentPath,
	folder,
	shared = false,
	trashed = false,
	showInfo,
	onContextMenu,
}: {
	currentPath: string;
	folder: IDrive;
	shared?: boolean;
	trashed?: boolean;
	showInfo?: (folder: IDrive | null) => void;
	onContextMenu: (value: string, e: MouseEvent, type: 'folder') => void;
}) => {
	const [hover, setHover] = useState(false);
	const navigate = useNavigate();

	const link = `${
		shared ? AUTH_ROUTES.DRIVE_SHARED : trashed ? AUTH_ROUTES.DRIVE_TRASH : AUTH_ROUTES.DRIVE
	}?path=${encodeURIComponent(currentPath)}${encodeURIComponent(
		`${shared ? folder.id : `/${folder.name}`}`
	)}`;

	const doubleClick = useRef(false);

	const handleDoubleClick = () => {
		if (doubleClick.current) {
			showInfo && showInfo(null);
			navigate(link);
		} else {
			showInfo && showInfo(folder);
			doubleClick.current = true;
			setTimeout(() => {
				doubleClick.current = false;
			}, 300);
		}
	};

	return (
		<>
			<div
				onClick={handleDoubleClick}
				className={clsx('group w-full cursor-pointer max-w-[160px] h-full')}
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
				onContextMenu={(e) => {
					onContextMenu(folder.id, e, 'folder');
				}}
			>
				<div className='flex flex-col items-center p-3 rounded-lg bg-neutral-900 h-full'>
					<div className='p-3 bg-neutral-800 rounded-lg transition-colors aspect-square w-full flex items-center justify-center'>
						{hover ? (
							<i
								className={clsx(
									PrimeIcons.FOLDER_OPEN,
									'text-[80px] group-hover:text-primary transition-colors'
								)}
							/>
						) : (
							<i
								className={clsx(
									PrimeIcons.FOLDER,
									'text-[80px] group-hover:text-primary transition-colors'
								)}
							/>
						)}
					</div>
					<h3 className='text-center text-lg font-medium mt-2 max-w-full break-words line-clamp-2'>
						{folder.name}
					</h3>
				</div>
			</div>
		</>
	);
};

export default Folder;
