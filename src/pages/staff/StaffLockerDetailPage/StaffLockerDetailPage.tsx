import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import Progress from '@/components/Progress/Progress.component';
import { SkeletonPage } from '@/components/Skeleton';
import Table from '@/components/Table/Table.component';
import { AUTH_ROUTES } from '@/constants/routes';
import { GetFoldersResponse, GetLockerByIdResponse } from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { useQuery } from 'react-query';
import { Link, useParams } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '@/context/authContext';
import useNavigateSelect from '@/hooks/useNavigateSelect';
import { IFolder } from '@/types/item';
import Status from '@/components/Status/Status.component';

const StaffLockerDetailPage = () => {
	const { user } = useContext(AuthContext);
	const { lockerId } = useParams<{ lockerId: string }>();
	const { getNavigateOnSelectProps } = useNavigateSelect({ route: 'FOLDERS' });

	const roomId = user?.department.roomId || '';

	const { data: locker, isLoading } = useQuery(
		['lockers', lockerId],
		async () =>
			(
				await axiosClient.get<GetLockerByIdResponse>(`/lockers/${lockerId}`, {
					params: {
						roomId,
					},
				})
			).data
	);

	const { data: folders, isLoading: isFoldersLoading } = useQuery(
		[
			'folders',
			{
				roomId,
				lockerId,
			},
		],
		async () =>
			(
				await axiosClient.get<GetFoldersResponse>(`/folders`, {
					params: {
						lockerId,
						roomId,
						size: 20,
						page: 1,
					},
				})
			).data,
		{
			enabled: !!lockerId && !!roomId,
		}
	);

	if (isLoading || !locker) return <SkeletonPage />;

	const { name: lockerName, capacity, numberOfFolders } = locker.data;

	const foldersWithId = folders?.data.items.map((folder, index) => ({
		count: index + 1,
		...folder,
	}));

	const totalDocuments = folders?.data.items.reduce(
		(acc, folder) => acc + folder.numberOfDocuments,
		0
	);

	const totalDocumentsCapacity = folders?.data.items.reduce(
		(acc, folder) => acc + folder.capacity,
		0
	);

	return (
		<div className='flex flex-col gap-5'>
			<div className='card'>
				<h2 className='title flex gap-2'>
					<span>/</span>
					<span>{lockerName}</span>
				</h2>
			</div>
			<div className='flex gap-5 md:flex-row flex-col'>
				<div className='flex flex-col gap-5 flex-1'>
					<InformationPanel header='Locker information'>
						<InputWithLabel
							label='ID'
							wrapperClassName='flex-1'
							value={lockerId}
							readOnly
							sideComponent={<Status type='locker' item={locker.data} />}
						/>
						<InputWithLabel
							label='Locker name'
							wrapperClassName='flex-1'
							value={lockerName}
							readOnly
						/>
						<Progress
							label='Folder capacity'
							current={numberOfFolders}
							max={capacity}
							showPercentage
						/>
						<Progress
							label='Document capacity'
							current={totalDocuments}
							max={totalDocumentsCapacity}
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
						<Link to={AUTH_ROUTES.LOCKERS}>
							<Button
								label='Return home'
								className='w-full h-11 rounded-lg btn-outlined'
								outlined
							/>
						</Link>
					</InformationPanel>
					<InformationPanel header='Folders' className='flex-1'>
						<Table
							value={foldersWithId}
							loading={isFoldersLoading}
							lazy
							selectionMode='single'
							{...getNavigateOnSelectProps()}
						>
							<Column field='count' header='No.' />
							<Column field='name' header='Name' />
							<Column
								field='status'
								header='Status'
								body={(item: IFolder) => <Status type='folder' item={item} />}
							/>
						</Table>
					</InformationPanel>
				</div>
			</div>
		</div>
	);
};

export default StaffLockerDetailPage;
