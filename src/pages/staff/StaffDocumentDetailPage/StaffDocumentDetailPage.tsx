import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import { AUTH_ROUTES } from '@/constants/routes';
import { BaseResponse, GetDocumentByIdResponse } from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { Button } from 'primereact/button';
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode';
import TextareaWithLabel from '@/components/InputWithLabel/TextareaWithLabel.component';
// import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.component';
import { Formik, FormikHelpers } from 'formik';
import { SkeletonPage } from '@/components/Skeleton';
import Status from '@/components/Status/Status.component';
import { AxiosError } from 'axios';
import ErrorTemplate from '@/components/ErrorTemplate/ErrorTemplate.component';

const StaffDocumentDetailPage = () => {
	const { documentId = '' } = useParams<{ documentId: string }>();
	const [qr, setQr] = useState('');
	const [editMode, setEditMode] = useState(false);
	const queryClient = useQueryClient();

	const { data, isLoading, error } = useQuery(
		['documents', documentId],
		async () => (await axiosClient.get<GetDocumentByIdResponse>(`/documents/${documentId}`)).data
	);

	useEffect(() => {
		const renderQr = async () => {
			const { id } = data?.data || { id: '' };
			if (!id) return;
			const qrCode = await QRCode.toDataURL(id);
			setQr(qrCode);
		};
		renderQr();
	}, [data]);

	if (isLoading) return <SkeletonPage />;

	if ((error as AxiosError)?.response?.status === 404 || !data)
		return <ErrorTemplate code={404} message='Document not found' url={AUTH_ROUTES.DOCUMENTS} />;

	const { title } = data.data;

	const folder = data.data.folder || {
		id: '',
		name: '',
		locker: {
			id: '',
			name: '',
		},
	};

	const {
		id: folderId,
		name: folderName,
		locker: { id: lockerId, name: lockerName } = {},
	} = folder;

	const initialValues = { ...data.data, folder };

	type FormValues = typeof initialValues;

	const onSubmit = async (values: FormValues, { setFieldError }: FormikHelpers<FormValues>) => {
		if (JSON.stringify(values) === JSON.stringify(initialValues)) return setEditMode(false);
		try {
			await axiosClient.put(`/documents/${documentId}`, {
				...values,
				documentType: values.documentType.toUpperCase(),
			});
			queryClient.invalidateQueries('documents');
			setEditMode(false);
		} catch (error) {
			const axiosError = error as AxiosError<BaseResponse>;
			setFieldError('title', axiosError?.response?.data?.message || 'Bad request');
		}
	};

	const validate = (values: FormValues) => {
		const errors: Partial<FormValues> = {};

		if (!values.title) errors.title = 'Title is required';
		if (!values.documentType) errors.documentType = 'Document type is required';

		return errors;
	};

	return (
		<div className='flex flex-col gap-5'>
			<div className='card py-3'>
				<h2 className='flex gap-2'>
					{lockerId && (
						<>
							<span>/</span>
							<Link to={`${AUTH_ROUTES.LOCKERS}/${lockerId}`} className='link-underlined'>
								{lockerName}
							</Link>
						</>
					)}
					{folderId && (
						<>
							<span>/</span>
							<Link to={`${AUTH_ROUTES.FOLDERS}/${folderId}`} className='link-underlined'>
								{folderName}
							</Link>
						</>
					)}
					<span>/</span>
					<span>{title}</span>
				</h2>
			</div>
			<Formik initialValues={initialValues} onSubmit={onSubmit} validate={validate}>
				{({
					values,
					touched,
					errors,
					handleChange,
					handleBlur,
					handleSubmit,
					submitForm,
					resetForm,
					isSubmitting,
					isValid,
				}) => (
					<form className='flex gap-5 md:flex-row flex-col' onSubmit={handleSubmit}>
						<div className='flex flex-col gap-5 flex-1'>
							<InformationPanel header='Employee information'>
								{/* <div className='flex gap-3'>
									<InputWithLabel
										label='ID'
										wrapperClassName='flex-1'
										readOnly
										value={values.importer.id}
									/>
									<Button
										label='Detail'
										className='self-end bg-primary rounded-lg h-11'
										type='button'
									/>
								</div> */}
								<InputWithLabel
									label='Name'
									wrapperClassName='flex-1'
									value={`${values.importer.firstName} ${values.importer.lastName}`}
									readOnly
								/>
								<InputWithLabel
									label='Department'
									wrapperClassName='flex-1'
									// value={department || 'this should be department'}
									value={values.department.name}
									readOnly
								/>
							</InformationPanel>
							<InformationPanel header='Document information'>
								<InputWithLabel
									label='ID'
									wrapperClassName='flex-1'
									value={values.id}
									readOnly
									sideComponent={<Status item={values} type='document' />}
								/>
								<InputWithLabel
									label='Title'
									wrapperClassName='flex-1'
									id='title'
									name='title'
									value={values.title}
									readOnly={!editMode}
									onChange={handleChange}
									onBlur={handleBlur}
									error={touched.title && !!errors.title}
									small={touched.title ? errors.title : undefined}
									disabled={isSubmitting}
								/>
								<InputWithLabel
									label='Types'
									id='documentType'
									name='documentType'
									value={values.documentType.toUpperCase()}
									readOnly={!editMode}
									onChange={handleChange}
									onBlur={handleBlur}
									error={touched.documentType && !!errors.documentType}
									small={touched.documentType ? errors.documentType : undefined}
									disabled={isSubmitting}
								/>
								<TextareaWithLabel
									label='Description'
									wrapperClassName='flex-1'
									id='description'
									name='description'
									value={editMode ? values.description : values.description || 'No description'}
									readOnly={!editMode}
									onChange={handleChange}
									onBlur={handleBlur}
									disabled={isSubmitting}
								/>
								<div className='flex gap-5'>
									<InputWithLabel
										label='Locker'
										readOnly
										value={values.folder.locker.name}
										wrapperClassName='flex-1'
									/>
									<InputWithLabel
										label='Folder'
										readOnly
										value={values.folder.name}
										wrapperClassName='flex-1'
									/>
								</div>
							</InformationPanel>
						</div>
						<div className='flex flex-col gap-5 flex-1'>
							<InformationPanel direction='row' className='h-max'>
								{qr ? (
									<img src={qr} className='rounded-lg w-48 aspect-square' />
								) : (
									<div className='w-48 aspect-square bg-neutral-600 animate-pulse rounded-lg' />
								)}
								<div className='flex flex-col gap-5 flex-1'>
									{editMode ? (
										<Button
											label='Cancel'
											severity='danger'
											className='h-11 rounded-lg'
											type='button'
											disabled={isSubmitting}
											onClick={() => {
												resetForm();
												setEditMode(false);
											}}
										/>
									) : (
										<Button
											label='Print QR'
											className='h-11 rounded-lg'
											severity='info'
											type='button'
										/>
									)}
									<Button
										label={editMode ? 'Save' : 'Edit'}
										className='h-11 rounded-lg bg-primary'
										type='button'
										disabled={!isValid || isSubmitting}
										onClick={() => {
											if (!editMode) {
												setEditMode(true);
												return;
											}
											submitForm();
										}}
									/>
									<Link to={AUTH_ROUTES.DOCUMENTS} className='w-full'>
										<Button
											type='button'
											label='Return home'
											className='w-full h-11 rounded-lg btn-outlined'
											outlined
										/>
									</Link>
								</div>
							</InformationPanel>
						</div>
					</form>
				)}
			</Formik>
		</div>
	);
};

export default StaffDocumentDetailPage;
