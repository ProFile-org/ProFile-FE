import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import TextareaWithLabel from '@/components/InputWithLabel/TextareaWithLabel.component';
import { AUTH_ROUTES } from '@/constants/routes';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';

const EmpRequestDetailPage = () => {
	return (
		<div className='flex gap-5'>
			<div className='flex flex-col gap-5'>
				<InformationPanel header='Document information'>
					<InputWithLabel label='Title' value='Fake title here' readOnly />
					<InputWithLabel label='Document type' value='Document type' readOnly />
					<div className='flex gap-5'>
						<InputWithLabel label='Locker' value='Locker' readOnly />
						<InputWithLabel label='Folder' value='Folder' readOnly />
					</div>
				</InformationPanel>
				<InformationPanel header='Borrow information'>
					<InputWithLabel label='Status' value='Pending' readOnly />
					<TextareaWithLabel label='Reason' value='Reason' readOnly />
					<div className='flex gap-5'>
						<InputWithLabel label='Borrow date' value='2021-09-01' readOnly />
						<InputWithLabel label='Return date' value='2021-09-01' readOnly />
					</div>
				</InformationPanel>
			</div>
			<div className='flex flex-col gap-5 flex-1'>
				<InformationPanel className=''>
					<img src='/assets/temp/qr.svg' alt='' className='rounded-lg' />
					<Link to={AUTH_ROUTES.REQUESTS}>
						<Button label='Return home' className='w-full h-11 rounded-lg btn-outlined' outlined />
					</Link>
				</InformationPanel>
			</div>
		</div>
	);
};

export default EmpRequestDetailPage;
