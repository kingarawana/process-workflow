import { CustomNode } from './types';
import { MarkerType } from '@xyflow/react';

export const initialNodes: CustomNode[] = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: { label: '1', isComplete: false, allPriorCompleted: false },
    type: 'editableNode',
  },
  {
    id: '2',
    position: { x: 200, y: 0 },
    data: { label: '2', isComplete: false, allPriorCompleted: false },
    type: 'editableNode',
  },
  {
    id: '3',
    position: { x: 400, y: 0 },
    data: { label: '3', isComplete: false, allPriorCompleted: false },
    type: 'editableNode',
  },
];
export const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    markerend: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    markerend: {
      type: MarkerType.ArrowClosed,
    },
  },
];
