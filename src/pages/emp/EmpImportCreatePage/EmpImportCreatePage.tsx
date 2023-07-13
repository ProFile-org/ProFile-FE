/* eslint-disable no-mixed-spaces-and-tabs */
import CustomDropdown from '@/components/Dropdown/Dropdown.component';
import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import { AUTH_ROUTES } from '@/constants/routes';
import axiosClient from '@/utils/axiosClient';
import { Formik, FormikHelpers } from 'formik';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router';
import { useContext, useEffect } from 'react';
import { AuthContext } from '@/context/authContext';
import { AxiosError } from 'axios';
import useDocumentTypes from '@/hooks/useDocumentTypes';
import useRooms from '@/hooks/useRooms';
import { BaseResponse } from '@/types/response';
import TextareaWithLabel from '@/components/InputWithLabel/TextareaWithLabel.component';
import { InputSwitch } from 'primereact/inputswitch';

const RequiredValues = {
	title: '',
	documentType: '',
	description: '',
	roomId: '',
	importReason: '',
	isPrivate: true,
	// files: [] as File[],
};

const NOT_REQUIRED = ['description', 'isPrivate'];

type FormValues = typeof RequiredValues;

const EmpImportPage = () => {
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);

	const { documentTypes, typesRefetch } = useDocumentTypes();

	const departmentId = user?.department.id || '';

	const { rooms, roomsRefetch } = useRooms(false, departmentId);

	const onSubmit = async (
		values: FormValues,
		{ setSubmitting, setFieldError }: FormikHelpers<FormValues>
	) => {
		try {
			const result = await axiosClient.post('/documents/import-requests', values);
			navigate(`${AUTH_ROUTES.IMPORT_MANAGE}/${result.data.data.id}`);
		} catch (error) {
			console.log(error);
			const axiosError = error as AxiosError<BaseResponse>;
			const msg = axiosError.response?.data.message || 'Incorrect format';
			const status = axiosError.response?.status;

			if (status === 409) {
				setFieldError('title', msg);
			}
			if (status === 400) {
				setFieldError('id', msg);
			}
		} finally {
			setSubmitting(false);
		}
	};

	const onValidate = (values: FormValues) => {
		const errors: { [key: string]: string } = {};
		Object.entries(values).forEach(([key, value]) => {
			if (!value && NOT_REQUIRED.indexOf(key) === -1) {
				errors[key] = 'This field is required';
			}
		});
		return errors;
	};

	useEffect(() => {
		const getConfigs = async () => {
			await typesRefetch();
			await roomsRefetch();
		};
		getConfigs();
	}, [typesRefetch, roomsRefetch]);

	return (
		<Formik initialValues={RequiredValues} onSubmit={onSubmit} validate={onValidate}>
			{({
				values,
				errors,
				touched,
				handleBlur,
				handleChange,
				handleSubmit,
				setFieldValue,
				setFieldTouched,
				isSubmitting,
				isValid,
			}) => {
				return (
					<>
						<form className='flex gap-5 md:flex-row flex-col' onSubmit={handleSubmit}>
							<div className='flex flex-col gap-5 flex-1'>
								<InformationPanel header='Document information'>
									<InputWithLabel
										name='title'
										id='title'
										label='Title'
										error={touched.title && !!errors.title}
										small={touched.title ? errors.title : undefined}
										value={values.title}
										onChange={handleChange}
										onBlur={handleBlur}
										disabled={isSubmitting}
									/>
									<CustomDropdown
										id='documentType'
										name='documentType'
										options={documentTypes}
										optionLabel='name'
										optionValue='id'
										label='Document type'
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.documentType}
										error={touched.documentType && !!errors.documentType}
										small={touched.documentType ? errors.documentType : undefined}
										disabled={isSubmitting}
										editable
										panelFooterTemplate={({ options, value }) => (
											<div className='px-3 py-2'>
												{value === '' ? (
													'No item selected'
												) : options?.some(
														(option) => option.id.toUpperCase() === value.toUpperCase()
												  ) ? (
													<>
														<strong>{value.toUpperCase()}</strong> selected
													</>
												) : (
													<>
														<strong>{value.toUpperCase()}</strong> will be added
													</>
												)}
											</div>
										)}
									/>
									<div className='flex gap-3 items-center'>
										<label htmlFor='isPrivate' className='header'>
											Private
										</label>
										<InputSwitch
											checked={values.isPrivate}
											name='isPrivate'
											id='isPrivate'
											onChange={(e) => setFieldValue('isPrivate', e.value)}
										/>
									</div>
									<TextareaWithLabel
										label='Reason for importing'
										wrapperClassName='w-full'
										id='importReason'
										name='importReason'
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.importReason}
										error={touched.importReason && !!errors.importReason}
										small={touched.importReason ? errors.importReason : undefined}
										placeholder='Reason for importing'
										disabled={isSubmitting}
									/>
									<TextareaWithLabel
										label='Description'
										wrapperClassName='w-full'
										id='description'
										name='description'
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.description}
										error={touched.description && !!errors.description}
										small={touched.description ? errors.description : undefined}
										placeholder="Document's description"
										disabled={isSubmitting}
									/>
								</InformationPanel>
								<InformationPanel className='flex-1 h-max overflow-y-auto' header='Availability'>
									<CustomDropdown
										id='roomId'
										name='roomId'
										label='Rooms'
										options={rooms}
										optionLabel='name'
										optionValue='id'
										onChange={(e) => {
											setFieldValue('roomId', '');
											setFieldTouched('roomId', false);
											handleChange(e);
										}}
										onBlur={handleBlur}
										value={values.roomId}
										error={touched.roomId && !!errors.roomId}
										small={touched.roomId ? errors.roomId : undefined}
										disabled={isSubmitting}
										itemTemplate={(option) => (
											<div className='flex flex-col gap-3'>
												<div>
													{option.name} - Free: {option.capacity - option.numberOfLockers}/
													{option.capacity}
												</div>
												<div>{option.description}</div>
											</div>
										)}
									/>
									<Button
										label='Submit'
										type='submit'
										className='bg-primary mt-5 rounded-lg h-11'
										disabled={isSubmitting || !isValid}
									/>
								</InformationPanel>
							</div>
						</form>
					</>
				);
			}}
		</Formik>
	);
};

export default EmpImportPage;
