import React from 'react';
import { FaFile, FaFolder, FaFolderOpen, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import styled from 'styled-components';
import keys from 'lodash/keys';
import PropTypes from 'prop-types';

const getPaddingLeft = (level, type) => {
  let paddingLeft = level * 20;
  if (type === 'file') paddingLeft += 20;
  return paddingLeft;
}

const StyledTreeNode = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 5px 8px;
  padding-left: ${props => getPaddingLeft(props.level, props.type)}px;
  &:hover {
    background: lightgray;
  }
`;

const NodeIcon = styled.div`
  font-size: 12px;
  margin-right: ${props => props.marginRight ? props.marginRight : 5}px;
`;

const NodeProp = styled.div`
  float: right;
`;

const TreeNode = (props) => {
  const { node, getChildNodes, level, onToggle, onNodeSelect, loc } = props;
  const cNodes = getChildNodes(loc);
  //console.log(cNodes);
  if (cNodes['type'] == 'property') {
    console.log(node);
  }
  return (
    <React.Fragment>
      
      <StyledTreeNode level={level} type={node.type}>
        {/* isOpen will always be false for properties, so it will never be triggered.
            This is how we handle the base case for the recursive tree; that is, by 
            checking if the treeNode is open. */}
        <NodeIcon onClick={() => onToggle(node)}>
          { node.type == 'node' && (node.isOpen ? <FaChevronDown /> : <FaChevronRight />) }
        </NodeIcon>
        
        <NodeIcon marginRight={10}>
          { node.type === 'property' && <FaFile /> }
          { node.type === 'node' && node.isOpen === true && <FaFolderOpen /> }
          { node.type === 'node' && !node.isOpen && <FaFolder /> }
        </NodeIcon>

        <span role="button" onClick={() => onNodeSelect(node)}>
          { loc } 
        </span>
        <NodeProp>
          {node.type === 'property' ? " = " + node.val : ''}
        </NodeProp>
      </StyledTreeNode>
      

      { node.isOpen && keys(node).map((nkey) => (
        <TreeNode getChildNodes={getChildNodes} onNodeSelect={onNodeSelect} onToggle={onToggle} node={cNodes[nkey]} level={level + 1} loc={nkey}/>
      ))}
    </React.Fragment>
  );
}

TreeNode.propTypes = {
  node: PropTypes.any.isRequired,
  getChildNodes: PropTypes.func.isRequired,
  level: PropTypes.number.isRequired,
  onToggle: PropTypes.func.isRequired,
  onNodeSelect: PropTypes.func.isRequired,
  loc: PropTypes.any.isRequired,
};

TreeNode.defaultProps = {
  level: 0,
};

export default TreeNode;