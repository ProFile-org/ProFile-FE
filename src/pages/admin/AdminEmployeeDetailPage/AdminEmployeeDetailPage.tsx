import ErrorTemplate from '@/components/ErrorTemplate/ErrorTemplate.component';
import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import { SkeletonPage } from '@/components/Skeleton';
import { AUTH_ROUTES } from '@/constants/routes';
import { BaseResponse, GetUserByIdResponse } from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { AxiosError } from 'axios';
import { Formik } from 'formik';
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router';
import QRCode from 'qrcode';
import { Link } from 'react-router-dom';

const AdminEmployeeDetailPage = () => {
	const { empId } = useParams<{ empId: string }>();
	const [qr, setQr] = useState('');
	const [editMode, setEditMode] = useState(false);
	const queryClient = useQueryClient();
	const [error, setError] = useState('');

	const {
		data: user,
		isLoading,
		error: axiosError,
	} = useQuery(
		['users', empId],
		async () => (await axiosClient.get<GetUserByIdResponse>(`/users/${empId}`)).data,
		{
			enabled: !!empId,
		}
	);

	useEffect(() => {
		const renderQr = async () => {
			if (!empId) return;
			const qrCode = await QRCode.toDataURL(empId);
			setQr(qrCode);
		};
		renderQr();
	}, [empId]);

	if (isLoading) return <SkeletonPage />;
	if ((axiosError as AxiosError)?.response?.status === 404 || !user)
		return <ErrorTemplate code={404} message='User not found' url={AUTH_ROUTES.EMPLOYEES_MANAGE} />;

	const initialValues = {
		firstName: user.data.firstName,
		lastName: user.data.lastName,
		position: user.data.position,
	};

	const {
		role,
		email,
		username,
		isActive,
		isActivated,
		department: { name: departmentName },
	} = user.data;

	type FormValues = typeof initialValues;

	const onToggleAvailability = async () => {
		try {
			await axiosClient.put(`/users/${empId}`, {
				...initialValues,
				role,
				isActive: !isActive,
			});
			queryClient.invalidateQueries('users');
		} catch (error) {
			const axiosError = error as AxiosError<BaseResponse>;
			setError(axiosError.response?.data.message || 'Bad request');
		}
	};

	const onSubmit = async (values: FormValues) => {
		if (JSON.stringify(values) === JSON.stringify(initialValues)) return setEditMode(false);
		try {
			await axiosClient.put<GetUserByIdResponse>(`/users/${empId}`, values);
			queryClient.invalidateQueries('users');
			setEditMode(false);
		} catch (error) {
			const axiosError = error as AxiosError<BaseResponse>;
			// const status = axiosError.response?.status;
			const message = axiosError.response?.data.message;
			console.error(message);
		}
	};

	const validate = (values: FormValues) => {
		const error = {} as { [key in keyof FormValues]: string };
		Object.entries(values).forEach(([key, value]) => {
			if (!value) {
				error[key as keyof FormValues] = 'Required';
			}
		});
		return error;
	};

	return (
		<Formik initialValues={initialValues} onSubmit={onSubmit} validate={validate}>
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
				<div className='flex gap-5 flex-col md:flex-row w-full'>
					<div className='flex flex-col gap-5 flex-1'>
						<InformationPanel header='General information' className='flex-1 h-max'>
							<InputWithLabel
								label='First name'
								name='firstName'
								id='firstName'
								placeholder='A'
								value={values.firstName}
								onChange={handleChange}
								onBlur={handleBlur}
								error={touched.firstName && !!errors.firstName}
								small={touched.firstName ? errors.firstName : undefined}
								disabled={isSubmitting}
								readOnly={!editMode}
							/>
							<InputWithLabel
								label='Last name'
								name='lastName'
								id='lastName'
								placeholder='Nguyen Van'
								value={values.lastName}
								onChange={handleChange}
								onBlur={handleBlur}
								error={touched.lastName && !!errors.lastName}
								small={touched.lastName ? errors.lastName : undefined}
								disabled={isSubmitting}
								readOnly={!editMode}
							/>
							<InputWithLabel
								label='Username'
								name='username'
								id='username'
								placeholder='some cool username'
								value={username}
								readOnly
								disabled={editMode}
							/>
							<InputWithLabel
								label='Email'
								name='email'
								id='email'
								placeholder='example@email.com'
								value={email}
								disabled={editMode}
								readOnly
							/>
						</InformationPanel>
						<InformationPanel header='Work information' className='flex-1 h-max'>
							<InputWithLabel
								label='Department'
								name='department'
								id='department'
								placeholder='Enter department'
								value={departmentName}
								readOnly
								disabled={editMode}
							/>
							<InputWithLabel
								label='Role'
								name='role'
								id='role'
								placeholder='Select role'
								value={role}
								disabled={editMode}
								readOnly
							/>
							<InputWithLabel
								label='Position'
								name='position'
								id='position'
								placeholder='Enter position'
								value={values.position}
								onChange={handleChange}
								onBlur={handleBlur}
								error={touched.position && !!errors.position}
								small={touched.position ? errors.position : undefined}
								disabled={isSubmitting}
							/>
						</InformationPanel>
					</div>
					<div>
						<InformationPanel>
							{qr ? (
								<img src={qr} className='rounded-lg w-48 aspect-square' />
							) : (
								<div className='w-48 aspect-square bg-neutral-600 animate-pulse rounded-lg' />
							)}
							<div className='flex flex-col flex-1 gap-5'>
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
									<Button
										type='button'
										label={isActive ? 'Disable' : 'Enable'}
										className='h-11 rounded-lg'
										severity={isActive ? 'danger' : 'success'}
										onClick={onToggleAvailability}
										disabled={editMode || isSubmitting || !isValid}
									/>
									// <Button label='Print QR' className='h-11 rounded-lg bg-primary' type='button' />
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
								{!isActivated && <Button label='Resend email' severity='info' className='h-11' />}
								<Link to={AUTH_ROUTES.EMPLOYEES_MANAGE} className='w-full'>
									<Button
										type='button'
										label='Return home'
										className='w-full h-11 rounded-lg btn-outlined'
										outlined
									/>
								</Link>
							</div>
							{error && <div className='text-red-500'>{error}</div>}
						</InformationPanel>
					</div>
				</div>
			)}
		</Formik>
	);
};

export default AdminEmployeeDetailPage;
