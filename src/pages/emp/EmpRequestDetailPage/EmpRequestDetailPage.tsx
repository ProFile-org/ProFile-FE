import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import TextareaWithLabel from '@/components/InputWithLabel/TextareaWithLabel.component';
import { AUTH_ROUTES } from '@/constants/routes';
import {
	BaseResponse,
	GetDocumentByIdResponse,
	GetRequestByIdResponse,
	PostRequestResponse,
} from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { Button } from 'primereact/button';
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Link, Navigate, useParams } from 'react-router-dom';
import QRCode from 'qrcode';
import { SkeletonPage } from '@/components/Skeleton';
import CustomCalendar from '@/components/Calendar/Calendar.component';
import { REQUEST_STATUS } from '@/constants/status';
import ErrorTemplate from '@/components/ErrorTemplate/ErrorTemplate.component';
import { Formik, FormikHelpers } from 'formik';
import { AxiosError } from 'axios';

const NO_ACTIONS = [
	REQUEST_STATUS.Approved.status,
	REQUEST_STATUS.Cancelled.status,
	REQUEST_STATUS.CheckedOut.status,
	REQUEST_STATUS.Returned.status,
	REQUEST_STATUS.Rejected.status,
	REQUEST_STATUS.Lost.status,
	REQUEST_STATUS.NotProcessable.status,
];

type InitialValues = {
	reason: string;
	dates: Date[];
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
	const queryClient = useQueryClient();

	useEffect(() => {
		const renderQr = async () => {
			const { documentId } = data?.data || { documentId: '' };
			if (!documentId) return;
			const qrCode = await QRCode.toDataURL(documentId);
			setQr(qrCode);
		};
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
	if (!document || !data)
		return (
			<ErrorTemplate
				code={404}
				message='Request not found'
				url={AUTH_ROUTES.REQUESTS}
				btnText='Return home'
			/>
		);

	const {
		title,
		documentType,
		folder: {
			name: folder,
			locker: { name: locker },
		},
	} = document.data;

	const { status } = data.data;

	const initialValues = {
		dates: [new Date(data.data.borrowTime), new Date(data.data.dueTime)],
		reason: data.data.borrowReason || '',
	};

	const onCancel = async () => {
		try {
			await axiosClient.post(`/documents/borrows/cancel/${requestId}`);
			await refetchRequest();
		} catch (error) {
			console.log(error);
		}
	};

	const validate = (values: InitialValues) => {
		const error = {} as { [key: string]: string | Date[] };
		Object.entries(values).forEach(([key, value]) => {
			if (key === 'dates') {
				const values = value as Date[];
				if (!values || !values[0] || !values[1]) {
					error[key] = 'Must provide borrow and return date';
				}
			}
			if (!value) error[key] = 'Required';
		});
		return error;
	};

	const onSubmit = async (
		values: InitialValues,
		{ setFieldError, setFieldTouched }: FormikHelpers<InitialValues>
	) => {
		const { dates, reason } = values;
		if (!dates || dates.length !== 2) {
			setFieldTouched('dates', true, false);
			setFieldError('dates', 'Missing information');
			return;
		}
		try {
			await axiosClient.put<PostRequestResponse>(`/documents/borrows/${requestId}`, {
				borrowFrom: dates[0].toISOString(),
				borrowTo: dates[1].toISOString(),
				reason: reason,
			});
			queryClient.invalidateQueries(['requests']);
		} catch (error) {
			const axiosError = error as AxiosError<BaseResponse>;
			setFieldError('id', axiosError.response?.data?.message || 'Bad request');
		}
	};

	return (
		<Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
			{({
				values,
				touched,
				errors,
				handleChange,
				handleBlur,
				resetForm,
				submitForm,
				isValid,
				isSubmitting,
			}) => (
				<div className='flex gap-5 md:flex-row flex-col'>
					<div className='flex flex-col gap-5 flex-1'>
						<InformationPanel header='Document information'>
							<InputWithLabel label='Title' value={title} readOnly disabled={editMode} />
							<InputWithLabel
								label='Document type'
								value={documentType}
								readOnly
								disabled={editMode}
							/>
							<div className='flex gap-5'>
								<InputWithLabel
									label='Locker'
									value={locker}
									wrapperClassName='flex-1'
									readOnly
									disabled={editMode}
								/>
								<InputWithLabel
									label='Folder'
									value={folder}
									wrapperClassName='flex-1'
									readOnly
									disabled={editMode}
								/>
							</div>
						</InformationPanel>
						<InformationPanel header='Borrow information'>
							<InputWithLabel label='Status' value={status} readOnly disabled={editMode} />
							<TextareaWithLabel
								label='Reason'
								readOnly={!editMode}
								value={values.reason}
								onChange={handleChange}
								onBlur={handleBlur}
								id='reason'
								name='reason'
								error={touched.reason && !!errors.reason}
								small={touched.reason ? errors.reason : undefined}
							/>
							<div className='flex gap-5'>
								<CustomCalendar
									label='Borrow date'
									showIcon
									value={values.dates || []}
									wrapperClassName='flex-1'
									numberOfMonths={1}
									name='dates'
									id='dates'
									selectionMode='range'
									onChange={handleChange}
									onBlur={handleBlur}
									error={touched.dates && !!errors.dates}
									small={touched.dates ? (errors.dates as string) : undefined}
									disabled={!editMode}
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
										if (!editMode) {
											setEditMode(true);
											return;
										}
										submitForm();
									}}
									disabled={!isValid || isSubmitting}
								/>
							)}
							{NO_ACTIONS.indexOf(status) === -1 && (
								<Button
									label='Cancel'
									className='w-full h-11 rounded-lg'
									severity='danger'
									disabled={isSubmitting}
									onClick={() => {
										if (!editMode) onCancel();
										else {
											resetForm();
											setEditMode(false);
										}
									}}
								/>
							)}
							<Link to={AUTH_ROUTES.REQUESTS}>
								<Button
									label='Return home'
									className='w-full h-11 rounded-lg btn-outlined'
									outlined
								/>
							</Link>
						</InformationPanel>
					</div>
				</div>
			)}
		</Formik>
	);
};

export default EmpRequestDetailPage;
