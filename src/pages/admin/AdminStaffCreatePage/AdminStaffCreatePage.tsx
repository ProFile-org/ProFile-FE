import CustomDropdown from '@/components/Dropdown/Dropdown.component';
import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import { AUTH_ROUTES } from '@/constants/routes';
import usePagination from '@/hooks/usePagination';
import { IRoom, IStaff } from '@/types/item';
import { BaseResponse } from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { AxiosError } from 'axios';
import { Formik } from 'formik';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { useNavigate } from 'react-router';

const AdminStaffCreatePage = () => {
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const params = new URLSearchParams(window.location.search);

	const initialValues = {
		staffId: params.get('staffId') || '',
		roomId: '',
	};

	type FormValues = typeof initialValues;

	const { data: staffs } = usePagination<IStaff>({
		key: ['staffs', 'unassigned'],
		url: '/staffs',
	});

	const { data: rooms } = usePagination<IRoom>({
		key: ['rooms', 'unassigned'],
		url: '/rooms',
	});

	const staffOptions = staffs?.data.items
		// .filter((staff) => staff.room === null)
		.map((staff) => ({
			label: `${staff.user.firstName} ${staff.user.lastName}`,
			value: staff.id,
			room: staff.room,
		}));

	const roomOptions = rooms?.data.items
		.filter((room) => room.staffId === null && room.isAvailable)
		.map((room) => ({
			label: room.name,
			value: room.id,
		}));

	const onSubmit = async (values: FormValues) => {
		try {
			await axiosClient.post('/staffs', values);
			navigate(AUTH_ROUTES.STAFFS_MANAGE);
		} catch (error) {
			const axiosError = error as AxiosError<BaseResponse>;
			console.error(error);
			setError(axiosError.response?.data.message || 'Bad request');
		}
	};

	const onRemove = async (values: FormValues) => {
		try {
			await axiosClient.put(`/staffs/${values.staffId}`);
			navigate(AUTH_ROUTES.STAFFS_MANAGE);
		} catch (error) {
			const axiosError = error as AxiosError<BaseResponse>;
			console.error(error);
			setError(axiosError.response?.data.message || 'Bad request');
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
			{({ handleSubmit, handleBlur, handleChange, errors, touched, values }) => (
				<form onSubmit={handleSubmit}>
					<InformationPanel>
						<CustomDropdown
							label='Staff'
							filter
							options={staffOptions}
							name='staffId'
							id='staffId'
							onChange={handleChange}
							onBlur={handleBlur}
							small={touched.staffId ? errors.staffId : undefined}
							error={touched.staffId && !!errors.staffId}
							value={values.staffId}
							itemTemplate={(option) => (
								<div className='flex justify-between'>
									<div>{option.label}</div>
									<div>{option.room?.name || 'Unassigned'}</div>
								</div>
							)}
						/>
						<CustomDropdown
							label='Room'
							filter
							options={roomOptions}
							name='roomId'
							id='roomId'
							onChange={handleChange}
							onBlur={handleBlur}
							small={touched.roomId ? errors.roomId : undefined}
							error={touched.roomId && !!errors.roomId}
							value={values.roomId}
						/>
						{error && <div className='text-red-500'>{error}</div>}
						<div className='flex gap-5 w-full'>
							<Button label='Submit' type='submit' className='bg-primary h-11 flex-1' />
							<Button
								label='Remove'
								type='button'
								outlined
								className='bg-primary btn-outlined h-11 flex-1'
								onClick={() => onRemove(values)}
							/>
						</div>
					</InformationPanel>
				</form>
			)}
		</Formik>
	);
};

export default AdminStaffCreatePage;
