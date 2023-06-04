import Status from '@/components/Status/Status.component';
import Table from '@/components/Table/Table.component';
import { AUTH_ROUTES } from '@/constants/routes';
import usePagination, { DEFAULT_ROWS, ROWS_PER_PAGE_OPTIONS } from '@/hooks/usePagination';
import { GetRequestsResponse } from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';

const EmpRequestPage = () => {
	const navigate = useNavigate();
	const { paginate, setPaginate } = usePagination();

	const { data, isLoading } = useQuery(
		['requests', paginate],
		async () =>
			await (
				await axiosClient.get<GetRequestsResponse>('/borrows/employees', {
					params: {
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
	);

	const requests = data?.data.items.map((item, index) => ({ ...item, count: index + 1 })) || [];

	const totalCount = data?.data.totalCount || 0;

	return (
		<div className='flex flex-col gap-5'>
			<div className='card w-full py-3 flex justify-between'>
				<form className='flex h-11 gap-3'>
					<InputText className='input' />
					<Button label='Search' className='px-3 rounded-lg' />
				</form>
				<Link to={AUTH_ROUTES.NEW_REQUEST}>
					<Button className='h-11 rounded-lg'>Request +</Button>
				</Link>
			</div>
			<h2 className='header'>Requests</h2>
			<div className='card'>
				<Table
					loading={isLoading}
					value={requests}
					onSelectionChange={(e) =>
						navigate(`${AUTH_ROUTES.REQUESTS}/${(e.value as { id: string }).id}`)
					}
					selectionMode='single'
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
					paginator
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
					<Column field='count' header='No.' />
					<Column field='id' header='Request ID' sortable />
					<Column
						field='status'
						header='Status'
						body={(request) => <Status request={request} />}
						sortable
					/>
					<Column field='borrowTime' header='From' sortable />
					<Column field='dueTime' header='To' sortable />
				</Table>
			</div>
		</div>
	);
};

export default EmpRequestPage;
