import React from 'react';
import styled from 'styled-components';
import { SketchPicker, } from 'react-color';
import Popup from '../UI/Popup';
import { useTranslation } from 'react-i18next';
import { L18N_NAMESPACE } from '../../utils/constans';

const ParametersPanel = styled.div`
  text-align: left;
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

  const [lang] = useTranslation(L18N_NAMESPACE);

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
      <PanelLabel onClick={setShowPicker.bind(null, !showPicker)}>
        {lang('color')}:
      </PanelLabel>
      <ColorPicker>
        <ColorSample color={props.diceColor} onClick={setShowPicker.bind(null, !showPicker)} />
        <Popup show={showPicker} hide={setShowPicker.bind(null, false)}>
          <SketchPicker color={ props.diceColor } onChange={ handleChangeComplete }/>
        </Popup>
      </ColorPicker>
      {props.showSidesSetting ? (
        <div>
          <div>
            <PanelLabel>{lang('sides')}:</PanelLabel>
            <input type="number" value={sidesValue} onChange={handleSidesChange} />
          </div>
          <div>
            <AddButton onClick={handleAddDie}>
              {lang('add')}
            </AddButton>
            <CancelButton onClick={props.onCustomCanceled}>
              {lang('cancel')}
            </CancelButton>
          </div>
        </div>
      ) : <></>}
    </ParametersPanel>
  );
}
