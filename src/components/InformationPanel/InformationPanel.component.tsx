import clsx from 'clsx';
import { FC, HTMLAttributes } from 'react';

interface IInformationPanelProps extends HTMLAttributes<HTMLDivElement> {
	header?: string;
	direction?: 'row' | 'column';
}

const InformationPanel: FC<IInformationPanelProps> = ({
	header,
	children,
	className,
	direction = 'column',
	...rest
}) => {
	return (
		<div
			className={clsx(
				'card flex gap-4',
				className,
				direction === 'column' ? 'flex-col' : 'flex-row'
			)}
			{...rest}
		>
			{header && <h2 className='header'>{header}</h2>}
			{children}
		</div>
	);
};

export default InformationPanel;
