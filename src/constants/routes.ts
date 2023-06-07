export const AUTH_ROUTES = {
	HOME: '/',
	PHYSICAL: '/physical',
	LOCKERS: '/physical/lockers',
	LOCKER: '/physical/lockers/:lockerId',
	FOLDERS: '/physical/folders',
	FOLDER: '/physical/folders/:folderId',
	DOCUMENTS: '/physical/documents',
	DOCUMENT: '/physical/documents/:documentId',
	REQUESTS: '/requests',
	REQUEST: '/requests/:requestId',
	NEW_REQUEST: '/requests/create',
	RETURNS: '/returns',
	IMPORT: '/import',
	DRIVE: '/digital',
};

export const UNAUTH_ROUTES = {
	AUTH: '/auth',
};

export type AUTH_ROUTES_KEY = keyof typeof AUTH_ROUTES;
