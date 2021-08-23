import React from 'react';
import styled from 'styled-components';
import { SketchPicker, } from 'react-color';
import Popup from '../Popup';

const ParametersPanel = styled.div`
  padding: 13px 15px;
  text-align: left;
`;
const Title = styled.h4`
  margin: 0;
  padding: 0 10px 7px 0;
`;
const PanelLabel = styled.div`
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
  padding: 5px 10px 5px 0;
`;
const ColorPicker = styled.div`
  position: relative;
  display: inline-block;
  vertical-align: middle;
`;
const ColorSample = styled.div`
  width: 20px;
  height: 20px;
  background-color: ${(props) => props.color};
  cursor: pointer;
  border: 1px solid #898989;
`;
const AddButton = styled.button`
  padding: 7px 16px;
  margin: 15px 14px 10px 0;
  min-width: 60px;
  cursor: pointer;
`;
const CancelButton = styled.button`
  padding: 7px 16px;
  margin: 10px 0;
  cursor: pointer;
`;


export default function DieParametersPanel(props) {
  
  const [showPicker, setShowPicker] = React.useState(false);
  const [sidesValue, setSidesValue] = React.useState(100);

  const handleChangeComplete = (color) => {
    props.onColorSelected(color.hex);
  }

  const handleSidesChange = (e) => {
    setSidesValue(e.target.value);
  };

  const handleAddDie = () => {
    props.onAddDie(sidesValue);
  };

  return (
    <ParametersPanel>
      <Title>Die parameters</Title>
      <PanelLabel onClick={setShowPicker.bind(null, !showPicker)}>Color:</PanelLabel>
      <ColorPicker>
        <ColorSample color={props.diceColor} onClick={setShowPicker.bind(null, !showPicker)} />
        <Popup show={showPicker} hide={setShowPicker.bind(null, false)}>
          <SketchPicker color={ props.diceColor } onChange={ handleChangeComplete }/>
        </Popup>
      </ColorPicker>
      {props.showSidesSetting ? (
        <div>
          <div>
            <PanelLabel>Sides:</PanelLabel>
            <input type="number" value={sidesValue} onChange={handleSidesChange} />
          </div>
          <div>
            <AddButton onClick={handleAddDie}>Add</AddButton>
            <CancelButton onClick={props.onCustomCanceled}>Cancel</CancelButton>
          </div>
        </div>
      ) : <></>}
    </ParametersPanel>
  );
}
