import * as React from 'react';
import  TSCustomNodeModel  from './TSCustomNodeModel.tsx';
import { TSCustomNodeWidget } from './TSCustomNodeWidget.tsx';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';

export default class TSCustomNodeFactory extends AbstractReactFactory<TSCustomNodeModel, DiagramEngine> {
	constructor() {
		super('ts-custom-node');
	}

	generateModel(initialConfig) {
		return new TSCustomNodeModel();
	}

	generateReactWidget(event): JSX.Element {
		return <TSCustomNodeWidget engine={this.engine as DiagramEngine} node={event.model} />;
	}
}
