import Table from '@/components/Table/Table.component';
import { AUTH_ROUTES } from '@/constants/routes';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom';

const EmpDocumentPage = () => {
	return (
		<div className='flex flex-col gap-5'>
			<div className='card w-full py-3 flex justify-between'>
				<form className='flex h-11 gap-3'>
					<InputText className='input' />
					<Button label='Search' className='px-3 rounded-lg' />
				</form>
				<Link to={AUTH_ROUTES.REQUESTS}>
					<Button className='h-11 rounded-lg'>Request +</Button>
				</Link>
			</div>
			<div className='card w-full overflow-hidden'>
				<Table
					value={[...Array(100)].map((_, index) => ({
						id: index,
						name: `Document ${index}`,
						date: new Date().toLocaleTimeString() + ' - ' + new Date().toLocaleDateString(),
					}))}
				>
					<Column
						field='id'
						header='ID'
						body={(document) => <Link to={`${document.id}`}>{document.id}</Link>}
					/>
					<Column field='name' header='Name' />
					<Column field='date' header='Date' />
				</Table>
			</div>
		</div>
	);
};

export default EmpDocumentPage;
