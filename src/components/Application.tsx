import * as SRD from '@projectstorm/react-diagrams';
import LogicalNodeFactory  from './LogicalNodeFactory.tsx';
import  LogicalNodeModel from './LogicalNodeModel.tsx';
import {
	DefaultDiagramState,
	DiagramEngine,
	LinkLayerFactory,
	NodeLayerFactory
} from '@projectstorm/react-diagrams-core';
import {
	DefaultLabelFactory,
	DefaultLinkFactory,
	DefaultNodeFactory
} from '@projectstorm/react-diagrams-defaults';
import { LogicalPortFactory } from '../components/port/LogicalPortFactory.tsx';
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
		engine.getNodeFactories().registerFactory(new LogicalNodeFactory()); // i cant figure out why
		engine.getLinkFactories().registerFactory(new DefaultLinkFactory());
		engine.getLinkFactories().registerFactory(new PathFindingLinkFactory());
		engine.getPortFactories().registerFactory(new LogicalPortFactory());

		// register the default interaction behaviours
		engine.getStateMachine().pushState(new DefaultDiagramState());
		return engine;
	}

	constructor() {
		
		// register the two engines
		this.diagramEngine = this.createDefaultEngine();

		this.newModel();
	}
	public setModel(str){
		var model2 = new SRD.DiagramModel();
		model2.deserializeModel(JSON.parse(str), this.diagramEngine);
		this.diagramEngine.setModel(model2);
	}
	public newModel() {
		this.activeModel = new SRD.DiagramModel();

		this.diagramEngine.setModel(this.activeModel);

		//3-A) create a default node
		var node1 = new LogicalNodeModel('Input Source 1', 'rgb(0,192,255)');
		let port = node1.addOutPort('Out');
		node1.setPosition(100, 100);

		//3-B) create another default node
		var node2 = new LogicalNodeModel('Output Source 2', 'rgb(192,255,0)');
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
