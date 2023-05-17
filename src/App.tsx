import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';

function App() {
	return (
		<div className='bg-neutral-900 p-5'>
			<h1 className='text-primary'>Hello world</h1>
			<InputText />
			<Button label='Test' icon={PrimeIcons.SIGN_OUT} />
		</div>
	);
}

export default App;
