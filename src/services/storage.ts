import { Edge, Node } from '@xyflow/react';

const NODES_KEY = 'savedNodes';
const EDGES_KEY = 'savedEdges';

export const saveState = (nodes: Node[], edges: Edge[]) => {
  try {
    localStorage.setItem(NODES_KEY, JSON.stringify(nodes));
    localStorage.setItem(EDGES_KEY, JSON.stringify(edges));
    console.log('State saved successfully!');
  } catch (error) {
    console.error('Failed to save state:', error);
  }
};

export const getSavedState = () => {
  try {
    const savedNodes = localStorage.getItem(NODES_KEY);
    const savedEdges = localStorage.getItem(EDGES_KEY);

    const nodes = savedNodes ? JSON.parse(savedNodes) : null;
    const edges = savedEdges ? JSON.parse(savedEdges) : null;

    return { nodes, edges };
  } catch (error) {
    console.error('Failed to retrieve saved state:', error);
    return { nodes: [], edges: [] };
  }
};
