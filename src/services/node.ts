import { CustomNode } from '../store/types';
import { Edge } from '@xyflow/react';

export const areAllPriorNodesComplete = (
  allNodes: Record<string, CustomNode>,
  edges: Edge[],
  currentNode: CustomNode,
): boolean => {
  const priorNodeIds = edges
    .filter((edge) => edge.target === currentNode.id)
    .map((edge) => edge.source);

  // Check if the current node has at least one outgoing edge
  const hasOutgoingEdges = edges.some((edge) => edge.source === currentNode.id);

  // If no prior nodes and no outgoing edges, return false (it's a free-floating node)
  if (!priorNodeIds.length && !hasOutgoingEdges) return false;

  // Return true only if the current node is `isComplete` and all prior nodes are complete
  /**
   * I've added and applied topological sort prior this function call, therefore
   * I've updated it to use priorNode.data.allPriorCompleted instead of a recursive
   * fn call. This should now be a time complexity of O(n + e) where n = # nodes
   * and e = # edges
   */
  return priorNodeIds.every((priorNodeId) => {
    const priorNode = allNodes[priorNodeId];
    return priorNode.data.isComplete && priorNode.data.allPriorCompleted;
  });
};

export const topologicalSort = (nodes: CustomNode[], edges: Edge[]) => {
  const adjacencyList = new Map<string, string[]>();
  const nodesMap = new Map<string, CustomNode>();

  nodes.forEach((node) => {
    adjacencyList.set(node.id, []);
    nodesMap.set(node.id, node);
  });

  edges.forEach((edge) => {
    adjacencyList.get(edge.source)?.push(edge.target);
  });

  const edgeTargets = edges.reduce((accum, edge) => {
    accum.add(edge.target);
    return accum;
  }, new Set<string>());

  const rootNodes = nodes.filter((node) => !edgeTargets.has(node.id));
  const queue: CustomNode[] = [...rootNodes];
  const result: CustomNode[] = [];

  while (queue.length > 0) {
    const curNode = queue.shift();
    result.push(curNode);
    adjacencyList.get(curNode.id).forEach((nodeId) => {
      const nextNode = nodesMap.get(nodeId);
      if (nextNode) {
        queue.push(nextNode);
        nodesMap.delete(nodeId);
      }
    });
  }
  return result;
};
