import { FC } from 'react';
import { QrReader, OnResultFunction } from 'react-qr-reader';

import style from './QrScanner.module.scss';
import clsx from 'clsx';

interface IQrScannerProps {
	onResult?: OnResultFunction;
}

const defaultOnResult: OnResultFunction = (result) => result && console.log(result);

const QrScanner: FC<IQrScannerProps> = ({ onResult = defaultOnResult }) => {
	return (
		<QrReader
			constraints={{
				aspectRatio: 1,
				facingMode: 'environment',
			}}
			className={clsx(style['qr-scanner'])}
			onResult={onResult}
		/>
	);
};

export default QrScanner;
