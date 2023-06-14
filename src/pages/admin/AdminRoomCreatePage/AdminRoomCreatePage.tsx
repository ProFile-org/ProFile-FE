import CustomDropdown from '@/components/Dropdown/Dropdown.component';
import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputNumberWithLabel from '@/components/InputWithLabel/InputNumberWithLabel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import { AUTH_ROUTES } from '@/constants/routes';
import { BaseResponse, GetRoomByIdResponse } from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { AxiosError } from 'axios';
import { Formik, FormikHelpers } from 'formik';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import TextareaWithLabel from '@/components/InputWithLabel/TextareaWithLabel.component';
import useDepartments from '@/hooks/useDepartments';

const initialValues = {
	name: '',
	description: '',
	department: '',
	capacity: 0,
};

const NOT_REQUIRED = ['description'];

type FormValues = typeof initialValues;

const AdminRoomCreatePage = () => {
	const { departments, departmentsRefetch } = useDepartments();
	const navigate = useNavigate();

	const onSubmit = async (values: FormValues, { setFieldError }: FormikHelpers<FormValues>) => {
		try {
			const { data: room } = await axiosClient.post<GetRoomByIdResponse>('/rooms', {
				...values,
				departmentId: values.department,
			});
			navigate(`${AUTH_ROUTES.ROOMS}/${room.data.id}`);
		} catch (error) {
			const axiosError = error as AxiosError<BaseResponse>;
			const status = axiosError.response?.status;
			const message = axiosError.response?.data.message;
			if (status === 404) {
				setFieldError('department', 'Department not found');
			}
			if (status === 409) {
				if (message?.includes('limit')) {
					setFieldError('department', 'Department is full');
				} else {
					setFieldError('name', 'Locker name already exists');
				}
			}
			console.error(message);
		}
	};

	const validate = (values: FormValues) => {
		const error = {} as { [key in keyof FormValues]: string };
		Object.entries(values).forEach(([key, value]) => {
			if (!value && NOT_REQUIRED.indexOf(key) === -1) {
				error[key as keyof FormValues] = 'Required';
			}
			if (key === 'capacity' && (value as number) <= 0) {
				error[key as keyof FormValues] = 'Capacity must be greater than 0';
			}
		});
		return error;
	};

	useEffect(() => {
		departmentsRefetch();
	}, [departmentsRefetch]);

	return (
		<Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
			{({
				values,
				errors,
				touched,
				handleBlur,
				handleChange,
				handleSubmit,
				isValid,
				setFieldValue,
				isSubmitting,
			}) => (
				<form onSubmit={handleSubmit}>
					<InformationPanel header='Room information' className='w-full md:w-1/2'>
						<InputWithLabel
							label='Name'
							name='name'
							id='name'
							placeholder='Room name'
							value={values.name}
							onChange={handleChange}
							onBlur={handleBlur}
							error={touched.name && !!errors.name}
							small={touched.name ? errors.name : undefined}
							disabled={isSubmitting}
						/>
						<InputNumberWithLabel
							label='Capacity'
							name='capacity'
							id='capacity'
							placeholder='Room capacity'
							value={values.capacity}
							onChange={(e) => setFieldValue('capacity', e.value)}
							onBlur={handleBlur}
							error={touched.capacity && !!errors.capacity}
							small={touched.capacity ? errors.capacity : undefined}
							disabled={isSubmitting}
						/>
						<CustomDropdown
							options={departments}
							label='Department'
							name='department'
							id='department'
							optionLabel='name'
							optionValue='id'
							placeholder='Select a department'
							value={values.department}
							onChange={handleChange}
							onBlur={handleBlur}
							error={touched.department && !!errors.department}
							small={touched.department ? errors.department : undefined}
							disabled={isSubmitting}
						/>
						<TextareaWithLabel
							label='Description'
							name='description'
							id='description'
							placeholder='Room description'
							value={values.description}
							onChange={handleChange}
							onBlur={handleBlur}
							error={touched.description && !!errors.description}
							small={touched.description ? errors.description : undefined}
							disabled={isSubmitting}
						/>
						<Button
							type='submit'
							label='Create'
							className='w-full mt-5 h-11 bg-primary'
							disabled={!isValid}
							loading={isSubmitting}
						/>
					</InformationPanel>
				</form>
			)}
		</Formik>
	);
};

export default AdminRoomCreatePage;
