import Status from '@/components/Status/Status.component';
import Table from '@/components/Table/Table.component';
import { AUTH_ROUTES } from '@/constants/routes';
import usePagination from '@/hooks/usePagination';
import { IDocument, IImportRequest } from '@/types/item';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import useNavigateSelect from '@/hooks/useNavigateSelect';

const EmpImportPage = () => {
	const query = useRef('');

	const { getPaginatedTableProps, refetch } = usePagination<IImportRequest>({
		key: ['imports', query.current],
		url: '/documents/import-requests',
		query: query.current,
	});

	const { getNavigateOnSelectProps } = useNavigateSelect({ route: 'IMPORT_MANAGE' });

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
						placeholder='document a'
						onChange={(e) => (query.current = e.target.value)}
					/>
					<Button label='Search' name='search' id='search' className='px-3 rounded-lg' />
				</form>
				<Link to={AUTH_ROUTES.NEW_IMPORT}>
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
					<Column field='document.title' header='Title' sortable />
					<Column field='document.documentType' header='Type' sortable />
					<Column
						field='document.status'
						header='Document status'
						sortable
						body={(item) => <Status type='document' item={item.document} />}
					/>
					<Column field='status' header='Request status' sortable />
					<Column field='room.name' header='Into room' sortable />
				</Table>
			</div>
		</div>
	);
};

export default EmpImportPage;
