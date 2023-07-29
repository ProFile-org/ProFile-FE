import { Button } from 'primereact/button';
import InputWithLabel from '../InputWithLabel/InputWithLabel.component';
import { FormEvent, useState } from 'react';

const CreateFolderModal = ({
	onCreateFolder,
	handleClose,
}: {
	onCreateFolder: (e: FormEvent<HTMLFormElement>) => void;
	handleClose: () => void;
}) => {
	const [name, setName] = useState('');
	return (
		<form
			className='bg-neutral-800 rounded-lg p-5 w-[50vw]'
			onSubmit={onCreateFolder}
			onClick={(e) => e.stopPropagation()}
		>
			<h2 className='title'>Creating folder</h2>
			<InputWithLabel
				wrapperClassName='mt-5'
				label='Folder name'
				id='folderName'
				name='folderName'
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>
			<div className='flex justify-end'>
				<Button
					label='Cancel'
					className='mt-5 h-11 rounded-lg mr-3 btn-outlined !border-red-600'
					onClick={handleClose}
					severity='danger'
					outlined
				/>
				<Button label='Create' className='mt-5 h-11 rounded-lg' disabled={!name} />
			</div>
		</form>
	);
};

export default CreateFolderModal;
