import { useState } from 'react';

interface ILazyTableState {
	first: number;
	rows: number;
	page: number;
	sortField: string;
	sortOrder: 1 | -1;
}

export const DEFAULT_ROWS = 10;
export const ROWS_PER_PAGE_OPTIONS = [DEFAULT_ROWS, 20, 50, 100];

const usePagination = () => {
	const [paginate, setPaginate] = useState<ILazyTableState>({
		page: 0,
		rows: DEFAULT_ROWS,
		first: 0,
		sortField: 'id',
		sortOrder: 1,
	});
	return { paginate, setPaginate };
};

export default usePagination;
