export const AUTH_ROUTES = {
	HOME: '/',
	PHYSICAL: '/physical',
	LOCKERS: '/physical/lockers',
	LOCKER: '/physical/lockers/:lockerId',
	NEW_LOCKER: '/physical/lockers/create',
	FOLDERS: '/physical/folders',
	FOLDER: '/physical/folders/:folderId',
	NEW_FOLDER: '/physical/folders/create',
	DOCUMENTS: '/physical/documents',
	DOCUMENT: '/physical/documents/:documentId',
	REQUESTS: '/requests',
	REQUEST: '/requests/:requestId',
	NEW_REQUEST: '/requests/create',
	RETURNS: '/returns',
	IMPORT: '/import',
	DRIVE: '/digital',
	EMPLOYEES: '/employees',
	EMPLOYEES_MANAGE: '/employees/manage',
	EMPLOYEE: '/employees/manage/:empId',
	NEW_EMP: '/employees/create',
	LOGS: '/logs',
	ROOMS: '/physical/rooms',
	ROOM: '/physical/rooms/:roomId',
	NEW_ROOM: '/physical/rooms/create',
	STAFFS: '/staffs',
	STAFFS_MANAGE: '/staffs/manage',
	STAFF: '/staffs/manage/:staffId',
	NEW_STAFF: '/staffs/create',
	DEPARTMENTS: '/departments',
	DEPARTMENT: '/departments/:departmentId',
	NEW_DEPARTMENT: '/departments/create',
};

export const UNAUTH_ROUTES = {
	AUTH: '/auth',
};

export type AUTH_ROUTES_KEY = keyof typeof AUTH_ROUTES;
