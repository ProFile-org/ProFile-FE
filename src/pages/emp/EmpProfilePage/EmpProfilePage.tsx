import ErrorTemplate from '@/components/ErrorTemplate/ErrorTemplate.component';
import { AuthContext } from '@/context/authContext';
import { BaseResponse, GetUserByIdResponse } from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { useContext, useState, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import QRCode from 'qrcode';
import { AxiosError } from 'axios';
import { Formik } from 'formik';
import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import { Button } from 'primereact/button';

const EmpProfilePage = () => {
	const { user, dispatch } = useContext(AuthContext);
	const [editMode, setEditMode] = useState(false);
	const [error, setError] = useState('');
	const queryClient = useQueryClient();
	const [qr, setQr] = useState('');

	useEffect(() => {
		const renderQr = async () => {
			if (!user?.id) return;
			const qrCode = await QRCode.toDataURL(user.id);
			setQr(qrCode);
		};
		renderQr();
	}, [user?.id]);

	if (!user) return <ErrorTemplate code={404} message='User not found' url='/' />;

	const initialValues = {
		firstName: user.firstName,
		lastName: user.lastName,
	};

	const {
		role,
		email,
		username,
		position,
		department: { name: departmentName },
	} = user;

	type FormValues = typeof initialValues;

	const onSubmit = async (values: FormValues) => {
		if (JSON.stringify(values) === JSON.stringify(initialValues)) return setEditMode(false);
		try {
			const {
				data: { data },
			} = await axiosClient.put<GetUserByIdResponse>(`/users/self`, values);
			queryClient.invalidateQueries('users');
			const user = {
				...data,
				role: data.role.toLowerCase(),
			};

			dispatch({
				type: 'LOGIN',
				payload: user,
			});
			localStorage.setItem('user', JSON.stringify(user));
			setEditMode(false);
		} catch (error) {
			const axiosError = error as AxiosError<BaseResponse>;
			// const status = axiosError.response?.status;
			const message = axiosError.response?.data.message || 'Bad request';
			console.error(message);
			setError(message);
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
				<div className='flex gap-5 flex-col md:flex-row'>
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
								value={position}
								readOnly
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
							<div className='flex flex-col justify-between flex-1 gap-4'>
								{editMode && (
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
								{error && <div className='text-red-500'>{error}</div>}
							</div>
						</InformationPanel>
					</div>
				</div>
			)}
		</Formik>
	);
};

export default EmpProfilePage;
