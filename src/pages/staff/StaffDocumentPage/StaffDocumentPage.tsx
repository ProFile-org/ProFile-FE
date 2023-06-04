import Table from '@/components/Table/Table.component';
import { AUTH_ROUTES } from '@/constants/routes';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { IDocument } from '@/types/item';
import { GetDocumentsResponse } from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { useQuery } from 'react-query';
import { AuthContext } from '@/context/authContext';
import usePagination, { DEFAULT_ROWS, ROWS_PER_PAGE_OPTIONS } from '@/hooks/usePagination';

const StaffDocumentPage = () => {
	const navigate = useNavigate();
	const { paginate, setPaginate } = usePagination();
	const { user } = useContext(AuthContext);

	const { data, isLoading } = useQuery(
		['documents', paginate],
		async () =>
			(
				await axiosClient.get<GetDocumentsResponse>('/documents', {
					params: {
						roomId: user?.department.roomId,
						page: paginate.page + 1, // Primereact datatable page start at 0, our api start at 1
						size: paginate.rows,
						sortBy: paginate?.sortField?.slice(0, 1).toUpperCase() + paginate?.sortField?.slice(1),
						sortOrder: paginate.sortOrder === 1 ? 'asc' : 'desc',
					},
				})
			).data,
		{
			refetchOnReconnect: true,
			refetchOnWindowFocus: true,
			refetchOnMount: true,
			retry: true,
			retryOnMount: true,
		}

		// {
		// 	keepPreviousData: true, // Reduce fetching on already fetched data
		// }
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
					rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
					totalRecords={totalCount}
					// totalRecords={documents.length}
					lazy
					rows={paginate.rows}
					first={paginate.first}
					paginatorTemplate='CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown JumpToPageInput'
					sortMode='single'
					onSort={(e) => {
						setPaginate((prev) => ({
							...prev,
							sortField: e.sortField,
							sortOrder: e.sortOrder || 1,
						}));
					}}
					sortField={paginate.sortField}
					sortOrder={paginate.sortOrder}
				>
					<Column field='count' header='No.' className='w-max' />
					<Column
						field='id'
						header='ID'
						className='break-keep  overflow-ellipsis max-w-[5rem]'
						sortable
					/>
					<Column field='title' header='Title' sortable />
					<Column field='documentType' header='Type' sortable />
					<Column field='folder.name' header='Folder' sortable />
					<Column field='folder.locker.name' header='Locker' sortable />
					<Column field='department.name' header='Department' />
				</Table>
			</div>
		</div>
	);
};

export default StaffDocumentPage;
