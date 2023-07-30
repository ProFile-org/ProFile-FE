/* eslint-disable no-mixed-spaces-and-tabs */
import axiosClient from '@/utils/axiosClient';
// import { InputText } from 'primereact/inputtext';
import { useQuery, useQueryClient } from 'react-query';
import { useRef, useState, useContext, useEffect } from 'react';
// import { Button } from 'primereact/button';
import useQueryParams from '@/hooks/useQueryParams';
import { ContextMenu } from 'primereact/contextmenu';
import { PrimeIcons } from 'primereact/api';
import { MenuItem } from 'primereact/menuitem';
import {
	BaseResponse,
	GetCurrentDrivePermissionResponse,
	GetDriveByIDResponse,
	GetDrivePermissionResponse,
	GetDriveResponse,
	GetUsersResponse,
} from '@/types/response';
import Overlay from '@/components/Overlay/Overlay.component';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs.component';
import Folder from '@/components/Drive/Folder';
import { CreateFolderModal, DetailInfo, File } from '@/components/Drive';
import CreateFileModal from '@/components/Drive/CreateFileModal';
import RenameModal from '@/components/Drive/RenameModal';
import { Toast } from 'primereact/toast';
import { AxiosError } from 'axios';
import ShareModal from '@/components/Drive/ShareModal';
import { AuthContext } from '@/context/authContext';
import Spinner from '@/components/Spinner/Spinner.component';
import { REFETCH_CONFIG } from '@/constants/config';
import { IDrive } from '@/types/item';
import { Button } from 'primereact/button';

