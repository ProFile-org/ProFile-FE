import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import { AUTH_ROUTES } from '@/constants/routes';
import { Button } from 'primereact/button';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

const StaffRequestDetailPage = () => {
	const { requestId } = useParams<{ requestId: string }>();
	return (
		<div className='flex gap-5 flex-col md:flex-row'>
			<div className='flex flex-col gap-5 flex-1'>
				<InformationPanel title='Document information'>
					<InputWithLabel label='ID' value={requestId} readOnly />
					<InputWithLabel label='Types' value='Word' readOnly />
					<InputWithLabel label='Title' value='This is a word document' readOnly />
					<div className='flex gap-5'>
						<InputWithLabel label='Locker' value='12' readOnly />
						<InputWithLabel label='Folder' value='5' readOnly />
					</div>
				</InformationPanel>
				<InformationPanel title='Borrower information'>
					<InputWithLabel label='ID' value='123' readOnly />
					<InputWithLabel label='Name' value='Chien gamer' readOnly />
					<InputWithLabel label='Department' value='Accounting' readOnly />
				</InformationPanel>
			</div>
			<div className='flex flex-col gap-5 flex-1'>
				<InformationPanel title='Borrow information' className='h-max'>
					<InputWithLabel label='Borrow date' value='12/12/2021' readOnly />
					<InputWithLabel label='Return date' value='12/12/2021' readOnly />
					<InputWithLabel label='Reasons' value='These are reasons for borrowing' readOnly />
				</InformationPanel>
				<InformationPanel direction='row'>
					<Button label='Approve' className='h-11 rounded-lg flex-1' />
					<Button label='Deny' severity='danger' className='h-11 rounded-lg flex-1' />
					{/* Add return home outlined */}
					<Link to={AUTH_ROUTES.REQUESTS}>
						<Button
							label='Return home'
							className='h-11 rounded-lg flex-1 btn-outlined w-max'
							outlined
						/>
					</Link>
				</InformationPanel>
			</div>
		</div>
	);
};

export default StaffRequestDetailPage;
