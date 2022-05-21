import * as React from 'react';
import  LogicalNodeModel  from './LogicalNodeModel.tsx';
import { LogicalNodeWidget } from './LogicalNodeWidget.tsx';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';

export default class LogicalNodeFactory extends AbstractReactFactory<LogicalNodeModel, DiagramEngine> {
	constructor() {
		super('ts-custom-node');
	}

	generateModel(initialConfig) {
		return new LogicalNodeModel();
	}

	generateReactWidget(event): JSX.Element {
		return <LogicalNodeWidget engine={this.engine as DiagramEngine} node={event.model} />;
	}
}
