/* eslint-disable react-refresh/only-export-components */
// This helps with performance, warning is for development only
import { AUTH_ROUTES } from '@/constants/routes';
import { lazy } from 'react';
import { Navigate } from 'react-router';

// Staff imports
const StaffDashboardPage = lazy(
	() => import('@/pages/staff/StaffDashboardPage/StaffDashboardPage')
);
const StaffLockerPage = lazy(() => import('@/pages/staff/StaffLockerPage/StaffLockerPage'));
const StaffDocumentPage = lazy(() => import('@/pages/staff/StaffDocumentPage/StaffDocumentPage'));
const StaffImportCreatePage = lazy(
	() => import('@/pages/staff/StaffImportCreatePage/StaffImportCreatePage')
);
const StaffDocumentDetailPage = lazy(
	() => import('@/pages/staff/StaffDocumentDetailPage/StaffDocumentDetailPage')
);
const StaffRequestPage = lazy(() => import('@/pages/staff/StaffRequestPage/StaffRequestPage'));
const StaffRequestDetailPage = lazy(
	() => import('@/pages/staff/StaffRequestDetailPage/StaffRequestDetailPage')
);
const StaffReturnsPage = lazy(() => import('@/pages/staff/StaffReturnPage/StaffReturnPage'));
const StaffLockerDetailPage = lazy(
	() => import('@/pages/staff/StaffLockerDetailPage/StaffLockerDetailPage')
);
const StaffFolderPage = lazy(() => import('@/pages/staff/StaffFolderPage/StaffFolderPage'));
const StaffFolderDetailPage = lazy(
	() => import('@/pages/staff/StaffFolderDetailPage/StaffFolderDetailPage')
);
const StaffImportDetailPage = lazy(
	() => import('@/pages/staff/StaffImportDetailPage/StaffImportDetailPage')
);
const StaffImportPage = lazy(() => import('@/pages/staff/StaffImportPage/StaffImportPage'));

// Employee imports
const EmpDashboardPage = lazy(() => import('@/pages/emp/EmpDashboardPage/EmpDashboardPage'));
const EmpDocumentPage = lazy(() => import('@/pages/emp/EmpDocumentPage/EmpDocumentPage'));
const EmpRequestPage = lazy(() => import('@/pages/emp/EmpRequestPage/EmpRequestPage'));
const EmpRequestDetailPage = lazy(
	() => import('@/pages/emp/EmpRequestDetailPage/EmpRequestDetailPage')
);
const EmpRequestCreatePage = lazy(
	() => import('@/pages/emp/EmpRequestCreatePage/EmpRequestCreatePage')
);
const EmpDocumentDetailPage = lazy(
	() => import('@/pages/emp/EmpDocumentDetailPage/EmpDocumentDetailPage')
);
const EmpImportCreatePage = lazy(
	() => import('@/pages/emp/EmpImportCreatePage/EmpImportCreatePage')
);
const EmpImportDetailPage = lazy(
	() => import('@/pages/emp/EmpImportDetailPage/EmpImportDetailPage')
);
const EmpImportPage = lazy(() => import('@/pages/emp/EmpImportPage/EmpImportPage'));
const EmpProfilePage = lazy(() => import('@/pages/emp/EmpProfilePage/EmpProfilePage'));

