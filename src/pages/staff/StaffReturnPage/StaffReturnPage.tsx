import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import QrScanner from '@/components/QrScanner/QrScanner.component';
import { Button } from 'primereact/button';
import { useState } from 'react';

const StaffReturnsPage = () => {
	const [openScan, setOpenScan] = useState(false);
	return (
		<div className='flex gap-5 flex-col md:flex-row'>
			<div className='flex flex-col gap-5 flex-1'>
				<InformationPanel title='Document information'>
					<InputWithLabel label='ID' readOnly value='123' />
					<InputWithLabel label='Types' readOnly value='Word' />
					<InputWithLabel label='Title' readOnly value='This is a word document' />
					<div className='flex gap-5'>
						<InputWithLabel label='Locker' wrapperClassName='flex-1' readOnly value='12' />
						<InputWithLabel label='Folder' wrapperClassName='flex-1' readOnly value='5' />
					</div>
				</InformationPanel>
				<InformationPanel title='Borrower information'>
					<InputWithLabel label='ID' readOnly value='123' />
					<InputWithLabel label='Name' readOnly value='Chien gamer' />
					<InputWithLabel label='Department' readOnly value='Accounting' />
				</InformationPanel>
			</div>
			<InformationPanel className='flex-1 h-max'>
				{openScan ? (
					<QrScanner />
				) : (
					<div className='w-full aspect-square rounded-lg bg-neutral-700 flex items-center justify-center text-xl font-semibold'>
						Hit scan to open scanner
					</div>
				)}
				<Button
					label={openScan ? 'Close scan' : 'Scan'}
					severity='info'
					className='h-11 rounded-lg'
					onClick={() => setOpenScan((prev) => !prev)}
				/>
				<div className='flex gap-5'>
					<Button label='Approve' className='h-11 rounded-lg flex-1' />
					<Button label='Deny' severity='danger' className='h-11 rounded-lg flex-1' />
				</div>
			</InformationPanel>
		</div>
	);
};

export default StaffReturnsPage;
