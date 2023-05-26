export interface IItem {
	label: string;
	type?: 'item' | 'group';
	items?: IItem[];
	path?: string;
	icon?: string;
}

export interface IImporter {
	id: string;
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	role: string;
	created: string;
}

export interface IDocument {
	id: string;
	title: string;
	description: string;
	documentType: string;
	department: {
		id: string;
		name: string;
	};
	importer: IImporter;
	folder: {
		id: string;
		name: string;
		locker: {
			id: string;
			name: string;
			room: {
				id: string;
				name: string;
			};
		};
	};
}

export interface IUser {
	id: string;
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	role: string;
	position: string;
	department?: {
		id: string;
		name: string;
	};
	roomId?: string;
}
