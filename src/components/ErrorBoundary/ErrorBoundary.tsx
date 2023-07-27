/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from 'react';
import ErrorTemplate from '../ErrorTemplate/ErrorTemplate.component';

interface IErrorBoundaryProps {
	children: React.ReactNode;
}

class ErrorBoundary extends Component<IErrorBoundaryProps, { hasError: boolean }> {
	constructor(props: IErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error: any, errorInfo: any) {
		console.error(error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<ErrorTemplate code={400} message='Some thing went wrong' url='/' btnText='Return home' />
			);
		}
		return this.props.children;
	}
}

export default ErrorBoundary;
