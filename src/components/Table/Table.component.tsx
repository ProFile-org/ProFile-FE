import { DataTable, DataTableProps, DataTableValueArray } from 'primereact/datatable';
import style from './Table.module.scss';
import clsx from 'clsx';

const Table = <T extends DataTableValueArray>({
	className,
	children,
	scrollHeight = '80vh',
	scrollable = true,
	resizableColumns = true,
	...rest
}: DataTableProps<T>) => {
	return (
		<DataTable
			className={clsx(style['table'], className)}
			{...rest}
			scrollable={scrollable}
			scrollHeight={scrollHeight}
			resizableColumns={resizableColumns}
		>
			{children}
		</DataTable>
	);
};

export default Table;
