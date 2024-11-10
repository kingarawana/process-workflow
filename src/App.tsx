import {
  ReactFlow,
  MiniMap,
  Controls,
  Panel,
  BackgroundVariant,
  Background,
  useReactFlow,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { useStore } from './store';
import EditableNode from './components/EditableNode';
import { useCallback, useEffect, useRef, useState } from 'react';
import NodeContextMenu from './components/NodeContextMenu';
import { Button } from '@chakra-ui/react';
import { saveState } from './services/storage';

const onNodeDragStart = (event, node) => console.log('drag start', node);
const onNodeDragStop = (event, node) => console.log('drag stop', node);
const onNodeClick = (event, node) => console.log('click node', node);
const onPaneScroll = (event) => console.log('onPaneScroll', event);

const nodeTypes = {
  editableNode: EditableNode,
};

const InteractionFlow = () => {
  const {
    nodes,
    edges,
    updateNodePosition,
    addEdge,
    createNodeAndAddNode,
    reset,
    refreshAllPriorCompleted,
  } = useStore();
  const flowWrapperRef = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState(null);
  const reactFlowInstance = useReactFlow();
  const handleAddNode = async () => {
    createNodeAndAddNode();
    /**
     * I tried using useEffect dependent on nodes, but it didn't work correctly
     */
    setTimeout(() => {
      reactFlowInstance.fitView({ padding: 0.1, includeHiddenNodes: true });
    }, 1);
  };

  const handleSaveState = () => {
    saveState(nodes, edges);
  };

  const handleResetState = () => {
    reset();
    saveState(null, null);
  };

  const onNodeContextMenu = useCallback(
    (event, node) => {
      // Prevent native context menu from showing
      event.preventDefault();

      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.
      const pane = flowWrapperRef.current.getBoundingClientRect();
      setMenu({
        id: node.id,
        top: event.clientY < pane.height - 200 && event.clientY,
        left: event.clientX < pane.width - 200 && event.clientX,
        right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
        bottom: event.clientY >= pane.height - 200 && pane.height - event.clientY,
      });
    },
    [setMenu],
  );

  useEffect(() => {
    refreshAllPriorCompleted();
  }, []);

  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  return (
    <ReactFlow
      ref={flowWrapperRef}
      nodes={nodes}
      edges={edges}
      onNodesChange={(changes) => {
        changes.forEach((node) => {
          /**
           * Apparently this gets called on load. I have to check that it's actually
           * a position change event.
           */
          if (node.type === 'position') {
            updateNodePosition(node.id, node.position);
          }
        });
      }}
      onEdgesChange={(edges) => {
        console.log('edge change', edges);
      }}
      onNodeDoubleClick={() => {
        console.log('double clicked');
      }}
      elementsSelectable={true}
      nodesConnectable={true}
      nodesDraggable={true}
      zoomOnScroll={true}
      zoomOnDoubleClick={false}
      onConnect={addEdge}
      onNodeClick={onNodeClick}
      onNodeDragStart={onNodeDragStart}
      onNodeDragStop={(event, node) => {
        onNodeDragStop(event, node);
      }}
      panOnDrag={true}
      onPaneClick={onPaneClick}
      onPaneScroll={onPaneScroll}
      onNodeContextMenu={onNodeContextMenu}
      fitView
      attributionPosition="top-right"
      onDrop={(dropped) => {
        console.log('dropped', dropped);
      }}
      nodeTypes={nodeTypes}
    >
      <MiniMap />
      <Controls />
      <Background variant={BackgroundVariant.Lines} gap={12} size={1} />
      <Panel position="top-center">
        <Button colorPalette="teal" onClick={handleAddNode} mr={1}>
          Add Node
        </Button>
        <Button colorPalette="blue" onClick={handleSaveState} mr={1}>
          Save State
        </Button>
        <Button colorPalette="red" onClick={handleResetState}>
          Reset State
        </Button>
      </Panel>
      {menu && <NodeContextMenu onClick={onPaneClick} {...menu} />}
    </ReactFlow>
  );
};

export default InteractionFlow;
