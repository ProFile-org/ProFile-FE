import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import Progress from '@/components/Progress/Progress.component';
import { SkeletonPage } from '@/components/Skeleton';
import Table from '@/components/Table/Table.component';
import { AUTH_ROUTES } from '@/constants/routes';
import { AuthContext } from '@/context/authContext';
import { GetDocumentsResponse, GetFolderByIdResponse } from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { useQuery } from 'react-query';
import { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { IDocument } from '@/types/item';
import Status from '@/components/Status/Status.component';
import useNavigateSelect from '@/hooks/useNavigateSelect';

const StaffFolderDetailPage = () => {
	const { user } = useContext(AuthContext);
	const { folderId } = useParams<{ folderId: string }>();

	const { getNavigateOnSelectProps } = useNavigateSelect({ route: 'DOCUMENTS' });

	const roomId = user?.department.roomId;

	const { data: folder, isLoading } = useQuery(
		['folders', folderId],
		async () => (await axiosClient.get<GetFolderByIdResponse>(`/folders/${folderId}`)).data
	);

	const lockerId = folder?.data.locker.id || '';

	const { data: documents, isLoading: isDocumentsLoading } = useQuery(
		[
			'documents',
			{
				folderId,
				roomId,
				lockerId,
			},
		],
		async () =>
			(
				await axiosClient.get<GetDocumentsResponse>(`/documents`, {
					params: {
						lockerId,
						roomId,
						folderId,
						size: 20,
						page: 1,
					},
				})
			).data,
		{
			enabled: !!folderId && !!lockerId && !!roomId,
		}
	);

	if (isLoading || !folder) return <SkeletonPage />;

	const {
		name: folderName,
		capacity,
		numberOfDocuments,
		locker: { name: lockerName },
	} = folder.data;

	const documentsWithId = documents?.data.items.map((doc, index) => ({
		count: index + 1,
		...doc,
	}));

	return (
		<div className='flex flex-col gap-5'>
			<div className='card'>
				<h2 className='title flex gap-2'>
					<span>/</span>
					<Link to={`${AUTH_ROUTES.LOCKERS}/${lockerId}`} className='link-underlined'>
						{lockerName}
					</Link>
					<span>/</span>
					<span>{folderName}</span>
				</h2>
			</div>
			<div className='flex gap-5 md:flex-row flex-col'>
				<div className='flex flex-col gap-5 flex-1'>
					<InformationPanel header='Folder information'>
						<InputWithLabel
							label='ID'
							wrapperClassName='flex-1'
							value={folderId}
							readOnly
							sideComponent={<Status item={folder.data} type='folder' />}
						/>
						<InputWithLabel
							label='Folder name'
							wrapperClassName='flex-1'
							value={folderName}
							readOnly
						/>
						<Progress
							label='Document capacity'
							current={numberOfDocuments}
							max={capacity}
							showPercentage
						/>
					</InformationPanel>
					<InformationPanel header='History'>
						<Table>
							<Column field='id' header='ID' />
							<Column field='name' header='Name' />
						</Table>
					</InformationPanel>
				</div>
				<div className='flex flex-col gap-5 flex-1'>
					<InformationPanel direction='row'>
						<Button label='Edit' className='h-11 rounded-lg flex-1' />
						<Button label='Delete' className='h-11 rounded-lg flex-1' severity='danger' />
						<Link to={AUTH_ROUTES.FOLDERS}>
							<Button
								label='Return home'
								className='w-full h-11 rounded-lg btn-outlined'
								outlined
							/>
						</Link>
					</InformationPanel>
					<InformationPanel header='Documents' className='flex-1'>
						<Table
							value={documentsWithId}
							loading={isDocumentsLoading}
							lazy
							selectionMode='single'
							{...getNavigateOnSelectProps()}
						>
							<Column field='count' header='No.' />
							<Column field='title' header='Title' />
							<Column
								field='status'
								header='Status'
								body={(item: IDocument) => <Status type='document' item={item} />}
							/>
						</Table>
					</InformationPanel>
				</div>
			</div>
		</div>
	);
};

export default StaffFolderDetailPage;
