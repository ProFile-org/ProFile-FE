import { FC } from 'react';

interface ILayoutProps {
	children?: React.ReactNode;
}

const Layout: FC<ILayoutProps> = ({ children }) => {
	return <div className='layout-wrapper max-w-7xl mx-auto px-3 sm:px-5'>{children}</div>;
};

export default Layout;
