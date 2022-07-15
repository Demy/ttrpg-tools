import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { L18N_NAMESPACE } from '../../utils/constans';
import DicePanel from './DicePanel';
import Die from './Die';
import DieParametersPanel from './DieParametersPanel';

const SmallTitle = styled.h5`
  margin: 1em 0 0.5em 0;
`;
const DiceBagPanel = styled.div`
  width: 100%;
  text-align: left;
`;
const DicePanelContainer = styled.div`
  margin: -5px -14px -10px -14px;
`;
const SelectedDiceContainer = styled.div`
  margin: 10px -7px;
`;
const DieButton = styled.div`
  cursor: pointer;
  display: inline-block;
`;
const SetInfo = styled.p`
  font-size: 0.8em;
  margin: 0;
`;

export default function DiceSetEditor({ dice, onUpdate, onColorChange }) {

  const [dieColor, setDieColor] = useState('');
  const [isCustomSelected, setCustomSelected] = useState(false);
  const [selected, setSelected] = useState(dice);

  const [lang] = useTranslation(L18N_NAMESPACE);

  const changeColor = (color) => {
    setDieColor(color);
    onColorChange(color);
  }

  const addDie = useCallback((sides, color) => {
    const existingIndex = selected.findIndex(die => {
      return die.die === sides && die.color === color
    });
    if (existingIndex < 0) {
      const newSet = selected.concat([{
        die: sides, 
        color: color ? color : dieColor
      }])
      setSelected(newSet);
      onUpdate(newSet);
    }
    setCustomSelected(false);
  }, [dieColor, onUpdate, selected]);

  const removeDie = (index) => {
    const newSet = selected.concat();
    newSet.splice(index, 1);
    setSelected(newSet);
    onUpdate(newSet);
  };

  return (
    <DiceBagPanel>
      <DieParametersPanel 
        diceColor={dieColor} 
        showSidesSetting={isCustomSelected} 
        onColorSelected={changeColor}
        onAddDie={addDie} 
        onCustomCanceled={setCustomSelected.bind(null, false)}
      />
      <DicePanelContainer>
        <DicePanel
          size="tiny"
          fromParams={false}
          diceColor={dieColor}
          onDieSelected={addDie}
          onCustomToggle={setCustomSelected}
        />
      </DicePanelContainer>
      <SmallTitle>{lang('your_set')}:</SmallTitle>
      {selected.length === 0 ? (
        <SetInfo>{lang('empty_set')}</SetInfo>
      ) : (
        <SelectedDiceContainer>
          {selected.map((die, index) => (
            <DieButton
              key={`dieSet${index}`} 
              onClick={removeDie.bind(null, index)}
            >
              <Die 
                color={die.color} 
                sides={die.die} 
                value={die.die}
                size="tiny"
              />
            </DieButton>
          ))}
        </SelectedDiceContainer>
      )}
    </DiceBagPanel>
  );
}