import { IBorrowRequest, IDepartment, IDocument, IFolder, ILocker, IRoom, IUser } from './item';

export type BaseResponse<T = null> = {
	data: T;
	succeeded: boolean;
	message: string | null;
};

export type PaginationResponse = {
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
	} & PaginationResponse
>;

export type GetDocumentsResponse = BaseResponse<{ items: IDocument[] } & PaginationResponse>;

export type GetDocumentByIdResponse = BaseResponse<IDocument>;

export type LoginResponse = BaseResponse<IUser>;

export type PostRequestResponse = BaseResponse<IBorrowRequest>;

export type GetRequestsResponse = BaseResponse<
	{
		items: IBorrowRequest[];
	} & PaginationResponse
>;

export type GetRequestByIdResponse = BaseResponse<IBorrowRequest>;

export type GetUserByIdResponse = BaseResponse<IUser>;

export type GetLockersResponse = BaseResponse<{ items: ILocker[] } & PaginationResponse>;

export type GetLockerByIdResponse = BaseResponse<ILocker>;

export type GetFoldersResponse = BaseResponse<{ items: IFolder[] } & PaginationResponse>;

export type GetFolderByIdResponse = BaseResponse<IFolder>;

export type GetRoomsResponse = BaseResponse<{ items: IRoom[] } & PaginationResponse>;

export type GetRoomByIdResponse = BaseResponse<IRoom>;
