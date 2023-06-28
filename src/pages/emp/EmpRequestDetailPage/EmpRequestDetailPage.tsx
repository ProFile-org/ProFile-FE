import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import TextareaWithLabel from '@/components/InputWithLabel/TextareaWithLabel.component';
import { AUTH_ROUTES } from '@/constants/routes';
import { GetDocumentByIdResponse, GetRequestByIdResponse } from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { Button } from 'primereact/button';
import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Link, Navigate, useParams } from 'react-router-dom';
import QRCode from 'qrcode';
import { SkeletonPage } from '@/components/Skeleton';
import CustomCalendar from '@/components/Calendar/Calendar.component';
import { REQUEST_STATUS } from '@/constants/status';
import ErrorTemplate from '@/components/ErrorTemplate/ErrorTemplate.component';

const NO_ACTIONS = [
	REQUEST_STATUS.Cancelled.status,
	REQUEST_STATUS.CheckedOut.status,
	REQUEST_STATUS.Returned.status,
	REQUEST_STATUS.Rejected.status,
	REQUEST_STATUS.Lost.status,
	REQUEST_STATUS.NotProcessable.status,
];

type Values = {
	borrowReason: string;
	borrowTime?: string | null | Date;
	dueTime?: string | null | Date;
};

const EmpRequestDetailPage = () => {
	const { requestId } = useParams<{ requestId: string }>();
	const [qr, setQr] = useState('');
	const { data, refetch: refetchRequest } = useQuery(
		['requests', requestId],
		async () =>
			(await axiosClient.get<GetRequestByIdResponse>(`/documents/borrows/${requestId}`)).data,
		{
			enabled: !!requestId,
		}
	);
	const [editMode, setEditMode] = useState(false);
	const [values, setValues] = useState<Values>({
		borrowReason: '',
		borrowTime: '',
		dueTime: '',
	});

	useEffect(() => {
		const renderQr = async () => {
			const { documentId } = data?.data || { documentId: '' };
			if (!documentId) return;
			const qrCode = await QRCode.toDataURL(documentId);
			setQr(qrCode);
		};

		const updateValues = () => {
			const { borrowReason, borrowTime, dueTime } = data?.data || {
				borrowReason: 'This is a reason',
				borrowTime: new Date(),
				dueTime: new Date(new Date().setDate(new Date().getDate() + 7)),
			};
			setValues({ borrowReason, borrowTime, dueTime });
		};
		updateValues();
		renderQr();
	}, [data]);

	const { documentId } = data ? data.data : { documentId: '' };

	const { data: document, isLoading } = useQuery(
		[requestId, documentId],
		async () => (await axiosClient.get<GetDocumentByIdResponse>(`/documents/${documentId}`)).data,
		{
			enabled: !!documentId,
		}
	);

	if (!requestId) return <Navigate to={AUTH_ROUTES.REQUESTS} />;

	if (isLoading) return <SkeletonPage />;
	// if (!document || !data)
	// 	return (
	// 		<ErrorTemplate
	// 			code={404}
	// 			message='Request not found'
	// 			url={AUTH_ROUTES.REQUESTS}
	// 			btnText='Return home'
	// 		/>
	// 	);

	// const {
	// 	title,
	// 	documentType,
	// 	// folder: {
	// 	// 	name: folder,
	// 	// 	locker: { name: locker },
	// 	// },
	// } = document.data;

	const folder = '',
		locker = '',
		title = '',
		documentType = '';

	const status = 'Pending';

	// const { status, borrowReason, borrowTime, dueTime } = data.data;

	const onCancel = async () => {
		try {
			await axiosClient.post(`/documents/borrows/cancel/${requestId}`);
			await refetchRequest();
		} catch (error) {
			console.log(error);
		}
	};

	const onUpdate = async () => {
		if (!values.borrowReason || !values.borrowTime || !values.dueTime) return;
		if (JSON.stringify(values) === JSON.stringify(data?.data)) return;
		try {
			await axiosClient.put(`/documents/borrows/${requestId}`, {
				reason: values.borrowReason,
				borrowFrom: values.borrowTime,
				borrowTo: values.dueTime,
			});
			await refetchRequest();
			setEditMode(false);
		} catch (error) {
			console.log(error);
		}
	};

	const onEditCancel = () => {
		setEditMode(false);
		setValues({
			borrowReason: data?.data.borrowReason || 'This is a reason',
			borrowTime: data?.data.borrowTime || new Date(),
			dueTime: data?.data.dueTime || new Date(new Date().setDate(new Date().getDate() + 7)),
		});
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
					<TextareaWithLabel
						label='Reason'
						value={values.borrowReason}
						readOnly={!editMode}
						onChange={(e) => setValues((prev) => ({ ...prev, borrowReason: e.target.value }))}
						error={values.borrowReason === ''}
						small={values.borrowReason === '' ? 'Please enter a reason' : ''}
					/>
					<div className='flex gap-5'>
						<CustomCalendar
							label='Borrow date'
							wrapperClassName='flex-1'
							selectionMode='range'
							value={values.borrowTime ? [values.borrowTime as Date, values.dueTime as Date] : []}
							readOnlyInput={!editMode}
							disabled={!editMode}
							onChange={(e) => {
								if (e.value === null) {
									setValues((prev) => ({ ...prev, borrowTime: null, dueTime: null }));
									return;
								}
								const [borrowTime, dueTime] = e.value as Date[];
								setValues((prev) => ({ ...prev, borrowTime, dueTime }));
							}}
							error={!values.borrowTime || !values.dueTime}
							small={!values.borrowTime || !values.dueTime ? 'Please select a date' : ''}
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
					{status === REQUEST_STATUS.Pending.status && (
						<Button
							label={editMode ? 'Save' : 'Edit'}
							className='w-full h-11 rounded-lg'
							onClick={() => {
								if (editMode) onUpdate();
								else setEditMode(!editMode);
							}}
							disabled={editMode && (values.borrowReason === '' || values.borrowTime === '')}
						/>
					)}
					{NO_ACTIONS.indexOf(status) === -1 && (
						<Button
							label='Cancel'
							className='w-full h-11 rounded-lg'
							severity='danger'
							onClick={() => {
								if (!editMode) onCancel();
								else onEditCancel();
							}}
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
