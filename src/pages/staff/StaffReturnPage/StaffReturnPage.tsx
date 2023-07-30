import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import Overlay from '@/components/Overlay/Overlay.component';
import QrScanner from '@/components/QrScanner/QrScanner.component';
import { AUTH_ROUTES } from '@/constants/routes';
import {
	BaseResponse,
	GetDocumentByIdResponse,
	GetRequestByIdResponse,
	GetUserByIdResponse,
} from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { AxiosError } from 'axios';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { OnResultFunction } from 'react-qr-reader';
import { useNavigate } from 'react-router';

const initialValues = {
	documentId: 'N/A',
	types: 'N/A',
	title: 'N/A',
	locker: 'N/A',
	folder: 'N/A',
	borrowerId: 'N/A',
	borrowerName: 'N/A',
	borrowerDepartment: 'N/A',
};

const StaffReturnsPage = () => {
	const navigate = useNavigate();
	const [openScan, setOpenScan] = useState(false);
	const [values, setValues] = useState(initialValues);
	const [error, setError] = useState('');
	const [modalOpen, setModalOpen] = useState(false);

	const { borrowerDepartment, borrowerId, borrowerName, folder, documentId, locker, title, types } =
		values;

	const getDocumentsById = async (requestId: string) => {
		if (!requestId) return;
		try {
			const { data } = await axiosClient.get<GetRequestByIdResponse>(
				`/documents/borrows/${requestId}`,
				{
					params: {
						status: 'checkedout,overdue',
						page: 1,
						size: 1,
						sortBy: 'BorrowTime',
						sortDirection: 'desc',
					},
				}
			);
			const { data: document } = await axiosClient.get<GetDocumentByIdResponse>(
				`/documents/${data.data.documentId}`
			);
			const { data: employee } = await axiosClient.get<GetUserByIdResponse>(
				`/users/${data.data.borrowerId}`
			);
			setValues((prev) => ({
				...prev,
				documentId: document.data.id,
				types: document.data.documentType,
				title: document.data.title,
				locker: document.data.folder.locker.name,
				folder: document.data.folder.name,
				borrowerId: employee.data.id,
				borrowerName: `${employee.data.lastName} ${employee.data.firstName}`,
				borrowerDepartment: employee?.data?.department?.name || 'N/A',
			}));
		} catch (error) {
			const axiosError = error as AxiosError<BaseResponse>;
			const status = axiosError.response?.status;
			if (status === 404) setError('Document not found');
			else setError(axiosError.response?.data.message || 'Bad request');
		}
	};

	const onScan: OnResultFunction = async (e) => {
		const id = e?.getText();
		if (!id || id === values.documentId) return;
		try {
			await getDocumentsById(id);
			setOpenScan(false);
		} catch (error) {
			console.log(error);
		}
	};

	const onApprove = async () => {
		try {
			await axiosClient.post(`/documents/borrows/return/${documentId}`);
			navigate(AUTH_ROUTES.REQUESTS);
		} catch (error) {
			const axiosError = error as AxiosError<BaseResponse>;
			const status = axiosError.response?.status;
			if (status === 404) setError('Document not found');
			else setError(axiosError.response?.data.message || 'Bad request');
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
				<InformationPanel header='Document information'>
					<InputWithLabel label='ID' readOnly value={documentId} />
					<InputWithLabel label='Types' readOnly value={types} />
					<InputWithLabel label='Title' readOnly value={title} />
					<div className='flex gap-5'>
						<InputWithLabel label='Locker' wrapperClassName='flex-1' readOnly value={locker} />
						<InputWithLabel label='Folder' wrapperClassName='flex-1' readOnly value={folder} />
					</div>
				</InformationPanel>
				<InformationPanel header='Borrower information'>
					<InputWithLabel label='ID' readOnly value={borrowerId} />
					<InputWithLabel label='Name' readOnly value={borrowerName} />
					<InputWithLabel label='Department' readOnly value={borrowerDepartment} />
				</InformationPanel>
			</div>
			<InformationPanel className='flex-1 h-max'>
				{openScan ? (
					<QrScanner onResult={onScan} />
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
				{documentId !== 'N/A' && (
					<div className='flex gap-5'>
						<Button
							label='Approve'
							className='h-11 rounded-lg flex-1'
							disabled={!documentId}
							onClick={() => setModalOpen(true)}
						/>
						<Button
							label='Reject'
							severity='danger'
							className='h-11 rounded-lg flex-1'
							disabled={!documentId}
							onClick={onDeny}
						/>
					</div>
				)}

				{error && <div className='tex-red-500'>{error}</div>}
			</InformationPanel>
			{modalOpen && (
				<Overlay onExit={() => setModalOpen(false)} className='flex justify-center items-center'>
					<div className='bg-neutral-800 rounded-lg p-5 w-[50vw]'>
						<h2 className='title'>Confirmation</h2>
						<div className='mt-2'>Are you sure you want to approve returning this item?</div>
						<div className='flex w-full justify-end mt-5'>
							<Button
								label='Cancel'
								className='h-11 rounded-lg mr-3'
								severity='danger'
								onClick={() => setModalOpen(false)}
							/>
							<Button label='Approve' className='h-11 rounded-lg' onClick={onApprove} />
						</div>
					</div>
				</Overlay>
			)}
		</div>
	);
};

export default StaffReturnsPage;
