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
   * An additional note. I know this implementation is suboptimal. I didn't have time to implement
   * a more optimal solution, but I'll describe it here. Instead of calling `areAllPriorNodesComplete`
   * recursively on each node, essentially recomputing the same nodes several times depending on
   * how many other edges has this as the source, we could do a topological presort of the nodes
   * within my `refreshAllPriorCompleted` function, that way we can guarantee that we are checking
   * from the bottom-up (or top down depending on how you visualize the graph) and change the line
   * `return priorNode.data.isComplete && areAllPriorNodesComplete(allNodes, edges, priorNode);`
   * to return priorNode.data.isComplete && priorNode.data.allPriorCompleted;`. By doing this
   * we go from an exponential time complexity to a linear time complexity of O(n + e) n = num nodes
   * e = num edges.
   *
   * In a production system, I would definitely recommend and put time towards this since in prod
   * environments, I'm sure the process workflows get extremely deep and interconnected.
   */
  return priorNodeIds.every((priorNodeId) => {
    const priorNode = allNodes[priorNodeId];
    return priorNode.data.isComplete && areAllPriorNodesComplete(allNodes, edges, priorNode);
  });
};