// Admin imports
const AdminDashboardPage = lazy(
	() => import('@/pages/admin/AdminDashboardPage/AdminDashboardPage')
);
const AdminLockerPage = lazy(() => import('@/pages/admin/AdminLockerPage/AdminLockerPage'));
const AdminLockerDetailPage = lazy(
	() => import('@/pages/admin/AdminLockerDetailPage/AdminLockerDetailPage')
);
const AdminFolderPage = lazy(() => import('@/pages/admin/AdminFolderPage/AdminFolderPage'));
const AdminFolderDetailPage = lazy(
	() => import('@/pages/admin/AdminFolderDetailPage/AdminFolderDetailPage')
);
const AdminDocumentPage = lazy(() => import('@/pages/admin/AdminDocumentPage/AdminDocumentPage'));
const AdminDocumentDetailPage = lazy(
	() => import('@/pages/admin/AdminDocumentDetailPage/AdminDocumentDetailPage')
);
const AdminRequestPage = lazy(() => import('@/pages/admin/AdminRequestPage/AdminRequestPage'));
const AdminRequestDetailPage = lazy(
	() => import('@/pages/admin/AdminRequestDetailPage/AdminRequestDetailPage')
);
const AdminRoomPage = lazy(() => import('@/pages/admin/AdminRoomPage/AdminRoomPage'));
const AdminRoomDetailPage = lazy(
	() => import('@/pages/admin/AdminRoomDetailPage/AdminRoomDetailPage')
);
const AdminEmployeePage = lazy(() => import('@/pages/admin/AdminEmployeePage/AdminEmployeePage'));
const AdminEmployeeCreatePage = lazy(
	() => import('@/pages/admin/AdminEmployeeCreatePage/AdminEmployeeCreatePage')
);
const AdminEmployeeDetailPage = lazy(
	() => import('@/pages/admin/AdminEmployeeDetailPage/AdminEmployeeDetailPage')
);
const AdminStaffPage = lazy(() => import('@/pages/admin/AdminStaffPage/AdminStaffPage'));
const AdminLockerCreatePage = lazy(
	() => import('@/pages/admin/AdminLockerCreatePage/AdminLockerCreatePage')
);
const AdminRoomCreatePage = lazy(
	() => import('@/pages/admin/AdminRoomCreatePage/AdminRoomCreatePage')
);
const AdminFolderCreatePage = lazy(
	() => import('@/pages/admin/AdminFolderCreatePage/AdminFolderCreatePage')
);
const AdminStaffCreatePage = lazy(
	() => import('@/pages/admin/AdminStaffCreatePage/AdminStaffCreatePage')
);
const AdminDepartmentPage = lazy(
	() => import('@/pages/admin/AdminDepartmentPage/AdminDepartmentPage')
);
const AdminDepartmentCreatePage = lazy(
	() => import('@/pages/admin/AdminDepartmentCreatePage/AdminDepartmentCreatePage')
);
const AdminDepartmentDetailPage = lazy(
	() => import('@/pages/admin/AdminDepartmentDetailPage/AdminDepartmentDetailPage')
);
const AdminLogPage = lazy(() => import('@/pages/admin/AdminLogPage/AdminLogPage'));

