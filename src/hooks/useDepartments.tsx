import { DropdownOption } from '@/types/config';
import { GetDepartmentsResponse } from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { useQuery } from 'react-query';

const useDepartments = () => {
	const { data: departmentsResult, refetch: departmentsRefetch } = useQuery(
		['departments'],
		async () => (await axiosClient.get<GetDepartmentsResponse>('/departments')).data,
		{
			enabled: false,
		}
	);

	const departments: DropdownOption[] =
		departmentsResult?.data.map((department) => ({
			name: department.name,
			id: department.id,
		})) || [];

	return {
		departments,
		departmentsRefetch,
	};
};

export default useDepartments;
