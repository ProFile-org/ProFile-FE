import { REQUEST_STATUS } from '@/constants/status';
import { IBorrowRequest } from '@/types/item';
import clsx from 'clsx';
import { FC } from 'react';

interface IStatusProps {
	request: IBorrowRequest;
}

const Status: FC<IStatusProps> = ({ request }) => {
	let statusClass = '';

	switch (request.status) {
		case REQUEST_STATUS.PENDING:
			statusClass = 'bg-yellow-500';
			break;
		case REQUEST_STATUS.APPROVED:
			statusClass = 'bg-green-500';
			break;
		case REQUEST_STATUS.REJECTED:
			statusClass = 'bg-red-500';
			break;
		case REQUEST_STATUS.CANCELLED:
			statusClass = 'bg-orange-500';
			break;
		case REQUEST_STATUS.CHECKED_OUT:
			statusClass = 'bg-blue-500';
			break;
		default:
			statusClass = 'bg-primary';
	}

	return (
		<span className={clsx('px-2 py-1 rounded-lg text-white text-center', statusClass)}>
			{request.status}
		</span>
	);
};

export default Status;
