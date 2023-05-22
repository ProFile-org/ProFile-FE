import { AUTH_ROUTES } from '@/constants/routes';
import { lazy } from 'react';
import { Navigate } from 'react-router';
import { StaffDashboardPage } from '../staff';

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

export const ROLE_MAPPER = {
	[AUTH_ROUTES.HOME]: {
		admin: () => <div>Admins</div>,
		staff: () => <StaffDashboardPage />,
		employee: () => <div>Employee</div>,
	},
	[AUTH_ROUTES.PHYSICAL]: {
		admin: () => <div>Admins</div>,
		staff: () => <Navigate to={AUTH_ROUTES.LOCKERS} />,
	},
	[AUTH_ROUTES.LOCKERS]: {
		admin: () => <div>Admins</div>,
		staff: () => <StaffLockerPage />,
	},
	[AUTH_ROUTES.LOCKER]: {
		admin: () => <div>Admins</div>,
		staff: () => <div>Staff</div>,
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
		staff: () => <div>Staff</div>,
		employee: () => <div>Employee</div>,
	},
	[AUTH_ROUTES.FOLDER]: {
		admin: () => <div>Admins</div>,
		staff: () => <div>Staff</div>,
		employee: () => <div>Employee</div>,
	},
};
