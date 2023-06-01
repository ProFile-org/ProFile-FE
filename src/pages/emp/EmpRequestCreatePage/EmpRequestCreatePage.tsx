import CustomCalendar from '@/components/Calendar/Calendar.component';
import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import TextareaWithLabel from '@/components/InputWithLabel/TextareaWithLabel.component';
import useQueryParams from '@/hooks/useQueryParams';
import { Formik } from 'formik';
import { Button } from 'primereact/button';
import {} from 'react-router';

type InitialValues = {
	title: string;
	documentType: string;
	locker: string;
	folder: string;
	reason: string;
	borrowDate: Date;
	returnDate: Date;
};

const NOT_REQUIRED = ['reason'];

const EmpRequestCreatePage = () => {
	const query = useQueryParams();
	const queries = query.entries();
	const initialValues = Object.fromEntries(queries) as unknown as InitialValues;

	const validate = (values: InitialValues) => {
		const error = {} as { [key: string]: string | Date };
		Object.entries(values).forEach(([key, value]) => {
			if (!value && NOT_REQUIRED.indexOf(key) === -1) error[key] = 'Required';
		});
		return error;
	};

	const onSubmit = (values: InitialValues) => {
		console.log(values);
	};

	return (
		<div className='flex gap-5'>
			<Formik initialValues={initialValues} onSubmit={onSubmit} validate={validate}>
				{({ values, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
					<form onSubmit={handleSubmit} className='flex flex-col gap-5'>
						<InformationPanel header='Document information'>
							<InputWithLabel
								label='Title'
								value={values.title}
								name='title'
								id='title'
								onChange={handleChange}
								onBlur={handleBlur}
							/>
							<InputWithLabel
								label='Document type'
								value={values.documentType}
								name='documentType'
								id='documentType'
								onChange={handleChange}
								onBlur={handleBlur}
							/>
							<div className='flex gap-5'>
								<InputWithLabel
									label='Locker'
									value={values.locker}
									wrapperClassName='flex-1'
									name='locker'
									id='locker'
									onChange={handleChange}
									onBlur={handleBlur}
								/>
								<InputWithLabel
									label='Folder'
									value={values.folder}
									wrapperClassName='flex-1'
									name='folder'
									id='folder'
									onChange={handleChange}
									onBlur={handleBlur}
								/>
							</div>
						</InformationPanel>
						<InformationPanel header='Borrow information'>
							<TextareaWithLabel label='Reason' value={values.reason} />
							<div className='flex gap-5'>
								<CustomCalendar
									label='Borrow date'
									showIcon
									value={values.borrowDate}
									numberOfMonths={1}
									name='borrowDate'
									id='borrowDate'
									onChange={(e) => {
										if (!e.value) return handleChange(e);
										if (typeof e.value === 'string') return handleChange(e);
										if ((e.value as Date).getTime() > (values.returnDate as Date).getTime()) {
											setFieldValue('borrowDate', values.returnDate);
											setFieldValue('returnDate', e.value);
											return;
										}
										handleChange(e);
									}}
									onBlur={handleBlur}
								/>
								<div className='h-11 self-end flex items-center font-bold text-2xl'>-</div>
								<CustomCalendar
									label='Return date'
									showIcon
									value={values.returnDate}
									numberOfMonths={1}
									name='returnDate'
									id='returnDate'
									onChange={(e) => {
										if (!e.value) return handleChange(e);
										if (typeof e.value === 'string') return handleChange(e);
										if ((e.value as Date).getTime() < (values.borrowDate as Date).getTime()) {
											setFieldValue('returnDate', values.borrowDate);
											setFieldValue('borrowDate', e.value);
											return;
										}
										handleChange(e);
									}}
									onBlur={handleBlur}
								/>
							</div>
							<Button label='Submit' className='w-full h-11' />
						</InformationPanel>
					</form>
				)}
			</Formik>
		</div>
	);
};

export default EmpRequestCreatePage;
