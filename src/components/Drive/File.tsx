import { IDrive } from '@/types/item';
import clsx from 'clsx';
import { PrimeIcons } from 'primereact/api';
import { MouseEvent } from 'react';

const IconMapper = (type: string) => {
	if (type.includes('wordprocessingml')) {
		return (
			<svg xmlns='http://www.w3.org/2000/svg' height='80px' viewBox='0 0 384 512'>
				<path
					fill='currentColor'
					d='M48 448V64c0-8.8 7.2-16 16-16H224v80c0 17.7 14.3 32 32 32h80V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16zM64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V154.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0H64zm55 241.1c-3.8-12.7-17.2-19.9-29.9-16.1s-19.9 17.2-16.1 29.9l48 160c3 10.2 12.4 17.1 23 17.1s19.9-7 23-17.1l25-83.4 25 83.4c3 10.2 12.4 17.1 23 17.1s19.9-7 23-17.1l48-160c3.8-12.7-3.4-26.1-16.1-29.9s-26.1 3.4-29.9 16.1l-25 83.4-25-83.4c-3-10.2-12.4-17.1-23-17.1s-19.9 7-23 17.1l-25 83.4-25-83.4z'
				/>
			</svg>
		);
	}
	if (type.includes('presentationml')) {
		return (
			<svg xmlns='http://www.w3.org/2000/svg' height='80px' viewBox='0 0 384 512'>
				<path
					fill='currentColor'
					d='M64 464c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16H224v80c0 17.7 14.3 32 32 32h80V448c0 8.8-7.2 16-16 16H64zM64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V154.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0H64zm72 208c-13.3 0-24 10.7-24 24V336v56c0 13.3 10.7 24 24 24s24-10.7 24-24V360h44c42 0 76-34 76-76s-34-76-76-76H136zm68 104H160V256h44c15.5 0 28 12.5 28 28s-12.5 28-28 28z'
				/>
			</svg>
		);
	}
	if (type.includes('spreadsheetml')) {
		return (
			<svg xmlns='http://www.w3.org/2000/svg' height='80px' viewBox='0 0 384 512'>
				<path
					fill='currentColor'
					d='M48 448V64c0-8.8 7.2-16 16-16H224v80c0 17.7 14.3 32 32 32h80V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16zM64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V154.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0H64zm90.9 233.3c-8.1-10.5-23.2-12.3-33.7-4.2s-12.3 23.2-4.2 33.7L161.6 320l-44.5 57.3c-8.1 10.5-6.3 25.5 4.2 33.7s25.5 6.3 33.7-4.2L192 359.1l37.1 47.6c8.1 10.5 23.2 12.3 33.7 4.2s12.3-23.2 4.2-33.7L222.4 320l44.5-57.3c8.1-10.5 6.3-25.5-4.2-33.7s-25.5-6.3-33.7 4.2L192 280.9l-37.1-47.6z'
				/>
			</svg>
		);
	}
	return <i className={clsx(PrimeIcons.FILE, 'text-[80px]')} />;
};

const File = ({
	// shared = false,
	file,
	onContextMenu,
	showInfo,
}: // trashed = false,
{
	trashed?: boolean;
	shared?: boolean;
	file: IDrive;
	showInfo?: (file: IDrive | null) => void;
	onContextMenu: (value: string, e: MouseEvent, type: 'file') => void;
}) => {
	return (
		<>
			<div
				onContextMenu={(e) => {
					onContextMenu(file.id, e, 'file');
				}}
				onClick={() => {
					showInfo && showInfo(file);
				}}
				className='group w-full cursor-pointer max-w-[160px] h-full'
			>
				<div className='flex flex-col items-center p-3 rounded-lg bg-neutral-900 h-full'>
					<div className='p-3 bg-neutral-800 rounded-lg transition-colors flex items-center justify-center w-full aspect-square'>
						<span className='text-white group-hover:text-primary transition-colors'>
							{IconMapper(file.fileType as string)}
						</span>
					</div>
					<h3 className='text-center text-lg font-medium mt-2 max-w-full break-words line-clamp-2'>
						{file.name}
					</h3>
				</div>
			</div>
		</>
	);
};

export default File;
