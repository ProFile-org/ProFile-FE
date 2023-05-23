import { ROLE_MAPPER } from '@/pages/Guards/RoleMapper';
import { IItem } from './item';
import { AUTH_ROUTES } from '@/constants/routes';

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
			label: 'Import',
			path: AUTH_ROUTES.IMPORT,
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
	// Employee sidebar
	employee: [
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
			path: AUTH_ROUTES.PHYSICAL,
		},
		{
			label: 'Digital',
			path: AUTH_ROUTES.DRIVE,
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
};