export const ROLE_MAPPER = {
	[AUTH_ROUTES.HOME]: {
		admin: () => <AdminDashboardPage />,
		staff: () => <StaffDashboardPage />,
		employee: () => <EmpDashboardPage />,
	},
	[AUTH_ROUTES.PHYSICAL]: {
		admin: () => <Navigate to={AUTH_ROUTES.ROOMS} replace />,
		staff: () => <Navigate to={AUTH_ROUTES.LOCKERS} replace />,
		employee: () => <Navigate to={AUTH_ROUTES.DOCUMENTS} replace />,
	},
	[AUTH_ROUTES.LOCKERS]: {
		admin: () => <AdminLockerPage />,
		staff: () => <StaffLockerPage />,
	},
	[AUTH_ROUTES.LOCKER]: {
		admin: () => <AdminLockerDetailPage />,
		staff: () => <StaffLockerDetailPage />,
	},
	[AUTH_ROUTES.DOCUMENTS]: {
		admin: () => <AdminDocumentPage />,
		staff: () => <StaffDocumentPage />,
		employee: () => <EmpDocumentPage />,
	},
	[AUTH_ROUTES.NEW_IMPORT]: {
		staff: () => <StaffImportCreatePage />,
		employee: () => <EmpImportCreatePage />,
	},
	[AUTH_ROUTES.DOCUMENT]: {
		admin: () => <AdminDocumentDetailPage />,
		staff: () => <StaffDocumentDetailPage />,
		employee: () => <EmpDocumentDetailPage />,
	},
	[AUTH_ROUTES.REQUESTS]: {
		admin: () => <AdminRequestPage />,
		staff: () => <StaffRequestPage />,
		employee: () => <EmpRequestPage />,
	},
	[AUTH_ROUTES.REQUEST]: {
		admin: () => <AdminRequestDetailPage />,
		staff: () => <StaffRequestDetailPage />,
		employee: () => <EmpRequestDetailPage />,
	},
	[AUTH_ROUTES.NEW_REQUEST]: {
		employee: () => <EmpRequestCreatePage />,
	},
	[AUTH_ROUTES.RETURNS]: {
		staff: () => <StaffReturnsPage />,
	},
	[AUTH_ROUTES.FOLDERS]: {
		admin: () => <AdminFolderPage />,
		staff: () => <StaffFolderPage />,
	},
	[AUTH_ROUTES.FOLDER]: {
		admin: () => <AdminFolderDetailPage />,
		staff: () => <StaffFolderDetailPage />,
	},
	[AUTH_ROUTES.ROOMS]: {
		admin: () => <AdminRoomPage />,
	},
	[AUTH_ROUTES.ROOM]: {
		admin: () => <AdminRoomDetailPage />,
	},
	[AUTH_ROUTES.EMPLOYEES]: {
		admin: () => <Navigate to={AUTH_ROUTES.EMPLOYEES_MANAGE} replace />,
	},
	[AUTH_ROUTES.EMPLOYEES_MANAGE]: {
		admin: () => <AdminEmployeePage />,
	},
	[AUTH_ROUTES.EMPLOYEE]: {
		admin: () => <AdminEmployeeDetailPage />,
	},
	[AUTH_ROUTES.STAFFS]: {
		admin: () => <Navigate to={AUTH_ROUTES.STAFFS_MANAGE} replace />,
	},
	[AUTH_ROUTES.STAFFS_MANAGE]: {
		admin: () => <AdminStaffPage />,
	},
	[AUTH_ROUTES.NEW_ROOM]: {
		admin: () => <AdminRoomCreatePage />,
	},
	[AUTH_ROUTES.NEW_LOCKER]: {
		admin: () => <AdminLockerCreatePage />,
	},
	[AUTH_ROUTES.NEW_FOLDER]: {
		admin: () => <AdminFolderCreatePage />,
	},
	[AUTH_ROUTES.NEW_STAFF]: {
		admin: () => <AdminStaffCreatePage />,
	},
	[AUTH_ROUTES.NEW_EMP]: {
		admin: () => <AdminEmployeeCreatePage />,
	},
	[AUTH_ROUTES.DEPARTMENTS_MANAGE]: {
		admin: () => <AdminDepartmentPage />,
	},
	[AUTH_ROUTES.DEPARTMENTS]: {
		admin: () => <Navigate to={AUTH_ROUTES.DEPARTMENTS_MANAGE} replace />,
	},
	[AUTH_ROUTES.DEPARTMENT]: {
		admin: () => <AdminDepartmentDetailPage />,
	},
	[AUTH_ROUTES.NEW_DEPARTMENT]: {
		admin: () => <AdminDepartmentCreatePage />,
	},
	[AUTH_ROUTES.IMPORT_ID]: {
		employee: () => <EmpImportDetailPage />,
		staff: () => <StaffImportDetailPage />,
	},
	[AUTH_ROUTES.IMPORT_MANAGE]: {
		employee: () => <EmpImportPage />,
		staff: () => <StaffImportPage />,
	},
	[AUTH_ROUTES.IMPORT]: {
		employee: () => <Navigate to={AUTH_ROUTES.IMPORT_MANAGE} />,
		staff: () => <Navigate to={AUTH_ROUTES.IMPORT_MANAGE} />,
	},
	[AUTH_ROUTES.LOGS]: {
		admin: () => <AdminLogPage />,
	},
	[AUTH_ROUTES.PROFILE]: {
		employee: () => <EmpProfilePage />,
	},
};
