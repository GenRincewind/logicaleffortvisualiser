import * as React from 'react';
import * as _ from 'lodash';
import { TrayWidget } from './TrayWidget.tsx';
import { Application } from './Application';
import { TrayItemWidget } from './TrayItemWidget.tsx';
import { DefaultNodeModel } from '@projectstorm/react-diagrams';
import LogicalNodeModel from './LogicalNodeModel.tsx';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { DemoCanvasWidget } from '../helpers/DemoCanvasWidget.tsx';
import styled from '@emotion/styled';

export interface BodyWidgetProps {
	app: Application;
}

namespace S {
	export const Body = styled.div`
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		min-height: 100%;
	`;

	export const Header = styled.div`
		display: flex;
		background: rgb(30, 30, 30);
		flex-grow: 0;
		flex-shrink: 0;
		color: white;
		font-family: Helvetica, Arial, sans-serif;
		padding: 10px;
		align-items: center;
	`;

	export const Content = styled.div`
		display: flex;
		flex-grow: 1;
	`;

	export const Layer = styled.div`
		position: relative;
		flex-grow: 1;
	`;
}
export function Upload({ children, setOutFile, title }) {
	const [files, setFiles] = React.useState("");

	const handleChange = (e: any) => {
		const fileReader = new FileReader();
		fileReader.readAsText(e.target.files[0], "UTF-8");
		fileReader.onload = (e: any) => {
			console.log("e.target.result", e.target.result);
			setFiles(e.target.result);
			setOutFile(e.target.result);
		};
	};
	return (
		<div style={{ textAlign: 'center', width: '100%' }}>
			<p style={{ color: "white" }}>{title}</p>
			<div style={{
				margin: 'auto', textAlign: 'center', paddingLeft: '50%', transform: "translateX(-20%)"
			}}>
				<input type="file" onChange={handleChange} />
			</div>
			<br />

		</div>
	);
}
export type Port = {
	id: string;
	parentNodeID: string;
	in: boolean;
	capacitance: number;
};
export type Ports = {
	[index: string]: Port;
}
export type PortLink = {
	target: string;
	source: string;
};
export type Node = {
	id: string;
	inherent_capacitance: number;
	out_ports: PortLink[];
	in_ports: PortLink[];
	name: string;
};
export type Nodes = {
	[index: string]: Node;
}
export type GraphModel = {
	nodes: Nodes;
	ports: Ports;
}

export const INVERTER = {

};
export class BodyWidget extends React.Component<BodyWidgetProps> {
	state = { loading: false }
	combineCapacitance(cI, cR) {
		if (cI === 0 || cR === 0) return Math.max(cR, cI);
		return (cR * cI) / (cR + cI);
	}
	recurseCapacitance(cN: Node, iP, new_graph, nodesvisited) {
		let add_capacitance = 0;
		if (cN.id in nodesvisited) return 0;
		for (const port in cN.out_ports) {
			add_capacitance += this.recurseCapacitance(new_graph.nodes[new_graph.ports[port.target].parentNodeID], port.source, new_graph, nodesvisited);
		}
		if (cN.out_ports) {

		}
		new_graph.ports[iP].capacitance = this.combineCapacitance(add_capacitance, cN.inherent_capacitance);
	}
	calculateCapacitance(graph, startnode) {
		const new_graph = { ...graph };
		let nodesvisited: any = {};
		let currentnode = startnode;
		let nodes = [startnode,];
		while (nodes.length > 0) {
			const cNID = nodes.pop();
			const cN = new_graph[cNID];
			for (const port in cN.out_ports) {

			}
		}

	}

