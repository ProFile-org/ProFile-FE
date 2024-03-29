import Status from '@/components/Status/Status.component';
import Table from '@/components/Table/Table.component';
import { AuthContext } from '@/context/authContext';
import useNavigateSelect from '@/hooks/useNavigateSelect';
import usePagination from '@/hooks/usePagination';
import { GetRequestsResponse } from '@/types/response';
import { dateFormatter } from '@/utils/formatter';
import { Column } from 'primereact/column';
import { useContext } from 'react';

const EmpRequestPage = () => {
	const { user } = useContext(AuthContext);
	const { getPaginatedTableProps } = usePagination<GetRequestsResponse>({
		key: 'requests',
		url: `/documents/borrows?employeeId=${user?.id}`,
	});

	const { getNavigateOnSelectProps } = useNavigateSelect({ route: 'REQUESTS' });

	return (
		<div className='flex flex-col gap-5'>
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
