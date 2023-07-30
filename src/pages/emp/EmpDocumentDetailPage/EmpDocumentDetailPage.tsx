/* eslint-disable no-mixed-spaces-and-tabs */
import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import { AUTH_ROUTES } from '@/constants/routes';
import {
	BaseResponse,
	GetDocumentByIdResponse,
	GetPermissionResponse,
	GetPermissionsResponse,
	GetUsersResponse,
} from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { Button } from 'primereact/button';
import { useState, useEffect, useContext, FormEvent } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode';
import TextareaWithLabel from '@/components/InputWithLabel/TextareaWithLabel.component';
import { Formik, FormikHelpers } from 'formik';
import { SkeletonPage } from '@/components/Skeleton';
import Status from '@/components/Status/Status.component';
import { AxiosError } from 'axios';
import ErrorTemplate from '@/components/ErrorTemplate/ErrorTemplate.component';
import Overlay from '@/components/Overlay/Overlay.component';
import { PrimeIcons } from 'primereact/api';
import { AuthContext } from '@/context/authContext';
import { InputSwitch } from 'primereact/inputswitch';
import CustomDropdown from '@/components/Dropdown/Dropdown.component';
import { REQUEST_STATUS } from '@/constants/status';
import { IUser } from '@/types/item';
import { REFETCH_CONFIG } from '@/constants/config';

const NO_BORROW = [REQUEST_STATUS.Lost.status, REQUEST_STATUS.NotProcessable.status];

