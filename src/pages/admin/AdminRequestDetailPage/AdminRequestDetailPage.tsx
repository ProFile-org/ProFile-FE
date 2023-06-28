/* eslint-disable no-mixed-spaces-and-tabs */
import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import { SkeletonPage } from '@/components/Skeleton';
import { AUTH_ROUTES } from '@/constants/routes';
import {
	GetDocumentByIdResponse,
	GetRequestByIdResponse,
	GetUserByIdResponse,
} from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { Button } from 'primereact/button';
import { useQuery } from 'react-query';
import { Navigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';

const AdminRequestDetailPage = () => {
	const { requestId } = useParams<{ requestId: string }>();
	const { data } = useQuery(
		['requests', requestId],
		async () =>
			(await axiosClient.get<GetRequestByIdResponse>(`/documents/borrows/${requestId}`)).data,
		{
			enabled: !!requestId,
		}
	);

	const { documentId, borrowerId } = data ? data.data : { documentId: '', borrowerId: '' };

	const { data: document, isLoading } = useQuery(
		[requestId, documentId],
		async () => (await axiosClient.get<GetDocumentByIdResponse>(`/documents/${documentId}`)).data,
		{
			enabled: !!documentId,
		}
	);

	const { data: employee, isLoading: isEmployeeLoading } = useQuery(
		['employee', borrowerId, requestId],
		async () => (await axiosClient.get<GetUserByIdResponse>(`/users/${borrowerId}`)).data,
		{
			enabled: !!requestId && !!borrowerId,
		}
	);

	if (!requestId) return <Navigate to={AUTH_ROUTES.REQUESTS} />;

	if (!data || !document || !employee || isLoading || isEmployeeLoading) return <SkeletonPage />;

	const {
		title,
		documentType,
		folder: {
			name: folder,
			locker: { name: locker },
		},
	} = document.data;

	const { id: employeeId, lastName, firstName } = employee.data;

	const { borrowTime, dueTime, borrowReason, status } = data.data;

	return (
		<div className='flex gap-5 flex-col md:flex-row'>
			<div className='flex flex-col gap-5 flex-1'>
				<InformationPanel header='Document information'>
					<InputWithLabel label='Document ID' value={documentId} readOnly />
					<InputWithLabel label='Types' value={documentType} readOnly />
					<InputWithLabel label='Title' value={title} readOnly />
					<div className='flex gap-5'>
						<InputWithLabel label='Locker' value={locker} readOnly />
						<InputWithLabel label='Folder' value={folder} readOnly />
					</div>
				</InformationPanel>
				<InformationPanel header='Borrower information'>
					<InputWithLabel label='Employee ID' value={employeeId} readOnly />
					<InputWithLabel label='Name' value={`${firstName} ${lastName}`} readOnly />
					<InputWithLabel label='Department' value={'Accounting'} readOnly />
				</InformationPanel>
			</div>
			<div className='flex flex-col gap-5 flex-1'>
				<InformationPanel header='Borrow information' className='h-max'>
					<InputWithLabel label='Status' value={status} readOnly />
					<InputWithLabel label='Borrow date' value={borrowTime} readOnly />
					<InputWithLabel label='Return date' value={dueTime} readOnly />
					<InputWithLabel label='Reasons' value={borrowReason} readOnly />
				</InformationPanel>
				<InformationPanel>
					<div className='flex flex-row gap-4'>
						{/* Add return home outlined */}
						<Link to={AUTH_ROUTES.REQUESTS} className='flex-1 flex-shrink-0'>
							<Button label='Return home' className='h-11 rounded-lg btn-outlined w-max' outlined />
						</Link>
					</div>
				</InformationPanel>
			</div>
		</div>
	);
};

export default AdminRequestDetailPage;
