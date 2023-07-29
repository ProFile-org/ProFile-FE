import { Button } from 'primereact/button';
import InputWithLabel from '../InputWithLabel/InputWithLabel.component';
import { FormEvent, useState } from 'react';

const RenameModal = ({
	onRename,
	handleClose,
}: {
	onRename: (e: FormEvent<HTMLFormElement>) => void;
	handleClose: () => void;
}) => {
	const [newName, setNewName] = useState('');

	return (
		<form
			className='bg-neutral-800 rounded-lg p-5 w-[50vw]'
			onSubmit={onRename}
			onClick={(e) => e.stopPropagation()}
		>
			<h2 className='title'>Renaming</h2>
			<InputWithLabel
				wrapperClassName='mt-5'
				label='New name'
				id='newName'
				name='newName'
				value={newName}
				onChange={(e) => setNewName(e.target.value)}
			/>
			<div className='flex justify-end mt-5'>
				<Button
					label='Cancel'
					className='h-11 rounded-lg mr-3 btn-outlined !border-red-600'
					onClick={handleClose}
					severity='danger'
					outlined
				/>
				<Button label='Create' className='h-11 rounded-lg' disabled={!newName} />
			</div>
		</form>
	);
};

export default RenameModal;
