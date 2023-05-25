import { IDocument } from './item';

export type GetConfigResponse = {
	succeeded: boolean;
	message: string | null;
};

export type GetPaginationResponse = {
	pageNumber: number;
	totalPages: number;
	totalCount: number;
	hasPreviousPage: boolean;
	hasNextPage: boolean;
};

export type GetDocumentTypesResponse = GetConfigResponse & {
	data: string[];
};

export type GetDepartmentsResponse = GetConfigResponse & {
	data: {
		id: string;
		name: string;
	}[];
};

export type GetEmptyContainersResponse = GetConfigResponse & {
	data: {
		items: {
			id: string;
			name: string;
			description: string;
			numberOfFreeFolders: number;
			numberOfFolders: number;
			folders: {
				id: string;
				name: string;
				description: string;
				slot: number;
				capacity: number;
			}[];
		}[];
	} & GetPaginationResponse;
};

export type GetDocumentsResponse = GetConfigResponse & {
	data: {
		items: IDocument[];
	} & GetPaginationResponse;
};

export type GetDocumentByIdResponse = GetConfigResponse & {
	data: IDocument;
};
