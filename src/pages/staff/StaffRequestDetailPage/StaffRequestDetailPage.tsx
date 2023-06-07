/* eslint-disable no-mixed-spaces-and-tabs */
import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import { SkeletonPage } from '@/components/Skeleton';
import { AUTH_ROUTES } from '@/constants/routes';
import { REQUEST_STATUS } from '@/constants/status';
import {
	BaseResponse,
	GetDocumentByIdResponse,
	GetRequestByIdResponse,
	GetUserByIdResponse,
} from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { AxiosError } from 'axios';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { Navigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';

const NO_ACTIONS = [
	REQUEST_STATUS.Cancelled.status,
	REQUEST_STATUS.CheckedOut.status,
	REQUEST_STATUS.NotProcessable.status,
	REQUEST_STATUS.Returned.status,
];

const StaffRequestDetailPage = () => {
	const { requestId } = useParams<{ requestId: string }>();
	const [error, setError] = useState('');
	const { data, refetch } = useQuery(
		['requests', requestId],
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
			const axiosError = error as AxiosError<BaseResponse>;
			const message = axiosError.response?.data.message || 'Something went wrong';
			console.log(error);
			setError(message);
		}
	};

	const onDeny = async () => {
		try {
			await axiosClient.post(`/borrows/reject/${requestId}`);
			await refetch();
		} catch (error) {
			const axiosError = error as AxiosError<BaseResponse>;
			const message = axiosError.response?.data.message || 'Something went wrong';
			console.log(error);
			setError(message);
		}
	};

	const onCheckout = async () => {
		try {
			await axiosClient.post(`/borrows/checkout/${requestId}`);
			await refetch();
		} catch (error) {
			const axiosError = error as AxiosError<BaseResponse>;
			const message = axiosError.response?.data.message || 'Something went wrong';
			console.log(error);
			setError(message);
		}
	};

	return (
		<div className='flex gap-5 flex-col md:flex-row'>
			<div className='flex flex-col gap-5 flex-1'>
				<InformationPanel title='Document information'>
					<InputWithLabel label='Document ID' value={documentId} readOnly />
					<InputWithLabel label='Types' value={documentType} readOnly />
					<InputWithLabel label='Title' value={title} readOnly />
					<div className='flex gap-5'>
						<InputWithLabel label='Locker' value={locker} readOnly />
						<InputWithLabel label='Folder' value={folder} readOnly />
					</div>
				</InformationPanel>
				<InformationPanel title='Borrower information'>
					<InputWithLabel label='Employee ID' value={employeeId} readOnly />
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
				<InformationPanel>
					<div className='flex flex-row gap-4'>
						{NO_ACTIONS.indexOf(status) !== -1 ? null : status ===
						  REQUEST_STATUS.Approved.status ? (
							<Button label='Checkout' className='h-11 rounded-l flex-1' onClick={onCheckout} />
						) : (
							<>
								<Button label='Approve' className='h-11 rounded-lg flex-1' onClick={onApprove} />
								{status === REQUEST_STATUS.Rejected.status ? null : (
									<Button
										label='Deny'
										severity='danger'
										className='h-11 rounded-lg flex-1'
										onClick={onDeny}
									/>
								)}
							</>
						)}
						{/* Add return home outlined */}
						<Link to={AUTH_ROUTES.REQUESTS} className='flex-1 flex-shrink-0'>
							<Button label='Return home' className='h-11 rounded-lg btn-outlined w-max' outlined />
						</Link>
					</div>
					{error && <div className='text-red-500'>{error}</div>}
				</InformationPanel>
			</div>
		</div>
	);
};

export default StaffRequestDetailPage;
