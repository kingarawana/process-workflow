import { useState, useEffect, useRef } from 'react';
import { Handle, Position } from '@xyflow/react';
import { NodeProps } from '@xyflow/react';
import { useStore } from '../store';
import { Box, Input, Icon } from '@chakra-ui/react';
import { Checkbox } from './ui/checkbox';
import { CustomNode } from '../store/types';
import { toaster } from './ui/toaster';

const EditableNode = ({ id, data }: NodeProps<CustomNode>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const inputRef = useRef<HTMLInputElement>(null);

  const { updateNode, updateNodeCompleted, interactiveMode, nodes } = useStore();
  const handleDoubleClick = (event: React.MouseEvent) => {
    setIsEditing(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(event.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    updateNode({ id, data: { ...data, label } });
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <Box
      padding="10px"
      width="100px"
      border={isEditing ? '2px solid blue' : '1px solid black'}
      borderRadius={5}
      bg={data.allPriorCompleted && !data.isComplete && interactiveMode ? 'green' : 'white'}
    >
      <Box display="flex" justifyContent="space-between">
        {isEditing ? (
          <Input
            ref={inputRef}
            type="text"
            value={label as string}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        ) : (
          <Box textAlign="left" onDoubleClick={handleDoubleClick}>
            {label as string}
          </Box>
        )}
        <Checkbox
          checked={data.isComplete}
          size="sm"
          onClick={(e) => {
            if (data.allPriorCompleted) {
              const node = { id, data: { ...data, isComplete: !data.isComplete } };

              updateNodeCompleted(node);
              if (
                nodes.filter((node) => node.id !== id).every((node) => node.data.isComplete) &&
                !data.isComplete
              ) {
                toaster.create({
                  description: 'Good job! Project completed!',
                  type: 'success',
                });
              }
            } else {
              toaster.create({
                description: 'Node can only be completed if all prior nodes are completed',
                type: 'warning',
              });
            }

            e.preventDefault(); // for some reason onClick was getting triggered twice without this.
          }}
          onChange={(change) => {
            console.log('change', change);
          }}
        />
      </Box>

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </Box>
  );
};

export default EditableNode;
