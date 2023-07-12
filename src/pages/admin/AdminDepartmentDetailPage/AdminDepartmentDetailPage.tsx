import ErrorTemplate from '@/components/ErrorTemplate/ErrorTemplate.component';
import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import InputWithLabel from '@/components/InputWithLabel/InputWithLabel.component';
import { SkeletonPage } from '@/components/Skeleton';
import { AUTH_ROUTES } from '@/constants/routes';
import { GetDepartmentByIdResponse } from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { AxiosError } from 'axios';
import { Button } from 'primereact/button';
import { useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import useNavigateSelect from '@/hooks/useNavigateSelect';
import { Column } from 'primereact/column';
import Table from '@/components/Table/Table.component';

const AdminDepartmentDetailPage = () => {
	const { departmentId } = useParams<{ departmentId: string }>();
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const { getNavigateOnSelectProps } = useNavigateSelect({ route: 'ROOMS' });

	const {
		data: department,
		isLoading,
		error: axiosError,
	} = useQuery(
		['departments', departmentId],
		async () =>
			(await axiosClient.get<GetDepartmentByIdResponse>(`/departments/${departmentId}`)).data
	);

	if (isLoading) return <SkeletonPage />;

	if ((axiosError as AxiosError)?.response?.status === 404 || !department)
		return (
			<ErrorTemplate code={404} message='Locker not found' url={AUTH_ROUTES.DEPARTMENTS_MANAGE} />
		);

	const { name } = department.data;

	const onDelete = async () => {
		try {
			await axiosClient.delete(`/departments/${departmentId}`);
			queryClient.invalidateQueries('rooms');
			navigate(AUTH_ROUTES.ROOMS);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='flex gap-5 md:flex-row flex-col'>
			<InformationPanel className='flex-1 h-max'>
				<InputWithLabel label='Department name' readOnly value={name} />
			</InformationPanel>
			<div className='flex flex-col gap-5 flex-1'>
				<InformationPanel direction='row'>
					<Button
						label='Delete'
						className='h-11 rounded-lg flex-1 btn-outlined !border-red-500 hover:!bg-red-500'
						type='button'
						outlined
						onClick={onDelete}
					/>
					<Link to={AUTH_ROUTES.DEPARTMENTS_MANAGE} className='flex-1'>
						<Button
							type='button'
							label='Return home'
							className='w-full h-11 rounded-lg btn-outlined'
							outlined
						/>
					</Link>
				</InformationPanel>
				<InformationPanel header='Rooms' className='flex-1'>
					<Table
						value={[]}
						loading={isLoading}
						lazy
						selectionMode='single'
						{...getNavigateOnSelectProps()}
					>
						<Column field='count' header='No.' />
						<Column field='name' header='Name' />
					</Table>
				</InformationPanel>
			</div>
		</div>
	);
};

export default AdminDepartmentDetailPage;
