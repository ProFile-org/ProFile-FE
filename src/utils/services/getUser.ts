import { GetUserByIdResponse } from '@/types/response';
import axiosClient from '../axiosClient';

let timeout: NodeJS.Timeout;

export const getUser = async (id: string, debounceTime = 500) => {
	if (!id) return null;
	if (timeout) clearTimeout(timeout);
	return new Promise((resolve) => {
		timeout = setTimeout(async () => {
			try {
				const user = (await axiosClient.get<GetUserByIdResponse>(`/users/${id}`)).data;
				resolve(user);
			} catch (error) {
				resolve(null);
			}
		}, debounceTime);
	});
};
