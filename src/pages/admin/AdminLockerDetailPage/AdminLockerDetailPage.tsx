import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import Progress from '@/components/Progress/Progress.component';
import { SkeletonPage } from '@/components/Skeleton';
import Table from '@/components/Table/Table.component';
import { AUTH_ROUTES } from '@/constants/routes';
import { BaseResponse, GetFoldersResponse, GetLockerByIdResponse } from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { useQuery, useQueryClient } from 'react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import useNavigateSelect from '@/hooks/useNavigateSelect';
import { IFolder } from '@/types/item';
import Status from '@/components/Status/Status.component';
import { AxiosError } from 'axios';
import ErrorTemplate from '@/components/ErrorTemplate/ErrorTemplate.component';
import { Formik } from 'formik';
import InputNumberWithLabel from '@/components/InputWithLabel/InputNumberWithLabel.component';

const NOT_REQUIRED = ['description'];

const AdminLockerDetailPage = () => {
	const { lockerId } = useParams<{ lockerId: string }>();
	const { getNavigateOnSelectProps } = useNavigateSelect({ route: 'FOLDERS' });
	const queryClient = useQueryClient();
	const [editMode, setEditMode] = useState(false);
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const {
		data: locker,
		isLoading,
		error: axiosError,
	} = useQuery(
		['lockers', lockerId],
		async () => (await axiosClient.get<GetLockerByIdResponse>(`/lockers/${lockerId}`)).data
	);

	const roomId = locker?.data.room.id;

	const { data: folders, isLoading: isFoldersLoading } = useQuery(
		[
			'folders',
			{
				lockerId,
				roomId,
			},
		],
		async () =>
			(
				await axiosClient.get<GetFoldersResponse>(`/folders`, {
					params: {
						lockerId,
						roomId,
						size: 20,
						page: 1,
					},
				})
			).data,
		{
			enabled: !!lockerId && !!roomId,
		}
	);

	if (isLoading) return <SkeletonPage />;

	if ((axiosError as AxiosError)?.response?.status === 404 || !locker)
		return <ErrorTemplate code={404} message='Locker not found' url={AUTH_ROUTES.LOCKERS} />;

	const {
		name: lockerName,
		capacity,
		numberOfFolders,
		description,
		isAvailable,
		room: { name: roomName },
	} = locker.data;

	const foldersWithId = folders?.data.items.map((folder, index) => ({
		count: index + 1,
		...folder,
	}));

	const totalDocuments = folders?.data.items.reduce(
		(acc, folder) => acc + folder.numberOfDocuments,
		0
	);

	const totalDocumentsCapacity = folders?.data.items.reduce(
		(acc, folder) => acc + folder.capacity,
		0
	);

	const onToggleAvailability = async () => {
		try {
			await axiosClient.put(`/lockers/${lockerId}`, {
				isAvailable: !isAvailable,
				name: lockerName,
				description,
				capacity,
			});
			queryClient.invalidateQueries('lockers');
		} catch (error) {
			const axiosError = error as AxiosError<BaseResponse>;
			setError(axiosError.response?.data.message || 'Something went wrong');
		}
	};

	const initialValues = {
		name: lockerName,
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
			await axiosClient.put(`/lockers/${lockerId}`, values);
			queryClient.invalidateQueries('lockers');
			setEditMode(false);
		} catch (error) {
			const axiosError = error as AxiosError<BaseResponse>;
			setError(axiosError.response?.data.message || 'Something went wrong');
		}
	};

	const onDelete = async () => {
		try {
			await axiosClient.delete(`/lockers/${lockerId}`);
			queryClient.invalidateQueries('lockers');
			navigate(AUTH_ROUTES.LOCKERS);
		} catch (error) {
			const axiosError = error as AxiosError<BaseResponse>;
			setError(axiosError.response?.data.message || 'Something went wrong');
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
					<span>{lockerName}</span>
				</h2>
			</div>
			<Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
				{({
					values,
					errors,
					touched,
					handleChange,
					handleBlur,
					handleSubmit,
					isSubmitting,
					setFieldValue,
					resetForm,
					submitForm,
					isValid,
				}) => {
					return (
						<form className='flex gap-5 md:flex-row flex-col' onSubmit={handleSubmit}>
							{' '}
							<div className='flex flex-col gap-5 flex-1'>
								<InformationPanel header='Locker information'>
									<InputWithLabel
										label='ID'
										wrapperClassName='flex-1'
										value={lockerId}
										readOnly
										sideComponent={<Status type='locker' item={locker.data} />}
									/>
									<InputWithLabel
										label='Locker name'
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
											label='Folder capacity'
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
										<>
											<Progress
												label='Folder capacity'
												current={numberOfFolders}
												max={capacity}
												showPercentage
											/>
											<Progress
												label='Document capacity'
												current={totalDocuments}
												max={totalDocumentsCapacity}
												showPercentage
											/>
										</>
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
								<InformationPanel header='Folders' className='flex-1'>
									<Table
										value={foldersWithId}
										loading={isFoldersLoading}
										lazy
										selectionMode='single'
										{...getNavigateOnSelectProps()}
									>
										<Column field='count' header='No.' />
										<Column field='name' header='Name' />
										<Column
											field='status'
											header='Status'
											body={(item: IFolder) => <Status type='folder' item={item} />}
										/>
									</Table>
								</InformationPanel>
							</div>
						</form>
					);
				}}
			</Formik>
		</div>
	);
};

export default AdminLockerDetailPage;
