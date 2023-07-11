import { FormEvent } from 'react';
import InputWithLabel from '../InputWithLabel/InputWithLabel.component';
import FileInput from '../FileInput/FileInput.component';
import { Button } from 'primereact/button';
import { fileSizeFormatter } from '@/utils/formatter';
import { useRef } from 'react';

const CreateFileModal = ({
	onCreateFile,
	setModal,
	setFile,
	file,
}: {
	onCreateFile: (e: FormEvent<HTMLFormElement>) => void;
	setModal: (value: string) => void;
	setFile: (value: File) => void;
	file: File | null;
}) => {
	const ref = useRef<HTMLInputElement>(null);
	return (
		<form
			className='bg-neutral-800 rounded-lg p-5 w-[50vw]'
			onSubmit={onCreateFile}
			onClick={(e) => e.stopPropagation()}
		>
			<h2 className='title'>Creating folder</h2>
			<InputWithLabel
				wrapperClassName='mt-5'
				label='File name'
				id='fileName'
				name='fileName'
				ref={ref}
			/>
			<FileInput
				name='file'
				id='file'
				setFiles={(f) => {
					setFile(f);
					if (!ref.current) return;
					ref.current.value = f.name;
				}}
			/>
			{file && (
				<div className='mt-5'>
					Selected: {file.name} ({fileSizeFormatter(file.size)})
				</div>
			)}
			<div className='flex justify-end mt-5'>
				<Button
					label='Cancel'
					className='h-11 rounded-lg mr-3 btn-outlined !border-red-600'
					onClick={() => setModal('')}
					severity='danger'
					outlined
				/>
				<Button label='Create' className='h-11 rounded-lg' />
			</div>
		</form>
	);
};

export default CreateFileModal;
