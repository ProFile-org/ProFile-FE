import CustomDropdown from '@/components/Dropdown/Dropdown.component';
import Table from '@/components/Table/Table.component';
import usePagination from '@/hooks/usePagination';
import { Ilog } from '@/types/item';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { useRef, useState } from 'react';

const LOG_TYPES = [
	{ label: 'Document', value: 'Document' },
	{ label: 'Folder', value: 'Folder' },
	{ label: 'Locker', value: 'Locker' },
	{ label: 'User', value: 'User' },
	{ label: 'Room', value: 'Room' },
	{ label: 'Request', value: 'Request' },
	{ label: 'Borrow', value: 'Borrow' },
];

const AdminLogPage = () => {
	const query = useRef('');
	const [objectType, setObjectType] = useState('Document');

	const { getPaginatedTableProps, refetch } = usePagination<Ilog>({
		key: ['logs', objectType, query.current],
		url: `/logs?objectType=${objectType}`,
		query: query.current,
		queryConfig: {
			enabled: !!objectType,
		},
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
					<CustomDropdown
						className='w-48'
						options={LOG_TYPES}
						value={objectType}
						onChange={(e) => setObjectType(e.value)}
					/>
					<InputText
						className='input'
						onChange={(e) => (query.current = e.target.value)}
						placeholder='log a'
					/>
					<Button type='submit' label='Search' className='px-3 rounded-lg bg-primary' />
				</form>
			</div>
			<div className='card w-full overflow-hidden'>
				<Table sortMode='single' {...getPaginatedTableProps()}>
					<Column field='count' header='No.' className='w-max' />
					<Column
						field='id'
						header='ID'
						className='break-keep overflow-ellipsis max-w-[5rem]'
						sortable
					/>
					<Column
						field='message'
						header='Message'
						body={(item) => (
							<div className='w-[500px] overflow-hidden break-words whitespace-normal'>
								{item.message}
							</div>
						)}
						sortable
					/>
					<Column field='level' header='Level' sortable />
					<Column field='time' header='Time' sortable />
					<Column field='user.email' header='By user' sortable />
					<Column field='objectId' header='Item ID' />
				</Table>
			</div>
		</div>
	);
};

export default AdminLogPage;
