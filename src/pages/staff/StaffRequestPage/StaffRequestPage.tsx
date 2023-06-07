import Status from '@/components/Status/Status.component';
import Table from '@/components/Table/Table.component';
import useNavigateSelect from '@/hooks/useNavigateSelect';
import usePagination from '@/hooks/usePagination';
import { IBorrowRequest } from '@/types/item';
import { Column } from 'primereact/column';

const StaffRequestPage = () => {
	const { getPaginatedTableProps } = usePagination<IBorrowRequest>({
		key: 'requests',
		url: '/borrows/staffs',
	});

	const { getNavigateOnSelectProps } = useNavigateSelect({ route: 'REQUESTS' });

	return (
		<div className='flex flex-col gap-5'>
			<h2 className='header'>Pending requests</h2>
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
					<Column field='borrowTime' header='From' sortable />
					<Column field='dueTime' header='To' sortable />
				</Table>
			</div>
		</div>
	);
};

export default StaffRequestPage;
