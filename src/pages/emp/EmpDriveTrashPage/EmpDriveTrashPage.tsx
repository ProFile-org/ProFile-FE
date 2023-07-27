/* eslint-disable no-mixed-spaces-and-tabs */
import axiosClient from '@/utils/axiosClient';
// import { InputText } from 'primereact/inputtext';
import { useQuery, useQueryClient } from 'react-query';
import { useRef, useState } from 'react';
// import { Button } from 'primereact/button';
import useQueryParams from '@/hooks/useQueryParams';
import { ContextMenu } from 'primereact/contextmenu';
import { PrimeIcons } from 'primereact/api';
import { MenuItem } from 'primereact/menuitem';
import { BaseResponse, GetDriveResponse } from '@/types/response';
import Folder from '@/components/Drive/Folder';
import { DetailInfo, File } from '@/components/Drive';
import { Toast } from 'primereact/toast';
import { AxiosError } from 'axios';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import Spinner from '@/components/Spinner/Spinner.component';
import { REFETCH_CONFIG } from '@/constants/config';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs.component';
import { IDrive } from '@/types/item';

const EmpDriveTrashPage = () => {
	const query = useRef('');
	const toast = useRef<Toast>(null);
	const cm = useRef<ContextMenu>(null);

	const queryClient = useQueryClient();
	const queryParams = useQueryParams();

	const path = queryParams.get('path') || '/';
	const pathArr = path.split('/');
	const currentPath = pathArr.slice(1).join('/') ? pathArr.join('/') : '';

	const [currentItem, setCurrentItem] = useState('');
	const [showInfo, setShowInfo] = useState<IDrive | null>(null);

	const { data, isLoading } = useQuery(
		['digital', 'bin', path, query.current],
		async () =>
			(
				await axiosClient.get<GetDriveResponse>(
					`/bin/entries?EntryPath=${encodeURIComponent(path)}`,
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

	const files = data?.data.items.filter((item) => !item.isDirectory);
	const folders = data?.data.items.filter((item) => item.isDirectory);

	const onDelete = async () => {
		try {
			await axiosClient.delete(`/bin/entries/${currentItem}`);
			queryClient.invalidateQueries(['digital', 'bin', path]);
		} catch (error) {
			onError(error as AxiosError<BaseResponse>);
		}
	};

	const onRestore = async () => {
		try {
			await axiosClient.put(`/bin/entries/${currentItem}/restore`);
			queryClient.invalidateQueries(['digital', 'bin', path]);
		} catch (error) {
			onError(error as AxiosError<BaseResponse>);
		}
	};

	const items: MenuItem[] = [
		{
			label: 'Restore',
			icon: PrimeIcons.REFRESH,
			command: () => {
				confirmDialog({
					message: 'Are you sure you want to restore this item?',
					header: 'Confirmation',
					className: '!text-white',
					accept: onRestore,
					rejectClassName:
						'!border-red-500 text-white bg-transparent hover:!bg-[#fff3] transition-colors',
				});
			},
		},
		{
			label: 'Delete permanently',
			icon: PrimeIcons.TRASH,
			command: () => {
				confirmDialog({
					message: 'Are you sure you want to delete this item permanently? This cannot be undone',
					header: 'Confirmation',
					className: '!text-white',
					accept: onDelete,
					rejectClassName:
						'!border-red-500 text-white bg-transparent hover:!bg-[#fff3] transition-colors',
				});
			},
		},
	];

	return (
		<>
			{isLoading ? (
				<div className='w-full h-full flex items-center justify-center'>
					<Spinner />
				</div>
			) : (
				<div className='flex flex-col gap-5 h-full w-full'>
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
				</div> */}
					<Breadcrumbs trashed path={path} pathArr={pathArr} />
					{(!data || data.data.items.length === 0) && (
						<div className='text-center text-lg font-bold h-full flex items-center justify-center w-full'>
							This bin is empty
							<br />
							Any recently deleted files or folder will appear here
						</div>
					)}
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
										{folders?.map((folder) => (
											<Folder
												showInfo={setShowInfo}
												trashed
												key={folder.id}
												folder={folder}
												currentPath={currentPath}
												onContextMenu={(value, e) => {
													e.preventDefault();
													e.stopPropagation();
													cm.current?.show(e);
													setCurrentItem(value);
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
										{files?.map((file) => (
											<File
												showInfo={setShowInfo}
												key={file.id}
												file={file}
												onContextMenu={(value, e) => {
													e.preventDefault();
													e.stopPropagation();
													cm.current?.show(e);
													setCurrentItem(value);
												}}
											/>
										))}
									</div>
								</>
							)}
						</div>
						<DetailInfo showInfo={showInfo} setShowInfo={setShowInfo} />
					</div>

					<ContextMenu ref={cm} model={items} />
					<ConfirmDialog dismissableMask />
				</div>
			)}
			<Toast ref={toast} position='top-right' />
		</>
	);
};

export default EmpDriveTrashPage;
