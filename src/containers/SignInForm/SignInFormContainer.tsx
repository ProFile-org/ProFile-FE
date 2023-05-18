import { useContext } from 'react';
import { Formik, FormikHelpers } from 'formik';
import { Button } from 'primereact/button';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import { AuthContext } from '@/context/authContext';
import Spinner from '@/components/Spinner/Spinner.component';

const SIGNIN_INITIALS = {
	email: '',
	password: '',
};

interface ISiginFormValues {
	email: string;
	password: string;
}

const SignInForm = () => {
	const { dispatch } = useContext(AuthContext);

	const onValidate = async (values: ISiginFormValues) => {
		const errors: { email?: string; password?: string } = {};
		const { email, password } = values;

		if (!email) errors.email = 'Email is required';
		if (!password) errors.password = 'Password is required';

		// Email does not match regex
		if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Email is invalid';

		// Password length needs to be at least 6
		if (password && password.length < 6)
			errors.password = 'Password must be at least 6 characters long';

		return errors;
	};

	const onSubmit = (
		values: ISiginFormValues,
		{ setSubmitting }: FormikHelpers<ISiginFormValues>
	) => {
		try {
			const USER = {
				email: values.email,
				id: Date.now().toString(),
				role: 'admin',
				username: 'admin',
				department: 'IT',
			};
			setTimeout(() => {
				dispatch({
					type: 'LOGIN',
					payload: USER,
				});
				localStorage.setItem('user', JSON.stringify(USER));
				setSubmitting(false);
			}, 300);
		} catch (error) {
			console.error(error);
		} finally {
			// setSubmitting(false);
		}
	};

	return (
		<Formik initialValues={SIGNIN_INITIALS} onSubmit={onSubmit} validate={onValidate}>
			{({ errors, values, touched, handleChange, handleSubmit, handleBlur, isSubmitting }) => (
				<form
					onSubmit={handleSubmit}
					className='w-full max-w-md p-5 lg:p-10 flex flex-col gap-8 bg-neutral-800 rounded-lg'
				>
					<InputWithLabel
						label='Email'
						id='email'
						name='email'
						value={values.email}
						onChange={handleChange}
						onBlur={handleBlur}
						error={touched.email && !!errors.email}
						small={touched.email && errors.email ? errors.email : undefined}
					/>
					<InputWithLabel
						label='Password'
						id='password'
						name='password'
						value={values.password}
						onChange={handleChange}
						onBlur={handleBlur}
						error={touched.password && !!errors.password}
						small={touched.password && errors.password ? errors.password : undefined}
						type='password'
					/>
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
