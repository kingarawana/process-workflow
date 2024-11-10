import { Box, IconButton } from '@chakra-ui/react';
import { CiTrash } from 'react-icons/ci';
import { useStore } from '../store';
import { toaster } from './ui/toaster';

export default function NodeContextMenu({ id, top, left, right, bottom, ...props }) {
  const { removeNode, edges, removeEdge } = useStore();

  const removeRightEdges = () => {
    const edgesToRemove = edges.filter((edge) => edge.source == id);
    edgesToRemove.forEach(removeEdge);
    toaster.create({
      description: 'Removed right edges',
      type: 'success',
    });
  };

  const removeLeftEdges = () => {
    toaster.create({
      description: 'Removed left edges',
      type: 'success',
    });
    const edgesToRemove = edges.filter((edge) => edge.target == id);
    edgesToRemove.forEach(removeEdge);
  };

  return (
    <Box
      style={{ top, left, right, bottom }}
      className="context-menu"
      {...props}
      display="flex"
      flexDirection="column"
    >
      <IconButton
        aria-label="Delete"
        variant="outline"
        px="2"
        display="flex"
        justifyContent="space-between"
        onClick={() => removeNode(id)}
      >
        Delete Node
        <CiTrash />
      </IconButton>
      <IconButton
        aria-label="Delete"
        variant="outline"
        px="2"
        display="flex"
        justifyContent="space-between"
        onClick={() => removeRightEdges()}
      >
        Delete Right Edges
        <CiTrash />
      </IconButton>
      <IconButton
        aria-label="Delete"
        variant="outline"
        px="2"
        display="flex"
        justifyContent="space-between"
        onClick={() => removeLeftEdges()}
      >
        Delete Left Edges
        <CiTrash />
      </IconButton>
    </Box>
  );
}
