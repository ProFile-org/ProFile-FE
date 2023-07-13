import CustomDropdown from '@/components/Dropdown/Dropdown.component';
import ErrorTemplate from '@/components/ErrorTemplate/ErrorTemplate.component';
import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import TextareaWithLabel from '@/components/InputWithLabel/TextareaWithLabel.component';
import Overlay from '@/components/Overlay/Overlay.component';
import Progress from '@/components/Progress/Progress.component';
import { SkeletonPage } from '@/components/Skeleton';
import Status from '@/components/Status/Status.component';
import { AUTH_ROUTES } from '@/constants/routes';
import { AuthContext } from '@/context/authContext';
import useEmptyContainers from '@/hooks/useEmptyContainers';
import { GetImportByIdResponse } from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import clsx from 'clsx';
import { PrimeIcons } from 'primereact/api';
import { Button } from 'primereact/button';
import { useState, useContext, useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';

const StaffImportDetailPage = () => {
	const { importId } = useParams<{ importId: string }>();
	const [showModal, setShowModal] = useState('');
	const [reason, setReason] = useState('');
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);
	const [selected, setSelected] = useState({
		folder: '',
		locker: '',
	});

	const {
		data: importRequest,
		isLoading,
		error,
	} = useQuery(
		['imports', importId],
		async () =>
			(await axiosClient.get<GetImportByIdResponse>(`/documents/import-requests/${importId}`)).data,
		{
			enabled: !!importId,
		}
	);

	const { availableFolders, availableLockers, containerRefetch } = useEmptyContainers({
		roomId: user?.roomId || '',
	});

	useEffect(() => {
		containerRefetch();
	}, [containerRefetch]);

	if (isLoading) return <SkeletonPage />;
	if (error || !importRequest)
		return <ErrorTemplate code={404} message='Request not found' url={AUTH_ROUTES.IMPORT_MANAGE} />;

	const {
		document: { title, documentType, isPrivate, description, id: documentId, folder },
		room: { name: roomName },
		importReason,
		staffReason,
		status: importStatus,
	} = importRequest.data;

	const onApprove = async () => {
		if (!reason) return;
		try {
			await axiosClient.put(`/documents/import-requests/${importId}`, {
				decision: 'Approve',
				staffReason: reason,
			});
			queryClient.invalidateQueries('imports');
			setShowModal('');
		} catch (error) {
			console.log(error);
		}
	};

	const onReject = async () => {
		if (!reason) return;
		try {
			await axiosClient.put(`/documents/import-requests/${importId}`, {
				decision: 'Reject',
				staffReason: reason,
			});
			setShowModal('');
			queryClient.invalidateQueries('imports');
		} catch (error) {
			console.log(error);
		}
	};

	const onAssign = async () => {
		if (!selected.folder || !selected.locker) return;
		try {
			await axiosClient.put(`/documents/import-requests/assign/${importId}`, {
				folderId: selected.folder,
			});
			setShowModal('');
			queryClient.invalidateQueries('imports');
		} catch (error) {
			console.log(error);
		}
	};

	const onCheckIn = async () => {
		try {
			await axiosClient.put(`/documents/import-requests/checkin/${documentId}`);
			navigate(`${AUTH_ROUTES.DOCUMENTS}/${documentId}`);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='flex gap-5 flex-col lg:flex-row'>
			<InformationPanel header='Document information' className='flex-1 h-max'>
				<InputWithLabel
					label='Title'
					value={title}
					readOnly
					sideComponent={<Status type='document' item={importRequest.data.document} />}
				/>
				<InputWithLabel label='Document type' value={documentType} readOnly />
				<InputWithLabel label='Private' value={isPrivate ? 'PRIVATE' : 'PUBLIC'} readOnly />
				<TextareaWithLabel label='Description' value={description} readOnly />
				{folder && (
					<div className='flex gap-5 flex-col lg:flex-row'>
						<InputWithLabel label='Folder' value={folder.name} readOnly />
						<InputWithLabel label='Locker' value={folder.locker.name} readOnly />
					</div>
				)}
			</InformationPanel>
			<div className='flex flex-col gap-5 flex-1'>
				<InformationPanel>
					{importStatus === 'Pending' && (
						<div className='flex gap-3'>
							<Button
								label='Approve'
								className='bg-primary h-11 rounded-lg flex-1'
								onClick={() => {
									setShowModal('approve');
								}}
							/>
							<Button
								label='Reject'
								severity='danger'
								className=' h-11 rounded-lg flex-1'
								onClick={() => {
									setShowModal('reject');
								}}
							/>
						</div>
					)}
					<div className='flex gap-3'>
						{importStatus === 'Approved' ? (
							<Button
								label='Assign folder'
								className='bg-blue-600 hover:!bg-blue-600/80 h-11 rounded-lg flex-1'
								onClick={() => {
									setShowModal('assign');
								}}
							/>
						) : importStatus === 'Assigned' ? (
							<Button
								label='Check in'
								className='bg-blue-600 hover:!bg-blue-600/80 h-11 rounded-lg flex-1'
								onClick={onCheckIn}
							/>
						) : null}
						<Link to={AUTH_ROUTES.IMPORT_MANAGE} className='flex-1'>
							<Button
								label='Return home'
								outlined
								className='btn-outlined h-11 rounded-lg w-full'
							/>
						</Link>
					</div>
				</InformationPanel>
				<InformationPanel header='Import information'>
					<InputWithLabel label='Status' value={importStatus} readOnly />
					<InputWithLabel label='Room' value={roomName} readOnly />
					<InputWithLabel label='Import reason' value={importReason} readOnly />
					<InputWithLabel label='Staff reason' value={staffReason} readOnly />
				</InformationPanel>
			</div>
			{showModal && (
				<Overlay onExit={() => setShowModal('')} className='flex items-center justify-center'>
					<div className='bg-neutral-800 p-5 rounded-lg' onClick={(e) => e.stopPropagation()}>
						<div className='flex justify-between items-center'>
							<div className='title'>Confirmation</div>
							<i
								className={clsx(PrimeIcons.TIMES, 'hover:text-red-500 cursor-pointer text-lg')}
								onClick={() => setShowModal('')}
							/>
						</div>
						<div className='text-lg mt-5 title'>
							{showModal === 'approve'
								? 'Are you sure you want to approve this request?'
								: showModal === 'reject'
								? 'Are you sure you want to reject this request?'
								: 'Choose the folder to assign this document to'}
						</div>
						{showModal === 'assign' ? (
							<div className='flex flex-col gap-5 mt-5'>
								<CustomDropdown
									id='locker'
									name='locker'
									label='Lockers'
									options={availableLockers}
									optionLabel='name'
									optionValue='id'
									itemTemplate={(option) => (
										<div className='flex flex-col gap-3'>
											<div>
												{option.name} - Free: {option.free}/{option.max}
											</div>
											<div>{option.description}</div>
										</div>
									)}
									onChange={(e) => {
										setSelected((prev) => ({ ...prev, locker: e.value }));
									}}
									value={selected.locker}
								/>
								<CustomDropdown
									id='folder'
									name='folder'
									label='Folders'
									options={availableFolders?.[selected.locker] || []}
									optionLabel='name'
									optionValue='id'
									itemTemplate={(option) => (
										<div className='flex gap-2 items-center'>
											{option.name} - Free: {option.free}/{option.max}
										</div>
									)}
									onChange={(e) => {
										setSelected((prev) => ({ ...prev, folder: e.value }));
									}}
									value={selected.folder}
								/>
								{selected.folder && availableFolders && (
									<Progress
										label='Available'
										showPercentage
										current={
											availableFolders[selected.locker].find(
												(value) => value.id === selected.folder
											)?.free || 0
										}
										max={
											availableFolders[selected.locker].find(
												(value) => value.id === selected.folder
											)?.max || 0
										}
									/>
								)}
							</div>
						) : (
							<InputWithLabel
								// label={`Reason for ${showModal === 'approve' ? 'approve' : 'reject'}`}
								label=''
								wrapperClassName='mt-1'
								value={reason}
								onChange={(e) => setReason(e.target.value)}
								placeholder='Enter your reason here'
							/>
						)}
						<div className='flex items-center gap-5 mt-5 justify-end'>
							<Button
								label='Cancel'
								outlined
								severity='danger'
								className='!text-white !border-red-500'
								onClick={() => setShowModal('')}
							/>
							<Button
								label={
									showModal === 'approve' ? 'Confirm' : showModal === 'reject' ? 'Reject' : 'Assign'
								}
								onClick={() => {
									if (showModal === 'approve') onApprove();
									else if (showModal === 'reject') onReject();
									else onAssign();
								}}
							/>
						</div>
					</div>
				</Overlay>
			)}
		</div>
	);
};

export default StaffImportDetailPage;
