import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import { AUTH_ROUTES } from '@/constants/routes';
import { GetDocumentByIdResponse } from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode';
import StaffDocumentDetailSkeleton from './StaffDocumentDetailSkeleton';
import TextareaWithLabel from '@/components/InputWithLabel/TextareaWithLabel.component';
import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.component';

const StaffDocumentDetailPage = () => {
	const { documentId = '' } = useParams<{ documentId: string }>();
	const [qr, setQr] = useState('');

	const { data, isLoading } = useQuery(
		documentId,
		async () => (await axiosClient.get<GetDocumentByIdResponse>(`/documents/${documentId}`)).data,
		{
			onSuccess: async (data) => {
				const { id } = data?.data || { id: '' };
				if (!id) return;
				const qrCode = await QRCode.toDataURL(id);
				setQr(qrCode);
			},
		}
	);

	if (isLoading || !data) return <StaffDocumentDetailSkeleton />;

	const {
		title,
		documentType,
		folder: {
			id: folderId,
			name: folderName,
			locker: {
				id: lockerId,
				name: lockerName,
				// room: { id: roomId, name: roomName },
			},
		},
		// department: { name: department },
		description,
		importer: { firstName, lastName, id: importerId },
	} = data.data;

	// const title = 'title';
	// const documentType = 'documentType';
	// const folderId = 'folderId';
	// const folderName = 'folderName';
	// const lockerId = 'lockerId';
	// const lockerName = 'lockerName';
	// const description = 'description';
	// const firstName = 'firstName';
	// const lastName = 'lastName';
	// const importerId = 'importerId';

	return (
		<div className='flex flex-col gap-5'>
			<div className='card py-3'>
				<h2 className='title flex gap-2'>
					<span>/</span>
					<Link to={`${AUTH_ROUTES.LOCKERS}/${lockerId}`} className='link-underlined'>
						{lockerName}
					</Link>
					<span>/</span>
					<Link to={`${AUTH_ROUTES.FOLDERS}/${folderId}`} className='link-underlined'>
						{folderName}
					</Link>
					<span>/</span>
					<span>{title}</span>
				</h2>
			</div>
			<div className='flex gap-5 md:flex-row flex-col'>
				<div className='flex flex-col gap-5 flex-1'>
					<InformationPanel header='Employee information'>
						<div className='flex gap-3'>
							<InputWithLabel label='ID' wrapperClassName='flex-1' readOnly value={importerId} />
							<Button
								label='Detail'
								className='self-end bg-primary rounded-lg h-11'
								type='button'
							/>
						</div>
						<InputWithLabel
							label='Name'
							wrapperClassName='flex-1'
							value={`${firstName} ${lastName}`}
							readOnly
						/>
						<InputWithLabel
							label='Department'
							wrapperClassName='flex-1'
							// value={department || 'this should be department'}
							value='this should be department'
							readOnly
						/>
					</InformationPanel>
					<InformationPanel header='Document information'>
						<InputWithLabel label='ID' wrapperClassName='flex-1' value={documentId} readOnly />
						<InputWithLabel label='Types' value={documentType} readOnly />
						<InputWithLabel label='Title' wrapperClassName='flex-1' value={title} readOnly />
						{description && (
							<TextareaWithLabel
								label='Description'
								wrapperClassName='flex-1'
								value={description}
								readOnly
							/>
						)}
						<div className='flex gap-5'>
							<InputWithLabel
								label='Locker'
								readOnly
								value={lockerName}
								wrapperClassName='flex-1'
							/>
							<InputWithLabel
								label='Folder'
								readOnly
								value={folderName}
								wrapperClassName='flex-1'
							/>
						</div>
					</InformationPanel>
				</div>
				<div className='flex flex-col gap-5 flex-1'>
					<InformationPanel direction='row' className='h-max'>
						{qr ? (
							<img src={qr} className='rounded-lg w-48 aspect-square' />
						) : (
							<div className='w-48 aspect-square bg-neutral-600 animate-pulse rounded-lg' />
						)}
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
					<InformationPanel header='Digital copies' className='h-max'>
						<ImagePreviewer
							readOnly
							images={[
								'https://picsum.photos/200/300',
								'https://picsum.photos/200/301',
								'https://picsum.photos/200/302',
							]}
						/>
					</InformationPanel>
					<InformationPanel header='History' className='flex-1'></InformationPanel>
				</div>
			</div>
		</div>
	);
};

export default StaffDocumentDetailPage;
