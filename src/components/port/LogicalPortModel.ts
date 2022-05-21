import {
	LinkModel,
	PortModel,
	PortModelAlignment,
	PortModelGenerics,
	PortModelOptions
} from '@projectstorm/react-diagrams-core';
import { DefaultLinkModel } from '@projectstorm/react-diagrams';
import { AbstractModelFactory, DeserializeEvent } from '@projectstorm/react-canvas-core';

export interface LogicalPortModelOptions extends PortModelOptions {
	label?: string;
	in?: boolean;
	type?: string;
}

export interface LogicalPortModelGenerics extends PortModelGenerics {
	OPTIONS: LogicalPortModelOptions;
}

export class LogicalPortModel extends PortModel<LogicalPortModelGenerics> {
	constructor(isIn: boolean, name?: string, label?: string);
	constructor(options: LogicalPortModelOptions);
	constructor(options: LogicalPortModelOptions | boolean, name?: string, label?: string) {
		if (!!name) {
			options = {
				in: !!options,
				name: name,
				label: label
			};
		}
		options = options as LogicalPortModelOptions;
		super({
			label: options.label || options.name,
			alignment: options.in ? PortModelAlignment.LEFT : PortModelAlignment.RIGHT,
			type: 'default',
			...options
		});
	}

	deserialize(event: DeserializeEvent<this>) {
		super.deserialize(event);
		this.options.in = event.data.in;
		this.options.label = event.data.label;
	}

	serialize() {
		return {
			...super.serialize(),
			in: this.options.in,
			label: this.options.label
		};
	}

	link<T extends LinkModel>(port: PortModel, factory?: AbstractModelFactory<T>): T {
		let link = this.createLinkModel(factory);
		link.setSourcePort(this);
		link.setTargetPort(port);
		return link as T;
	}

	canLinkToPort(port: PortModel): boolean {
		if (port instanceof LogicalPortModel) {
			return this.options.in !== port.getOptions().in;
		}
		return true;
	}

	createLinkModel(factory?: AbstractModelFactory<LinkModel>): LinkModel {
		let link = super.createLinkModel();
		if (!link && factory) {
			return factory.generateModel({});
		}
		return link || new DefaultLinkModel();
	}
}
