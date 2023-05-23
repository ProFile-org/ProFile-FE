import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import { AUTH_ROUTES } from '@/constants/routes';
import { Button } from 'primereact/button';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

const StaffDocumentDetailPage = () => {
	const { documentId } = useParams();
	return (
		<div className='flex flex-col gap-5'>
			<div className='card'>
				<h2 className='title flex gap-2'>
					<span>/</span>
					<Link to={`${AUTH_ROUTES.LOCKERS}/12`} className='link-underlined'>
						Locker 12
					</Link>
					<span>/</span>
					<Link to={`${AUTH_ROUTES.FOLDERS}/5`} className='link-underlined'>
						Folder 5
					</Link>
					<span>/</span>
					<span>Document {documentId}</span>
				</h2>
			</div>
			<div className='flex gap-5 md:flex-row flex-col'>
				<div className='flex flex-col gap-5 flex-1'>
					<InformationPanel header='Employee information'>
						<div className='flex gap-3'>
							<InputWithLabel label='ID' wrapperClassName='flex-1' value='123456' readOnly />
							<Button
								label='Detail'
								className='self-end bg-primary rounded-lg h-11'
								type='button'
							/>
						</div>
						<InputWithLabel label='Name' wrapperClassName='flex-1' value='Nguyen van a' readOnly />
						<InputWithLabel
							label='Department'
							wrapperClassName='flex-1'
							value='Department A'
							readOnly
						/>
					</InformationPanel>
					<InformationPanel header='Document information'>
						<InputWithLabel label='ID' wrapperClassName='flex-1' value={documentId} readOnly />
						<InputWithLabel label='Types' value='Temp' readOnly />
						<InputWithLabel label='Title' wrapperClassName='flex-1' value='title' readOnly />
						<div className='flex gap-5'>
							<InputWithLabel label='Locker' readOnly value='12' wrapperClassName='flex-1' />
							<InputWithLabel label='Folder' readOnly value='5' wrapperClassName='flex-1' />
						</div>
					</InformationPanel>
				</div>
				<div className='flex flex-col gap-5'>
					<InformationPanel direction='row'>
						<img src='/assets/temp/qr.svg' className='rounded-lg' />
						<div className='flex flex-col justify-between flex-1'>
							<Button label='Print QR' className='h-11 rounded-lg' severity='info' />
							<Button label='Edit' className='h-11 rounded-lg' />
							<Link to={AUTH_ROUTES.DOCUMENTS} className='w-full'>
								<Button
									label='Return home'
									className='w-full h-11 rounded-lg btn-outlined'
									outlined
								/>
							</Link>
						</div>
					</InformationPanel>
					<InformationPanel header='History' className='flex-1'></InformationPanel>
				</div>
			</div>
		</div>
	);
};

export default StaffDocumentDetailPage;
