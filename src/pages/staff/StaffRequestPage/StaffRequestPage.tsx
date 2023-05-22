import Table from '@/components/Table/Table.component';
import { Column } from 'primereact/column';
import { Link } from 'react-router-dom';

const StaffRequestPage = () => {
	return (
		<div className='flex flex-col gap-5'>
			<h2 className='header'>Pending requests</h2>
			<div className='card'>
				<Table
					value={[...Array(10)].map((_, i) => ({
						id: i,
						name: 'John Doe',
						documentId: '123456789',
						documentTitle: 'Document Title',
						documentType: 'Document Type',
					}))}
				>
					<Column
						field='id'
						header='ID'
						body={(request) => <Link to={`${request.id}`}>{request.id}</Link>}
					/>
					<Column field='name' header='Name' />
					<Column field='documentId' header='Document ID' />
					<Column field='documentTitle' header='Title' />
					<Column field='documentType' header='Type' />
				</Table>
			</div>
		</div>
	);
};

export default StaffRequestPage;
