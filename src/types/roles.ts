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
		},
		{
			type: 'group',
			label: 'Documents',
		},
		{
			label: 'Physical',
			items: [
				{
					label: 'Lockers',
					path: AUTH_ROUTES.LOCKERS,
				},
				{
					label: 'Folders',
					path: AUTH_ROUTES.FOLDERS,
				},
				{
					label: 'Documents',
					path: AUTH_ROUTES.DOCUMENTS,
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
		},
		{
			label: 'Returns',
			path: AUTH_ROUTES.RETURNS,
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
