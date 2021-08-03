import React, { useState } from 'react';
import Die from './Die';
import styled from 'styled-components';

const DiceContainer = styled.div`
  display: inline-block;
  vertical-align: top;
  width: 100%;
`;
const TopPanel = styled.div`
  width: 100%;
`;
const CodeInput = styled.input`
  display: inline-block;
  vertical-align: middle;
  width: 200px;
  padding: 7px;
  margin: 15px;
`;
const ErrorText = styled.div`
  display: inline-block;
  vertical-align: middle;
  width: 150px;
  margin: 15px 0;
  color: red;
`;
const RollButton = styled.button`
  display: inline-block;
  vertical-align: middle;
  float: right;
  padding: 12px 24px;
  margin: 10px 10px 10px 0;
  cursor: pointer;
  width: 110px;
`;
const ClearButton = styled.button`
  float: right;
  padding: 10px 14px;
  margin: 13px 10px 13px 0;
  cursor: pointer;
  border: none;
`;
const DieButton = styled.div`
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
  position: relative;
  padding: 2px;
`;
const Dice = styled.div`
  padding: 10px;
  text-align: center;
`;

export default function SelectedDicePanel(props) {

  const [rollCode, setRollCode] = useState('');
  const [isParseError, setIsParseError] = useState(false);
  const [parseError, setParseError] = useState('');
  const [parsedFromCode, setParsedFromCode] = useState([]);
  const [lastParsed, setLastParsed] = useState('');

  const addDiceFrom = (die, index) => {
    const result = [];
    for (let j = 0; j < die.count; j++) {
      result.push(
        <DieButton
          key={`selected${index}-${die.die}-${die.color}-${j}`}
          onClick={removeDie.bind(null, index)} >
          <Die sides={die.die} color={die.color} value={die.die} size="small" />
        </DieButton>
      );
    }
    return result;
  };

  const handleCodeChange = (e) => {
    setRollCode(e.target.value);
  };

  const parseCodeToDice = (code) => {
    if (lastParsed === code) return;
    const result = [];
    let allDiceAmount = 0;
    const pieces = code.split(' ').join(',').split(',');
    for (let i = 0; i < pieces.length; i++) {
      const piece = pieces[i];
      if (piece) {
        const dIndex = piece.indexOf('d');
        if (dIndex <= 0) {
          setIsParseError(true);
          setParseError('Invalid input');
          return;
        }
        const amountStr = piece.substring(0, dIndex);
        const amount = +amountStr;
        const dieStr = piece.substr(dIndex + 1);
        const die = +dieStr;
        if (amount.toString() !== amountStr || 
          die.toString() !== dieStr || 
          amount <= 0 || die <= 1) {
            setIsParseError(true);
            setParseError('Invalid input');
            return;
        }
        if (allDiceAmount + amount > props.max) {
            setIsParseError(true);
            setParseError('Too many dice');
            return;
        }
        allDiceAmount += amount;
        
        const existingIndex = result.findIndex(selected => 
          selected.die === die && selected.color === props.diceColor);
        if (existingIndex < 0) {
          result.push({ die: die, color: props.diceColor, count: amount });
        } else {
          result[existingIndex] = { 
            ...result[existingIndex], 
            count: result[existingIndex].count + amount 
          };
        }
      }
    }
    setParsedFromCode(result);
    setIsParseError(false);
    setLastParsed(code);
  };

  const getCode = (dice) => {
    const diceCollection = {};
    dice.forEach(die => {
      const count = diceCollection[die.die];
      diceCollection[die.die] = count !== undefined ? count + 1 : 1;
    });
    let result = '';
    for (let key in diceCollection) {
      result += diceCollection[key] + 'd' + key + ' ';
    }
    return result;
  };

  const handleKeyPress = (e) => {
    if (e.charCode === 13) {
      parseCodeToDice(rollCode);
    }
  };

  const handleCodeInputBlur = () => {
    parseCodeToDice(rollCode);
  };

  const removeDie = (index) => {
    const copy = props.selected.concat();
    copy.splice(index, 1);
    props.onUpdate(copy);
  };

  const handleClear = () => {
    props.onUpdate([]);
  };

  const selected = isParseError || parsedFromCode.length === 0 ? props.selected : parsedFromCode;

  return (
    <DiceContainer>
      <TopPanel>
        <CodeInput 
          type="text"
          placeholder={rollCode.length === 0 ? getCode(props.selected) : ''} 
          value={rollCode} 
          onChange={handleCodeChange} 
          onKeyPress={handleKeyPress}
          onBlur={handleCodeInputBlur} 
        />
        <ErrorText>{isParseError && rollCode ? parseError : ''}</ErrorText>
        <RollButton onClick={props.onRoll}>ROLL</RollButton>
        <ClearButton onClick={handleClear}>Clear</ClearButton>
      </TopPanel>
      <Dice>
        {selected.map((die, i) => addDiceFrom(die, `selected${i}`))}
      </Dice>
    </DiceContainer>
  );
}