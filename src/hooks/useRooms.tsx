/* eslint-disable no-mixed-spaces-and-tabs */
import { GetRoomsResponse } from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { useQuery } from 'react-query';

const useRooms = (groupByDepartment = false, departmentId = '') => {
	const { data: roomsResult, refetch: roomsRefetch } = useQuery(
		['rooms'],
		async () =>
			(
				await axiosClient.get<GetRoomsResponse>('/rooms', {
					params: {
						departmentId: departmentId || undefined,
					},
				})
			).data,
		{
			enabled: false,
		}
	);

	const rooms = roomsResult
		? groupByDepartment
			? roomsResult.data.items.reduce(
					(acc, room) => {
						const departmentName = room.department.name;
						const department = acc.find((item) => item.department === departmentName);

						if (!department) {
							acc.push({
								department: departmentName,
								rooms: [{ name: room.name, id: room.id }],
							});
							return acc;
						}

						department.rooms.push({ name: room.name, id: room.id });

						return acc;
					},
					[] as {
						department: string;
						rooms: { name: string; id: string }[];
					}[]
			  )
			: roomsResult.data.items.map((room) => ({
					...room,
					name: room.name,
					id: room.id,
			  }))
		: [];

	return {
		rooms,
		roomsRefetch,
	};
};

export default useRooms;
