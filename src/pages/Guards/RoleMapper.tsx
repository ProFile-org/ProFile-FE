/* eslint-disable react-refresh/only-export-components */
// This helps with performance, warning is for development only
import { AUTH_ROUTES } from '@/constants/routes';
import { lazy } from 'react';
import { Navigate } from 'react-router';
import { StaffDashboardPage } from '../staff';
import { EmpDashboardPage } from '../emp';

// Staff imports
const StaffLockerPage = lazy(() => import('@/pages/staff/StaffLockerPage/StaffLockerPage'));
const StaffDocumentPage = lazy(() => import('@/pages/staff/StaffDocumentPage/StaffDocumentPage'));
const StaffImportPage = lazy(() => import('@/pages/staff/StaffImportPage/StaffImportPage'));
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

// Employee imports
const EmpDocumentPage = lazy(() => import('@/pages/emp/EmpDocumentPage/EmpDocumentPage'));

export const ROLE_MAPPER = {
	[AUTH_ROUTES.HOME]: {
		admin: () => <div>Admins</div>,
		staff: () => <StaffDashboardPage />,
		employee: () => <EmpDashboardPage />,
	},
	[AUTH_ROUTES.PHYSICAL]: {
		admin: () => <div>Admins</div>,
		staff: () => <Navigate to={AUTH_ROUTES.LOCKERS} />,
		employee: () => <EmpDocumentPage />,
	},
	[AUTH_ROUTES.LOCKERS]: {
		admin: () => <div>Admins</div>,
		staff: () => <StaffLockerPage />,
	},
	[AUTH_ROUTES.LOCKER]: {
		admin: () => <div>Admins</div>,
		staff: () => <StaffLockerDetailPage />,
	},
	[AUTH_ROUTES.DOCUMENTS]: {
		admin: () => <div>Admins</div>,
		staff: () => <StaffDocumentPage />,
		employee: () => <div>Employee</div>,
	},
	[AUTH_ROUTES.IMPORT]: {
		staff: () => <StaffImportPage />,
	},
	[AUTH_ROUTES.DOCUMENT]: {
		staff: () => <StaffDocumentDetailPage />,
	},
	[AUTH_ROUTES.REQUESTS]: {
		staff: () => <StaffRequestPage />,
	},
	[AUTH_ROUTES.REQUEST]: {
		staff: () => <StaffRequestDetailPage />,
	},
	[AUTH_ROUTES.RETURNS]: {
		staff: () => <StaffReturnsPage />,
	},
	[AUTH_ROUTES.FOLDERS]: {
		admin: () => <div>Admins</div>,
		staff: () => <StaffFolderPage />,
		employee: () => <div>Employee</div>,
	},
	[AUTH_ROUTES.FOLDER]: {
		admin: () => <div>Admins</div>,
		staff: () => <StaffFolderDetailPage />,
		employee: () => <div>Employee</div>,
	},
};
