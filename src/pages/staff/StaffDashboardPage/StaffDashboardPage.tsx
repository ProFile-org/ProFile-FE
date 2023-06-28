import Progress from '@/components/Progress/Progress.component';
import { SkeletonCard } from '@/components/Skeleton';
import { REFETCH_CONFIG } from '@/constants/config';
import { AUTH_ROUTES } from '@/constants/routes';
import { GetDocumentsResponse, GetFoldersResponse, GetLockersResponse } from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import clsx from 'clsx';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '@/context/authContext';
import InfoCard from '@/components/Card/InfoCard.component';
import Status from '@/components/Status/Status.component';

const StaffDashboardPage = () => {
	const { user } = useContext(AuthContext);

	const roomId = user?.roomId || '';

	const { data: lockers, isLoading: isLockerLoading } = useQuery(
		['lockers', 'recent'],
		async () =>
			(
				await axiosClient.get<GetLockersResponse>('/lockers', {
					params: {
						roomId,
						sortBy: 'NumberOfFolders',
						sortOrder: 'desc',
						size: 3,
						page: 1,
					},
				})
			).data,
		{
			...REFETCH_CONFIG,
		}
	);

	const { data: folders, isLoading: isFolderLoading } = useQuery(
		['folders', 'recent'],
		async () =>
			(
				await axiosClient.get<GetFoldersResponse>('/folders', {
					params: {
						roomId,
						sortBy: 'NumberOfDocuments',
						sortOrder: 'desc',
						size: 3,
						page: 1,
					},
				})
			).data,
		{
			...REFETCH_CONFIG,
		}
	);

	const { data: documents, isLoading: isDocumentLoading } = useQuery(
		['documents', 'recent'],
		async () =>
			(
				await axiosClient.get<GetDocumentsResponse>('/documents', {
					params: {
						roomId,
						sortBy: '',
						sortOrder: 'desc',
						size: 8,
						page: 1,
					},
				})
			).data,
		{
			...REFETCH_CONFIG,
		}
	);

	return (
		<div className='flex flex-col gap-5'>
			<Link to={AUTH_ROUTES.REQUESTS} className='header link-underlined'>
				Pending request &gt;
			</Link>
			<div className='flex gap-5'>
				<div className='card flex-1 h-40'></div>
				<div className='card flex-1 h-40'></div>
				<div className='card flex-1 h-40'></div>
			</div>
			<Link to={AUTH_ROUTES.LOCKERS} className='header link-underlined'>
				Lockers &gt;
			</Link>
			<div className='flex gap-5'>
				{isLockerLoading ? (
					[...Array(3)].map((_, index) => <SkeletonCard key={index} />)
				) : lockers && lockers.data.items.length !== 0 ? (
					lockers.data.items.map((locker) => (
						<InfoCard
							key={locker.id}
							header={locker.name}
							url={`${AUTH_ROUTES.LOCKERS}/${locker.id}`}
						>
							<p className='mt-2 text-lg'>
								Status:{' '}
								<span
									className={clsx(
										!locker.isAvailable && 'text-red-500',
										'text-green-500 font-bold'
									)}
								>
									{locker.isAvailable ? 'Available' : 'Not available'}
								</span>
							</p>
							<p className='mt-2 text-lg'>Folder count:</p>
							<Progress
								className='mt-2'
								current={locker.numberOfFolders}
								max={locker.capacity}
								showPercentage
							/>
						</InfoCard>
					))
				) : (
					<InfoCard>No lockers</InfoCard>
				)}
			</div>
			<Link to={AUTH_ROUTES.FOLDERS} className='header link-underlined'>
				Folders &gt;
			</Link>
			<div className='flex gap-5'>
				{isFolderLoading ? (
					[...Array(3)].map((_, index) => <SkeletonCard key={index} />)
				) : folders && folders.data.items.length !== 0 ? (
					folders.data.items.map((folder) => (
						<InfoCard
							key={folder.id}
							header={folder.name}
							url={`${AUTH_ROUTES.FOLDERS}/${folder.id}`}
						>
							<p className='mt-2 text-lg'>
								Status:{' '}
								<span
									className={clsx(
										!folder.isAvailable && 'text-red-500',
										'text-green-500 font-bold'
									)}
								>
									{folder.isAvailable ? 'Available' : 'Not available'}
								</span>
							</p>
							<p className='mt-2 text-lg'>Document count:</p>
							<Progress
								className='mt-2'
								current={folder.numberOfDocuments}
								max={folder.capacity}
								showPercentage
							/>
						</InfoCard>
					))
				) : (
					<InfoCard>No folders</InfoCard>
				)}
			</div>
			<Link to={AUTH_ROUTES.DOCUMENTS} className='header link-underlined'>
				Documents &gt;
			</Link>
			<div className='flex gap-5 overflow-x-auto max-w-full'>
				{isDocumentLoading ? (
					[...Array(3)].map((_, index) => <SkeletonCard key={index} />)
				) : documents && documents.data.items.length !== 0 ? (
					documents.data.items.map((document) => (
						<InfoCard key={document.id} url={`${AUTH_ROUTES.DOCUMENTS}/${document.id}`}>
							<div className='flex items-center gap-3'>
								<h4 className='font-bold text-xl group-hover:text-primary transition-colors'>
									{document.title}
								</h4>
								<Status className='block w-max' type='document' item={document} />
							</div>
							<p className='mt-2 text-lg'>{document.folder?.name}</p>
							<p className='mt-2 text-lg'>
								Type: <span className='font-bold'>{document.documentType}</span>
							</p>
						</InfoCard>
					))
				) : (
					<InfoCard>No documents</InfoCard>
				)}
			</div>
		</div>
	);
};

export default StaffDashboardPage;
