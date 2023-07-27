import CustomDropdown from '@/components/Dropdown/Dropdown.component';
import Table from '@/components/Table/Table.component';
import usePagination from '@/hooks/usePagination';
import { Ilog } from '@/types/item';
// import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
// import { InputText } from 'primereact/inputtext';
import { SelectItemOptionsType } from 'primereact/selectitem';
import { useRef, useState } from 'react';

const LOG_TYPES: SelectItemOptionsType = [
	{
		label: 'Physical',
		items: [
			{ label: 'Document', value: 'Document' },
			{ label: 'Folder', value: 'Folder' },
			{ label: 'Locker', value: 'Locker' },
			{ label: 'Room', value: 'Room' },
		],
	},
	{
		label: 'User',
		items: [
			{ label: 'User action', value: 'User' },
			{ label: 'Staff', value: 'Staff' },
		],
	},
	{
		label: 'Requests',
		items: [
			{ label: 'Request creation', value: 'Request' },
			{ label: 'Import request', value: 'ImportRequest' },
			{ label: 'Borrow request', value: 'BorrowRequest' },
		],
	},
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
						options={LOG_TYPES}
						value={objectType}
						onChange={(e) => setObjectType(e.value)}
						optionGroupChildren='items'
						optionGroupLabel='label'
						optionGroupTemplate={(option) => (
							<span className='font-bold text-primary'>{option.label}</span>
						)}
					/>
					{/* <InputText
						className='input'
						onChange={(e) => (query.current = e.target.value)}
						placeholder='log a'
					/> */}
					{/* <Button type='submit' label='Search' className='px-3 rounded-lg bg-primary' /> */}
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
