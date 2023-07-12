import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import { AUTH_ROUTES } from '@/constants/routes';
import axiosClient from '@/utils/axiosClient';
import { Formik, FormikHelpers } from 'formik';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router';

const initialValues = {
	name: '',
};

type FormValues = typeof initialValues;

const AdminDepartmentCreatePage = () => {
	const navigate = useNavigate();

	const onSubmit = async (values: FormValues, { setFieldError }: FormikHelpers<FormValues>) => {
		try {
			const res = await axiosClient.post('/departments', values);
			navigate(`${AUTH_ROUTES.DEPARTMENTS_MANAGE}/${res.data.data.id}`);
		} catch (error) {
			setFieldError('name', 'Department name already exists');
			console.error(error);
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
			{({ handleSubmit, handleChange, handleBlur, values, errors, touched }) => (
				<form onSubmit={handleSubmit}>
					<InformationPanel title='Create Department'>
						<InputWithLabel
							label='Department name'
							name='name'
							id='name'
							value={values.name}
							onChange={handleChange}
							error={touched.name && !!errors.name}
							small={touched.name ? errors.name : undefined}
							onBlur={handleBlur}
						/>
						<Button label='Create' type='submit' className='bg-primary h-11' />
					</InformationPanel>
				</form>
			)}
		</Formik>
	);
};

export default AdminDepartmentCreatePage;
