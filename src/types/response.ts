import { IDepartment, IDocument, IUser } from './item';

export type BaseResponse<T = null> = {
	data: T;
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

export type GetDocumentTypesResponse = BaseResponse<string[]>;

export type GetDepartmentsResponse = BaseResponse<IDepartment[]>;

export type GetEmptyContainersResponse = BaseResponse<
	{
		items: {
			id: string;
			name: string;
			description: string;
			capacity: number;
			numberOfFolders: number;
			numberOfFreeFolders: number;
			folders: {
				id: string;
				name: string;
				description: string;
				capacity: number;
				slot: number;
			}[];
		}[];
	} & GetPaginationResponse
>;

export type GetDocumentsResponse = BaseResponse<{ items: IDocument[] } & GetPaginationResponse>;

export type GetDocumentByIdResponse = BaseResponse<IDocument>;

export type LoginResponse = BaseResponse<IUser>;
