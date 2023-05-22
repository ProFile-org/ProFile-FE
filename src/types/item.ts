export interface IItem {
	label: string;
	type?: 'item' | 'group';
	items?: IItem[];
	path?: string;
	icon?: string;
}
