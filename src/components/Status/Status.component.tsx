import { DOCUMENT_STATUS, REQUEST_STATUS } from '@/constants/status';
import { IBorrowRequest, IDocument, IFolder, ILocker } from '@/types/item';
import clsx from 'clsx';
import { FC, HTMLAttributes } from 'react';

interface IStatusBorrowProps {
	item: IBorrowRequest;
	type: 'request';
}

interface IStatusDocumentProps {
	item: IDocument;
	type: 'document';
}

interface IStatusLockerProps {
	item: ILocker;
	type: 'locker';
}

interface IStatusFolderProps {
	item: IFolder;
	type: 'folder';
}

type IStatusProps = (
	| IStatusBorrowProps
	| IStatusDocumentProps
	| IStatusLockerProps
	| IStatusFolderProps
) &
	HTMLAttributes<HTMLSpanElement>;

const Status: FC<IStatusProps> = ({ item, type, className, ...rest }) => {
	if (type === 'document')
		return (
			<span
				className={clsx(
					'px-2 py-1 rounded-lg text-white text-center flex items-center justify-center',
					DOCUMENT_STATUS[item.status].color,
					className
				)}
				{...rest}
			>
				{item.status}
			</span>
		);

	if (type === 'request')
		return (
			<span
				className={clsx(
					'px-2 py-1 rounded-lg text-white text-center flex items-center justify-center',
					REQUEST_STATUS[item.status].color,
					className
				)}
				{...rest}
			>
				{item.status}
			</span>
		);

	return (
		<span
			className={clsx(
				'px-2 py-1 rounded-lg text-white text-center flex items-center justify-center',
				item.isAvailable ? 'bg-green-500' : 'bg-red-500',
				className
			)}
			{...rest}
		>
			{item.isAvailable ? 'Available' : 'Not available'}
		</span>
	);
};

export default Status;
