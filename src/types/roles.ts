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
			path: AUTH_ROUTES.STAFFS_MANAGE,
			icon: PrimeIcons.USER,
			// items: [
			// 	{
			// 		label: 'Manage',
			// 		path: AUTH_ROUTES.STAFFS_MANAGE,
			// 		icon: PrimeIcons.USER,
			// 	},
			// 	// {
			// 	// 	label: 'Create',
			// 	// 	path: AUTH_ROUTES.NEW_STAFF,
			// 	// 	icon: PrimeIcons.USER_PLUS,
			// 	// },
			// ],
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
			label: 'Digital',
			path: AUTH_ROUTES.DRIVE,
			icon: PrimeIcons.CLOUD,
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
			label: 'Import',
			path: AUTH_ROUTES.IMPORT,
			icon: PrimeIcons.UPLOAD,
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
		{
			label: 'Returns',
			path: AUTH_ROUTES.RETURNS,
			icon: PrimeIcons.REPLY,
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
			type: 'group',
			label: 'Documents',
		},
		{
			label: 'Physical',
			path: AUTH_ROUTES.PHYSICAL,
			icon: PrimeIcons.FOLDER_OPEN,
		},
		{
			label: 'Digital',
			path: AUTH_ROUTES.DRIVE,
			icon: PrimeIcons.CLOUD,
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
};
