import { FolderOption, LockerOption } from '@/types/config';
import { GetEmptyContainersResponse } from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { useQuery } from 'react-query';
import { useMemo } from 'react';

interface IUserEmptyContainers {
	roomId: string;
	page?: number;
	size?: number;
}

const useEmptyContainers = ({ roomId, page = 1, size = 20 }: IUserEmptyContainers) => {
	const { data: emptyContainers, refetch: containerRefetch } = useQuery(
		'imports',
		async () =>
			(
				await axiosClient.post<GetEmptyContainersResponse>(
					`/rooms/${roomId}/empty-containers?page=${page}&size=${size}`
				)
			).data,
		{
			enabled: false,
		}
	);

	const availableLockers: LockerOption[] | undefined = useMemo(
		() =>
			emptyContainers?.data.items.map((locker) => ({
				name: locker.name,
				id: locker.id,
				free: locker.numberOfFreeFolders,
				max: locker.numberOfFolders,
				description: locker.description,
			})),
		[emptyContainers?.data.items]
	);
	// [{name: 'Locker 1', id: '1', max: 60, current: 40}

	const availableFolders: { [key: string]: FolderOption[] } | undefined = useMemo(
		() =>
			emptyContainers?.data.items.reduce((acc, locker) => {
				const folders = locker.folders.map((folder) => ({
					name: folder.name,
					id: folder.id,
					free: folder.slot,
					max: folder.capacity,
					description: folder.description,
				}));
				return { ...acc, [locker.id]: folders };
			}, {} as { [key: string]: FolderOption[] }),
		[emptyContainers?.data.items]
	);
	// [{name: 'Folder 1', id: '1', max: 60, current: 40}
	return { availableLockers, availableFolders, containerRefetch };
};

export default useEmptyContainers;
