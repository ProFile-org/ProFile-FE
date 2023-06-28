import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import { Formik } from 'formik';
import { Button } from 'primereact/button';

const initialValues = {
	password: '',
	confirmPassword: '',
};

type FormValues = typeof initialValues;

const CallbackPage = () => {
	const query = new URLSearchParams(window.location.search);

	const validate = (values: FormValues) => {
		const errors: Partial<FormValues> = {};
		if (!values.password) {
			errors.password = 'Required';
		} else if (values.password.length < 8) {
			errors.password = 'Password must be at least 8 characters';
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
			// const response = await axiosClient.post('/auth/reset-password', {
			//   password: values.password,
			//   confirmPassword: values.confirmPassword,
			//   token: query.get('token'),
			// });
			// console.log(response);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Formik initialValues={initialValues} onSubmit={onSubmit} validate={validate}>
			{({ values, touched, errors, handleBlur, handleChange, handleSubmit }) => (
				<form onSubmit={handleSubmit}>
					<h1 className='text-lg font-bold'>Reset Password</h1>
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
					<Button label='Submit' type='submit' className='bg-primary h-11 mt-5 rounded-lg' />
				</form>
			)}
		</Formik>
	);
};

export default CallbackPage;
