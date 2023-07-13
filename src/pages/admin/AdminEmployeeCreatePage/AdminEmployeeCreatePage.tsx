import CustomDropdown from '@/components/Dropdown/Dropdown.component';
import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import { AUTH_ROUTES } from '@/constants/routes';
import useDepartments from '@/hooks/useDepartments';
import { BaseResponse, GetUserByIdResponse } from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { AxiosError } from 'axios';
import { Formik, FormikHelpers } from 'formik';
import { Button } from 'primereact/button';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const initialValues = {
	username: '',
	email: '',
	firstName: '',
	lastName: '',
	department: '',
	role: '',
	position: '',
};

type FormValues = typeof initialValues;

const roles = [
	{ label: 'Staff', value: 'Staff' },
	{ label: 'Employee', value: 'Employee' },
];

const AdminEmployeeCreatePage = () => {
	const { departments, departmentsRefetch } = useDepartments();
	const navigate = useNavigate();

	const onSubmit = async (values: FormValues, { setFieldError }: FormikHelpers<FormValues>) => {
		try {
			const { data: user } = await axiosClient.post<GetUserByIdResponse>('/users', {
				...values,
				departmentId: values.department,
			});
			navigate(`${AUTH_ROUTES.EMPLOYEES_MANAGE}/${user.data.id}`);
		} catch (error) {
			const axiosError = error as AxiosError<BaseResponse>;
			const status = axiosError.response?.status;
			const message = axiosError.response?.data.message;
			if (status === 409) {
				setFieldError('username', 'Username already exists');
				setFieldError('email', 'Email already exists');
			}
			if (status === 404) {
				setFieldError('department', 'Department not found');
			}
			console.error(message);
		}
	};

	const validate = (values: FormValues) => {
		const error = {} as { [key in keyof FormValues]: string };
		Object.entries(values).forEach(([key, value]) => {
			if (key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string)) {
				error[key as keyof FormValues] = 'Invalid email';
			}
			if (!value) {
				error[key as keyof FormValues] = 'Required';
			}
		});
		return error;
	};

	useEffect(() => {
		departmentsRefetch();
	}, [departmentsRefetch]);

	return (
		<Formik initialValues={initialValues} onSubmit={onSubmit} validate={validate}>
			{({
				values,
				touched,
				errors,
				handleSubmit,
				handleChange,
				handleBlur,
				isValid,
				isSubmitting,
			}) => (
				<form className='flex gap-5 flex-col md:flex-row w-full' onSubmit={handleSubmit}>
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
						/>
						<InputWithLabel
							label='Username'
							name='username'
							id='username'
							placeholder='some cool username'
							value={values.username}
							onChange={handleChange}
							onBlur={handleBlur}
							error={touched.username && !!errors.username}
							small={touched.username ? errors.username : undefined}
							disabled={isSubmitting}
						/>
						<InputWithLabel
							label='Email'
							name='email'
							id='email'
							placeholder='example@email.com'
							value={values.email}
							onChange={handleChange}
							onBlur={handleBlur}
							error={touched.email && !!errors.email}
							small={touched.email ? errors.email : undefined}
							disabled={isSubmitting}
						/>
					</InformationPanel>
					<InformationPanel header='Work information' className='flex-1 h-max'>
						<CustomDropdown
							label='Department'
							name='department'
							id='department'
							options={departments}
							optionLabel='name'
							optionValue='id'
							placeholder='Select department'
							value={values.department}
							onChange={handleChange}
							onBlur={handleBlur}
							error={touched.department && !!errors.department}
							small={touched.department ? errors.department : undefined}
							disabled={isSubmitting}
						/>
						<CustomDropdown
							label='Role'
							name='role'
							id='role'
							options={roles}
							placeholder='Select role'
							value={values.role}
							onChange={handleChange}
							onBlur={handleBlur}
							error={touched.role && !!errors.role}
							small={touched.role ? errors.role : undefined}
							disabled={isSubmitting}
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
						<Button
							label='Create'
							type='submit'
							className='w-full h-11 bg-primary mt-5'
							disabled={!isValid}
							loading={isSubmitting}
						/>
					</InformationPanel>
				</form>
			)}
		</Formik>
	);
};

export default AdminEmployeeCreatePage;
