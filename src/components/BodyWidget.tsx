import * as React from 'react';
import * as _ from 'lodash';
import { TrayWidget } from './TrayWidget.tsx';
import { Application } from './Application';
import { TrayItemWidget } from './TrayItemWidget.tsx';
import { DefaultNodeModel } from '@projectstorm/react-diagrams';
import TSCustomNodeModel from './TSCustomNodeModel.tsx';
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

export class BodyWidget extends React.Component<BodyWidgetProps> {
	render() {
		return (
			<S.Body>
				<S.Header>
					<div className="title">Create a Circuit to Analyse</div>
				</S.Header>
				<S.Content>
					<TrayWidget>
						<TrayItemWidget model={{ type: 'inverter' }} name="Inverter" color="rgb(0,192,255)" />
						<TrayItemWidget model={{ type: 'nand' }} name="NAND" color="rgb(0,192,255)" />
						<TrayItemWidget model={{ type: 'in' }} name="Input Source" color="rgb(0,255,0)" />
						<TrayItemWidget model={{ type: 'out' }} name="Output Source" color="rgb(255,0,0)" />
					</TrayWidget>
					<S.Layer
						onDrop={(event) => {
							var data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'));
							var nodesCount = _.keys(this.props.app.getDiagramEngine().getModel().getNodes()).length;

							var node: TSCustomNodeModel = null;
							switch (data.type) {
								case 'in':
									node = new TSCustomNodeModel({name:'Input Source' + (nodesCount + 1), color:'rgb(0,255,0)',logicaleffort:10});
									node.addOutPort('Out');
									break;
								case 'out':
									node = new TSCustomNodeModel({name:'Output Source ' + (nodesCount + 1), color:'rgb(255,0,0)',logicaleffort:10});
									node.addInPort('In');
									break;
								case 'inverter':
									node = new TSCustomNodeModel({name:'Inverter ' + (nodesCount + 1), color:'rgb(0,192,255)',logicaleffort:10});
									node.addOutPort('Out');
									node.addInPort('In');
									break;
								case 'nand':
									node = new TSCustomNodeModel({name:'NAND ' + (nodesCount + 1), color:'rgb(0,192,255)',logicaleffort:10});
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
