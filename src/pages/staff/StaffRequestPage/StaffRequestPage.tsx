import Status from '@/components/Status/Status.component';
import Table from '@/components/Table/Table.component';
import { AUTH_ROUTES } from '@/constants/routes';
import { GetRequestsResponse } from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { Column } from 'primereact/column';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

const StaffRequestPage = () => {
	const navigate = useNavigate();
	const { data, isLoading } = useQuery(
		'requests',
		async () => (await axiosClient.get<GetRequestsResponse>('/borrows/staffs')).data
	);

	const requests = data?.data.items.map((item, index) => ({ ...item, count: index + 1 })) || [];

	return (
		<div className='flex flex-col gap-5'>
			<h2 className='header'>Pending requests</h2>
			<div className='card'>
				<Table
					loading={isLoading}
					value={requests}
					onSelectionChange={(e) =>
						navigate(`${AUTH_ROUTES.REQUESTS}/${(e.value as { id: string }).id}`)
					}
					selectionMode='single'
				>
					<Column field='count' header='No.' />
					<Column field='id' header='Request ID' />
					<Column field='status' header='Status' body={(request) => <Status request={request} />} />
					<Column field='borrowTime' header='From' />
					<Column field='dueTime' header='To' />
				</Table>
			</div>
		</div>
	);
};

export default StaffRequestPage;
