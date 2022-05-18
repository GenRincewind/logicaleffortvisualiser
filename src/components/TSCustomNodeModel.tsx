import * as _ from 'lodash';
import { NodeModel, NodeModelGenerics, PortModelAlignment } from '@projectstorm/react-diagrams-core';
import { DefaultPortModel } from '@projectstorm/react-diagrams';
import { BasePositionModelOptions, DeserializeEvent } from '@projectstorm/react-canvas-core';

export interface TSCustomNodeModelOptions extends BasePositionModelOptions {
	name?: string;
	color?: string;
	logicaleffort?:number;
}

export interface TSCustomNodeModelGenerics extends NodeModelGenerics {
	OPTIONS: TSCustomNodeModelOptions;
}

export default class TSCustomNodeModel extends NodeModel<TSCustomNodeModelGenerics> {
	protected portsIn: DefaultPortModel[];
	protected portsOut: DefaultPortModel[];

	constructor(name: string, color: string);
	constructor(options?: TSCustomNodeModelOptions);
	constructor(options: any = {}, color?: string) {
		if (typeof options === 'string') {
			options = {
				name: options,
				color: color
			};
		}
		super({
			type: 'ts-custom-node',
			name: 'Untitled',
			color: 'rgb(0,192,255)',
			logicaleffort:10,
			...options
		});
		this.portsOut = [];
		this.portsIn = [];
	}

	doClone(lookupTable: {}, clone: any): void {
		clone.portsIn = [];
		clone.portsOut = [];
		super.doClone(lookupTable, clone);
	}

	removePort(port: DefaultPortModel): void {
		super.removePort(port);
		if (port.getOptions().in) {
			this.portsIn.splice(this.portsIn.indexOf(port), 1);
		} else {
			this.portsOut.splice(this.portsOut.indexOf(port), 1);
		}
	}

	addPort<T extends DefaultPortModel>(port: T): T {
		super.addPort(port);
		if (port.getOptions().in) {
			if (this.portsIn.indexOf(port) === -1) {
				this.portsIn.push(port);
			}
		} else {
			if (this.portsOut.indexOf(port) === -1) {
				this.portsOut.push(port);
			}
		}
		return port;
	}

	addInPort(label: string, after = true): DefaultPortModel {
		const p = new DefaultPortModel({
			in: true,
			name: label,
			label: label,
			alignment: PortModelAlignment.LEFT
		});
		if (!after) {
			this.portsIn.splice(0, 0, p);
		}
		return this.addPort(p);
	}

	addOutPort(label: string, after = true): DefaultPortModel {
		const p = new DefaultPortModel({
			in: false,
			name: label,
			label: label,
			alignment: PortModelAlignment.RIGHT
		});
		if (!after) {
			this.portsOut.splice(0, 0, p);
		}
		return this.addPort(p);
	}

	deserialize(event: DeserializeEvent<this>) {
		super.deserialize(event);
		this.options.name = event.data.name;
		this.options.color = event.data.color;
		this.options.logicaleffort = event.data.logicaleffort;
		this.portsIn = _.map(event.data.portsInOrder, (id) => {
			return this.getPortFromID(id);
		}) as DefaultPortModel[];
		this.portsOut = _.map(event.data.portsOutOrder, (id) => {
			return this.getPortFromID(id);
		}) as DefaultPortModel[];
	}

	serialize(): any {
		return {
			...super.serialize(),
			name: this.options.name,
			color: this.options.color,
			logicaleffort: this.options.logicaleffort,
			portsInOrder: _.map(this.portsIn, (port) => {
				return port.getID();
			}),
			portsOutOrder: _.map(this.portsOut, (port) => {
				return port.getID();
			})
		};
	}

	getInPorts(): DefaultPortModel[] {
		return this.portsIn;
	}

	getOutPorts(): DefaultPortModel[] {
		return this.portsOut;
	}
}