import { useState, useEffect, useRef } from 'react';
import { Handle, Position } from '@xyflow/react';
import { NodeProps } from '@xyflow/react';
import { useStore } from '../store';
import { Box, Input, Icon } from '@chakra-ui/react';
import { Checkbox } from './ui/checkbox';
import { CustomNode } from '../store/types';

const EditableNode = ({ id, data, selected }: NodeProps<CustomNode>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const inputRef = useRef<HTMLInputElement>(null);

  const { updateNode, removeNode, updateNodeCompleted, interactiveMode } = useStore();
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
      border={selected ? '2px solid blue' : '1px solid black'}
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
            const node = { id, data: { ...data, isComplete: !data.isComplete } };
            // updateNode(node);
            updateNodeCompleted(node);
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
