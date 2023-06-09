/* eslint-disable no-mixed-spaces-and-tabs */
import CustomDropdown from '@/components/Dropdown/Dropdown.component';
import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import Progress from '@/components/Progress/Progress.component';
import { AUTH_ROUTES } from '@/constants/routes';
import axiosClient from '@/utils/axiosClient';
import { Formik, FormikHelpers } from 'formik';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '@/context/authContext';
import Overlay from '@/components/Overlay/Overlay.component';
import QrScanner from '@/components/QrScanner/QrScanner.component';
import { BaseResponse, GetDocumentByIdResponse } from '@/types/response';
import { useMutation } from 'react-query';
import { AxiosError, AxiosResponse } from 'axios';
import useEmptyContainers from '@/hooks/useEmptyContainers';
import useDocumentTypes from '@/hooks/useDocumentTypes';
import TextareaWithLabel from '@/components/InputWithLabel/TextareaWithLabel.component';
// import FileInput from '@/components/FileInput/FileInput.component';
// import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.component';
import { getUser } from '@/utils/services/getUser';

const RequiredValues = {
	id: '',
	name: '',
	title: '',
	documentType: '',
	locker: '',
	folder: '',
	description: '',
	files: [] as File[],
};

const NOT_REQUIRED = ['description', 'files'];

type FormValues = typeof RequiredValues;

// type FormKeys = keyof FormValues;

type ImportDocumentBody = {
	title: string;
	documentType: string;
	importerId: string;
	folderId: string;
	description: string;
};

