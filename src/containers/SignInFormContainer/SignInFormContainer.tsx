import { useContext } from 'react';
import { Formik, FormikHelpers } from 'formik';
import { Button } from 'primereact/button';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import { AuthContext } from '@/context/authContext';
import Spinner from '@/components/Spinner/Spinner.component';
import axiosClient from '@/utils/axiosClient';
import { BaseResponse, GetRoomByIdResponse, LoginResponse } from '@/types/response';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router';

const SIGNIN_INITIALS = {
	email: '',
	password: '',
	error: '',
};

interface ISiginFormValues {
	email: string;
	password: string;
	error: string;
}

const SignInForm = () => {
	const { dispatch } = useContext(AuthContext);
	const navigate = useNavigate();

	const onValidate = async (values: ISiginFormValues) => {
		const errors: { email?: string; password?: string } = {};
		const { email, password } = values;

		if (!email) errors.email = 'Email is required';
		if (!password) errors.password = 'Password is required';

		// Email does not match regex
		if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Email is invalid';

		// Password length needs to be at least 5
		if (password && password.length < 5)
			errors.password = 'Password must be at least 5 characters long';

		return errors;
	};

	const onSubmit = async (
		values: ISiginFormValues,
		{ setSubmitting, setErrors }: FormikHelpers<ISiginFormValues>
	) => {
		try {
			const { email, password } = values;
			const {
				data: { data },
			} = await axiosClient.post<LoginResponse>('/auth/login', {
				email,
				password,
			});

			const user = {
				...data,
				role: data.role.toLowerCase(),
			};

			if (user.role === 'staff') {
				const room = (await axiosClient.get<GetRoomByIdResponse>(`/staffs/${data.id}/rooms`)).data;
				user.roomId = room.data?.id; // If staff is not assigned, it will be null
			}

			dispatch({
				type: 'LOGIN',
				payload: user,
			});
			localStorage.setItem('user', JSON.stringify(user));
		} catch (error) {
			console.error(error);
			const axiosError = error as AxiosError<BaseResponse<{ token: string }>>;
			if (axiosError.response?.status === 404) {
				setErrors({
					error: 'You have not been assigned a room yet, please contact admin for more information',
				});
			} else {
				const token = axiosError.response?.data.data.token;
				if (token) {
					navigate(`/reset`, {
						state: token,
					});
					return;
				}
				const message = axiosError.response?.data.message || 'Bad request';
				setErrors({
					error: message,
				});
			}
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Formik initialValues={SIGNIN_INITIALS} onSubmit={onSubmit} validate={onValidate}>
			{({ errors, values, touched, handleChange, handleSubmit, handleBlur, isSubmitting }) => (
				<form
					onSubmit={handleSubmit}
					className='w-full max-w-md p-5 lg:p-10 flex flex-col gap-6 bg-neutral-800 rounded-lg'
				>
					<h1 className='text-white text-center font-bold text-xl'>Sign in to ProFile</h1>
					<InputWithLabel
						label='Email'
						id='email'
						name='email'
						value={values.email}
						onChange={handleChange}
						onBlur={handleBlur}
						error={touched.email && (!!errors.email || !!errors.error)}
						small={touched.email && errors.email ? errors.email : undefined}
					/>
					<InputWithLabel
						label='Password'
						id='password'
						name='password'
						value={values.password}
						onChange={handleChange}
						onBlur={handleBlur}
						error={touched.password && (!!errors.password || !!errors.error)}
						small={touched.password && errors.password ? errors.password : undefined}
						type='password'
					/>
					{errors.error && (
						<div className='bg-red-300 border-red-500 border-2 rounded-lg px-3 py-2'>
							{errors.error}
						</div>
					)}
					<Button
						disabled={isSubmitting || Object.keys(errors).length > 0}
						className='justify-center rounded-lg font-semibold'
					>
						{isSubmitting ? <Spinner size='1.5rem' /> : 'Sign in'}
					</Button>
				</form>
			)}
		</Formik>
	);
};

export default SignInForm;
