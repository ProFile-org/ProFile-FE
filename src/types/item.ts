export interface IItem {
	label: string;
	type?: 'item' | 'group';
	items?: IItem[];
	path?: string;
	icon?: string;
}

export interface IDocument {
	id: string;
	title: string;
	description: string;
	documentType: string;
	departmentId: string;
	importerId: string;
	folderId: string;
}
