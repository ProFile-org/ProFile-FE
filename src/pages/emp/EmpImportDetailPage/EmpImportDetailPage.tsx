import ErrorTemplate from '@/components/ErrorTemplate/ErrorTemplate.component';
import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import TextareaWithLabel from '@/components/InputWithLabel/TextareaWithLabel.component';
import { SkeletonPage } from '@/components/Skeleton';
import Status from '@/components/Status/Status.component';
import { AUTH_ROUTES } from '@/constants/routes';
import { GetImportByIdResponse } from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { AxiosError } from 'axios';
import { Button } from 'primereact/button';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';

const ImportDetailPagePage = () => {
	const { importId } = useParams<{ importId: string }>();

	const {
		data: importRequest,
		isLoading,
		error: axiosError,
	} = useQuery(
		['import', importId],
		async () =>
			(await axiosClient.get<GetImportByIdResponse>(`/documents/import-requests/${importId}`)).data,
		{
			enabled: !!importId,
		}
	);

	if (isLoading) return <SkeletonPage />;

	if ((axiosError as AxiosError)?.response?.status === 404 || !importRequest)
		return <ErrorTemplate code={404} message='Folder not found' url={AUTH_ROUTES.IMPORT} />;

	const {
		document: { title, documentType, description, isPrivate },
		importReason,
		staffReason,
		status: importStatus,
		room: { name },
	} = importRequest.data;

	return (
		<div className='flex gap-5 flex-col lg:flex-row'>
			<InformationPanel header='Document information' className='flex-1 h-max'>
				<InputWithLabel
					label='Title'
					value={title}
					sideComponent={<Status type='document' item={importRequest.data.document} />}
				/>
				<InputWithLabel label='Document type' value={documentType} />
				<InputWithLabel label='Is private' value={isPrivate ? 'Private' : 'Public'} />
				<TextareaWithLabel label='Description' value={description} />
			</InformationPanel>
			<div className='flex flex-col gap-5 flex-1'>
				<InformationPanel header='Import information' className='h-max'>
					<InputWithLabel label='Status' value={importStatus} />
					<InputWithLabel label='Room' value={name} />
					<TextareaWithLabel label='Import reason' value={importReason} />
					<TextareaWithLabel label='Staff reason' value={staffReason} />
				</InformationPanel>
				<InformationPanel>
					<Button label='Print QR' className='h-11 w-full' />
				</InformationPanel>
			</div>
		</div>
	);
};

export default ImportDetailPagePage;
