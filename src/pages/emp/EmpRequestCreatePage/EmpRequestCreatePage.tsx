import CustomCalendar from '@/components/Calendar/Calendar.component';
import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import TextareaWithLabel from '@/components/InputWithLabel/TextareaWithLabel.component';
import Overlay from '@/components/Overlay/Overlay.component';
import QrScanner from '@/components/QrScanner/QrScanner.component';
import { AUTH_ROUTES } from '@/constants/routes';
import useQueryParams from '@/hooks/useQueryParams';
import {
	BaseResponse,
	GetDocumentByIdResponse,
	GetPermissionResponse,
	PostRequestResponse,
} from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { AxiosError } from 'axios';
import { Formik, FormikHelpers } from 'formik';
import { Button } from 'primereact/button';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

type InitialValues = {
	id: string;
	reason: string;
	dates: Date[];
};

const EmpRequestCreatePage = () => {
	const query = useQueryParams();
	const timeout = useRef<NodeJS.Timeout>();
	const initialValues = {
		id: query.get('id') || '',
		dates: [] as Date[],
		reason: '',
	};
	const [document, setDocument] = useState<GetDocumentByIdResponse['data'] | null>(null);
	const [openScan, setOpenScan] = useState(false);
	const navigate = useNavigate();

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

	const getDocumentById = async (id: string) => {
		if (!id) return null;
		if (timeout.current) clearTimeout(timeout.current);
		return await new Promise<GetDocumentByIdResponse | null>((resolve) => {
			timeout.current = setTimeout(async () => {
				try {
					const { data: borrow } = await axiosClient.get<GetPermissionResponse>(
						`/documents/${id}/permissions`
					);
					if (!borrow.data.canBorrow) resolve(null);
					const { data } = await axiosClient.get<GetDocumentByIdResponse>(`/documents/${id}`);
					resolve(data);
				} catch (error) {
					resolve(null);
				}
			}, 500);
		});
	};

	const onSubmit = async (
		values: InitialValues,
		{ setFieldError, setFieldTouched }: FormikHelpers<InitialValues>
	) => {
		const { id, dates, reason } = values;
		if (!dates || dates.length !== 2) {
			setFieldTouched('dates', true, false);
			setFieldError('dates', 'Missing information');
			return;
		}
		try {
			const { data } = await axiosClient.post<PostRequestResponse>('/documents/borrows', {
				documentId: id,
				borrowFrom: dates[0].toISOString(),
				borrowTo: dates[1].toISOString(),
				reason: reason,
			});
			navigate(`${AUTH_ROUTES.REQUESTS}/${data.data.id}`);
		} catch (error) {
			const axiosError = error as AxiosError<BaseResponse>;
			setFieldError('id', axiosError.response?.data?.message || 'Bad request');
		}
	};

	useEffect(() => {
		const fetch = async () => {
			try {
				const data = await getDocumentById(initialValues.id);
				if (!data) return;
				setDocument(data.data);
			} catch (error) {
				console.log(error);
			}
		};
		fetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleIdChange = async (
		id: string,
		// eslint-disable-next-line
		setFieldError: (field: string, value: string) => void
	) => {
		try {
			const doc = await getDocumentById(id);
			if (!doc) {
				setDocument(null);
				setFieldError('id', 'Document not found');
				return;
			}
			setDocument(doc.data);
			setFieldError('id', '');
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='flex gap-5'>
			<Formik initialValues={initialValues} onSubmit={onSubmit} validate={validate}>
				{({
					// isSubmitting,
					values,
					touched,
					errors,
					handleChange,
					handleBlur,
					handleSubmit,
					setFieldValue,
					setFieldError,
				}) => {
					// eslint-disable-next-line
					const onScan = async (e: any) => {
						const result = e?.getText();
						if (!result) return;
						setFieldValue('id', result);
						handleIdChange(result, setFieldError);
						setOpenScan(false);
					};
					return (
						<>
							<form onSubmit={handleSubmit} className='flex md:flex-row flex-col gap-5 w-full'>
								<InformationPanel header='Document information' className='flex-1'>
									<InputWithLabel
										label='ID'
										value={values.id || ''}
										name='id'
										id='id'
										onChange={async (e) => {
											handleChange(e);
											handleIdChange(e.target.value, setFieldError);
										}}
										onBlur={handleBlur}
										error={!!errors.id}
										small={errors.id || undefined}
										// sideComponent={
										// 	<Button
										// 		label='Scan'
										// 		className='self-end bg-primary rounded-lg h-11'
										// 		type='button'
										// 		onClick={() => setOpenScan(true)}
										// 		disabled={isSubmitting}
										// 	/>
										// }
									/>
									<InputWithLabel
										label='Title'
										value={document?.title || ''}
										name='title'
										id='title'
										readOnly
									/>
									<InputWithLabel
										label='Document type'
										value={document?.documentType || ''}
										name='documentType'
										id='documentType'
										readOnly
									/>
									<div className='flex gap-5'>
										<InputWithLabel
											label='Locker'
											value={document?.folder.locker.name || ''}
											wrapperClassName='flex-1'
											name='locker'
											id='locker'
											readOnly
										/>
										<InputWithLabel
											label='Folder'
											value={document?.folder.name || ''}
											wrapperClassName='flex-1'
											name='folder'
											id='folder'
											readOnly
										/>
									</div>
								</InformationPanel>
								<InformationPanel header='Borrow information' className='flex-1 h-max'>
									<TextareaWithLabel
										label='Reason'
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
											minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
										/>
									</div>
									<Button
										label='Submit'
										className='w-full h-11 bg-primary'
										type='submit'
										disabled={Object.values(errors).length !== 0}
									/>
								</InformationPanel>
							</form>
							{openScan && (
								<Overlay
									onExit={() => setOpenScan(false)}
									className='flex items-center justify-center'
								>
									<div className='card w-[70vw] min-w-[250px] sm:w-[50vh]'>
										<QrScanner onResult={onScan} />
										<Button
											label='Exit'
											className='h-11 rounded-lg w-full mt-5'
											onClick={() => setOpenScan(false)}
										/>
									</div>
								</Overlay>
							)}
						</>
					);
				}}
			</Formik>
		</div>
	);
};

export default EmpRequestCreatePage;
