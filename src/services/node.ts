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
  return priorNodeIds.every((priorNodeId) => {
    const priorNode = allNodes[priorNodeId];
    return priorNode.data.isComplete && areAllPriorNodesComplete(allNodes, edges, priorNode);
  });
};
