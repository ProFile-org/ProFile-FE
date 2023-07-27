import Overlay from '@/components/Overlay/Overlay.component';
import QrScanner from '@/components/QrScanner/QrScanner.component';
import Status from '@/components/Status/Status.component';
import Table from '@/components/Table/Table.component';
import { AUTH_ROUTES } from '@/constants/routes';
import { AuthContext } from '@/context/authContext';
import useNavigateSelect from '@/hooks/useNavigateSelect';
import usePagination from '@/hooks/usePagination';
import { IBorrowRequest } from '@/types/item';
import { dateFormatter } from '@/utils/formatter';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { useContext, useRef, useState } from 'react';
import { OnResultFunction } from 'react-qr-reader';
import { useNavigate } from 'react-router';

const StaffRequestPage = () => {
	const { user } = useContext(AuthContext);
	const query = useRef('');
	const [openScan, setOpenScan] = useState(false);
	const navigate = useNavigate();

	const { getPaginatedTableProps, refetch } = usePagination<IBorrowRequest>({
		key: 'requests',
		url: `/documents/borrows?roomId=${user?.roomId}`,
		query: query.current,
	});

	const { getNavigateOnSelectProps } = useNavigateSelect({ route: 'REQUESTS' });

	const onScan: OnResultFunction = (value) => {
		try {
			const id = value?.getText();
			if (!id) return;
			navigate(`${AUTH_ROUTES.REQUESTS}/${id}?mode=checkout`);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<div className='flex flex-col gap-5'>
				<h2 className='header'>Pending requests</h2>
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
					<Button label='Scan' className='px-3 h-11 rounded-lg' onClick={() => setOpenScan(true)} />
				</div>
				<div className='card'>
					<Table sortMode='single' {...getNavigateOnSelectProps()} {...getPaginatedTableProps()}>
						<Column field='count' header='No.' />
						<Column
							field='id'
							header='ID'
							sortable
							className='break-keep overflow-ellipsis max-w-[5rem]'
						/>
						<Column
							field='status'
							header='Status'
							body={(request) => <Status type='request' item={request} />}
							sortable
						/>
						<Column
							field='borrowTime'
							body={(request) =>
								dateFormatter(new Date(request.borrowTime), undefined, {
									dateStyle: 'full',
								})
							}
							header='From'
							sortable
						/>
						<Column
							field='dueTime'
							body={(request) =>
								dateFormatter(new Date(request.dueTime), undefined, {
									dateStyle: 'full',
								})
							}
							header='To'
							sortable
						/>
					</Table>
				</div>
			</div>
			{openScan && (
				<Overlay
					onExit={() => setOpenScan(false)}
					className='flex items-center justify-center z-[1000]'
				>
					<div className='card w-[70vw] min-w-[250px] sm:w-[50vh]'>
						<QrScanner onResult={onScan} />
						<Button
							label='Exit'
							className='h-11 rounded-lg w-full mt-5'
							onClick={() => setOpenScan(false)}
						/>
					</div>
				</Overlay>
			)}
		</>
	);
};

export default StaffRequestPage;
