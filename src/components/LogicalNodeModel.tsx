import * as _ from 'lodash';
import { NodeModel, NodeModelGenerics, PortModelAlignment } from '@projectstorm/react-diagrams-core';
import { DefaultPortModel } from '@projectstorm/react-diagrams';
import { BasePositionModelOptions, DeserializeEvent } from '@projectstorm/react-canvas-core';

export interface LogicalNodeModelOptions extends BasePositionModelOptions {
	name?: string;
	color?: string;
	logicaleffort?: number;
	electricaleffort?: number;
	parasiticapacitance?: number;
	inherent_capacitance?: number;
	outputcapacitance?: number;
	inputcapacitance?: number;
}

export interface LogicalNodeModelGenerics extends NodeModelGenerics {
	OPTIONS: LogicalNodeModelOptions;
}

export default class LogicalNodeModel extends NodeModel<LogicalNodeModelGenerics> {
	protected portsIn: DefaultPortModel[];
	protected portsOut: DefaultPortModel[];

	constructor(name: string, color: string);
	constructor(options?: LogicalNodeModelOptions);
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
			logicaleffort: 1,
			electricaleffort: 10,
			inherent_capacitance:10,
			parasiticapacitance: 10,
			outputcapacitance: null,
			inputcapacitance: null,
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
		this.options = event.data.options;
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
			inherent_capacitance: this.options.inherent_capacitance,
			options:this.options,
			logicaleffort: this.options.logicaleffort,
			portsInOrder: _.map(this.portsIn, (port) => {
				return port.getID();
			}),
			portsOutOrder: _.map(this.portsOut, (port) => {
				return port.getID();
			})
		};
	}

	setOutputCapacitance(outputcapacitance) {
		this.options.outputcapacitance = outputcapacitance;
	}
	setInputCapacitance(inputcapacitance) {
		this.options.inputcapacitance = inputcapacitance;
	}
	getInPorts(): DefaultPortModel[] {
		return this.portsIn;
	}

	getOutPorts(): DefaultPortModel[] {
		return this.portsOut;
	}
}
