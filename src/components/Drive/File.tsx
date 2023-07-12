import { IDrive } from '@/types/item';
import clsx from 'clsx';
import { PrimeIcons } from 'primereact/api';
import { MouseEvent } from 'react';

const File = ({
	// shared = false,
	file,
	onContextMenu,
}: // trashed = false,
{
	trashed?: boolean;
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
				className='w-max group'
			>
				<div className='flex flex-col items-center p-3 rounded-lg bg-neutral-900 w-max'>
					<div className='p-3 bg-neutral-800 rounded-lg transition-colors flex items-center justify-center w-full aspect-square'>
						<i
							className={clsx(
								PrimeIcons.FILE,
								'text-[100px] group-hover:text-primary transition-colors'
							)}
						/>
					</div>
					<h3 className='text-center text-lg font-medium mt-2 max-w-full break-words w-[160px]'>
						{file.name}
					</h3>
				</div>
			</div>
		</>
	);
};

export default File;
