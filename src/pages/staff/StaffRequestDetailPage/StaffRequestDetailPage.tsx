/* eslint-disable no-mixed-spaces-and-tabs */
import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import Overlay from '@/components/Overlay/Overlay.component';
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
import clsx from 'clsx';
import { PrimeIcons } from 'primereact/api';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { Navigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';

const NO_ACTIONS = [
	REQUEST_STATUS.Cancelled.status,
	REQUEST_STATUS.NotProcessable.status,
	REQUEST_STATUS.Returned.status,
	REQUEST_STATUS.Lost.status,
];

const StaffRequestDetailPage = () => {
	const { requestId } = useParams<{ requestId: string }>();
	const [error, setError] = useState('');
	const [showModal, setShowModal] = useState('');
	const [reason, setReason] = useState('');
	const { data, refetch } = useQuery(
		['requests', requestId],
		async () =>
			(await axiosClient.get<GetRequestByIdResponse>(`/documents/borrows/${requestId}`)).data,
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

	const { borrowTime, dueTime, borrowReason, status, staffReason } = data.data;

	const onApprove = async () => {
		try {
			await axiosClient.put(`/documents/borrows/staffs/${requestId}`, {
				staffReason: reason,
				decision: 'approve',
			});
			await refetch();
		} catch (error) {
			const axiosError = error as AxiosError<BaseResponse>;
			const message = axiosError.response?.data.message || 'Bad request';
			console.log(error);
			setError(message);
		}
	};

	const onReject = async () => {
		try {
			await axiosClient.put(`/documents/borrows/staffs/${requestId}`, {
				staffReason: reason,
				decision: 'reject',
			});
			await refetch();
		} catch (error) {
			const axiosError = error as AxiosError<BaseResponse>;
			const message = axiosError.response?.data.message || 'Bad request';
			console.log(error);
			setError(message);
		}
	};

	const onCheckout = async () => {
		try {
			await axiosClient.post(`/documents/borrows/checkout/${requestId}`);
			await refetch();
		} catch (error) {
			const axiosError = error as AxiosError<BaseResponse>;
			const message = axiosError.response?.data.message || 'Bad request';
			console.log(error);
			setError(message);
		}
	};

	const onLost = async () => {
		try {
			await axiosClient.post(`/documents/borrows/lost/${requestId}`);
			await refetch();
		} catch (error) {
			const axiosError = error as AxiosError<BaseResponse>;
			const message = axiosError.response?.data.message || 'Bad request';
			console.log(error);
			setError(message);
		}
	};

	return (
		<div className='flex gap-5 flex-col md:flex-row'>
			<div className='flex flex-col gap-5 flex-1'>
				<InformationPanel header='Document information'>
					<InputWithLabel label='Document ID' value={documentId} readOnly />
					<InputWithLabel label='Types' value={documentType} readOnly />
					<InputWithLabel label='Title' value={title} readOnly />
					<div className='flex gap-5'>
						<InputWithLabel wrapperClassName='flex-1' label='Locker' value={locker} readOnly />
						<InputWithLabel wrapperClassName='flex-1' label='Folder' value={folder} readOnly />
					</div>
				</InformationPanel>
				<InformationPanel header='Borrower information'>
					<InputWithLabel label='Employee ID' value={employeeId} readOnly />
					<InputWithLabel label='Name' value={`${firstName} ${lastName}`} readOnly />
					<InputWithLabel label='Department' value={'Accounting'} readOnly />
				</InformationPanel>
			</div>
			<div className='flex flex-col gap-5 flex-1'>
				<InformationPanel header='Borrow information' className='h-max'>
					<InputWithLabel label='Status' value={status} readOnly />
					<InputWithLabel label='Borrow date' value={borrowTime} readOnly />
					<InputWithLabel label='Return date' value={dueTime} readOnly />
					<InputWithLabel label='Borrow reasons' value={borrowReason} readOnly />
					{staffReason && <InputWithLabel label='Staff reasons' value={staffReason} readOnly />}
				</InformationPanel>
				<InformationPanel>
					<div className='flex flex-row gap-4'>
						{NO_ACTIONS.indexOf(status) !== -1 ? null : status ===
								REQUEST_STATUS.CheckedOut.status || status === REQUEST_STATUS.Overdue.status ? (
							<Button
								label='Marked as lost'
								className='h-11 rounded-lg flex-1'
								severity='danger'
								onClick={onLost}
							/>
						) : status === REQUEST_STATUS.Approved.status ? (
							<Button label='Checkout' className='h-11 rounded-lg flex-1' onClick={onCheckout} />
						) : (
							<>
								<Button
									label='Approve'
									className='h-11 rounded-lg flex-1'
									onClick={() => {
										setShowModal('approve');
									}}
								/>
								{status === REQUEST_STATUS.Rejected.status ? null : (
									<Button
										label='Deny'
										severity='danger'
										className='h-11 rounded-lg flex-1'
										onClick={() => {
											setShowModal('reject');
										}}
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
			{showModal && (
				<Overlay onExit={() => setShowModal('')} className='flex items-center justify-center'>
					<div className='bg-neutral-800 p-5 rounded-lg' onClick={(e) => e.stopPropagation()}>
						<div className='flex justify-between items-center'>
							<div className='title'>Confirmation</div>
							<i
								className={clsx(PrimeIcons.TIMES, 'hover:text-red-500 cursor-pointer text-lg')}
								onClick={() => setShowModal('')}
							/>
						</div>
						<div className='text-lg mt-5 title'>
							{showModal === 'approve'
								? 'Are you sure you want to approve this request?'
								: showModal === 'reject'
								? 'Are you sure you want to reject this request?'
								: 'Choose the folder to assign this document to'}
						</div>
						<InputWithLabel
							// label={`Reason for ${showModal === 'approve' ? 'approve' : 'reject'}`}
							label=''
							wrapperClassName='mt-1'
							value={reason}
							onChange={(e) => setReason(e.target.value)}
							placeholder='Enter your reason here'
						/>
						<div className='flex items-center gap-5 mt-5 justify-end'>
							<Button
								label='Cancel'
								outlined
								severity='danger'
								className='!text-white !border-red-500'
								onClick={() => setShowModal('')}
							/>
							<Button
								label={
									showModal === 'approve' ? 'Approve' : showModal === 'reject' ? 'Reject' : 'Assign'
								}
								onClick={() => {
									if (showModal === 'approve') onApprove();
									else if (showModal === 'reject') onReject();
								}}
							/>
						</div>
					</div>
				</Overlay>
			)}
		</div>
	);
};

export default StaffRequestDetailPage;
