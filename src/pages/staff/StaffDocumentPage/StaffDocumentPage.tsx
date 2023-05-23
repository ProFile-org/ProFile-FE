import Table from '@/components/Table/Table.component';
import { AUTH_ROUTES } from '@/constants/routes';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { IDocument } from '@/types/item';
import { GetDocumentsResponse } from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { useQuery } from 'react-query';

interface ILazyTableState {
	first: number;
	rows: number;
	page: number;
}

const DEFAULT_ROWS = 10;

const StaffDocumentPage = () => {
	const navigate = useNavigate();
	const [paginate, setPaginate] = useState<ILazyTableState>({
		page: 0,
		rows: DEFAULT_ROWS,
		first: 0,
	});

	const { data, isLoading } = useQuery(
		['documents', paginate],
		async () =>
			(
				await axiosClient.get<GetDocumentsResponse>('/documents', {
					params: {
						page: paginate.page + 1, // Primereact datatable page start at 0, our api start at 1
						size: paginate.rows,
					},
				})
			).data
	);

	const documents =
		data?.data.items.map((item, index) => ({ ...item, count: paginate.first + index + 1 })) || [];
	const totalCount = data?.data.totalCount || 0;

	return (
		<div className='flex flex-col gap-5'>
			<div className='card w-full py-3 flex justify-between'>
				<form className='flex h-11 gap-3'>
					<InputText className='input' />
					<Button label='Search' className='px-3 rounded-lg' />
				</form>
				<Link to={AUTH_ROUTES.IMPORT}>
					<Button className='h-11 rounded-lg'>Import +</Button>
				</Link>
			</div>
			<div className='card w-full overflow-hidden'>
				<Table
					value={documents}
					selectionMode='single'
					onSelectionChange={(e) => navigate((e.value as IDocument).id)}
					paginator
					loading={isLoading}
					onPage={(e) => {
						setPaginate((prev) => ({
							...prev,
							page: e.page || 0,
							rows: e.rows || DEFAULT_ROWS,
							first: e.first || 0,
						}));
					}}
					rowsPerPageOptions={[DEFAULT_ROWS, 20, 50, 100]}
					totalRecords={totalCount}
					lazy
					rows={paginate.rows}
					first={paginate.first}
					paginatorTemplate='CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown JumpToPageInput'
				>
					<Column field='count' header='No.' className='w-max' />
					<Column field='id' header='ID' className='w-max break-keep  overflow-ellipsis' />
					<Column field='title' header='Title' />
					<Column field='documentType' header='Type' />
				</Table>
			</div>
		</div>
	);
};

export default StaffDocumentPage;
