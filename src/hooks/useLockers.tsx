/* eslint-disable no-mixed-spaces-and-tabs */
import { GetLockersResponse } from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { useQuery } from 'react-query';

const useLockers = (groupByRoom = false) => {
	const { data: lockersResult, refetch: lockersRefetch } = useQuery(
		['lockers'],
		async () => (await axiosClient.get<GetLockersResponse>('/lockers')).data,
		{
			enabled: false,
		}
	);

	const lockers = lockersResult
		? groupByRoom
			? lockersResult.data.items.reduce(
					(acc, locker) => {
						const roomName = locker.room.name;
						const room = acc.find((item) => item.room === roomName);

						if (!room) {
							acc.push({
								room: roomName,
								lockers: [{ name: locker.name, id: locker.id }],
							});
							return acc;
						}

						room.lockers.push({ name: locker.name, id: locker.id });

						return acc;
					},
					[] as {
						room: string;
						lockers: { name: string; id: string }[];
					}[]
			  )
			: lockersResult.data.items.map((locker) => ({
					name: locker.name,
					id: locker.id,
			  }))
		: [];

	return {
		lockers,
		lockersRefetch,
	};
};

export default useLockers;
