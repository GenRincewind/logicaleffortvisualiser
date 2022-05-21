import * as React from 'react';

import { BodyWidget } from './components/BodyWidget.tsx';
import { Application } from './components/Application.tsx';

export default () => {
	var app = new Application();
    
	return <BodyWidget app={app} />;
};
