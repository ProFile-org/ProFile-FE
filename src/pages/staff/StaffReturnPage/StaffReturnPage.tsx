import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import { Button } from 'primereact/button';

const StaffReturnsPage = () => {
	return (
		<div className='flex gap-5 flex-col md:flex-row'>
			<div className='flex flex-col gap-5'>
				<InformationPanel title='Document information'>
					<InputWithLabel label='ID' readOnly value='123' />
					<InputWithLabel label='Types' readOnly value='Word' />
					<InputWithLabel label='Title' readOnly value='This is a word document' />
					<div className='flex gap-5'>
						<InputWithLabel label='Locker' readOnly value='12' />
						<InputWithLabel label='Folder' readOnly value='5' />
					</div>
				</InformationPanel>
				<InformationPanel title='Borrower information'>
					<InputWithLabel label='ID' readOnly value='123' />
					<InputWithLabel label='Name' readOnly value='Chien gamer' />
					<InputWithLabel label='Department' readOnly value='Accounting' />
				</InformationPanel>
			</div>
			<InformationPanel className='flex-1 h-max'>
				<img src='/assets/temp/qr.svg' className='rounded-lg' />
				<Button label='Scan qr' severity='info' className='h-11 rounded-lg' />
				<div className='flex gap-5'>
					<Button label='Approve' className='h-11 rounded-lg flex-1' />
					<Button label='Deny' severity='danger' className='h-11 rounded-lg flex-1' />
				</div>
			</InformationPanel>
		</div>
	);
};

export default StaffReturnsPage;
