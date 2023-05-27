import { DropdownOption } from '@/types/config';
import { GetDocumentTypesResponse } from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { useQuery } from 'react-query';

const useDocumentTypes = () => {
	const { data: documentTypesResult, refetch: typesRefetch } = useQuery(
		['documentTypes'],
		async () => (await axiosClient.get<GetDocumentTypesResponse>('/documents/types')).data,
		{
			enabled: false,
		}
	);

	const documentTypes: DropdownOption[] =
		documentTypesResult?.data.map((type) => ({
			name: type,
			id: type,
		})) || [];

	return { documentTypes, typesRefetch };
};

export default useDocumentTypes;
