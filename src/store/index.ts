import { create } from 'zustand';
import { Edge, XYPosition, MarkerType, addEdge } from '@xyflow/react';
import { Connection } from '@xyflow/system/dist/esm/types/general';
import { CustomNode } from './types';
import { v4 as uuidv4 } from 'uuid';
import { getSavedState } from '../services/storage';
import { initialEdges, initialNodes } from './data';
import { areAllPriorNodesComplete, topologicalSort } from '../services/node';

interface State {
  nodes: CustomNode[];
  edges: Edge[];
  interactiveMode: boolean;
  setInteractiveMode: (interactiveMode: boolean) => void;
  addNode: (node: CustomNode) => void;
  setNodes: (node: CustomNode[]) => void;
  setEdges: (edge: Edge[]) => void;
  reset: () => void;
  removeNode: (nodeId: string) => void;
  addEdge: (edge: Connection) => void;
  removeEdge: (edge: Edge) => void;
  updateNodePosition: (id: string, position: XYPosition) => void;
  updateNode: (node: Partial<CustomNode>) => void;
  updateNodeCompleted: (node: Partial<CustomNode>) => void;
  createNodeAndAddNode: (node?: Partial<CustomNode>) => void;
  refreshAllPriorCompleted: () => void;
}

const savedState = getSavedState();

export const useStore = create<State>((set) => ({
  nodes: savedState.nodes || initialNodes,
  edges: savedState.edges || initialEdges,
  interactiveMode: false,
  setInteractiveMode: (interactiveMode) => set((state) => ({ interactiveMode })),
  setNodes: (nodes) =>
    set(() => ({
      nodes,
    })),
  setEdges: (edges) =>
    set(() => ({
      edges,
    })),
  reset: () => set(() => ({ nodes: initialNodes, edges: initialEdges })),
  createNodeAndAddNode: (node) =>
    set((state) => {
      const nodes = state.nodes;
      // const lastNode = nodes[nodes.length - 1];

      // Since I'm doing topological sort, I have to resort the nodes so the furthest right node is considered the first node
      // I also assume there's at least one node already on the page, which is true in this case since I default to 3
      // nodes on the page.
      const lastNode = nodes.sort((a, b) => b.position.x - a.position.x)[0];
      const newPosition = lastNode
        ? { x: lastNode.position.x + 200, y: lastNode.position.y }
        : { x: 100, y: 100 }; // Initial position if there are no nodes

      const newNode: CustomNode = {
        id: uuidv4(),
        type: 'editableNode',
        data: { label: `${nodes.length + 1}`, isComplete: false, allPriorCompleted: false },
        position: newPosition,
        ...node,
      };
      return { nodes: [...state.nodes, newNode] };
    }),
  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
  removeNode: (nodeId) =>
    set((state) => {
      // Find edges associated with the node
      const incomingEdges = state.edges.filter((edge) => edge.target === nodeId);
      const outgoingEdges = state.edges.filter((edge) => edge.source === nodeId);

      let newEdges = [...state.edges];

      if (incomingEdges.length === 0 && outgoingEdges.length > 0) {
        // Root Node: delete all outgoing edges
        newEdges = newEdges.filter((edge) => edge.source !== nodeId);
      } else if (incomingEdges.length > 0 && outgoingEdges.length === 0) {
        // Leaf Node: delete all incoming edges
        newEdges = newEdges.filter((edge) => edge.target !== nodeId);
      } else if (incomingEdges.length === 1 && outgoingEdges.length === 1) {
        // Intermediate node with one incoming and one outgoing edge: connect the nodes
        const [incomingEdge] = incomingEdges;
        const [outgoingEdge] = outgoingEdges;
        const newEdge: Edge = {
          id: `e${incomingEdge.source}-${outgoingEdge.target}`,
          source: incomingEdge.source,
          target: outgoingEdge.target,
          markerEnd: { type: MarkerType.ArrowClosed },
        };
        newEdges = newEdges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId);
        newEdges.push(newEdge);
      } else if (incomingEdges.length > 1 && outgoingEdges.length === 1) {
        // Multiple incoming edges and one outgoing edge: redirect incoming edges to the outgoing target
        const [outgoingEdge] = outgoingEdges;
        // All edges not related to the node to delete. We want to keep all those.
        newEdges = newEdges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId);
        // Create new edges pointing to the outgoing node id
        incomingEdges.forEach((incomingEdge) => {
          newEdges.push({
            id: `e${incomingEdge.source}-${outgoingEdge.target}`,
            source: incomingEdge.source,
            target: outgoingEdge.target,
            markerEnd: { type: MarkerType.ArrowClosed },
          });
        });
      } else if (incomingEdges.length > 1 && outgoingEdges.length > 1) {
        // Multiple incoming and outgoing edges: delete all edges connected to this node
        newEdges = newEdges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId);
      }

      return {
        nodes: state.nodes.filter((node) => node.id !== nodeId),
        edges: newEdges,
      };
    }),
  updateNodePosition: (id: string, position: XYPosition) =>
    set((state) => ({
      nodes: state.nodes.map((curNode) => (curNode.id === id ? { ...curNode, position } : curNode)),
    })),
  refreshAllPriorCompleted: () =>
    set((state) => {
      const allNodes = state.nodes.reduce<Record<string, CustomNode>>((acc, curNode) => {
        acc[curNode.id] = curNode;
        return acc;
      }, {});

      const sortedNodes = topologicalSort(state.nodes, state.edges);

      const newNodes = sortedNodes.map((curNode) => ({
        ...curNode,
        data: {
          ...curNode.data,
          allPriorCompleted: areAllPriorNodesComplete(allNodes, state.edges, curNode),
        },
      }));

      return { nodes: newNodes };
    }),
  updateNode: (node) =>
    set((state) => {
      const updatedNodes = state.nodes.map((curNode) =>
        curNode.id === node.id ? { ...curNode, data: { ...curNode.data, ...node.data } } : curNode,
      );

      return { nodes: updatedNodes };
    }),
  updateNodeCompleted: (node) => {
    /**
     * Originally I did this in the updateNode fn, but figured there
     * was reason to run the recursion if it was non isComplete update
     */
    useStore.getState().updateNode(node);
    useStore.getState().refreshAllPriorCompleted();
  },
  addEdge: (edge) => set((state) => ({ edges: addEdge(edge, state.edges) })),
  removeEdge: (edge) =>
    set((state) => ({
      edges: state.edges.filter((curEdge) => curEdge.target !== edge.target),
    })),
}));
