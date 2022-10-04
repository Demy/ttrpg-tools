import React from "react";
import styled from 'styled-components';

const ToggleContainer = styled.div`
  text-align: center;
  display: inline-block;
  margin: 5px 10px 5px 0;
`;
const Label = styled.span`
  cursor: pointer;
  user-select: none;
  padding-right: 5px;
`;
const SwitchContainer = styled.div`
  position: relative;
  width: 35px;
  display: inline-block;
  text-align: left;
  vertical-align: middle;
`;
const SwitchViewLabel = styled.label`
  display: block;
  overflow: hidden;
  cursor: pointer;
  border: 0 solid #bbb;
  border-radius: 10px;
`;
const Inner = styled.span`
  display: block;
  width: 200%;
  margin-left: -100%;
  transition: margin 0.3s ease-in 0s;
  height: 18px;
  
  &:before,
  &:after {
    float: left;
    width: 50%;
    height: 18px;
    padding: 0;
    line-height: 18px;
    color: #fff;
    font-weight: bold;
    box-sizing: border-box;
  }
  
  &:before {
    content: "YES";
    padding-left: 5px;
    background-color: ${props => props.theme.colors.primary};
    color: transparent;
  }
  &:after {
    content: "NO";
    padding-right: 5px;
    background-color: ${props => props.theme.colors.primaryLight};
    color: transparent;
    text-align: right;
  }
`;
const Switch = styled.span`
  display: block;
  width: 12px;
  margin: 3px;
  background: #fff;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 17px;
  border: 0 solid #bbb;
  border-radius: 6px;
  transition: all 0.3s ease-in 0s;
`;
const Checkbox = styled.input`
  display: none;
  
  &:checked + ${SwitchViewLabel} ${Inner} {
    margin-left: 0;
  }
  &:checked + ${SwitchViewLabel} ${Switch} {
    right: 0px;
  }
`;

const ToggleSwitch = ({ id, label, value, onChange }) => {

  const handleChange = (e) => {
    if (onChange !== undefined) {
      onChange(e.target.checked);
    }
  };
  const handleLabelClick = () => {
    if (onChange !== undefined) {
      onChange(!value);
    }
  };

  return (
    <ToggleContainer>
      <Label onClick={handleLabelClick}>{label}: </Label>
      <SwitchContainer>
        <Checkbox 
          type="checkbox" 
          name={label} 
          id={id || label} 
          checked={value}
          onChange={handleChange} 
        />
        <SwitchViewLabel htmlFor={id || label}>
          <Inner />
          <Switch />
        </SwitchViewLabel>
      </SwitchContainer>
    </ToggleContainer>
  );
};

export default ToggleSwitch;
