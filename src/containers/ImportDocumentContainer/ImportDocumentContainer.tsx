import CustomDropdown from '@/components/Dropdown/Dropdown.component';
import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import Progress from '@/components/Progress/Progress.component';
import { AUTH_ROUTES } from '@/constants/routes';
import axiosClient from '@/utils/axiosClient';
import { Formik, FormikHelpers } from 'formik';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router';
import { useState, useContext, useMemo, useEffect } from 'react';
import { AuthContext } from '@/context/authContext';
import Overlay from '@/components/Overlay/Overlay.component';
import QrScanner from '@/components/QrScanner/QrScanner.component';
import {
	GetConfigResponse,
	GetDepartmentsResponse,
	GetDocumentTypesResponse,
	GetEmptyContainersResponse,
} from '@/types/response';
import { useMutation, useQuery } from 'react-query';
import { AxiosError, AxiosResponse } from 'axios';

const initialFormValues = {
	id: '',
	department: '',
	title: '',
	documentType: '',
	locker: '',
	folder: '',
};

type FormValues = typeof initialFormValues;

type FormKeys = keyof FormValues;

type DropdownOption = {
	name: string;
	id: string;
};

type LockerOption = {
	max: number;
	free: number;
	description?: string;
} & DropdownOption;

type FolderOption = LockerOption;

const ImportDocumentContainer = () => {
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);
	const mutation = useMutation<
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		AxiosResponse<{ data: { id: string } }, any>,
		unknown,
		{
			title: string;
			documentType: string;
			importerId: string;
			folderId: string;
		}
	>((document) => axiosClient.post('/documents', document), {
		retry: (_, error) => {
			if ((error as AxiosError).response?.status === 401) return true;
			return false;
		},
	});

	const { data: emptyContainers, refetch: containerRefetch } = useQuery(
		'imports',
		async () =>
			(
				await axiosClient.post<GetEmptyContainersResponse>('/rooms/empty-containers', {
					roomId: user?.roomId,
					page: 1,
					size: 20,
				})
			).data,
		{
			enabled: false,
		}
	);

	const availableLockers: LockerOption[] | undefined = useMemo(
		() =>
			emptyContainers?.data.items.map((locker) => ({
				name: locker.name,
				id: locker.id,
				free: locker.numberOfFreeFolders,
				max: locker.numberOfFolders,
				description: locker.description,
			})),
		[emptyContainers?.data.items]
	);
	// [{name: 'Locker 1', id: '1', max: 60, current: 40}
	const availableFolders: { [key: string]: FolderOption[] } | undefined = useMemo(
		() =>
			emptyContainers?.data.items.reduce((acc, locker) => {
				const folders = locker.folders.map((folder) => ({
					name: folder.name,
					id: folder.id,
					free: folder.slot,
					max: folder.capacity,
					description: folder.description,
				}));
				return { ...acc, [locker.id]: folders };
			}, {} as { [key: string]: FolderOption[] }),
		[emptyContainers?.data.items]
	);
	// [{name: 'Folder 1', id: '1', max: 60, current: 40}

	const { data: documentTypesResult, refetch: typesRefetch } = useQuery(
		['documentTypes'],
		async () => (await axiosClient.get<GetDocumentTypesResponse>('/documents/types')).data,
		{
			enabled: false,
		}
	);

	const documentTypes: DropdownOption[] =
		documentTypesResult?.data.map((type) => ({
			name: type,
			id: type,
		})) || [];

	const { data: departmentsResult, refetch: departmentsRefetch } = useQuery(
		['departments'],
		async () => (await axiosClient.get<GetDepartmentsResponse>('/departments')).data,
		{
			enabled: false,
		}
	);

	const departments: DropdownOption[] =
		departmentsResult?.data.map((department) => ({
			name: department.name,
			id: department.id,
		})) || [];

	const [openScan, setOpenScan] = useState(false);

	const onSubmit = async (
		values: FormValues,
		{ setSubmitting, setFieldError }: FormikHelpers<FormValues>
	) => {
		try {
			mutation.mutate(
				{
					title: values.title,
					documentType: values.documentType,
					importerId: values.id,
					folderId: values.folder,
				},
				{
					onSuccess: (result) => {
						navigate(`${AUTH_ROUTES.DOCUMENTS}/${result.data.data.id}`);
					},
					onError: (error) => {
						const axiosError = error as AxiosError<GetConfigResponse>;
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
		const errors: Partial<FormValues> = {};
		Object.entries(values).forEach(([key, value]) => {
			if (!value) {
				errors[key as FormKeys] = 'This field is required';
			}
		});
		return errors;
	};

	useEffect(() => {
		const getConfigs = async () => {
			await containerRefetch();
			await typesRefetch();
			await departmentsRefetch();
		};
		getConfigs();
	}, [containerRefetch, typesRefetch, departmentsRefetch]);

	return (
		<>
			<Formik initialValues={initialFormValues} onSubmit={onSubmit} validate={onValidate}>
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
				}) => {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const onScan = (e: any) => {
						const result = e?.getText();
						if (!result) return;
						console.log(result);
						setFieldValue('id', result);
						setFieldValue('department', '81377bd4-e1f5-4963-a0b8-68123f25923e');
						setOpenScan(false);
					};

					return (
						<>
							<form className='flex gap-5 md:flex-row flex-col' onSubmit={handleSubmit}>
								<div className='flex flex-col gap-5 flex-1'>
									<InformationPanel header='Employee information'>
										<InputWithLabel
											id='id'
											name='id'
											label='ID'
											onChange={handleChange}
											onBlur={handleBlur}
											value={values.id}
											error={touched.id && !!errors.id}
											small={errors.id ? errors.id : undefined}
											sideComponent={
												<Button
													label='Scan'
													className='self-end bg-primary rounded-lg h-11'
													type='button'
													onClick={() => setOpenScan(true)}
												/>
											}
										/>
										<CustomDropdown
											id='department'
											name='department'
											options={departments}
											optionLabel='name'
											optionValue='id'
											label='Department'
											onChange={handleChange}
											onBlur={handleBlur}
											value={values.department}
											error={touched.department && !!errors.department}
											small={errors.department}
										/>
									</InformationPanel>
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
											editable
											panelFooterTemplate={({ options, value }) =>
												value === '' ? (
													<div className='px-3 py-2'>No item selected</div>
												) : options?.some((option) => option.id === value) ? (
													<div className='px-3 py-2'>
														<strong>{value}</strong> selected
													</div>
												) : (
													<div className='px-3 py-2'>
														<strong>{value}</strong> will be added
													</div>
												)
											}
										/>
										<Button
											label='Submit'
											type='submit'
											className='bg-primary mt-5 rounded-lg'
											disabled={isSubmitting || Object.values(errors).length !== 0}
										/>
									</InformationPanel>
								</div>
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
										disabled={!values.locker}
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
								</InformationPanel>
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
		</>
	);
};

export default ImportDocumentContainer;
