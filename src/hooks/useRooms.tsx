import { DropdownOption } from '@/types/config';
import { GetRoomsResponse } from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { useQuery } from 'react-query';

const useRooms = () => {
	const { data: roomsResult, refetch: roomsRefetch } = useQuery(
		['rooms'],
		async () => (await axiosClient.get<GetRoomsResponse>('/rooms')).data,
		{
			enabled: false,
		}
	);

	const rooms: DropdownOption[] =
		roomsResult?.data.items.map((room) => ({
			name: room.name,
			id: room.id,
		})) || [];

	return {
		rooms,
		roomsRefetch,
	};
};

export default useRooms;
