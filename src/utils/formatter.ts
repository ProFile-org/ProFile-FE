const DEFAULT_DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
	dateStyle: 'short',
};

export const dateFormatter = (
	date: Date,
	region = 'vi-VN',
	options = DEFAULT_DATE_FORMAT_OPTIONS
) => Intl.DateTimeFormat(region, options).format(date);
