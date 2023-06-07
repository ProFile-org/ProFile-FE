import clsx from 'clsx';
import { FC, HTMLAttributes } from 'react';
import { Link } from 'react-router-dom';

interface IInfoCardProps extends HTMLAttributes<HTMLDivElement> {
	url?: string;
	header?: string;
}

const InfoCard: FC<IInfoCardProps> = ({ header, url, children, className, ...rest }) => {
	const Wrapper = ({ children }: { children: React.ReactNode }) =>
		url ? (
			<Link to={url} className='flex-1'>
				{children}
			</Link>
		) : (
			<>{children}</>
		);

	return (
		<Wrapper>
			<div
				className={clsx(
					'card flex-1 group hover:bg-opacity-90 transition-shadow min-w-max',
					className
				)}
				{...rest}
			>
				{header && (
					<h4 className='font-bold text-xl group-hover:text-primary transition-colors'>{header}</h4>
				)}
				{children}
			</div>
		</Wrapper>
	);
};

export default InfoCard;
