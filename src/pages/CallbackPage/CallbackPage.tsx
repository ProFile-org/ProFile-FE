import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import { UNAUTH_ROUTES } from '@/constants/routes';
import axiosClient from '@/utils/axiosClient';
import { Formik } from 'formik';
import { Button } from 'primereact/button';
import { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';

const initialValues = {
	password: '',
	confirmPassword: '',
};

type FormValues = typeof initialValues;

const ResetPage = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const token = location.state;

	useEffect(() => {
		window.history.replaceState({}, '');
	}, []);

	if (!token) {
		return <Navigate to={UNAUTH_ROUTES.AUTH} replace />;
	}

	const validate = (values: FormValues) => {
		const errors: Partial<FormValues> = {};
		if (!values.password) {
			errors.password = 'Required';
		} else if (values.password.length < 5) {
			errors.password = 'Password must be at least 5 characters';
		}
		if (!values.confirmPassword) {
			errors.confirmPassword = 'Required';
		} else if (values.confirmPassword !== values.password) {
			errors.confirmPassword = 'Password does not match';
		}
		return errors;
	};

	const onSubmit = async (values: FormValues) => {
		try {
			const response = await axiosClient.post('/auth/reset-password', {
				newPassword: values.password,
				confirmPassword: values.confirmPassword,
				token,
			});
			console.log(response);
			navigate(UNAUTH_ROUTES.AUTH, {
				replace: true,
			});
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Formik initialValues={initialValues} onSubmit={onSubmit} validate={validate}>
			{({ values, touched, errors, handleBlur, handleChange, handleSubmit }) => (
				<form
					onSubmit={handleSubmit}
					className='absolute top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 p-5 bg-neutral-800 rounded-lg max-w-xl w-full'
				>
					<h1 className='text-lg font-bold text-white mb-3'>Reset Password</h1>
					<InputWithLabel
						id='password'
						name='password'
						label='Password'
						type='password'
						value={values.password}
						onChange={handleChange}
						onBlur={handleBlur}
						error={touched.password && !!errors.password}
						small={touched.password ? errors.password : undefined}
					/>
					<InputWithLabel
						wrapperClassName='mt-5'
						id='confirmPassword'
						name='confirmPassword'
						label='Confirm Password'
						type='password'
						value={values.confirmPassword}
						onChange={handleChange}
						onBlur={handleBlur}
						error={touched.confirmPassword && !!errors.confirmPassword}
						small={touched.confirmPassword ? errors.confirmPassword : undefined}
					/>
					<Button label='Submit' type='submit' className='bg-primary h-11 mt-5 rounded-lg w-full' />
				</form>
			)}
		</Formik>
	);
};

export default ResetPage;
