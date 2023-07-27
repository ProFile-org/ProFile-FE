import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import Progress from '@/components/Progress/Progress.component';
import { SkeletonPage } from '@/components/Skeleton';
import Table from '@/components/Table/Table.component';
import { AUTH_ROUTES } from '@/constants/routes';
import { BaseResponse, GetLockersResponse, GetRoomByIdResponse } from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { useQuery, useQueryClient } from 'react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import useNavigateSelect from '@/hooks/useNavigateSelect';
import { ILocker } from '@/types/item';
import Status from '@/components/Status/Status.component';
import { AxiosError } from 'axios';
import ErrorTemplate from '@/components/ErrorTemplate/ErrorTemplate.component';
import { Formik } from 'formik';
import InputNumberWithLabel from '@/components/InputWithLabel/InputNumberWithLabel.component';

const NOT_REQUIRED = ['description'];

const AdminRoomDetailPage = () => {
	const { roomId } = useParams<{ roomId: string }>();
	const { getNavigateOnSelectProps } = useNavigateSelect({ route: 'LOCKERS' });
	const queryClient = useQueryClient();
	const [editMode, setEditMode] = useState(false);
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const {
		data: room,
		isLoading,
		error: axiosError,
	} = useQuery(
		['rooms', roomId],
		async () => (await axiosClient.get<GetRoomByIdResponse>(`/rooms/${roomId}`)).data
	);

	const { data: lockers, isLoading: isLockersLoading } = useQuery(
		[
			'lockers',
			{
				roomId,
			},
		],
		async () =>
			(
				await axiosClient.get<GetLockersResponse>(`/lockers`, {
					params: {
						roomId,
						size: 20,
						page: 1,
					},
				})
			).data,
		{
			enabled: !!roomId,
		}
	);

	if (isLoading) return <SkeletonPage />;

	if ((axiosError as AxiosError)?.response?.status === 404 || !room)
		return <ErrorTemplate code={404} message='Locker not found' url={AUTH_ROUTES.ROOMS} />;

	const { name: roomName, capacity, numberOfLockers, description, isAvailable } = room.data;

	const lockersWithId = lockers?.data.items.map((locker, index) => ({
		count: index + 1,
		...locker,
	}));

	const totalFolders = lockers?.data.items.reduce((acc, locker) => acc + locker.numberOfFolders, 0);

	const totalFoldersCapacity = lockers?.data.items.reduce(
		(acc, locker) => acc + locker.capacity,
		0
	);

	const onToggleAvailability = async () => {
		try {
			await axiosClient.put(`/rooms/${roomId}`, {
				name: roomName,
				description,
				capacity,
				isAvailable: !isAvailable,
			});
			queryClient.invalidateQueries('rooms');
			window.location.reload();
		} catch (error) {
			const axiosError = error as AxiosError<BaseResponse>;
			setError(axiosError.response?.data.message || 'Bad request');
		}
	};

	const initialValues = {
		name: roomName,
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
			await axiosClient.put(`/rooms/${roomId}`, values);
			queryClient.invalidateQueries('rooms');
			setEditMode(false);
		} catch (error) {
			const axiosError = error as AxiosError<BaseResponse>;
			setError(axiosError.response?.data.message || 'Bad request');
		}
	};

	const onDelete = async () => {
		try {
			await axiosClient.delete(`/rooms/${roomId}`);
			queryClient.invalidateQueries('rooms');
			navigate(AUTH_ROUTES.ROOMS);
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
					<span>{roomName}</span>
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
								<InformationPanel header='Room information'>
									<InputWithLabel
										label='ID'
										wrapperClassName='flex-1'
										value={roomId}
										readOnly
										sideComponent={<Status type='room' item={room.data} />}
										disabled={editMode}
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
												label='Locker capacity'
												current={numberOfLockers}
												max={capacity}
												showPercentage
											/>
											<Progress
												label='Folder capacity'
												current={totalFolders}
												max={totalFoldersCapacity}
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
											className='h-11 rounded-lg bg-primary flex-1'
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
												label='Cancel'
												severity='danger'
												type='button'
												className='h-11 rounded-lg '
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
									<Link to={AUTH_ROUTES.ROOMS}>
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
								<InformationPanel header='Lockers' className='flex-1'>
									<Table
										value={lockersWithId}
										loading={isLockersLoading}
										lazy
										selectionMode='single'
										{...getNavigateOnSelectProps()}
									>
										<Column field='count' header='No.' />
										<Column field='name' header='Name' />
										<Column
											field='status'
											header='Status'
											body={(item: ILocker) => <Status type='locker' item={item} />}
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

export default AdminRoomDetailPage;
