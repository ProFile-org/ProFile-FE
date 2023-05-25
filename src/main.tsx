import ReactDOM from 'react-dom/client';
import App from './App.tsx';
//theme
import 'primereact/resources/themes/tailwind-light/theme.css';
//core
import 'primereact/resources/primereact.min.css';
//icons
import 'primeicons/primeicons.css';
//main
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import AuthProvider from './context/authContext.tsx';

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<AuthProvider>
		<BrowserRouter>
			<QueryClientProvider client={client}>
				<App />
			</QueryClientProvider>
		</BrowserRouter>
	</AuthProvider>
);
