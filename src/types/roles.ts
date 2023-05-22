import { ROLE_MAPPER } from '@/pages/Guards/RoleMapper';
import { IItem } from './item';
import { AUTH_ROUTES } from '@/constants/routes';

export type Role = keyof (typeof ROLE_MAPPER)[string];

export const SIDEBAR_ROLES: { [key: string]: IItem[] } = {
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
};
