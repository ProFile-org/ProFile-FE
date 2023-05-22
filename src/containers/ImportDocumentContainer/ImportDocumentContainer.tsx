import CustomDropdown from '@/components/Dropdown/Dropdown.component';
import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import Progress from '@/components/Progress/Progress.component';
import { AUTH_ROUTES } from '@/constants/routes';
import axiosClient from '@/utils/axiosClient';
import { Formik, FormikHelpers } from 'formik';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/authContext';
import Overlay from '@/components/Overlay/Overlay.component';
import { QrReader } from 'react-qr-reader';
import QrScanner from '@/components/QrScanner/QrScanner.component';

const cities = [
	{ name: 'New York', code: 'NY' },
	{ name: 'Rome', code: 'RM' },
	{ name: 'London', code: 'LDN' },
	{ name: 'Istanbul', code: 'IST' },
	{ name: 'Paris', code: 'PRS' },
];

const folderOptions = [...Array(5)].map((_, i) => ({
	name: `Folder ${i}`,
	code: `${i}`,
}));

const lockerOptions = [...Array(5)].map((_, i) => ({
	name: `Locker ${i}`,
	code: `${i}`,
	max: 60,
	current: Math.round(Math.random() * 40),
}));

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

const ImportDocumentContainer = () => {
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);
	const [availableFolders, setAvailableFolders] = useState([]);
	const [openScan, setOpenScan] = useState(false);

	const onSubmit = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
		try {
			console.log(values);
			// await axiosClient.post('/documents', values);
			const data = {
				id: '1',
				name: 'Document 1',
				type: 'pdf',
				size: 100,
				createdAt: new Date().toISOString(),
			};
			navigate(`${AUTH_ROUTES.DOCUMENTS}/${data.id}`);
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
		const getAvailableFolders = async () => {
			try {
				if (!user) return;
				const { data } = await axiosClient.get('/rooms/empty-containers', {
					// roomId: user.roomId,
				});
				setAvailableFolders(data);
			} catch (error) {
				console.log(error);
			}
		};

		getAvailableFolders();
	}, [user]);

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
				}) => (
					<form className='flex gap-5 md:flex-row flex-col' onSubmit={handleSubmit}>
						<div className='flex flex-col gap-5 flex-1'>
							<InformationPanel header='Employee information'>
								<div className='flex gap-3'>
									<InputWithLabel
										id='id'
										name='id'
										label='ID'
										wrapperClassName='flex-1'
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.id}
										error={touched.id && !!errors.id}
										small={errors.id ? errors.id : undefined}
									/>
									<Button
										label='Scan'
										className='self-end bg-primary rounded-lg h-11'
										type='button'
										onClick={() => setOpenScan(true)}
									/>
								</div>
								<CustomDropdown
									id='department'
									name='department'
									options={cities}
									optionLabel='name'
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
									options={cities}
									optionLabel='name'
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
								options={lockerOptions}
								optionLabel='name'
								onChange={(e) => {
									setFieldValue('folder', '');
									setFieldTouched('folder', false);
									handleChange(e);
								}}
								onBlur={handleBlur}
								value={values.locker}
								optionValue='code'
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
								options={folderOptions}
								optionLabel='name'
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.folder}
								optionValue='code'
								disabled={!values.locker}
								error={touched.folder && !!errors.folder}
								small={touched.folder ? errors.folder : undefined}
								itemTemplate={(option) => (
									<div className='flex gap-2 items-center'>
										<span>{option.name}</span>
										<Progress wrapperClassName='w-full' max={60} current={Math.random() * 40} />
									</div>
								)}
							/>
							{values.folder && <Progress label='Available' showPercentage current={40} max={60} />}
						</InformationPanel>
					</form>
				)}
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
