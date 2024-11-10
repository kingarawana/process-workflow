import { useStore } from '../store';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  useReactFlow,
} from '@xyflow/react';
import { toaster } from './ui/toaster';
import { saveState } from '../services/storage';
import { Button } from '@chakra-ui/react';
import { Switch } from './ui/switch';
import NodeContextMenu from './NodeContextMenu';
import EditableNode from './EditableNode';
import { Tooltip } from './ui/tooltip';

export const Chart = () => {
  const {
    nodes,
    edges,
    updateNodePosition,
    addEdge,
    createNodeAndAddNode,
    reset,
    refreshAllPriorCompleted,
    setInteractiveMode,
    interactiveMode,
  } = useStore();
  const flowWrapperRef = useRef<HTMLDivElement>(null);
  const [showContextMenu, setShowContextMenu] = useState(null);
  const reactFlowInstance = useReactFlow();
  const handleAddNode = async () => {
    createNodeAndAddNode();
    refreshAllPriorCompleted();
    toaster.create({
      description: 'New node added',
      type: 'success',
    });
    /**
     * I tried using useEffect dependent on nodes, but it didn't work correctly
     */
    setTimeout(() => {
      reactFlowInstance.fitView({ padding: 0.1, includeHiddenNodes: true });
    }, 1);
  };

  const handleSaveState = () => {
    toaster.create({
      description: 'State saved locally',
      type: 'success',
    });
    saveState(nodes, edges);
  };

  const handleResetState = () => {
    // Rest in memory state
    reset();
    // Reset the localstorage state
    saveState(null, null);
    toaster.create({
      description: 'Page reset complete',
      type: 'success',
    });
  };

  const onNodeContextMenu = useCallback(
    (event, node) => {
      // Prevent native context menu from showing
      event.preventDefault();

      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.
      const pane = flowWrapperRef.current.getBoundingClientRect();
      setShowContextMenu({
        id: node.id,
        top: event.clientY < pane.height - 200 && event.clientY - pane.y, // Had to correct for the header
        left: event.clientX < pane.width - 200 && event.clientX,
        right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
        bottom: event.clientY >= pane.height - 200 && pane.height - event.clientY,
      });
    },
    [setShowContextMenu],
  );

  // Ensuring that allPriorCompleted are set on first load
  useEffect(() => {
    refreshAllPriorCompleted();
  }, []);

  const onPaneClick = useCallback(() => setShowContextMenu(null), [setShowContextMenu]);

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
      onConnect={(edge) => {
        addEdge(edge);
        refreshAllPriorCompleted();
      }}
      panOnDrag={true}
      onPaneClick={onPaneClick}
      onNodeContextMenu={onNodeContextMenu}
      fitView
      attributionPosition="top-right"
      nodeTypes={{
        editableNode: EditableNode,
      }}
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
        <Button colorPalette="red" onClick={handleResetState} mr={1}>
          Reset State
        </Button>
        <Switch
          size="lg"
          checked={interactiveMode}
          onCheckedChange={({ checked }) => setInteractiveMode(checked)}
        >
          Interactive Mode
        </Switch>
      </Panel>
      {showContextMenu && <NodeContextMenu onClick={onPaneClick} {...showContextMenu} />}
    </ReactFlow>
  );
};
