import Status from '@/components/Status/Status.component';
import Table from '@/components/Table/Table.component';
import { AUTH_ROUTES } from '@/constants/routes';
import useNavigateSelect from '@/hooks/useNavigateSelect';
import usePagination from '@/hooks/usePagination';
import { GetRequestsResponse } from '@/types/response';
import { dateFormatter } from '@/utils/formatter';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Link } from 'react-router-dom';

const EmpRequestPage = () => {
	const { getPaginatedTableProps } = usePagination<GetRequestsResponse>({
		key: 'requests',
		url: '/borrows/employees',
	});

	const { getNavigateOnSelectProps } = useNavigateSelect({ route: 'REQUESTS' });

	return (
		<div className='flex flex-col gap-5'>
			<div className='card w-full py-3 flex justify-end'>
				<Link to={AUTH_ROUTES.NEW_REQUEST}>
					<Button className='h-11 rounded-lg'>Request +</Button>
				</Link>
			</div>
			<h2 className='header'>Requests</h2>
			<div className='card'>
				<Table sortMode='single' {...getNavigateOnSelectProps()} {...getPaginatedTableProps()}>
					<Column field='count' header='No.' />
					<Column
						field='id'
						header='ID'
						sortable
						className='break-keep overflow-ellipsis max-w-[5rem]'
					/>
					<Column
						field='status'
						header='Status'
						body={(request) => <Status type='request' item={request} />}
						sortable
					/>
					<Column
						field='borrowTime'
						body={(request) =>
							dateFormatter(new Date(request.borrowTime), undefined, {
								dateStyle: 'full',
							})
						}
						header='From'
						sortable
					/>
					<Column
						field='dueTime'
						body={(request) =>
							dateFormatter(new Date(request.dueTime), undefined, {
								dateStyle: 'full',
							})
						}
						header='To'
						sortable
					/>
				</Table>
			</div>
		</div>
	);
};

export default EmpRequestPage;
