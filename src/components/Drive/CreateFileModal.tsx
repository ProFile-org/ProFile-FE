import { FormEvent } from 'react';
import InputWithLabel from '../InputWithLabel/InputWithLabel.component';
import FileInput from '../FileInput/FileInput.component';
import { Button } from 'primereact/button';
import { fileSizeFormatter } from '@/utils/formatter';
import { useState } from 'react';

const CreateFileModal = ({
	onCreateFile,
	handleClose,
	setFile,
	file,
}: {
	onCreateFile: (e: FormEvent<HTMLFormElement>) => void;
	handleClose: () => void;
	setFile: (value: File) => void;
	file: File | null;
}) => {
	const [name, setName] = useState('');
	return (
		<form
			className='bg-neutral-800 rounded-lg p-5 w-[50vw]'
			onSubmit={onCreateFile}
			onClick={(e) => e.stopPropagation()}
		>
			<h2 className='title'>Uploading file</h2>
			<InputWithLabel
				wrapperClassName='mt-5'
				label='File name'
				id='fileName'
				name='fileName'
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>
			<FileInput
				name='file'
				id='file'
				setFiles={(f) => {
					setFile(f);
					setName(f.name);
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
					onClick={handleClose}
					severity='danger'
					outlined
				/>
				<Button label='Create' className='h-11 rounded-lg' disabled={!file || !name} />
			</div>
		</form>
	);
};

export default CreateFileModal;
