import { DropdownOption } from '@/types/config';
import { GetLockersResponse } from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { useQuery } from 'react-query';

const useLockers = () => {
	const { data: lockersResult, refetch: lockersRefetch } = useQuery(
		['lockers'],
		async () => (await axiosClient.get<GetLockersResponse>('/lockers')).data,
		{
			enabled: false,
		}
	);

	const lockers: DropdownOption[] =
		lockersResult?.data.items.map((locker) => ({
			name: locker.name,
			id: locker.id,
		})) || [];

	return {
		lockers,
		lockersRefetch,
	};
};

export default useLockers;
