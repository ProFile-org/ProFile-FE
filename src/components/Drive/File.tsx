import { IDrive } from '@/types/item';
import clsx from 'clsx';
import { PrimeIcons } from 'primereact/api';
import { MouseEvent } from 'react';

const File = ({
	// shared = false,
	file,
	onContextMenu,
}: {
	shared?: boolean;
	file: IDrive;
	onContextMenu: (value: string, e: MouseEvent, type: 'file') => void;
}) => {
	return (
		<>
			<div
				onContextMenu={(e) => {
					onContextMenu(file.id, e, 'file');
				}}
			>
				<div className='flex flex-col items-center w-full p-3 rounded-lg bg-neutral-900'>
					<div className='p-5 bg-neutral-800 rounded-lg group transition-colors'>
						<i
							className={clsx(
								PrimeIcons.FILE,
								'text-7xl group-hover:text-primary transition-colors'
							)}
						/>
					</div>
					<h3 className='text-center text-lg font-medium mt-2 max-w-full break-words'>
						{file.name}
					</h3>
				</div>
			</div>
		</>
	);
};

export default File;