const EmpDrivePage = () => {
	const query = useRef('');
	const toast = useRef<Toast>(null);
	const globalCm = useRef<ContextMenu>(null);
	const folderCm = useRef<ContextMenu>(null);
	const fileCm = useRef<ContextMenu>(null);

	const queryClient = useQueryClient();
	const queryParams = useQueryParams();
	const { user } = useContext(AuthContext);

	const path = queryParams.get('path') || '';
	const pathArr = path.split('/');
	const currentPath = pathArr.slice(1).join('/') ? pathArr.join('/') : '';

	const [modal, setModal] = useState('');
	const [file, setFile] = useState<File | null>(null);
	const [currentItem, setCurrentItem] = useState(path);
	const [currentPathPerm, setCurrentPathPerm] = useState<{ canEdit: boolean; canView: boolean }>({
		canEdit: false,
		canView: false,
	});
	const [currentItemPerm, setCurrentItemPerm] = useState({
		canEdit: false,
		canView: false,
	});
	const [showInfo, setShowInfo] = useState<IDrive | null>(null);

	useEffect(() => {
		const getPerms = async () => {
			if (!path) return;
			const { data } = await axiosClient.get<GetCurrentDrivePermissionResponse>(
				`/shared/entries/${path}/permissions`
			);
			setCurrentPathPerm({
				canEdit: data.data.canEdit,
				canView: data.data.canView,
			});
		};
		getPerms();
	}, [path, setCurrentPathPerm]);

	const { data, isLoading } = useQuery(
		['digital', 'shared', path, query.current],
		async () =>
			(
				await axiosClient.get<GetDriveResponse>(
					`/shared/entries?entryId=${encodeURIComponent(path)}`,
					{
						params: {
							searchTerm: query.current,
							pageSize: 100,
						},
					}
				)
			).data,
		REFETCH_CONFIG
	);

	const { data: users } = useQuery(
		['digital', 'shared', 'users'],
		async () => (await axiosClient.get<GetUsersResponse>('/users/employees')).data
	);

	const { data: sharedUsers } = useQuery(
		['digital', 'shared', 'sharedUsers', currentItem],
		async () =>
			(
				await axiosClient.get<GetDrivePermissionResponse>(
					`/shared/entries/${currentItem}/shared-users`
				)
			).data,
		{
			enabled: !!currentItem,
		}
	);

	const { data: owner } = useQuery(
		['digital', 'shared', 'owner', currentItem],
		async () =>
			(await axiosClient.get<GetDriveByIDResponse>(`/shared/entries/${currentItem}`)).data,
		{
			enabled: !!currentItem,
		}
	);

	const onError = (error: AxiosError<BaseResponse>) => {
		const msg = error.response?.data.message || 'Something went wrong';
		toast.current?.show({
			severity: 'error',
			summary: 'Error',
			detail: msg,
			className: '!bg-red-200 overflow-hidden',
		});
		console.error(error);
	};

	const closeModals = () => {
		setModal('');
		setFile(null);
		setCurrentItem('');
	};

	const files = data?.data.items.filter((item) => !item.isDirectory);
	const folders = data?.data.items.filter((item) => item.isDirectory);

	const onDelete = async () => {
		try {
			await axiosClient.post(`/bin/entries?entryId=${currentItem}`);
			queryClient.invalidateQueries(['digital', 'shared', path]);
		} catch (error) {
			onError(error as AxiosError<BaseResponse>);
		}
	};

	const onDownload = async () => {
		try {
			// Open a new window with the file
			window.open(`${import.meta.env.VITE_API_ENDPOINT}/entries/${currentItem}/file`, '_blank');
			closeModals();
		} catch (error) {
			onError(error as AxiosError<BaseResponse>);
		}
	};

	const fileItems: MenuItem[] = currentItemPerm?.canEdit
		? [
				{
					label: 'Share',
					icon: PrimeIcons.SHARE_ALT,
					command: () => {
						setModal('share');
					},
				},
				{
					label: 'Rename',
					icon: PrimeIcons.PENCIL,
					command: () => {
						setModal('rename-file');
					},
				},
				{
					label: 'Download',
					icon: PrimeIcons.DOWNLOAD,
					command: onDownload,
				},
				// {
				// 	label: 'Delete',
				// 	icon: PrimeIcons.TRASH,
				// 	command: () => {
				// 		setModal('delete');
				// 	},
				// },
		  ]
		: [
				{
					label: 'Download',
					icon: PrimeIcons.DOWNLOAD,
					command: onDownload,
				},
		  ];

	const folderItems: MenuItem[] = currentItemPerm?.canEdit
		? [
				{
					label: 'Share',
					icon: PrimeIcons.SHARE_ALT,
					command: () => {
						setModal('share');
					},
				},
				{
					label: 'Rename',
					icon: PrimeIcons.PENCIL,
					command: () => {
						setModal('rename-file');
					},
				},
				// {
				// 	label: 'Delete',
				// 	icon: PrimeIcons.TRASH,
				// 	command: () => {
				// 		setModal('delete');
				// 	},
				// },
		  ]
		: [];

	const items: MenuItem[] = [
		{
			label: 'Create folder',
			icon: PrimeIcons.FOLDER,
			command: () => {
				setModal('create-folder');
			},
		},
		{
			label: 'Upload file',
			icon: PrimeIcons.UPLOAD,
			command: () => {
				setModal('upload-file');
			},
		},
	];

	const onCreateFolder = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const name = event.currentTarget.folderName.value;
		if (!name) return;

		const formData = new FormData();
		formData.set('Name', name);
		formData.set('isDirectory', 'true');
		try {
			await axiosClient.post(`/shared/entries/${path}`, formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});
			queryClient.invalidateQueries(['digital', 'shared', path]);
			closeModals();
		} catch (error) {
			onError(error as AxiosError<BaseResponse>);
		}
	};

	const onCreateFile = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!file) return;
		const name =
			event.currentTarget.fileName.value || file.name.slice(0, file.name.lastIndexOf('.'));

		const formData = new FormData();
		formData.set('Name', name);
		formData.set('File', file);
		formData.set('isDirectory', 'false');
		try {
			await axiosClient.post(`/shared/entries/${path}`, formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});
			queryClient.invalidateQueries(['digital', 'shared', path]);
			closeModals();
		} catch (error) {
			onError(error as AxiosError<BaseResponse>);
		}
	};

	const onRename = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const name = event.currentTarget.newName.value;
		if (!name) return;
		try {
			await axiosClient.put(`/entries/${currentItem}`, { name });
			queryClient.invalidateQueries(['digital', 'shared', path]);
			closeModals();
		} catch (error) {
			onError(error as AxiosError<BaseResponse>);
		}
	};

	const onShare = async (
		e: React.FormEvent<HTMLFormElement>,
		perms: {
			userId: string;
			expiryDate?: Date;
			canView: boolean;
			canEdit: boolean;
		}
	) => {
		e.preventDefault();
		try {
			await axiosClient.put(`/entries/${currentItem}/permissions`, perms);
			queryClient.invalidateQueries(['digital', 'shared']);
			closeModals();
		} catch (error) {
			onError(error as AxiosError<BaseResponse>);
		}
	};

	return (
		<>
			{isLoading ? (
				<div className='w-full h-full flex items-center justify-center'>
					<Spinner />
				</div>
			) : (
				<div
					className='flex flex-col gap-5 h-full w-full'
					onContextMenu={(e) => {
						e.preventDefault();
						e.stopPropagation();
						if (path === '') return;
						currentPathPerm.canEdit && globalCm.current?.show(e);
						fileCm.current?.hide(e);
						folderCm.current?.hide(e);
					}}
				>
					{/* <div className='card w-full py-3 flex justify-between'>
					<form
						className='flex h-11 gap-3'
						onSubmit={async (e) => {
							e.preventDefault();
							await refetch();
						}}
					>
						<InputText
							className='input'
							placeholder='file a'
							onChange={(e) => (query.current = e.target.value)}
						/>
						<Button label='Search' name='search' id='search' className='px-3 rounded-lg' />
					</form>
					<Button className='h-11 rounded-lg'>Upload +</Button>
				</div> */}
					<Breadcrumbs shared path={path} pathArr={pathArr} />
					{!data ||
						(data.data.items.length === 0 && (
							<div className='text-center text-lg font-bold h-full flex items-center justify-center w-full'>
								This drive is empty
								<br />
								Any files that are being shared with you will appear here
							</div>
						))}
					<div className='flex'>
						<div className='flex flex-col gap-5 w-full h-full'>
							{folders && folders.length !== 0 && (
								<>
									<h2 className='title'>Folders</h2>
									<div
										className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-5 place-items-center'
										style={{
											gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
										}}
									>
										{folders.map((folder) => (
											<Folder
												shared
												showInfo={setShowInfo}
												key={folder.id}
												folder={folder}
												currentPath={currentPath}
												onContextMenu={async (value, e) => {
													e.preventDefault();
													e.stopPropagation();
													// Race condition
													setTimeout(() => {
														globalCm.current?.hide(e);
													}, 0);
													fileCm.current?.hide(e);
													const { data: perm } =
														await axiosClient.get<GetCurrentDrivePermissionResponse>(
															`/shared/entries/${value}/permissions`
														);
													setCurrentItemPerm({
														canEdit: perm.data.canEdit,
														canView: perm.data.canView,
													});
													setCurrentItem(value);
													perm.data.canEdit && folderCm.current?.show(e);
												}}
											/>
										))}
									</div>
								</>
							)}
							{files && files.length !== 0 && (
								<>
									<h2 className='title'>Files</h2>
									<div
										className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-5 place-items-center'
										style={{
											gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
										}}
									>
										{files.map((file) => (
											<File
												key={file.id}
												showInfo={setShowInfo}
												file={file}
												onContextMenu={async (value, e) => {
													e.preventDefault();
													e.stopPropagation();
													// Race condition
													setTimeout(() => {
														globalCm.current?.hide(e);
													}, 0);
													folderCm.current?.hide(e);
													const { data: perm } =
														await axiosClient.get<GetCurrentDrivePermissionResponse>(
															`/shared/entries/${value}/permissions`
														);
													setCurrentItemPerm({
														canEdit: perm.data.canEdit,
														canView: perm.data.canView,
													});
													setCurrentItem(value);
													perm.data.canView && fileCm.current?.show(e);
												}}
											/>
										))}
									</div>
								</>
							)}
						</div>
						<DetailInfo showInfo={showInfo} setShowInfo={setShowInfo} />
					</div>

					<ContextMenu ref={globalCm} model={items} />
					<ContextMenu ref={folderCm} model={folderItems} />
					<ContextMenu ref={fileCm} model={fileItems} />
				</div>
			)}
			{modal && (
				<Overlay onExit={() => setModal('')} className='flex justify-center items-center'>
					{modal === 'create-folder' && (
						<CreateFolderModal onCreateFolder={onCreateFolder} handleClose={closeModals} />
					)}
					{modal === 'upload-file' && (
						<CreateFileModal
							onCreateFile={onCreateFile}
							handleClose={closeModals}
							setFile={setFile}
							file={file}
						/>
					)}
					{modal === 'rename-file' && <RenameModal onRename={onRename} handleClose={closeModals} />}
					{modal === 'share' && (
						<ShareModal
							sharedUsers={
								sharedUsers?.data.items
									.filter((u) => u.employee.id !== user?.id)
									.map((user) => ({ ...user, ...user.employee })) || []
							}
							users={
								// Only show users that are not already shared
								users?.data.items.filter(
									(x) =>
										!sharedUsers?.data.items.find((u) => x.id === u.employee.id) &&
										// Themselves
										x.id !== user?.id &&
										// Owners
										x.id !== owner?.data.owner.id
								) || []
							}
							onShare={onShare}
							handleClose={closeModals}
						/>
					)}
					{modal === 'delete' && (
						<div className='bg-neutral-800 rounded-lg p-5 w-[50vw]'>
							<h2 className='title'>Changing permission</h2>
							<div className='mt-2'>Are you sure you want to delete this item?</div>
							<div className='flex w-full justify-end mt-5'>
								<Button label='Cancel' className='h-11 rounded-lg mr-3' onClick={closeModals} />
								<Button
									label='Delete'
									className='h-11 rounded-lg btn-outlined !border-red-600'
									onClick={onDelete}
									severity='danger'
									outlined
								/>
							</div>
						</div>
					)}
				</Overlay>
			)}
			<Toast ref={toast} position='top-right' />
		</>
	);
};

export default EmpDrivePage;
