import { AUTH_ROUTES, AUTH_ROUTES_KEY } from '@/constants/routes';
import { DataTableProps } from 'primereact/datatable';
import { useNavigate } from 'react-router';
import { useCallback } from 'react';

interface IUseNavigateSelectProps {
	route: AUTH_ROUTES_KEY;
}

const useNavigateSelect = ({ route }: IUseNavigateSelectProps) => {
	const navigate = useNavigate();

	const getNavigateOnSelectProps = useCallback(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(): DataTableProps<any> => ({
			selectionMode: 'single',
			onSelectionChange: (e) => navigate(`${AUTH_ROUTES[route]}/${(e.value as { id: string }).id}`),
		}),
		[route, navigate]
	);

	return {
		getNavigateOnSelectProps,
	};
};

export default useNavigateSelect;
