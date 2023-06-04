import Status from '@/components/Status/Status.component';
import Table from '@/components/Table/Table.component';
import { AUTH_ROUTES } from '@/constants/routes';
import { GetRequestsResponse } from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';

const EmpRequestPage = () => {
	const navigate = useNavigate();
	const { data, isLoading } = useQuery(
		'requests',
		async () => await (await axiosClient.get<GetRequestsResponse>('/borrows/employees')).data
	);

	const requests = data?.data.items.map((item, index) => ({ ...item, count: index + 1 })) || [];

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

export default EmpRequestPage;
