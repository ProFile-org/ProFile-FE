import Table from '@/components/Table/Table.component';
import { AUTH_ROUTES } from '@/constants/routes';
import clsx from 'clsx';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Link, useNavigate } from 'react-router-dom';

const EmpRequestPage = () => {
	const navigate = useNavigate();
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
					value={[...Array(10)].map((_, i) => ({
						id: i,
						name: 'John Doe',
						documentId: '123456789',
						documentTitle: 'Document Title',
						documentType: 'Document Type',
						status: Math.random() > 0.7 ? 'Pending' : Math.random() < 0.3 ? 'Approved' : 'Rejected',
					}))}
					onSelectionChange={(e) =>
						navigate(`${AUTH_ROUTES.REQUESTS}/${(e.value as { id: string }).id}`)
					}
					selectionMode='single'
				>
					<Column field='id' header='ID' />
					<Column field='name' header='Name' />
					{/* <Column field='documentId' header='Request ID' /> */}
					<Column field='documentTitle' header='Title' />
					<Column field='documentType' header='Type' />
					<Column
						field='status'
						header='Status'
						body={(request) => (
							<span
								className={clsx(
									'px-2 py-1 rounded-lg text-white text-center',
									request.status === 'Pending' && 'bg-yellow-500',
									request.status === 'Approved' && 'bg-green-500',
									request.status === 'Rejected' && 'bg-red-500'
								)}
							>
								{request.status}
							</span>
						)}
					/>
				</Table>
			</div>
		</div>
	);
};

export default EmpRequestPage;
