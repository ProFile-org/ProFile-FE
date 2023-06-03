import clsx from 'clsx';
import { PrimeIcons } from 'primereact/api';
import { ChangeEvent, FC, InputHTMLAttributes, SetStateAction, useState, useRef } from 'react';

interface IFileInputProps extends InputHTMLAttributes<HTMLInputElement> {
	setData?: React.Dispatch<SetStateAction<string[]>>;
	files?: File[];
	setFiles?: (file: File) => void;
}

const FileInput: FC<IFileInputProps> = ({ setFiles, setData, ...rest }) => {
	const [notification, setNotification] = useState<{
		message: string;
		type: 'error' | 'warning';
	} | null>();
	const ref = useRef<HTMLInputElement>(null);

	const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;
		const newFile = e.target.files[0];
		if (!newFile) return;
		if (!newFile.type.startsWith('image/')) {
			setNotification({
				message: 'Please upload an image file.',
				type: 'error',
			});
			return;
		}
		const reader = new FileReader();
		reader.readAsDataURL(newFile);
		reader.onload = async () => {
			setData && setData((prev) => [...prev, reader.result as string]);
			const element = ref.current as HTMLInputElement;
			element.value = '';
			element.files = null;
		};
		setFiles && setFiles(newFile);
	};

	return (
		<div
			className={`rounded-lg border-solid border-2 ${
				!notification
					? 'border-primary'
					: notification.type === 'error'
					? 'border-red-500'
					: 'border-orange-500'
			} bg-neutral-700 w-full h-16 relative p-5`}
		>
			<input
				type='file'
				className='absolute opacity-0 w-full h-full top-0 left-0 cursor-pointer'
				accept='image/*'
				onChange={onFileChange}
				ref={ref}
				{...rest}
			/>
			<div className='flex items-center h-full justify-center font-normal text-base text-white max-w-xs mx-auto'>
				Drag and drop <i className={clsx('text-xl mx-3', PrimeIcons.UPLOAD)} /> Click to browse
			</div>
			{notification && (
				<div
					className={`my-[0.375rem] font-semibold text-base ${
						notification.type === 'error' ? 'text-red-500' : 'text-orange-500'
					} text-center`}
				>
					{notification.message}
				</div>
			)}
		</div>
	);
};

export default FileInput;
