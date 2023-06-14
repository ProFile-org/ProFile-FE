import Status from '@/components/Status/Status.component';
import Table from '@/components/Table/Table.component';
import { AUTH_ROUTES } from '@/constants/routes';
import useNavigateSelect from '@/hooks/useNavigateSelect';
import usePagination from '@/hooks/usePagination';
import { IFolder } from '@/types/item';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

const AdminFolderPage = () => {
	const query = useRef('');

	const { getPaginatedTableProps, refetch } = usePagination<IFolder>({
		key: ['folders', query.current],
		url: '/folders',
		query: query.current,
	});

	const { getNavigateOnSelectProps } = useNavigateSelect({ route: 'FOLDERS' });

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
						placeholder='folder '
					/>
					<Button type='submit' label='Search' className='px-3 rounded-lg bg-primary' />
				</form>
				<Link to={AUTH_ROUTES.NEW_FOLDER}>
					<Button className='h-11 rounded-lg'>Create +</Button>
				</Link>
			</div>
			<div className='card w-full overflow-hidden'>
				<Table sortMode='single' {...getNavigateOnSelectProps()} {...getPaginatedTableProps()}>
					{/* <Column
						field='id'
						header='ID'
						body={(folder) => <Link to={`${folder.id}`}>{folder.id}</Link>}
					/> */}
					<Column field='count' header='No.' />
					<Column field='name' header='Name' sortable />
					<Column field='locker.name' header='Locker' />
					<Column field='numberOfDocuments' header='No of docs' sortable />
					<Column field='capacity' header='Capacity' sortable />
					<Column
						field='isAvailable'
						header='Is available'
						sortable
						body={(folder) => <Status type='folder' item={folder} />}
					/>
				</Table>
			</div>
		</div>
	);
};

export default AdminFolderPage;
