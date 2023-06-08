import { Button } from 'primereact/button';
import { FC } from 'react';
import { Link } from 'react-router-dom';

interface IErrorTemplateProps {
	code: number;
	message: string;
	url?: string;
	btnText?: string;
}

const ErrorTemplate: FC<IErrorTemplateProps> = ({ code, message, url, btnText = 'Return' }) => {
	return (
		<div className='w-full h-full flex items-center justify-center flex-col gap-3'>
			<h1 className='text-2xl'>{code}</h1>
			<h2 className='text-lg'>{message}</h2>
			{url && btnText && (
				<Link to={url}>
					<Button label={btnText} className='h-11 rounded-lg btn-outlined' outlined />
				</Link>
			)}
		</div>
	);
};

export default ErrorTemplate;
