const DEFAULT_DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
	dateStyle: 'short',
};

export const dateFormatter = (
	date: Date,
	region = 'vi-VN',
	options = DEFAULT_DATE_FORMAT_OPTIONS
) => Intl.DateTimeFormat(region, options).format(date);

export const fileSizeFormatter = (size: number) => {
	const units = ['B', 'KB', 'MB', 'GB', 'TB'];
	let i = 0;
	while (size >= 1024 && i < units.length - 1) {
		size /= 1024;
		i++;
	}
	return `${Math.round(size)} ${units[i]}`;
};