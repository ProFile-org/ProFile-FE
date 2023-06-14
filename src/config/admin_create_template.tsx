import { GetDepartmentsResponse } from '@/types/response';
import axiosClient from '@/utils/axiosClient';
import { useQuery } from 'react-query';

const ADMIN_CREATE_TEMPLATE = {
	employees: {
		left: [
			{
				title: 'General information',
				fields: [
					{
						type: 'text',
						label: 'Username',
						placeholder: 'Enter username',
						required: true,
					},
					{
						type: 'group',
						fields: [
							{
								type: 'text',
								label: 'First name',
								placeholder: 'A',
								required: true,
							},
							{
								type: 'text',
								label: 'Last name',
								placeholder: 'Nguyen vane',
								required: true,
							},
						],
					},
					{
						type: 'select',
						label: 'Department',
						placeholder: 'Select department',
						required: true,
						data: async () => {
							const { data } = await axiosClient.get<GetDepartmentsResponse>('/departments');
							return data.data.map((department) => ({
								label: department.name,
								value: department.id,
							}));
						},
					},
				],
			},
		],
	},
	rooms: {
		left: [],
		right: [],
	},
};

export type TemplateKey = keyof typeof ADMIN_CREATE_TEMPLATE;

export default ADMIN_CREATE_TEMPLATE;
