import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import Progress from '@/components/Progress/Progress.component';
import Table from '@/components/Table/Table.component';
import { AUTH_ROUTES } from '@/constants/routes';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Link, useParams } from 'react-router-dom';

const StaffLockerDetailPage = () => {
	const { lockerId } = useParams<{ lockerId: string }>();
	return (
		<div className='flex flex-col gap-5'>
			<div className='card'>
				<h2 className='title flex gap-2'>
					<span>/</span>
					<span>Locker {lockerId}</span>
				</h2>
			</div>
			<div className='flex gap-5 md:flex-row flex-col'>
				<div className='flex flex-col gap-5 flex-1'>
					<InformationPanel header='Locker information'>
						<InputWithLabel label='ID' wrapperClassName='flex-1' value='123456' readOnly />
						<InputWithLabel
							label='Locker name'
							wrapperClassName='flex-1'
							value='Locker 1'
							readOnly
						/>
						<Progress label='Folder capacity' current={40} max={60} showPercentage />
						<Progress label='Ducment capacity' current={200} max={600} showPercentage />
					</InformationPanel>
					<InformationPanel direction='row'>
						<Button label='Edit' className='h-11 rounded-lg flex-1' />
						<Button label='Delete' className='h-11 rounded-lg flex-1' severity='danger' />
					</InformationPanel>
					<InformationPanel header='History'>
						<Table>
							<Column field='id' header='ID' />
							<Column field='name' header='Name' />
						</Table>
					</InformationPanel>
				</div>
				<div className='flex flex-col gap-5 flex-1'>
					<InformationPanel>
						<Link to={AUTH_ROUTES.LOCKERS}>
							<Button
								label='Return home'
								className='w-full h-11 rounded-lg btn-outlined'
								outlined
							/>
						</Link>
					</InformationPanel>
					<InformationPanel header='Folders' className='flex-1'>
						<Table>
							<Column field='id' header='ID' />
							<Column field='name' header='Name' />
						</Table>
					</InformationPanel>
				</div>
			</div>
		</div>
	);
};

export default StaffLockerDetailPage;
