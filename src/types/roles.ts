import { ROLE_MAPPER } from '@/pages/Guards/RoleMapper';
import { IItem } from './item';
import { AUTH_ROUTES } from '@/constants/routes';
import { PrimeIcons } from 'primereact/api';

export type Role = keyof (typeof ROLE_MAPPER)[string];

export const SIDEBAR_ROLES: { [key: string]: IItem[] } = {
	// Admin sidebar
	admin: [
		{
			label: 'Home',
			path: AUTH_ROUTES.HOME,
			icon: PrimeIcons.HOME,
		},
		{
			type: 'group',
			label: 'Audit',
		},
		{
			label: 'Logs',
			path: AUTH_ROUTES.LOGS,
			icon: PrimeIcons.FILE,
		},
		// {
		// 	label: 'Data',
		// 	path: AUTH_ROUTES.DATA,
		// 	icon: PrimeIcons.DATABASE,
		// },
		{
			type: 'group',
			label: 'Departments',
		},
		{
			label: 'Manage',
			path: AUTH_ROUTES.DEPARTMENTS_MANAGE,
			icon: PrimeIcons.BUILDING,
		},
		{
			label: 'Create',
			path: AUTH_ROUTES.NEW_DEPARTMENT,
			icon: PrimeIcons.PLUS,
		},
		{
			type: 'group',
			label: 'Users',
		},
		{
			label: 'Employee',
			path: AUTH_ROUTES.EMPLOYEES,
			icon: PrimeIcons.USERS,
			items: [
				{
					label: 'Manage',
					path: AUTH_ROUTES.EMPLOYEES_MANAGE,
					icon: PrimeIcons.USERS,
				},
				{
					label: 'Create',
					path: AUTH_ROUTES.NEW_EMP,
					icon: PrimeIcons.USER_PLUS,
				},
			],
		},
		{
			label: 'Staffs',
			path: AUTH_ROUTES.STAFFS,
			icon: PrimeIcons.USER,
			items: [
				{
					label: 'Manage',
					path: AUTH_ROUTES.STAFFS_MANAGE,
					icon: PrimeIcons.USER,
				},
				{
					label: 'Assign',
					path: AUTH_ROUTES.NEW_STAFF,
					icon: PrimeIcons.USER_PLUS,
				},
			],
		},
		{
			type: 'group',
			label: 'Documents',
		},
		{
			label: 'Physical',
			icon: PrimeIcons.FOLDER_OPEN,
			items: [
				{
					label: 'Rooms',
					path: AUTH_ROUTES.ROOMS,
					icon: PrimeIcons.BUILDING,
				},
				{
					label: 'Lockers',
					path: AUTH_ROUTES.LOCKERS,
					icon: PrimeIcons.LOCK,
				},
				{
					label: 'Folders',
					path: AUTH_ROUTES.FOLDERS,
					icon: PrimeIcons.FOLDER,
				},
				{
					label: 'Documents',
					path: AUTH_ROUTES.DOCUMENTS,
					icon: PrimeIcons.FILE,
				},
			],
			path: AUTH_ROUTES.PHYSICAL,
		},
		{
			type: 'group',
			label: 'Borrowed docs',
		},
		{
			label: 'Requests',
			path: AUTH_ROUTES.REQUESTS,
			icon: PrimeIcons.BELL,
		},
	],
	// Staff sidebar
	staff: [
		{
			label: 'Home',
			path: AUTH_ROUTES.HOME,
			icon: PrimeIcons.HOME,
		},
		{
			type: 'group',
			label: 'Documents',
		},
		{
			label: 'Physical',
			icon: PrimeIcons.FOLDER_OPEN,
			items: [
				{
					label: 'Lockers',
					path: AUTH_ROUTES.LOCKERS,
					icon: PrimeIcons.LOCK,
				},
				{
					label: 'Folders',
					path: AUTH_ROUTES.FOLDERS,
					icon: PrimeIcons.FOLDER,
				},
				{
					label: 'Documents',
					path: AUTH_ROUTES.DOCUMENTS,
					icon: PrimeIcons.FILE,
				},
			],
			path: AUTH_ROUTES.PHYSICAL,
		},
		{
			type: 'group',
			label: 'Requests',
		},
		{
			label: 'Borrows',
			path: AUTH_ROUTES.REQUESTS,
			icon: PrimeIcons.BELL,
		},
		{
			label: 'Returns',
			path: AUTH_ROUTES.RETURNS,
			icon: PrimeIcons.REPLY,
		},
		{
			label: 'Imports',
			path: AUTH_ROUTES.IMPORT,
			icon: PrimeIcons.UPLOAD,
			items: [
				{
					label: 'Requests',
					path: AUTH_ROUTES.IMPORT_MANAGE,
					icon: PrimeIcons.USERS,
				},
				{
					label: 'Manual',
					path: AUTH_ROUTES.NEW_IMPORT,
					icon: PrimeIcons.PLUS,
				},
			],
		},
	],
	// Employee sidebar
	employee: [
		{
			label: 'Home',
			path: AUTH_ROUTES.HOME,
			icon: PrimeIcons.HOME,
		},
		{
			path: AUTH_ROUTES.PROFILE,
			label: 'Profile',
			icon: PrimeIcons.USER,
		},
		{
			type: 'group',
			label: 'Documents',
		},
		{
			label: 'Physical',
			path: AUTH_ROUTES.PHYSICAL,
			icon: PrimeIcons.FOLDER_OPEN,
		},
		{
			type: 'group',
			label: 'Digital',
		},
		{
			label: 'My Drive',
			path: AUTH_ROUTES.DRIVE,
			icon: PrimeIcons.CLOUD,
		},
		{
			label: 'Shared',
			path: AUTH_ROUTES.DRIVE_SHARED,
			icon: PrimeIcons.CLOUD_UPLOAD,
		},
		{
			label: 'Trash',
			path: AUTH_ROUTES.DRIVE_TRASH,
			icon: PrimeIcons.TRASH,
		},
		{
			type: 'group',
			label: 'Requests',
		},
		{
			label: 'Borrow',
			path: AUTH_ROUTES.REQUESTS,
			icon: PrimeIcons.BELL,
		},
		{
			label: 'Import',
			path: AUTH_ROUTES.IMPORT,
			icon: PrimeIcons.UPLOAD,
			items: [
				{
					label: 'Manage',
					path: AUTH_ROUTES.IMPORT_MANAGE,
					icon: PrimeIcons.UPLOAD,
				},
				{
					label: 'Create',
					path: AUTH_ROUTES.NEW_IMPORT,
					icon: PrimeIcons.PLUS,
				},
			],
		},
	],
};
