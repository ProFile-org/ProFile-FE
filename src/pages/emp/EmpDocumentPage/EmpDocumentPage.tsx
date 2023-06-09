import Status from '@/components/Status/Status.component';
import Table from '@/components/Table/Table.component';
import { AUTH_ROUTES } from '@/constants/routes';
import usePagination from '@/hooks/usePagination';
import { IDocument } from '@/types/item';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import useNavigateSelect from '@/hooks/useNavigateSelect';

const EmpDocumentPage = () => {
	const query = useRef('');

	const { getPaginatedTableProps: getPublicTableProps, refetch: publicRefetch } =
		usePagination<IDocument>({
			key: ['documents', query.current, 'false'],
			url: '/documents/employees',
			query: query.current,
		});

	const { getPaginatedTableProps: getPrivateTableProps, refetch: privateRefetch } =
		usePagination<IDocument>({
			key: ['documents', query.current, 'true'],
			url: '/documents/employees?isPrivate=true',
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
						await publicRefetch();
						await privateRefetch();
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
			<h2 className='title'>Private document</h2>
			<div className='card w-full overflow-hidden'>
				<Table sortMode='single' {...getNavigateOnSelectProps()} {...getPrivateTableProps()}>
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
			<h2 className='title'>Public document</h2>
			<div className='card w-full overflow-hidden'>
				<Table sortMode='single' {...getNavigateOnSelectProps()} {...getPublicTableProps()}>
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

export default EmpDocumentPage;
