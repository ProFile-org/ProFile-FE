import { AUTH_ROUTES } from '@/constants/routes';
import { Link } from 'react-router-dom';
import axiosClient from '@/utils/axiosClient';
import { GetDocumentByIdResponse, GetImportsResponse, GetRequestsResponse } from '@/types/response';
import { REFETCH_CONFIG } from '@/constants/config';
import { SkeletonCard } from '@/components/Skeleton';
import InfoCard from '@/components/Card/InfoCard.component';
import { useQueries, useQuery } from 'react-query';
import Status from '@/components/Status/Status.component';
import { dateFormatter } from '@/utils/formatter';
import { useContext } from 'react';
import { AuthContext } from '@/context/authContext';

const EmpDashboardPage = () => {
	const { user } = useContext(AuthContext);

	const { data: requests, isLoading: isRequestsLoading } = useQuery(
		['requests', 'recent'],
		async () =>
			(
				await axiosClient.get<GetRequestsResponse>('/documents/borrows', {
					params: {
						employeeId: user?.id,
						sortOrder: 'desc',
						size: 4,
						page: 1,
					},
				})
			).data,
		{
			...REFETCH_CONFIG,
		}
	);
	const { data: imports, isLoading: isImportsLoading } = useQuery(
		['imports', 'recent'],
		async () =>
			(
				await axiosClient.get<GetImportsResponse>('/documents/import-requests', {
					params: {
						employeeId: user?.id,
						sortOrder: 'desc',
						size: 4,
						page: 1,
					},
				})
			).data,
		{
			...REFETCH_CONFIG,
		}
	);

	const temp = requests || { data: { items: [] } };

	const documents = useQueries(
		temp.data.items.map((request) => ({
			queryKey: ['documents', request.id],
			queryFn: async () =>
				(
					await axiosClient.get<GetDocumentByIdResponse>(`/documents/${request.documentId}`, {
						params: {
							employeeId: user?.id,
						},
					})
				).data,
		}))
	);

	return (
		<div className='flex flex-col gap-5'>
			<Link to={AUTH_ROUTES.REQUESTS} className='header link-underlined'>
				Borrow request &gt;
			</Link>
			<div className='flex gap-5 overflow-x-auto'>
				{isRequestsLoading ? (
					[...Array(3)].map((_, index) => <SkeletonCard key={index} />)
				) : requests?.data.items.length ? (
					requests.data.items.map((request, index) =>
						documents[index].isLoading ? (
							<SkeletonCard key={request.id} />
						) : (
							<InfoCard key={request.id} url={`${AUTH_ROUTES.REQUESTS}/${request.id}`}>
								<div className='flex items-center gap-3'>
									<h4 className='font-bold text-xl group-hover:text-primary transition-colors'>
										{documents[index].data?.data.title}
									</h4>
									<Status item={request} type='request' />
								</div>
								<p className='mt-2 text-lg'>
									Types: <span>{documents[index].data?.data.documentType}</span>
								</p>
								<p className='mt-2 text-lg'>
									From: <span>{dateFormatter(new Date(request.borrowTime))}</span>
								</p>
								<p className='mt-2 text-lg'>
									To: <span>{dateFormatter(new Date(request.dueTime))}</span>
								</p>
							</InfoCard>
						)
					)
				) : (
					<div className='card w-full text-center'>No requests</div>
				)}
			</div>
			<Link to={AUTH_ROUTES.IMPORT_MANAGE} className='header link-underlined'>
				Import requests &gt;
			</Link>
			<div className='flex gap-5 overflow-x-auto'>
				{isImportsLoading ? (
					[...Array(3)].map((_, index) => <SkeletonCard key={index} />)
				) : imports?.data.items.length ? (
					imports.data.items.map((request) => (
						<InfoCard key={request.id} url={`${AUTH_ROUTES.IMPORT_MANAGE}/${request.id}`}>
							<div className='flex items-center gap-3'>
								<h4 className='font-bold text-xl group-hover:text-primary transition-colors'>
									{request.document.title}
								</h4>
								<Status item={request} type='document' />
							</div>
							<p className='mt-2 text-lg'>
								Types: <span>{request.document.documentType}</span>
							</p>
							<p className='mt-2 text-lg'>
								Your reason: <span>{request.importReason}</span>
							</p>
							<p className='mt-2 text-lg'>
								Staff reason: <span>{request.staffReason}</span>
							</p>
						</InfoCard>
					))
				) : (
					<div className='card w-full text-center'>No import requests</div>
				)}
			</div>
		</div>
	);
};

export default EmpDashboardPage;
