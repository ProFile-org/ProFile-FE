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
	roomId: string;
}

export interface IDocument {
	id: string;
	title: string;
	description: string;
	documentType: string;
	department: IDepartment;
	importer: IUser;
	folder: IFolder;
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
}
