import clsx from 'clsx';
import { Calendar, CalendarProps } from 'primereact/calendar';
import { FC } from 'react';
import style from './Calendar.module.scss';

interface ICustomCalendarProps extends CalendarProps {
	label?: string;
	wrapperClassName?: string;
	error?: boolean;
	small?: string;
}

const CustomCalendar: FC<ICustomCalendarProps> = ({
	id,
	label,
	wrapperClassName,
	className,
	error,
	small,
	...rest
}) => {
	return (
		<div className={clsx('flex flex-col gap-3', wrapperClassName)}>
			{label && <label htmlFor={id}>{label}</label>}
			<Calendar
				id={id}
				numberOfMonths={2}
				className={clsx(style.calendar, className, 'h-11', error && 'p-invalid border-red-500')}
				showButtonBar
				inputClassName='hover:!border-primary/80 bg-transparent border-primary border-2'
				{...rest}
			/>
			{small && <small className='error-input'>{small}</small>}
		</div>
	);
};

export default CustomCalendar;
