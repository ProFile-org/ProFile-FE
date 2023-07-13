import Table from '@/components/Table/Table.component';
import { AUTH_ROUTES } from '@/constants/routes';
import usePagination from '@/hooks/usePagination';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom';
import { ILocker } from '@/types/item';
import useNavigateSelect from '@/hooks/useNavigateSelect';
import Status from '@/components/Status/Status.component';
import { useRef } from 'react';

const StaffLockerPage = () => {
	const query = useRef('');

	const { getPaginatedTableProps, refetch } = usePagination<ILocker>({
		key: ['lockers', query.current],
		url: '/lockers',
		query: query.current,
	});

	const { getNavigateOnSelectProps } = useNavigateSelect({ route: 'LOCKERS' });

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
						placeholder='locker a'
					/>
					<Button type='submit' label='Search' className='px-3 rounded-lg bg-primary' />
				</form>
				<Link to={AUTH_ROUTES.NEW_IMPORT}>
					<Button className='h-11 rounded-lg'>Import +</Button>
				</Link>
			</div>
			<div className='card w-full overflow-hidden'>
				<Table sortMode='single' {...getNavigateOnSelectProps()} {...getPaginatedTableProps()}>
					{/* <Column
						field='id'
						header='ID'
						body={(locker) => <Link to={`${locker.id}`}>{locker.id}</Link>}
					/> */}
					<Column field='count' header='No.' />
					<Column field='name' header='Name' sortable />
					<Column field='numberOfFolders' header='No of folders' sortable />
					<Column field='capacity' header='Capacity' sortable />
					<Column
						field='isAvailable'
						header='Is available'
						sortable
						body={(locker) => <Status type='locker' item={locker} />}
					/>
				</Table>
			</div>
		</div>
	);
};

export default StaffLockerPage;
