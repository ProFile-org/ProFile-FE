import Status from '@/components/Status/Status.component';
import Table from '@/components/Table/Table.component';
import { AUTH_ROUTES } from '@/constants/routes';
import useNavigateSelect from '@/hooks/useNavigateSelect';
import usePagination from '@/hooks/usePagination';
import { IUser } from '@/types/item';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

const AdminEmployeePage = () => {
	const query = useRef('');
	const { getPaginatedTableProps, refetch } = usePagination<IUser>({
		key: 'staffs',
		url: '/staffs',
		query: query.current,
	});

	const { getNavigateOnSelectProps } = useNavigateSelect({ route: 'STAFFS_MANAGE' });

	console.log(getPaginatedTableProps());

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
						placeholder='staff a'
					/>
					<Button type='submit' label='Search' className='px-3 rounded-lg bg-primary' />
				</form>
				<Link to={AUTH_ROUTES.NEW_STAFF}>
					<Button className='h-11 rounded-lg'>Create +</Button>
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
					<Column field='user.username' header='Username' sortable />
					<Column field='room.department.name' header='Department' sortable />
					<Column field='room.name' header='Room' sortable />
					<Column
						field='user.isActive'
						header='Is active'
						sortable
						body={(user) => <Status type='user_active' item={user.user} />}
					/>
					<Column
						field='user.isActivated'
						header='Is activated'
						sortable
						body={(user) => <Status type='user_activated' item={user.user} />}
					/>
				</Table>
			</div>
		</div>
	);
};

export default AdminEmployeePage;
