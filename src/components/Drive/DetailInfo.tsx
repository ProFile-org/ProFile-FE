import { IDrive } from '@/types/item';
import clsx from 'clsx';
import { PrimeIcons } from 'primereact/api';
import { TextOverflow } from '.';
import { fileSizeFormatter } from '@/utils/formatter';

const DetailInfo = ({
	showInfo,
	setShowInfo,
}: {
	showInfo: IDrive | null;
	setShowInfo: (value: IDrive | null) => void;
}) => {
	return (
		<div
			className={clsx(
				'card transition-all h-max min-h-[500px] ml-5 sticky top-5',
				showInfo ? 'w-[400px] opacity-100' : 'w-0 overflow-hidden p-0 opacity-0'
			)}
		>
			<div
				className='text-right hover:text-red-500 cursor-pointer'
				onClick={() => setShowInfo(null)}
			>
				<i className={PrimeIcons.TIMES} />
			</div>
			{showInfo && (
				<>
					<h3 className='text-xl font-semibold whitespace-nowrap text-ellipsis overflow-hidden max-w-[200px]'>
						{showInfo.name}
					</h3>
					<div className='flex items-center justify-center mt-3 bg-neutral-700 p-3 rounded-lg'>
						<i
							className={clsx(
								'text-[80px]',
								showInfo.isDirectory ? PrimeIcons.FOLDER : PrimeIcons.FILE
							)}
						/>
					</div>
					<h3 className='text-xl font-semibold whitespace-nowrap mt-5'>
						{showInfo.isDirectory ? 'Folder' : 'File'} information
					</h3>
					<div className='grid grid-cols-2 mt-3 gap-y-2 gap-x-10'>
						<div>Sizes</div>
						<div className='text-right col-span-1'>
							{fileSizeFormatter(showInfo.sizeInBytes || 0)}
						</div>
						<div>Location</div>
						<div className='text-right col-span-1'>{showInfo.path}</div>
						<div>Owner</div>
						<TextOverflow>{showInfo.owner.email}</TextOverflow>
						<div>Created</div>
						<div className='text-right col-span-1'>
							{new Date(showInfo.created).toLocaleDateString()}
						</div>
						<div>Created by</div>
						<TextOverflow>{showInfo.owner.email}</TextOverflow>
						<div>Last modified</div>
						<div className='text-right col-span-1'>
							{showInfo.lastModified
								? new Date(showInfo.lastModified).toLocaleDateString()
								: 'Never'}
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default DetailInfo;
