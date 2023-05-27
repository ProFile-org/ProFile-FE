export type DropdownOption = {
	name: string;
	id: string;
};

export type LockerOption = {
	max: number;
	free: number;
	description?: string;
} & DropdownOption;

export type FolderOption = LockerOption;
