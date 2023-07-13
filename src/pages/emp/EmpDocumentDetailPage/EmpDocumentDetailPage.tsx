import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import { AUTH_ROUTES } from '@/constants/routes';
import {
	BaseResponse,
	GetDocumentByIdResponse,
	GetPermissionResponse,
	GetUsersResponse,
} from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { Button } from 'primereact/button';
import { useState, useEffect, useContext } from 'react';
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
import Overlay from '@/components/Overlay/Overlay.component';
import { PrimeIcons } from 'primereact/api';
import clsx from 'clsx';
import { AuthContext } from '@/context/authContext';
import { InputSwitch } from 'primereact/inputswitch';
import CustomDropdown from '@/components/Dropdown/Dropdown.component';

const EmpDocumentDetailPage = () => {
	const { documentId = '' } = useParams<{ documentId: string }>();
	const [qr, setQr] = useState('');
	const [editMode, setEditMode] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const queryClient = useQueryClient();
	const { user } = useContext(AuthContext);
	const [perms, setPerms] = useState<GetPermissionResponse['data']>({
		canRead: false,
		canBorrow: false,
		documentId: '',
		employeeId: '',
	});
	const [error, setError] = useState('');

	const {
		data,
		isLoading,
		error: axiosError,
	} = useQuery(
		['documents', documentId],
		async () => (await axiosClient.get<GetDocumentByIdResponse>(`/documents/${documentId}`)).data
	);

	const { data: permission } = useQuery(
		['documents', documentId, user?.id],
		async () =>
			(await axiosClient.get<GetPermissionResponse>(`/documents/${documentId}/permissions`)).data
	);

	const { data: users } = useQuery(
		['users'],
		async () =>
			(
				await axiosClient.get<GetUsersResponse>('/users/employees', {
					params: {
						pageSize: 100,
					},
				})
			).data
	);

	useEffect(() => {
		const renderQr = async () => {
			const { id } = data?.data || { id: '' };
			if (!id) return;
			const qrCode = await QRCode.toDataURL(id);
			setQr(qrCode);
		};
		const updatePerms = async () => {
			if (!permission?.data) return;
			setPerms(permission.data);
		};
		updatePerms();
		renderQr();
	}, [data, permission]);

	if (isLoading) return <SkeletonPage />;

	if (
		(axiosError as AxiosError)?.response?.status === 404 ||
		!data ||
		(data.data.importer.id !== user?.id && (data.data.isPrivate && perms.employeeId !== user?.id))
	)
		return <ErrorTemplate code={404} message='Document not found' url={AUTH_ROUTES.DOCUMENTS} />;

	const { title, importer, isPrivate } = data.data;

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
		<>
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
						setFieldValue,
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
									{importer.id === user?.id && (
										<div className='flex gap-3 items-center'>
											<label htmlFor='isPrivate' className='header'>
												Private
											</label>
											<InputSwitch
												checked={values.isPrivate}
												name='isPrivate'
												id='isPrivate'
												onChange={(e) => setFieldValue('isPrivate', e.value)}
												disabled={!editMode}
											/>
										</div>
									)}
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
												label='Cancelled'
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
											importer.id === user?.id &&
											isPrivate && (
												<Button
													label='Share'
													className='h-11 rounded-lg'
													severity='info'
													type='button'
													onClick={() => setShowModal(true)}
												/>
											)
										)}
										{(!isPrivate || permission?.data.canBorrow) && (
											<Link to={`${AUTH_ROUTES.NEW_REQUEST}?id=${documentId}`} className='w-full'>
												<Button
													label='Request'
													className='h-11 rounded-lg w-full'
													severity='success'
												/>
											</Link>
										)}
										{importer.id === user?.id && (
											<>
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
											</>
										)}
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
								{/* <InformationPanel header='Digital copies' className='h-max'>
									<ImagePreviewer
										readOnly
										images={[
											'https://picsum.photos/200/300',
											'https://picsum.photos/200/301',
											'https://picsum.photos/200/302',
										]}
									/>
								</InformationPanel>
								<InformationPanel header='History' className='flex-1'></InformationPanel> */}
							</div>
						</form>
					)}
				</Formik>
			</div>
			{showModal && (
				<Overlay
					className='flex items-center justify-center'
					onExit={() => {
						setPerms((prev) => ({
							...prev,
							...permission?.data,
						}));
						setShowModal(false);
						setError('');
					}}
				>
					<div className='bg-neutral-800 p-5 rounded-lg' onClick={(e) => e.stopPropagation()}>
						<div className='flex justify-between items-center'>
							<div className='title'>Sharing permission</div>
							<i
								className={clsx(PrimeIcons.TIMES, 'hover:text-red-500 cursor-pointer text-lg')}
								onClick={() => {
									setPerms((prev) => ({
										...prev,
										...permission?.data,
									}));
									setShowModal(false);
									setError('');
								}}
							/>
						</div>
						<div className='mt-3'>
							<div className='mt-3'>
								<CustomDropdown
									label='Employee'
									options={users?.data.items.filter((u) => user?.id !== u.id)}
									value={perms.employeeId}
									optionLabel='email'
									optionValue='id'
									onChange={(e) => {
										setError('');
										setPerms((prev) => ({ ...prev, employeeId: e.target.value }));
									}}
									onBlur={() => perms.employeeId && setError('')}
								/>
							</div>
							<div className='grid gap-5 grid-cols-4 mt-5'>
								<div>Can read: </div>
								<InputSwitch
									checked={perms.canRead}
									name='canRead'
									id='canRead'
									onChange={(e) =>
										setPerms((prev) => ({
											...prev,
											canRead: e.value as boolean,
											canBorrow: e.value ? prev.canBorrow : false,
										}))
									}
								/>
								<div>Can borrow: </div>
								<InputSwitch
									checked={perms.canBorrow}
									name='canBorrow'
									id='canBorrow'
									onChange={(e) => setPerms((prev) => ({ ...prev, canBorrow: e.value as boolean }))}
									disabled={!perms.canRead}
								/>
							</div>
						</div>
						{error && <div className='text-red-500 mt-3'>{error}</div>}
						<div className='flex justify-end mt-3'>
							<Button
								label='Cancel'
								severity='danger'
								className='mt-5 h-11 rounded-base mr-5'
								onClick={() => {
									setPerms((prev) => ({
										...prev,
										...permission?.data,
									}));
									setShowModal(false);
									setError('');
								}}
							/>
							<Button
								label='Submit'
								className='mt-5 h-11 rounded-base'
								onClick={async () => {
									try {
										await axiosClient.post(`/documents/${documentId}/permissions`, {
											userId: perms.employeeId,
											canRead: perms.canRead,
											canBorrow: perms.canBorrow,
											expiryDate: new Date(
												new Date().setDate(new Date().getDate() + 7)
											).toISOString(),
										});
										queryClient.invalidateQueries(['documents', documentId, user?.id]);
										setError('');
										setShowModal(false);
									} catch (error) {
										const axiosError = error as AxiosError<BaseResponse>;
										const msg = axiosError.response?.data.message || 'Bad request';
										setError(msg);
									}
								}}
							/>
						</div>
					</div>
				</Overlay>
			)}
		</>
	);
};

export default EmpDocumentDetailPage;
