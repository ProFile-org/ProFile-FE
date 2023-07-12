import Table from '@/components/Table/Table.component';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IDepartment } from '@/types/item';
import usePagination from '@/hooks/usePagination';
import useNavigateSelect from '@/hooks/useNavigateSelect';
import { useRef } from 'react';

const AdminDepartmentPage = () => {
	const query = useRef('');

	const { getPaginatedTableProps, refetch } = usePagination<IDepartment>({
		key: ['departments', query.current],
		url: '/departments',
		query: query.current,
	});

	const { getNavigateOnSelectProps } = useNavigateSelect({ route: 'DEPARTMENTS_MANAGE' });

	return (
		<div className='flex flex-col gap-5'>
			<div className='card w-full py-3 flex justify-between'>
				<form
					className='flex h-11 gap-3'
					onSubmit={async (e) => {
						e.preventDefault();
						await refetch();
					}}
				>
					<InputText
						className='input'
						onChange={(e) => (query.current = e.target.value)}
						placeholder='department a'
					/>
					<Button type='submit' label='Search' className='px-3 rounded-lg bg-primary' />
				</form>
			</div>
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