	convertSerializeToGraphModelForm(ser): GraphModel {

		var nodesGM: Nodes = {};
		var portsGM: Ports = {};
		var graph: GraphModel = { nodes: nodesGM, ports: portsGM };
		var links: any = {};
		var nodes: any = {};
		var linkDict: any = {};
		for (var i: number = 0; i < ser.layers.length; i++) {
			var layer = ser.layers[i];
			if (layer.type === "diagram-links") {
				links = { ...layer };
			}
			if (layer.type === "diagram-nodes") {
				nodes = { ...layer };
			}
		}
		for (const [key, value] of Object.entries<any>(nodes.models)) {
			graph.nodes[key] = {
				id: key,
				inherent_capacitance: value.inherent_capacitance,
				out_ports: [],
				in_ports: [],
				name: value.name
			};
			for (const port of value.ports) {
				graph.ports[port.id] = { id: port.id, parentNodeID: key, in: port.in, capacitance: 0 };
			}
		}
		for (const [key, value] of Object.entries(links.models)) {
			linkDict[key] = value;
		}
		for (const [key, value] of Object.entries<any>(nodes.models)) {
			for (const port of value.ports) {
				for (const linkID of port.links) {
					const link = linkDict[linkID];
					const outport = graph.ports[link.targetPort].in ? link.targetPort : link.sourcePort;
					const inport = !graph.ports[link.targetPort].in ? link.targetPort : link.sourcePort;
					if (port.in) {
						graph.nodes[graph.ports[port.id].parentNodeID].in_ports.push({ source: inport, target: outport });
					} else {

						graph.nodes[graph.ports[port.id].parentNodeID].out_ports.push({ source: inport, target: outport });
					}

				}
			}
		}
		return graph;
	}
	setOutFile = (str) => {
		this.props.app.setModel(str);
	}
	setOutputCapacitance = (data) => {
		for (const [key, value] of Object.entries<any>(data)) {
			const node = this.props.app.getDiagramEngine().getModel().getNode(key);
			console.log('capacitance', key, value, node);

			this.props.app.getDiagramEngine().getModel().getNode(key).setOutputCapacitance(value);

		}
		this.props.app.getDiagramEngine().repaintCanvas();
	}
	render() {
		return (
			<S.Body>
				<S.Header>
					<div className="title">Create a Circuit to Analyse - Drag and Drop from the menu on the left</div>
				</S.Header>
				<S.Content>
					<TrayWidget>
						<TrayItemWidget model={{ type: 'inverter' }} name="Inverter" color="rgb(0,192,255)" />
						{/*<TrayItemWidget model={{ type: 'nand' }} name="NAND" color="rgb(0,192,255)" />*/}
						<TrayItemWidget model={{ type: 'in' }} name="Input Source" color="rgb(0,255,0)" />
						<TrayItemWidget model={{ type: 'out' }} name="Output Source" color="rgb(255,0,0)" />
						<button
							disabled={this.state.loading}
							onClick={() => {
								var str = (this.props.app.getDiagramEngine().getModel().serialize());

								var basic = this.convertSerializeToGraphModelForm(str);
								const requestOptions = {
									method: 'POST',
									headers: { 'Content-Type': 'application/json' },
									body: JSON.stringify(basic)
								};
								this.setState({ loading: true });
								fetch('http://lukasnel.pythonanywhere.com/calculate_capacitance', requestOptions)
									.then(response => response.json())
									.then(data => {
										alert('successful');
										console.log("data", data);
										this.setOutputCapacitance(data);
										setTimeout(() => {
											this.props.app.getDiagramEngine().repaintCanvas();

											var str = JSON.stringify(this.props.app.getDiagramEngine().getModel().serialize());
											console.log("str", str);
											this.props.app.setModel(str);
											this.setState({ loading: false });

										}, 500
										)

									}
									).catch(error => {
										console.error(error);
										alert('Internal Server Error');
									});;
							}}>Calculate Output Capacitance</button><br></br>
						<button onClick={() => {
							var str = (this.props.app.getDiagramEngine().getModel().serialize());

							var basic = this.convertSerializeToGraphModelForm(str);
							console.log("serialize2", basic);
							const element = document.createElement("a");
							const file = new Blob([JSON.stringify(basic)], {
								type: "text/plain"
							});
							element.href = URL.createObjectURL(file);
							element.download = "node_map.txt";
							document.body.appendChild(element);
							element.click();
							alert(JSON.stringify(basic));
						}
						}>Download Node Data</button><br></br>
						<button onClick={() => {
							var str = (this.props.app.getDiagramEngine().getModel().serialize());

							console.log("serialize", str);
							alert(JSON.stringify(str));
							const element = document.createElement("a");
							const file = new Blob([JSON.stringify(str)], {
								type: "text/plain"
							});
							element.href = URL.createObjectURL(file);
							element.download = "node_diagram.txt";
							document.body.appendChild(element);
							element.click();
						}
						}>Download Node Diagram</button>
						<Upload title="Select Node Diagram File" setOutFile={this.setOutFile}>
							<button>Upload Node Diagram</button>
						</Upload>
					</TrayWidget>
					<S.Layer
						onDrop={(event) => {
							var data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'));
							var nodesCount = _.keys(this.props.app.getDiagramEngine().getModel().getNodes()).length;

							var node: LogicalNodeModel = null;
							switch (data.type) {
								case 'in':
									node = new LogicalNodeModel({ name: 'Input Source' + (nodesCount + 1), color: 'rgb(0,255,0)', logicaleffort: 0, inherent_capacitance: 0, });
									node.addOutPort('Out');
									break;
								case 'out':
									node = new LogicalNodeModel({ name: 'Output Source ' + (nodesCount + 1), color: 'rgb(255,0,0)', logicaleffort: 0, inherent_capacitance: 0, });
									node.addInPort('In');
									break;
								case 'inverter':
									node = new LogicalNodeModel({ name: 'Inverter ' + (nodesCount + 1), color: 'rgb(0,192,255)', logicaleffort: 1, inherent_capacitance: 10, });
									node.addOutPort('Out');
									node.addInPort('In');
									break;
								case 'nand':
									node = new LogicalNodeModel({ name: 'NAND ' + (nodesCount + 1), color: 'rgb(0,192,255)', logicaleffort: Math.round(4 / 3 * 100) / 100 });
									node.addInPort('In 1');
									node.addInPort('In 2');
									node.addOutPort('Out');
									break;
							}
							var point = this.props.app.getDiagramEngine().getRelativeMousePoint(event);
							node.setPosition(point);
							this.props.app.getDiagramEngine().getModel().addNode(node);
							this.forceUpdate();
						}}
						onDragOver={(event) => {
							event.preventDefault();
						}}>
						<DemoCanvasWidget>
							<CanvasWidget engine={this.props.app.getDiagramEngine()} />
						</DemoCanvasWidget>
					</S.Layer>
				</S.Content>
			</S.Body>
		);
	}
}