const ImportDocumentContainer = () => {
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);
	const mutation = useMutation<
		AxiosResponse<GetDocumentByIdResponse>,
		AxiosError,
		ImportDocumentBody
	>((document) => axiosClient.post('/documents', document), {
		retry: (_, error) => {
			if (error.response?.status === 401) return true;
			return false;
		},
	});

	const { availableFolders, availableLockers, containerRefetch } = useEmptyContainers({
		roomId: user?.roomId || '',
	});

	const { documentTypes, typesRefetch } = useDocumentTypes();

	const [openScan, setOpenScan] = useState(false);
	// const [data, setData] = useState<string[]>([]);

	const onSubmit = async (
		values: FormValues,
		{ setSubmitting, setFieldError }: FormikHelpers<FormValues>
	) => {
		try {
			// const formData = new FormData();
			// formData.set('Name', values.title);
			// formData.set('Path', '/');
			// formData.set('isDirectory', 'true');
			// await axiosClient.post('/entries', formData, {
			// 	headers: { 'Content-Type': 'multipart/form-data' },
			// });
			// await Promise.all(
			// 	values.files.map((file) => {
			// 		const fileData = new FormData();
			// 		fileData.set('Name', file.name);
			// 		fileData.set('Path', `/${values.title}`);
			// 		fileData.set('File', file);
			// 		fileData.set('isDirectory', 'false');
			// 		return axiosClient.post('/entries', fileData, {
			// 			headers: { 'Content-Type': 'multipart/form-data' },
			// 		});
			// 	})
			// );
			mutation.mutate(
				{
					title: values.title,
					documentType: values.documentType.toUpperCase(),
					importerId: values.id,
					folderId: values.folder,
					description: values.description,
				},
				{
					onSuccess: (result) => {
						navigate(`${AUTH_ROUTES.DOCUMENTS}/${result.data.data.id}`);
					},
					onError: (error) => {
						const axiosError = error as AxiosError<BaseResponse>;
						const msg = axiosError.response?.data.message || 'Incorrect format';
						const status = axiosError.response?.status;

						if (status === 409) {
							setFieldError('title', msg);
						}
						if (status === 400) {
							setFieldError('id', msg);
						}
					},
				}
			);
		} catch (error) {
			console.log(error);
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

	const handleIdChange = async (
		id: string,
		setFieldError: (id: string, name: string) => void,
		setFieldValue: (id: string, value: string, revalidate?: boolean) => void
	) => {
		const user = await getUser(id);
		if (!user) {
			setFieldError('id', 'User not found');
			setFieldValue('name', '', false);
		} else setFieldValue('name', `${user.data.firstName} ${user.data.lastName}`, true);
	};

	useEffect(() => {
		const getConfigs = async () => {
			await containerRefetch();
			await typesRefetch();
		};
		getConfigs();
	}, [containerRefetch, typesRefetch]);

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
				setFieldError,
				isSubmitting,
				isValid,
			}) => {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const onScan = async (e: any) => {
					const result = e?.getText();
					if (!result) return;
					setFieldValue('id', result);
					const user = await getUser(result);
					if (!user) {
						setFieldError('id', 'User not found');
						setFieldValue('name', '', false);
					} else {
						setFieldValue('name', `${user.data.firstName} ${user.data.lastName}`, false);
					}
					setOpenScan(false);
				};

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
										id='locker'
										name='locker'
										label='Lockers'
										options={availableLockers}
										optionLabel='name'
										optionValue='id'
										onChange={(e) => {
											setFieldValue('folder', '');
											setFieldTouched('folder', false);
											handleChange(e);
										}}
										onBlur={handleBlur}
										value={values.locker}
										error={touched.locker && !!errors.locker}
										small={touched.locker ? errors.locker : undefined}
										disabled={isSubmitting}
										itemTemplate={(option) => (
											<div className='flex flex-col gap-3'>
												<div>
													{option.name} - Free: {option.free}/{option.max}
												</div>
												<div>{option.description}</div>
											</div>
										)}
									/>
									<CustomDropdown
										id='folder'
										name='folder'
										label='Folders'
										options={availableFolders?.[values.locker] || []}
										optionLabel='name'
										optionValue='id'
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.folder}
										disabled={!values.locker || isSubmitting}
										error={touched.folder && !!errors.folder}
										small={touched.folder ? errors.folder : undefined}
										itemTemplate={(option) => (
											<div className='flex gap-2 items-center'>
												{option.name} - Free: {option.free}/{option.max}
											</div>
										)}
									/>
									{values.folder && availableFolders && (
										<Progress
											label='Available'
											showPercentage
											current={
												availableFolders[values.locker].find((value) => value.id === values.folder)
													?.free || 0
											}
											max={
												availableFolders[values.locker].find((value) => value.id === values.folder)
													?.max || 0
											}
										/>
									)}
									<Button
										label='Submit'
										type='submit'
										className='bg-primary mt-5 rounded-lg'
										disabled={isSubmitting || !isValid}
									/>
								</InformationPanel>
							</div>
							<div className='flex flex-col gap-5 flex-1'>
								<InformationPanel header='Employee information' className='h-max'>
									<InputWithLabel
										id='id'
										name='id'
										label='ID'
										onChange={(e) => {
											handleChange(e);
											handleIdChange(e.target.value, setFieldError, setFieldValue);
										}}
										onBlur={(e) => {
											if (errors.id && e.target.value !== '') return;
											// handleBlur will call validate, if an error exists, aka not found, don't revalidate
											handleBlur(e);
										}}
										value={values.id}
										error={touched.id && !!errors.id}
										small={errors.id ? errors.id : undefined}
										disabled={isSubmitting}
										sideComponent={
											<Button
												label='Scan'
												className='self-end bg-primary rounded-lg h-11'
												type='button'
												onClick={() => setOpenScan(true)}
												disabled={isSubmitting}
											/>
										}
									/>
									<InputWithLabel label='Name' name='name' id='name' readOnly value={values.name} />
								</InformationPanel>
								{/* <InformationPanel header='Add digital copies'>
									<ImagePreviewer
										images={data}
										setData={setData}
										setFiles={(index) =>
											setFieldValue('files', [
												...values.files.slice(0, index),
												...values.files.slice(index + 1),
											])
										}
									/>
									<FileInput
										setData={setData}
										setFiles={(file) => setFieldValue('files', [...values.files, file])}
									/>
									<Button
										label='Scan more'
										type='button'
										className='bg-primary rounded-lg h-11'
										disabled={isSubmitting}
									/>
								</InformationPanel> */}
							</div>
						</form>
						{openScan && (
							<Overlay
								onExit={() => setOpenScan(false)}
								className='flex items-center justify-center'
							>
								<div className='card w-[70vw] min-w-[250px] sm:w-[50vh]'>
									<QrScanner onResult={onScan} />
									<Button
										label='Exit'
										className='h-11 rounded-lg w-full mt-5'
										onClick={() => setOpenScan(false)}
									/>
								</div>
							</Overlay>
						)}
					</>
				);
			}}
		</Formik>
	);
};

export default ImportDocumentContainer;
