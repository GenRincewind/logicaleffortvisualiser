import { LogicalPortModel } from '../port/LogicalPortModel.ts';
import { AbstractModelFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';

export class LogicalPortFactory extends AbstractModelFactory<LogicalPortModel, DiagramEngine> {
	constructor() {
		super('default');
	}

	generateModel(): LogicalPortModel {
		return new LogicalPortModel({
			name: 'unknown'
		});
	}
}
