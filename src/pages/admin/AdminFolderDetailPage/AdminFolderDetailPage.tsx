import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import Progress from '@/components/Progress/Progress.component';
import { SkeletonPage } from '@/components/Skeleton';
import Table from '@/components/Table/Table.component';
import { AUTH_ROUTES } from '@/constants/routes';
import { BaseResponse, GetDocumentsResponse, GetFolderByIdResponse } from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { useQuery, useQueryClient } from 'react-query';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IDocument } from '@/types/item';
import Status from '@/components/Status/Status.component';
import useNavigateSelect from '@/hooks/useNavigateSelect';
import InputNumberWithLabel from '@/components/InputWithLabel/InputNumberWithLabel.component';
import { AxiosError } from 'axios';
import ErrorTemplate from '@/components/ErrorTemplate/ErrorTemplate.component';
import { Formik } from 'formik';

const NOT_REQUIRED = ['description'];

const AdminFolderDetailPage = () => {
	const { folderId } = useParams<{ folderId: string }>();
	const queryClient = useQueryClient();
	const [editMode, setEditMode] = useState(false);
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const { getNavigateOnSelectProps } = useNavigateSelect({ route: 'DOCUMENTS' });

	const {
		data: folder,
		isLoading,
		error: axiosError,
	} = useQuery(
		['folders', folderId],
		async () => (await axiosClient.get<GetFolderByIdResponse>(`/folders/${folderId}`)).data
	);

	const lockerId = folder?.data.locker.id || '';
	const roomId = folder?.data.locker.room.id || '';
	const roomName = folder?.data.locker.room.name || '';

	const { data: documents, isLoading: isDocumentsLoading } = useQuery(
		[
			'documents',
			{
				folderId,
				roomId,
				lockerId,
			},
		],
		async () =>
			(
				await axiosClient.get<GetDocumentsResponse>(`/documents`, {
					params: {
						lockerId,
						roomId,
						folderId,
						size: 20,
						page: 1,
					},
				})
			).data,
		{
			enabled: !!folderId && !!lockerId && !!roomId,
		}
	);

	if (isLoading) return <SkeletonPage />;

	if ((axiosError as AxiosError)?.response?.status === 404 || !folder)
		return <ErrorTemplate code={404} message='Folder not found' url={AUTH_ROUTES.FOLDERS} />;

	const {
		name: folderName,
		capacity,
		numberOfDocuments,
		description,
		isAvailable,
		locker: { name: lockerName },
	} = folder.data;

	const documentsWithId = documents?.data.items.map((doc, index) => ({
		count: index + 1,
		...doc,
	}));

	const onToggleAvailability = async () => {
		try {
			await axiosClient.put(`/folders/${folderId}`, {
				name: folderName,
				description,
				capacity,
				isAvailable: !isAvailable,
			});
			queryClient.invalidateQueries('folders');
		} catch (error) {
			const axiosError = error as AxiosError<BaseResponse>;
			setError(axiosError.response?.data.message || 'Bad request');
		}
	};

	const initialValues = {
		name: folderName,
		description,
		capacity,
	};

	type FormValues = typeof initialValues;

	const validate = (values: FormValues) => {
		const errors: { [key: string]: string } = {};
		Object.entries(values).forEach(([key, value]) => {
			if (!value && !NOT_REQUIRED.includes(key)) {
				if (key === 'capacity' && (value as number) <= 0)
					errors[key] = 'Capacity must be greater than 0';
				else errors[key] = 'Required';
			}
		});
		return errors;
	};

	const onSubmit = async (values: FormValues) => {
		if (JSON.stringify(values) === JSON.stringify(initialValues)) return setEditMode(false);
		try {
			await axiosClient.put(`/folders/${folderId}`, values);
			queryClient.invalidateQueries('folders');
			setEditMode(false);
		} catch (error) {
			const axiosError = error as AxiosError<BaseResponse>;
			setError(axiosError.response?.data.message || 'Bad request');
		}
	};

	const onDelete = async () => {
		try {
			await axiosClient.delete(`/folders/${folderId}`);
			queryClient.invalidateQueries('folders');
			navigate(AUTH_ROUTES.FOLDERS);
		} catch (error) {
			const axiosError = error as AxiosError<BaseResponse>;
			setError(axiosError.response?.data.message || 'Bad request');
		}
	};

	return (
		<div className='flex flex-col gap-5'>
			<div className='card'>
				<h2 className='flex gap-2'>
					<span>/</span>
					<Link className='link-underlined' to={`${AUTH_ROUTES.ROOMS}/${roomId}`}>
						{roomName}
					</Link>
					<span>/</span>
					<Link to={`${AUTH_ROUTES.LOCKERS}/${lockerId}`} className='link-underlined'>
						{lockerName}
					</Link>
					<span>/</span>
					<span>{folderName}</span>
				</h2>
			</div>
			<Formik initialValues={initialValues} onSubmit={onSubmit} validate={validate}>
				{({
					values,
					touched,
					errors,
					handleBlur,
					handleChange,
					handleSubmit,
					submitForm,
					setFieldValue,
					resetForm,
					isSubmitting,
					isValid,
				}) => (
					<form className='flex gap-5 md:flex-row flex-col' onSubmit={handleSubmit}>
						<div className='flex flex-col gap-5 flex-1'>
							<InformationPanel header='Folder information'>
								<InputWithLabel
									label='ID'
									wrapperClassName='flex-1'
									value={folderId}
									readOnly
									sideComponent={<Status item={folder.data} type='folder' />}
								/>
								<InputWithLabel
									label='Folder name'
									wrapperClassName='flex-1'
									name='name'
									id='name'
									value={values.name}
									readOnly={!editMode}
									onChange={handleChange}
									onBlur={handleBlur}
									error={touched.name && !!errors.name}
									small={touched.name ? errors.name : undefined}
									disabled={isSubmitting}
								/>
								<InputWithLabel
									label='Description'
									wrapperClassName='flex-1'
									name='description'
									id='description'
									value={values.description}
									readOnly={!editMode}
									onChange={handleChange}
									onBlur={handleBlur}
									error={touched.description && !!errors.description}
									small={touched.description ? errors.description : undefined}
									disabled={isSubmitting}
								/>
								{editMode ? (
									<InputNumberWithLabel
										label='Document capacity'
										name='capacity'
										id='capacity'
										value={values.capacity}
										onChange={(e) => setFieldValue('capacity', e.value)}
										onBlur={handleBlur}
										error={touched.capacity && !!errors.capacity}
										small={touched.capacity ? errors.capacity : undefined}
										wrapperClassName='flex-1'
										disabled={isSubmitting}
									/>
								) : (
									<Progress
										label='Document capacity'
										current={numberOfDocuments}
										max={capacity}
										showPercentage
									/>
								)}
							</InformationPanel>
							<InformationPanel header='History'>
								<Table>
									<Column field='id' header='ID' />
									<Column field='name' header='Name' />
								</Table>
							</InformationPanel>
						</div>
						<div className='flex flex-col gap-5 flex-1'>
							<InformationPanel>
								<div className='flex gap-4'>
									<Button
										type='button'
										label={editMode ? 'Update' : 'Edit'}
										className='h-11 rounded-lg flex-1 bg-primary'
										onClick={async () => {
											if (editMode) {
												await submitForm();
												return;
											}
											setEditMode(true);
										}}
										disabled={isSubmitting || !isValid}
									/>
									{editMode ? (
										<Button
											label='Cancelled'
											severity='danger'
											type='button'
											className='h-11 rounded-lg flex-1'
											onClick={() => {
												setEditMode(false);
												resetForm();
												setError('');
											}}
										/>
									) : (
										<Button
											type='button'
											label={isAvailable ? 'Disable' : 'Enable'}
											className='h-11 rounded-lg flex-1'
											severity={isAvailable ? 'danger' : 'success'}
											onClick={onToggleAvailability}
											disabled={editMode || isSubmitting || !isValid}
										/>
									)}
									<Button
										label='Delete'
										className='h-11 rounded-lg flex-1 btn-outlined !border-red-500 hover:!bg-red-500'
										type='button'
										outlined
										onClick={onDelete}
									/>
								</div>
								<Link to={AUTH_ROUTES.FOLDERS}>
									<Button
										type='button'
										label='Return home'
										className='w-full h-11 rounded-lg btn-outlined'
										outlined
										disabled={isSubmitting}
									/>
								</Link>
								{error && <div className='text-red-500'>{error}</div>}
							</InformationPanel>
							<InformationPanel header='Documents' className='flex-1'>
								<Table
									value={documentsWithId}
									loading={isDocumentsLoading}
									lazy
									selectionMode='single'
									{...getNavigateOnSelectProps()}
								>
									<Column field='count' header='No.' />
									<Column field='title' header='Title' />
									<Column
										field='status'
										header='Status'
										body={(item: IDocument) => <Status type='document' item={item} />}
									/>
								</Table>
							</InformationPanel>
						</div>
					</form>
				)}
			</Formik>
		</div>
	);
};

export default AdminFolderDetailPage;
