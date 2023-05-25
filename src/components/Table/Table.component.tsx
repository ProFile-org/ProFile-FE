import { FC } from 'react';
import { DataTable, DataTableProps } from 'primereact/datatable';
import style from './Table.module.scss';
import clsx from 'clsx';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Table: FC<DataTableProps<any>> = ({
	className,
	children,
	scrollHeight = '70vh',
	scrollable = true,
	resizableColumns = true,
	...rest
}) => {
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
