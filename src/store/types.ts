import { Node } from '@xyflow/react';

export type CustomNode = Node<NodeData>;

export type NodeData = {
  label: string;
  isComplete: boolean;
  allPriorCompleted?: boolean;
};
