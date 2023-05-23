import CustomDropdown from '@/components/Dropdown/Dropdown.component';
import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import Progress from '@/components/Progress/Progress.component';
import { AUTH_ROUTES } from '@/constants/routes';
import axiosClient from '@/utils/axiosClient';
import { Formik, FormikHelpers } from 'formik';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router';
import { useState, useContext, useMemo } from 'react';
import { AuthContext } from '@/context/authContext';
import Overlay from '@/components/Overlay/Overlay.component';
import QrScanner from '@/components/QrScanner/QrScanner.component';
import {
	GetConfigResponse,
	GetDepartmentsResponse,
	GetDocumentTypesResponse,
	GetEmptyContainersResponse,
} from '@/types/response';
import { useQuery } from 'react-query';
import { AxiosError } from 'axios';

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
	current: number;
} & DropdownOption;

type FolderOption = LockerOption;

const ImportDocumentContainer = () => {
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);

	const { data: emptyContainers } = useQuery(
		'emptyContainers',
		async () =>
			(
				await axiosClient.post<GetEmptyContainersResponse>('/rooms/empty-containers', {
					roomId: user?.roomId,
					page: 1,
					size: 20,
				})
			).data
	);

	const availableLockers: LockerOption[] | undefined = useMemo(
		() =>
			emptyContainers?.data.items.map((locker) => ({
				name: locker.name,
				id: locker.id,
				current: 50 - locker.numberOfFreeFolders,
				max: 50,
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
					current: folder.slot - 50,
					max: folder.slot,
				}));
				return { ...acc, [locker.id]: folders };
			}, {} as { [key: string]: FolderOption[] }),
		[emptyContainers?.data.items]
	);
	// [{name: 'Folder 1', id: '1', max: 60, current: 40}

	const { data: documentTypesResult } = useQuery(
		'documentTypes',
		async () => (await axiosClient.get<GetDocumentTypesResponse>('/documents/types')).data
	);

	const documentTypes: DropdownOption[] =
		documentTypesResult?.data.map((type) => ({
			name: type,
			id: type,
		})) || [];

	const { data: departmentsResult } = useQuery(
		'departments',
		async () => (await axiosClient.get<GetDepartmentsResponse>('/departments')).data
	);

	const departments: DropdownOption[] =
		departmentsResult?.data.map((department) => ({
			name: department.name,
			id: department.id,
		})) || [];

	const [openScan, setOpenScan] = useState(false);

	const onSubmit = async (
		values: FormValues,
		{ setSubmitting, setFieldError, setFieldValue, setErrors }: FormikHelpers<FormValues>
	) => {
		try {
			const { data } = await axiosClient.post('/documents', {
				title: values.title,
				documentType: values.documentType,
				importerId: values.id,
				folderId: values.folder,
			});
			navigate(`${AUTH_ROUTES.DOCUMENTS}/${data.data.id}`);
		} catch (error) {
			const axiosError = error as AxiosError<GetConfigResponse>;
			const msg = axiosError.response?.data.message || 'Something went wrong';
			const status = axiosError.response?.status;

			if (status === 409) {
				setFieldError('title', msg);
			}
			if (status === 400) {
				// Note for future Jerry, calling setErrors or setFieldError will cause the form to be revalidated for whatever reason.
				setErrors({ id: msg });
				// DO NOT SAID FIELD VALUE TO ANYTHING BUT EMPTY STRING OR IT WILL REVALIDATE THE FORM EVEN WITH false AS THE THIRD PARAMETER
				setFieldValue('id', '', false);
			}
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
		console.log('fuck u?');
		return errors;
	};

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
					return (
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
										<div className='flex gap-2 items-center'>
											{option.name} - {option.current}/{option.max}
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
											<span>{option.name}</span>
											<Progress
												wrapperClassName='w-full'
												max={option.max}
												current={option.current}
											/>
										</div>
									)}
								/>
								{values.folder && availableFolders && (
									<Progress
										label='Available'
										showPercentage
										current={
											availableFolders[values.locker].find((value) => value.id === values.folder)
												?.current || 0
										}
										max={
											availableFolders[values.locker].find((value) => value.id === values.folder)
												?.max || 0
										}
									/>
								)}
							</InformationPanel>
						</form>
					);
				}}
			</Formik>
			{openScan && (
				<Overlay onExit={() => setOpenScan(false)} className='flex items-center justify-center'>
					<div className='card w-[70vw] min-w-[250px] sm:w-[50vh]'>
						<QrScanner />
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
};

export default ImportDocumentContainer;
