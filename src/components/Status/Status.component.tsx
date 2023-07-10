import { DOCUMENT_STATUS, REQUEST_STATUS } from '@/constants/status';
import {
	IBorrowRequest,
	IDocument,
	IFolder,
	IImportRequest,
	ILocker,
	IRoom,
	IUser,
} from '@/types/item';
import clsx from 'clsx';
import { FC, HTMLAttributes } from 'react';

interface IStatusBorrowProps {
	item: IBorrowRequest;
	type: 'request';
}

interface IStatusDocumentProps {
	item: IDocument | IImportRequest;
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

interface IStatusRoomProps {
	item: IRoom;
	type: 'room';
}

interface IStatusUserActiveProps {
	item: IUser;
	type: 'user_active';
}

interface IStatusUserActivatedProps {
	item: IUser;
	type: 'user_activated';
}

type IStatusProps = (
	| IStatusBorrowProps
	| IStatusDocumentProps
	| IStatusLockerProps
	| IStatusFolderProps
	| IStatusRoomProps
	| IStatusUserActiveProps
	| IStatusUserActivatedProps
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

	if (type === 'user_activated') {
		return (
			<span
				className={clsx(
					'px-2 py-1 rounded-lg text-white text-center flex items-center justify-center',
					item.isActivated ? 'bg-green-500' : 'bg-red-500',
					className
				)}
				{...rest}
			>
				{item.isActivated ? 'Activated' : 'Not activated'}
			</span>
		);
	}

	if (type === 'user_active') {
		return (
			<span
				className={clsx(
					'px-2 py-1 rounded-lg text-white text-center flex items-center justify-center',
					item.isActive ? 'bg-green-500' : 'bg-red-500',
					className
				)}
				{...rest}
			>
				{item.isActive ? 'Active' : 'Not active'}
			</span>
		);
	}

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
