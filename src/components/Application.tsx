import * as SRD from '@projectstorm/react-diagrams';
import TSCustomNodeFactory  from './TSCustomNodeFactory.tsx';
import  TSCustomNodeModel from './TSCustomNodeModel.tsx';
import {
	DefaultDiagramState,
	DiagramEngine,
	LinkLayerFactory,
	NodeLayerFactory
} from '@projectstorm/react-diagrams-core';
import {
	DefaultLabelFactory,
	DefaultLinkFactory,
	DefaultNodeFactory,
	DefaultPortFactory
} from '@projectstorm/react-diagrams-defaults';

import { PathFindingLinkFactory } from '@projectstorm/react-diagrams-routing';
import { SelectionBoxLayerFactory, CanvasEngineOptions } from '@projectstorm/react-canvas-core';
/**
 * @author Dylan Vorster
 */
export class Application {
	protected activeModel: SRD.DiagramModel;
	protected diagramEngine: SRD.DiagramEngine;

	public createDefaultEngine(){
		const engine = new DiagramEngine({});

		// register model factories
		engine.getLayerFactories().registerFactory(new NodeLayerFactory());
		engine.getLayerFactories().registerFactory(new LinkLayerFactory());
		engine.getLayerFactories().registerFactory(new SelectionBoxLayerFactory());

		engine.getLabelFactories().registerFactory(new DefaultLabelFactory());
		engine.getNodeFactories().registerFactory(new TSCustomNodeFactory()); // i cant figure out why
		engine.getLinkFactories().registerFactory(new DefaultLinkFactory());
		engine.getLinkFactories().registerFactory(new PathFindingLinkFactory());
		engine.getPortFactories().registerFactory(new DefaultPortFactory());

		// register the default interaction behaviours
		engine.getStateMachine().pushState(new DefaultDiagramState());
		return engine;
	}

	constructor() {
		
		// register the two engines
		this.diagramEngine = this.createDefaultEngine();

		this.newModel();
	}

	public newModel() {
		this.activeModel = new SRD.DiagramModel();

		this.diagramEngine.setModel(this.activeModel);

		//3-A) create a default node
		var node1 = new TSCustomNodeModel('Node 1', 'rgb(0,192,255)');
		let port = node1.addOutPort('Out');
		node1.setPosition(100, 100);

		//3-B) create another default node
		var node2 = new TSCustomNodeModel('Node 2', 'rgb(192,255,0)');
		let port2 = node2.addInPort('In');
		node2.setPosition(400, 100);

		// link the ports
		let link1 = port.link(port2);

		this.activeModel.addAll(node1, node2, link1);
	}

	public getActiveDiagram(): SRD.DiagramModel {
		return this.activeModel;
	}

	public getDiagramEngine(): SRD.DiagramEngine {
		return this.diagramEngine;
	}
}
