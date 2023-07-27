import Status from '@/components/Status/Status.component';
import Table from '@/components/Table/Table.component';
import { AUTH_ROUTES } from '@/constants/routes';
import usePagination from '@/hooks/usePagination';
import { IStaff } from '@/types/item';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminStaffPage = () => {
	const navigate = useNavigate();
	const query = useRef('');
	const { getPaginatedTableProps, refetch } = usePagination<IStaff>({
		key: 'staffs',
		url: '/staffs',
		query: query.current,
	});

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
					<Button className='h-11 rounded-lg'>Assign +</Button>
				</Link>
			</div>
			<div className='card w-full overflow-hidden'>
				<Table
					sortMode='single'
					selectionMode='single'
					onSelectionChange={(e) =>
						navigate(`${AUTH_ROUTES.NEW_STAFF}?staffId=${(e.value as { id: string }).id}`)
					}
					{...getPaginatedTableProps()}
				>
					{/* <Column
						field='id'
						header='ID'
						body={(locker) => <Link to={`${locker.id}`}>{locker.id}</Link>}
					/> */}
					<Column field='count' header='No.' />
					<Column field='user.username' header='Username' sortable />
					<Column
						field='user.department.name'
						header='Department'
						sortable
						body={(staff) => <>{staff.user.department?.name || 'N/A'}</>}
					/>
					<Column
						field='room.name'
						header='Room'
						sortable
						body={(staff) => <>{staff.room?.name || 'N/A'}</>}
					/>
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

export default AdminStaffPage;
