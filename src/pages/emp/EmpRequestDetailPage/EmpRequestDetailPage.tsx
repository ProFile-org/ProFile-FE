import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import TextareaWithLabel from '@/components/InputWithLabel/TextareaWithLabel.component';
import { AUTH_ROUTES } from '@/constants/routes';
import { GetDocumentByIdResponse, GetRequestByIdResponse } from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link, Navigate, useParams } from 'react-router-dom';
import QRCode from 'qrcode';
import { SkeletonPage } from '@/components/Skeleton';
import CustomCalendar from '@/components/Calendar/Calendar.component';
import { REQUEST_STATUS } from '@/constants/status';

const NO_ACTIONS = [
	REQUEST_STATUS.CANCELLED,
	REQUEST_STATUS.CHECKED_OUT,
	REQUEST_STATUS.RETURNED,
	REQUEST_STATUS.REJECTED,
	REQUEST_STATUS.LOST,
	REQUEST_STATUS.NOT_PROCESSABLE,
];

const EmpRequestDetailPage = () => {
	const { requestId } = useParams<{ requestId: string }>();
	const [qr, setQr] = useState('');
	const { data, refetch: refetchRequest } = useQuery(
		['request', requestId],
		async () => (await axiosClient.get<GetRequestByIdResponse>(`/borrows/${requestId}`)).data,
		{
			enabled: !!requestId,
			onSuccess: async (data) => {
				const id = data?.data?.documentId || '';
				if (!id) return;
				const qrCode = await QRCode.toDataURL(id);
				setQr(qrCode);
			},
		}
	);

	const { documentId } = data ? data.data : { documentId: '' };

	const { data: document, isLoading } = useQuery(
		[requestId, documentId],
		async () => (await axiosClient.get<GetDocumentByIdResponse>(`/documents/${documentId}`)).data,
		{
			enabled: !!documentId,
		}
	);

	if (!requestId) return <Navigate to={AUTH_ROUTES.REQUESTS} />;

	if (!data || !document || isLoading) return <SkeletonPage />;

	const {
		title,
		documentType,
		folder: {
			name: folder,
			locker: { name: locker },
		},
	} = document.data;

	const { status, reason, borrowTime, dueTime } = data.data;

	const onCancel = async () => {
		try {
			await axiosClient.post(`/borrows/cancel/${requestId}`);
			await refetchRequest();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='flex gap-5 md:flex-row flex-col'>
			<div className='flex flex-col gap-5 flex-1'>
				<InformationPanel header='Document information'>
					<InputWithLabel label='Title' value={title} readOnly />
					<InputWithLabel label='Document type' value={documentType} readOnly />
					<div className='flex gap-5'>
						<InputWithLabel label='Locker' value={locker} wrapperClassName='flex-1' readOnly />
						<InputWithLabel label='Folder' value={folder} wrapperClassName='flex-1' readOnly />
					</div>
				</InformationPanel>
				<InformationPanel header='Borrow information'>
					<InputWithLabel label='Status' value={status} readOnly />
					<TextareaWithLabel label='Reason' value={reason} readOnly />
					<div className='flex gap-5'>
						<CustomCalendar
							label='Borrow date'
							wrapperClassName='flex-1'
							value={new Date(borrowTime)}
							readOnlyInput
							disabled
						/>
						<CustomCalendar
							label='Return date'
							wrapperClassName='flex-1'
							value={new Date(dueTime)}
							readOnlyInput
							disabled
						/>
					</div>
				</InformationPanel>
			</div>
			<div className='flex flex-col gap-5 w-full md:w-1/3'>
				<InformationPanel>
					{qr ? (
						<img src={qr} className='rounded-lg aspect-square' />
					) : (
						<div className='aspect-square bg-neutral-600 animate-pulse rounded-lg' />
					)}
					{NO_ACTIONS.indexOf(status) === -1 && (
						<Button
							label='Cancel'
							className='w-full h-11 rounded-lg'
							severity='danger'
							onClick={onCancel}
						/>
					)}
					<Link to={AUTH_ROUTES.REQUESTS}>
						<Button label='Return home' className='w-full h-11 rounded-lg btn-outlined' outlined />
					</Link>
				</InformationPanel>
			</div>
		</div>
	);
};

export default EmpRequestDetailPage;
