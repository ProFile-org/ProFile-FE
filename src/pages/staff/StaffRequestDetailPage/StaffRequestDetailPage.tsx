import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import { SkeletonPage } from '@/components/Skeleton';
import { AUTH_ROUTES } from '@/constants/routes';
import { REQUEST_STATUS } from '@/constants/status';
import {
	GetDocumentByIdResponse,
	GetRequestByIdResponse,
	GetUserByIdResponse,
} from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { Button } from 'primereact/button';
import { useQuery } from 'react-query';
import { Navigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';

const NO_ACTIONS = [
	REQUEST_STATUS.CANCELLED,
	REQUEST_STATUS.REJECTED,
	REQUEST_STATUS.CHECKED_OUT,
	REQUEST_STATUS.NOT_PROCESSABLE,
	REQUEST_STATUS.RETURNED,
];

const StaffRequestDetailPage = () => {
	const { requestId } = useParams<{ requestId: string }>();
	const { data, refetch } = useQuery(
		['request', requestId],
		async () => (await axiosClient.get<GetRequestByIdResponse>(`/borrows/${requestId}`)).data,
		{
			enabled: !!requestId,
		}
	);

	const { documentId, borrowerId } = data ? data.data : { documentId: '', borrowerId: '' };

	const { data: document, isLoading } = useQuery(
		[requestId, documentId],
		async () => (await axiosClient.get<GetDocumentByIdResponse>(`/documents/${documentId}`)).data,
		{
			enabled: !!documentId,
		}
	);

	const { data: employee, isLoading: isEmployeeLoading } = useQuery(
		['employee', borrowerId, requestId],
		async () => (await axiosClient.get<GetUserByIdResponse>(`/users/${borrowerId}`)).data,
		{
			enabled: !!requestId && !!borrowerId,
		}
	);

	if (!requestId) return <Navigate to={AUTH_ROUTES.REQUESTS} />;

	if (!data || !document || !employee || isLoading || isEmployeeLoading) return <SkeletonPage />;

	const {
		title,
		documentType,
		folder: {
			name: folder,
			locker: { name: locker },
		},
	} = document.data;

	const { id: employeeId, lastName, firstName } = employee.data;

	const { borrowTime, dueTime, reason, status } = data.data;

	const onApprove = async () => {
		try {
			await axiosClient.post(`/borrows/approve/${requestId}`);
			await refetch();
		} catch (error) {
			console.log(error);
		}
	};

	const onDeny = async () => {
		try {
			await axiosClient.post(`/borrows/reject/${requestId}`);
			await refetch();
		} catch (error) {
			console.log(error);
		}
	};

	const onCheckout = async () => {
		try {
			await axiosClient.post(`/borrows/checkout/${requestId}`);
			await refetch();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='flex gap-5 flex-col md:flex-row'>
			<div className='flex flex-col gap-5 flex-1'>
				<InformationPanel title='Document information'>
					<InputWithLabel label='ID' value={requestId} readOnly />
					<InputWithLabel label='Types' value={documentType} readOnly />
					<InputWithLabel label='Title' value={title} readOnly />
					<div className='flex gap-5'>
						<InputWithLabel label='Locker' value={locker} readOnly />
						<InputWithLabel label='Folder' value={folder} readOnly />
					</div>
				</InformationPanel>
				<InformationPanel title='Borrower information'>
					<InputWithLabel label='ID' value={employeeId} readOnly />
					<InputWithLabel label='Name' value={`${firstName} ${lastName}`} readOnly />
					<InputWithLabel label='Department' value={'Accounting'} readOnly />
				</InformationPanel>
			</div>
			<div className='flex flex-col gap-5 flex-1'>
				<InformationPanel title='Borrow information' className='h-max'>
					<InputWithLabel label='Status' value={status} readOnly />
					<InputWithLabel label='Borrow date' value={borrowTime} readOnly />
					<InputWithLabel label='Return date' value={dueTime} readOnly />
					<InputWithLabel label='Reasons' value={reason} readOnly />
				</InformationPanel>
				<InformationPanel direction='row'>
					{NO_ACTIONS.indexOf(status) !== -1 ? null : status === 'Approved' ? (
						<Button label='Checkout' className='h-11 rounded-l flex-1' onClick={onCheckout} />
					) : (
						<>
							<Button label='Approve' className='h-11 rounded-lg flex-1' onClick={onApprove} />
							<Button
								label='Deny'
								severity='danger'
								className='h-11 rounded-lg flex-1'
								onClick={onDeny}
							/>
						</>
					)}
					{/* Add return home outlined */}
					<Link to={AUTH_ROUTES.REQUESTS} className='flex-1 flex-shrink-0'>
						<Button label='Return home' className='h-11 rounded-lg btn-outlined w-max' outlined />
					</Link>
				</InformationPanel>
			</div>
		</div>
	);
};

export default StaffRequestDetailPage;
