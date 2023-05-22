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
	RETURNS: '/returns',
	IMPORT: '/import',
};

export const UNAUTH_ROUTES = {
	AUTH: '/auth',
};
