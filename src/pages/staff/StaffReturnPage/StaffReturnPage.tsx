import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import QrScanner from '@/components/QrScanner/QrScanner.component';
import { BaseResponse } from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { AxiosError } from 'axios';
import { Button } from 'primereact/button';
import { useState } from 'react';

const initialValues = {
	id: '123',
	types: 'Word',
	title: 'This is a word document',
	locker: '12',
	folder: '5',
	borrowerId: '123',
	borrowerName: 'Chien gamer',
	borrowerDepartment: 'Accounting',
};

const StaffReturnsPage = () => {
	const [openScan, setOpenScan] = useState(false);
	const [values, setValues] = useState(initialValues);
	const [error, setError] = useState('');

	const { borrowerDepartment, borrowerId, borrowerName, folder, id, locker, title, types } = values;

	const onApprove = async () => {
		try {
			await axiosClient.post(`/borrows/return/${id}`);
		} catch (error) {
			const axiosError = error as AxiosError<BaseResponse>;
			const status = axiosError.response?.status;
			if (status === 404) setError('Document not found');
			else setError(axiosError.response?.data.message || 'Something went wrong');
		} finally {
			setOpenScan(false);
		}
	};

	const onDeny = async () => {
		setOpenScan(false);
		setError('');
		setValues(initialValues);
	};

	return (
		<div className='flex gap-5 flex-col md:flex-row'>
			<div className='flex flex-col gap-5 flex-1'>
				<InformationPanel title='Document information'>
					<InputWithLabel label='ID' readOnly value={id} />
					<InputWithLabel label='Types' readOnly value={types} />
					<InputWithLabel label='Title' readOnly value={title} />
					<div className='flex gap-5'>
						<InputWithLabel label='Locker' wrapperClassName='flex-1' readOnly value={locker} />
						<InputWithLabel label='Folder' wrapperClassName='flex-1' readOnly value={folder} />
					</div>
				</InformationPanel>
				<InformationPanel title='Borrower information'>
					<InputWithLabel label='ID' readOnly value={borrowerId} />
					<InputWithLabel label='Name' readOnly value={borrowerName} />
					<InputWithLabel label='Department' readOnly value={borrowerDepartment} />
				</InformationPanel>
			</div>
			<InformationPanel className='flex-1 h-max'>
				{openScan ? (
					<QrScanner />
				) : (
					<div className='w-full aspect-square rounded-lg bg-neutral-700 flex items-center justify-center text-xl font-semibold'>
						Hit scan to open scanner
					</div>
				)}
				<Button
					label={openScan ? 'Close scan' : 'Scan'}
					severity='info'
					className='h-11 rounded-lg'
					onClick={() => setOpenScan((prev) => !prev)}
				/>
				<div className='flex gap-5'>
					<Button
						label='Approve'
						className='h-11 rounded-lg flex-1'
						disabled={!id}
						onClick={onApprove}
					/>
					<Button
						label='Deny'
						severity='danger'
						className='h-11 rounded-lg flex-1'
						disabled={!id}
						onClick={onDeny}
					/>
				</div>
				{error && <div className='text-red-500'>{error}</div>}
			</InformationPanel>
		</div>
	);
};

export default StaffReturnsPage;