const EmpDocumentDetailPage = () => {
	const { documentId = '' } = useParams<{ documentId: string }>();
	const [qr, setQr] = useState('');
	const [editMode, setEditMode] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const queryClient = useQueryClient();
	const { user } = useContext(AuthContext);

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
			(await axiosClient.get<GetPermissionResponse>(`/documents/${documentId}/permissions`)).data,
		REFETCH_CONFIG
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

	const { data: sharedUsers } = useQuery(
		['documents', documentId, 'shared'],
		async () =>
			(
				await axiosClient.get<GetPermissionsResponse>(`/documents/${documentId}/shared-users`, {
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
		renderQr();
	}, [data, permission]);

	if (isLoading) return <SkeletonPage />;

	if (
		(axiosError as AxiosError)?.response?.status === 404 ||
		!data ||
		(data.data.importer.id !== user?.id &&
			data.data.isPrivate &&
			permission?.data.canRead === false)
	)
		return <ErrorTemplate code={404} message='Document not found' url={AUTH_ROUTES.DOCUMENTS} />;

	const { title, importer, isPrivate, status } = data.data;

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
	const onShare = async (
		e: React.FormEvent<HTMLFormElement>,
		perms: {
			userId: string;
			expiryDate?: Date;
			canRead: boolean;
			canBorrow: boolean;
		}
	) => {
		e.preventDefault();
		try {
			await axiosClient.post(`/documents/${documentId}/permissions`, {
				...perms,
				expiryDate:
					perms.expiryDate?.toISOString() ||
					new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
			});
			queryClient.invalidateQueries(['documents', documentId]);
			setShowModal(false);
		} catch (error) {
			console.log(error);
		}
	};

	const onDownload = async () => {
		try {
			window.open(`${import.meta.env.VITE_API_ENDPOINT}/documents/${documentId}/file`, '_blank');
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<div className='flex flex-col gap-5'>
				<div className='card py-3'>
					<h2 className='flex gap-2'>
						{lockerId && (
							<>
								<span>/</span>
								<span className='link-underlined'>{lockerName}</span>
							</>
						)}
						{folderId && (
							<>
								<span>/</span>
								<span className='link-underlined'>{folderName}</span>
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
									<InputWithLabel
										label='Name'
										wrapperClassName='flex-1'
										value={`${values.importer.firstName} ${values.importer.lastName}`}
										readOnly
										disabled={editMode}
									/>
									<InputWithLabel
										label='Department'
										wrapperClassName='flex-1'
										value={values.department.name}
										readOnly
										disabled={editMode}
									/>
								</InformationPanel>
								<InformationPanel header='Document information'>
									<InputWithLabel
										label='ID'
										wrapperClassName='flex-1'
										value={values.id}
										readOnly
										sideComponent={<Status item={values} type='document' />}
										disabled={editMode}
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
											disabled={editMode}
										/>
										<InputWithLabel
											label='Folder'
											readOnly
											value={values.folder.name}
											wrapperClassName='flex-1'
											disabled={editMode}
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
										{(!isPrivate || permission?.data.canBorrow) &&
											NO_BORROW.indexOf(status) === -1 && (
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
								{data.data.fileId && permission?.data.canBorrow && (
									<InformationPanel header='Attached file'>
										<Button
											label='Download attached file'
											className='h-11 rounded-lg bg-primary'
											onClick={onDownload}
										/>
									</InformationPanel>
								)}
							</div>
						</form>
					)}
				</Formik>
			</div>
			{showModal && (
				<Overlay
					className='flex items-center justify-center'
					onExit={() => {
						setShowModal(false);
					}}
				>
					<ShareModal
						sharedUsers={
							sharedUsers?.data.items.map((user) => ({ ...user, ...user.employee })) || []
						}
						users={
							users?.data.items.filter(
								(x) =>
									!sharedUsers?.data.items.find((u) => x.id === u.employee.id) &&
									// Themselves
									x.id !== user?.id
							) || []
						}
						handleClose={() => {
							setShowModal(false);
						}}
						onShare={onShare}
					/>
				</Overlay>
			)}
		</>
	);
};

export default EmpDocumentDetailPage;

type UserWithPermission = { canRead: boolean; canBorrow: boolean; employee: IUser };

const ShareModal = ({
	onShare,
	handleClose,
	users,
	sharedUsers,
}: {
	onShare: (
		e: FormEvent<HTMLFormElement>,
		perms: { userId: string; canBorrow: boolean; canRead: boolean; expiryDate?: Date }
	) => void;
	handleClose: () => void;
	users: IUser[];
	sharedUsers: UserWithPermission[];
}) => {
	const [shareModal, setShareModal] = useState(false);
	const [selectedUser, setSelectedUser] = useState<UserWithPermission | null>(null);
	const [selectedId, setSelectedId] = useState<string>('');
	const [edit, setEdit] = useState<boolean>(false);
	console.log(sharedUsers);
	return (
		<>
			<form
				className='bg-neutral-800 rounded-lg p-5 w-[50vw]'
				onSubmit={(e) => e.preventDefault()}
				onClick={(e) => e.stopPropagation()}
			>
				<h2 className='title'>Changing permission</h2>
				{sharedUsers.map((user) => (
					<div className='flex items-center mt-5' key={user.employee.id}>
						<div>{user.employee.email}</div>
						<div className='ml-auto'>
							<Button
								type='button'
								label='Change'
								className='h-11 rounded-lg bg-primary'
								onClick={() => {
									setShareModal(true);
									setSelectedUser(user);
									setSelectedId(user.employee.id);
									setEdit(true);
								}}
							/>
						</div>
					</div>
				))}
				<Button
					label='Add user'
					className='h-11 rounded-lg bg-primary w-full mt-5 btn-outlined items-center justify-center'
					onClick={() => {
						setShareModal(true);
						setEdit(false);
					}}
					outlined
					icon={PrimeIcons.PLUS}
					type='button'
				/>
				<div className='flex justify-end mt-5'>
					<Button
						type='button'
						label='Close'
						className='h-11 rounded-lg bg-primary'
						onClick={() => {
							handleClose();
							setShareModal(false);
							setSelectedUser(null);
							setSelectedId('');
							setEdit(false);
						}}
					/>
				</div>
			</form>
			{shareModal && (
				<Overlay
					onClick={(e) => e.stopPropagation()}
					onExit={() => {
						setShareModal(false);
						setSelectedUser(null);
						setSelectedId('');
						setEdit(false);
					}}
					className='flex items-center justify-center'
				>
					<form
						onSubmit={(e) =>
							onShare(e, {
								userId: selectedId,
								canBorrow: selectedUser?.canBorrow || false,
								canRead: selectedUser?.canRead || false,
							})
						}
						onClick={(e) => e.stopPropagation()}
						className='bg-neutral-800 rounded-lg p-5 w-[50vw]'
					>
						<h2 className='title mb-5'>Edit permission</h2>
						{edit ? (
							<InputWithLabel label='User' value={selectedUser?.employee.email} readOnly />
						) : (
							<CustomDropdown
								options={users}
								optionLabel='email'
								optionValue='id'
								value={selectedId}
								onChange={(e) => {
									const user = users.find((user) => user.id === e.value);
									setSelectedId(e.value);
									setSelectedUser(
										user ? { employee: user, canBorrow: false, canRead: false } : null
									);
								}}
								label='User'
							/>
						)}
						<div className='grid grid-cols-4 mt-5'>
							<div>Can view</div>
							<InputSwitch
								checked={selectedUser?.canRead || false}
								onChange={(e) =>
									setSelectedUser((user) =>
										user
											? {
													...user,
													canRead: e.value as boolean,
													canBorrow: e.value ? user.canBorrow : false,
											  }
											: null
									)
								}
								disabled={!selectedUser}
							/>
							<div>Can borrow</div>
							<InputSwitch
								checked={selectedUser?.canBorrow || false}
								onChange={(e) =>
									setSelectedUser((user) =>
										user ? { ...user, canBorrow: e.value as boolean } : null
									)
								}
								disabled={!selectedUser || !selectedUser.canRead}
							/>
						</div>
						<div className='flex justify-end mt-5'>
							<Button
								label='Cancel'
								className='h-11 rounded-lg mr-3 btn-outlined !border-red-600'
								onClick={() => {
									setShareModal(false);
									setSelectedUser(null);
									setSelectedId('');
									setEdit(false);
								}}
								severity='danger'
								outlined
							/>
							<Button label='Share' className='h-11 rounded-lg' disabled={!selectedId} />
						</div>
					</form>
				</Overlay>
			)}
		</>
	);
};
