import { DOCUMENT_STATUS_KEY, REQUEST_STATUS_KEY } from '@/constants/status';

export interface IItem {
	label: string;
	type?: 'item' | 'group';
	items?: IItem[];
	path?: string;
	icon?: string;
}

export interface IDepartment {
	id: string;
	name: string;
}

export interface IDocument {
	id: string;
	title: string;
	description: string;
	documentType: string;
	department: IDepartment;
	importer: IUser;
	folder: IFolder;
	status: DOCUMENT_STATUS_KEY;
	isPrivate: boolean;
}

export interface IRoom {
	id: string;
	name: string;
	description: string;
	staffId: string;
	department: IDepartment;
	capacity: number;
	numberOfLockers: number;
	isAvailable: boolean;
}

export interface ILocker {
	id: string;
	name: string;
	description: string;
	room: IRoom;
	capacity: number;
	numberOfFolders: number;
	isAvailable: boolean;
}

export interface IFolder {
	id: string;
	name: string;
	description: string;
	locker: ILocker;
	capacity: number;
	numberOfDocuments: number;
	isAvailable: boolean;
}

export interface IUser {
	id: string;
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	department: IDepartment;
	role: string;
	position: string;
	isActive: boolean;
	isActivated: boolean;
	created: string;
	createdBy: string;
	lastModified: string;
	lastModifiedBy: string;
	roomId?: string;
}

export interface IStaff {
	user: IUser;
	room: IRoom;
	id: string;
}

export interface IBorrowRequest {
	id: string;
	borrowerId: string;
	documentId: string;
	borrowTime: string;
	dueTime: string;
	actualReturnTime: string;
	borrowReason: string;
	staffReason: string;
	status: REQUEST_STATUS_KEY;
}

export interface IImportRequest {
	room: IRoom;
	document: IDocument;
	importReason: string;
	staffReason: string;
	status: string;
	id: string;
}
