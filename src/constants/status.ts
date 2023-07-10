export const REQUEST_STATUS = {
	Approved: { status: 'Approved', color: 'bg-green-500' },
	Pending: { status: 'Pending', color: 'bg-yellow-500' },
	Rejected: { status: 'Rejected', color: 'bg-red-500' },
	Cancelled: { status: 'Cancelled', color: 'bg-orange-500' },
	CheckedOut: { status: 'CheckedOut', color: 'bg-blue-500' },
	Returned: { status: 'Returned', color: 'bg-primary' },
	Lost: { status: 'Lost', color: 'bg-black' },
	NotProcessable: { status: 'NotProcessable', color: 'bg-black' },
	Overdue: { status: 'Overdue', color: 'bg-red-500' },
};

export type REQUEST_STATUS_KEY = keyof typeof REQUEST_STATUS;

export const DOCUMENT_STATUS = {
	Available: {
		status: 'Available',
		color: 'bg-green-500',
	},
	Issued: {
		status: 'Issued',
		color: 'bg-yellow-500',
	},
	Borrowed: {
		status: 'Borrowed',
		color: 'bg-blue-500',
	},
	Lost: {
		status: 'Lost',
		color: 'bg-black',
	},
	Pending: {
		status: 'Pending',
		color: 'bg-yellow-500',
	},
	Rejected: {
		status: 'Rejected',
		color: 'bg-red-500',
	},
	Approved: {
		status: 'Approved',
		color: 'bg-green-500',
	},
	Assigned: {
		status: 'Assigned',
		color: 'bg-blue-500',
	},
	CheckedIn: {
		status: 'CheckedIn',
		color: 'bg-primary',
	},
	Overdue: {
		status: 'Overdue',
		color: 'bg-red-500',
	},
};

export type DOCUMENT_STATUS_KEY = keyof typeof DOCUMENT_STATUS;
