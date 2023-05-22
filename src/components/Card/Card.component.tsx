import clsx from 'clsx';
import { FC, HTMLAttributes } from 'react';

interface ICardProps extends HTMLAttributes<HTMLDivElement> {
	children?: React.ReactNode;
}

const Card: FC<ICardProps> = ({ children, className, ...rest }) => {
	return (
		<div className={clsx('card-wrapper card', className)} {...rest}>
			{children}
		</div>
	);
};

export default Card;
