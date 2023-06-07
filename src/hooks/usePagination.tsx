import { REFETCH_CONFIG } from '@/constants/config';
import { AuthContext } from '@/context/authContext';
import { BaseResponse, GetPaginationResponse } from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { DataTableProps, DataTableStateEvent, DataTableValueArray } from 'primereact/datatable';
import { useState, useContext } from 'react';
import { useQuery } from 'react-query';

interface ILazyTableState {
	first: number;
	rows: number;
	page: number;
	sortField: string;
	sortOrder: 1 | -1;
}

const DEFAULT_ROWS = 10;
const ROWS_PER_PAGE_OPTIONS = [DEFAULT_ROWS, 20, 50, 100];

type UsePaginationProps = {
	key: string | Record<string, string> | string[];
	url: string;
	query?: string;
	lazyConfig?: ILazyTableState;
};

const DEFAULT_LAZY_CONFIG: ILazyTableState = {
	page: 0,
	rows: DEFAULT_ROWS,
	first: 0,
	sortField: 'id',
	sortOrder: 1,
};

const usePagination = <K,>({
	key,
	url,
	query = '',
	lazyConfig = DEFAULT_LAZY_CONFIG,
}: UsePaginationProps) => {
	const { user } = useContext(AuthContext);

	const [paginate, setPaginate] = useState<ILazyTableState>(lazyConfig);

	const { data, isLoading, refetch } = useQuery(
		[key, paginate],
		async () =>
			(
				await axiosClient.get<BaseResponse<{ items: K[] } & GetPaginationResponse>>(url, {
					params: {
						searchTerm: query,
						roomId: user?.department.roomId,
						page: paginate.page + 1, // Primereact datatable page start at 0, our api start at 1
						size: paginate.rows,
						sortBy: paginate?.sortField?.slice(0, 1).toUpperCase() + paginate?.sortField?.slice(1),
						sortOrder: paginate.sortOrder === 1 ? 'asc' : 'desc',
					},
				})
			).data,
		{
			...REFETCH_CONFIG,
		}
	);

	const dataWithCount =
		data?.data.items.map((item, index) => ({ ...item, count: paginate.first + index + 1 })) || [];

	type DataWithCount = typeof dataWithCount & DataTableValueArray;

	const totalCount = data?.data.totalCount || 0;

	const getPaginatedTableProps = (): DataTableProps<DataWithCount> => ({
		value: dataWithCount,
		paginator: true,
		loading: isLoading,
		onPage: (e: DataTableStateEvent) =>
			setPaginate((prev) => ({
				...prev,
				page: e.page || 0,
				rows: e.rows || DEFAULT_ROWS,
				first: e.first || 0,
			})),
		rowsPerPageOptions: ROWS_PER_PAGE_OPTIONS,
		totalRecords: totalCount,
		rows: paginate.rows,
		lazy: true,
		first: paginate.first,
		paginatorTemplate:
			'CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown JumpToPageInput',
		onSort: (e: DataTableStateEvent) =>
			setPaginate((prev) => ({
				...prev,
				sortField: e.sortField,
				sortOrder: e.sortOrder || 1,
			})),
		sortField: paginate.sortField,
		sortOrder: paginate.sortOrder,
	});

	return {
		refetch,
		data,
		paginate,
		setPaginate,
		DEFAULT_ROWS,
		ROWS_PER_PAGE_OPTIONS,
		isLoading,
		dataWithId: dataWithCount,
		totalCount,
		getPaginatedTableProps,
	};
};

export default usePagination;
