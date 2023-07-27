import clsx from 'clsx';
import { PrimeIcons } from 'primereact/api';
import { Toast } from 'primereact/toast';
import {
	ChangeEvent,
	FC,
	InputHTMLAttributes,
	SetStateAction,
	// useState,
	useRef,
} from 'react';

interface IFileInputProps extends InputHTMLAttributes<HTMLInputElement> {
	setData?: React.Dispatch<SetStateAction<string[]>>;
	file?: File;
	setFiles?: (file: File) => void;
}

const FileInput: FC<IFileInputProps> = ({ setFiles, setData, ...rest }) => {
	const ref = useRef<HTMLInputElement>(null);
	const toast = useRef<Toast>(null);

	const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;
		const newFile = e.target.files[0];
		if (!newFile) return;

		if (newFile.size > 20_000_000) {
			toast.current?.show({
				severity: 'error',
				summary: 'Error',
				detail: 'File size cannot exceed 20MB',
				className: '!bg-red-200 overflow-hidden',
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
		<>
			<div
				className={`rounded-lg border-solid border-2 border-primary bg-neutral-700 w-full h-16 relative p-5 mt-5`}
			>
				<input
					type='file'
					className='absolute opacity-0 w-full h-full top-0 left-0 cursor-pointer'
					onChange={onFileChange}
					ref={ref}
					{...rest}
				/>
				<div className='flex items-center h-full justify-center font-normal text-base text-white max-w-xs mx-auto'>
					Drag and drop <i className={clsx('text-xl mx-3', PrimeIcons.UPLOAD)} /> Click to browse
				</div>
			</div>
			<Toast ref={toast} position='top-right' />
		</>
	);
};

export default FileInput;
