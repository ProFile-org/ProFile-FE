import Table from '@/components/Table/Table.component';
import { Column } from 'primereact/column';
import { IDepartment } from '@/types/item';
import usePagination from '@/hooks/usePagination';
import useNavigateSelect from '@/hooks/useNavigateSelect';

const AdminDepartmentPage = () => {
	const { getPaginatedTableProps } = usePagination<IDepartment>({
		key: ['departments'],
		url: '/departments',
	});

	const { getNavigateOnSelectProps } = useNavigateSelect({ route: 'DEPARTMENTS_MANAGE' });

	return (
		<div className='flex flex-col gap-5 w-full'>
			<div className='card w-full overflow-hidden'>
				<Table sortMode='single' {...getNavigateOnSelectProps()} {...getPaginatedTableProps()}>
					<Column field='count' header='No.' className='w-max' />
					<Column
						field='id'
						header='ID'
						className='break-keep overflow-ellipsis max-w-[5rem]'
						sortable
					/>
					<Column field='name' header='Name' sortable />
				</Table>
			</div>
		</div>
	);
};

export default AdminDepartmentPage;
