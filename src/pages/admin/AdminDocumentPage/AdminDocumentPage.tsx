import Table from '@/components/Table/Table.component';
import { AUTH_ROUTES } from '@/constants/routes';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom';
import { IDocument } from '@/types/item';
import usePagination from '@/hooks/usePagination';
import useNavigateSelect from '@/hooks/useNavigateSelect';
import Status from '@/components/Status/Status.component';
import { useRef } from 'react';

const AdminDocumentPage = () => {
	const query = useRef('');

	const { getPaginatedTableProps, refetch } = usePagination<IDocument>({
		key: ['documents', query.current],
		url: '/documents',
		query: query.current,
	});

	const { getNavigateOnSelectProps } = useNavigateSelect({ route: 'DOCUMENTS' });

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
						placeholder='document a'
					/>
					<Button type='submit' label='Search' className='px-3 rounded-lg bg-primary' />
				</form>
				<Link to={AUTH_ROUTES.IMPORT}>
					<Button className='h-11 rounded-lg'>Import +</Button>
				</Link>
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
					<Column field='title' header='Title' sortable />
					<Column field='documentType' header='Type' sortable />
					<Column
						field='status'
						header='Status'
						sortable
						body={(item) => <Status type='document' item={item} />}
					/>
					<Column field='folder.name' header='Folder' />
					<Column field='folder.locker.name' header='Locker' />
				</Table>
			</div>
		</div>
	);
};

export default AdminDocumentPage;
