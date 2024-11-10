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

  // If no prior nodes, consider it complete
  if (priorNodeIds.length === 0) return true;

  // Return true only if the current node is isComplete and all prior nodes are complete
  return priorNodeIds.every((priorNodeId) => {
    const priorNode = allNodes[priorNodeId];
    return priorNode.data.isComplete && areAllPriorNodesComplete(allNodes, edges, priorNode);
  });
};
