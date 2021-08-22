import React from 'react';
import { ReactComponent as D20Image } from '../../assets/dice/d20.svg';
import { ReactComponent as D12Image } from '../../assets/dice/d12.svg';
import { ReactComponent as D10Image } from '../../assets/dice/d10.svg';
import { ReactComponent as D8Image } from '../../assets/dice/d8.svg';
import { ReactComponent as D6Image } from '../../assets/dice/d6.svg';
import { ReactComponent as D4Image } from '../../assets/dice/d4.svg';
import { ReactComponent as CustomDieImage } from '../../assets/dice/custom.svg';
import styled from 'styled-components';

const DieContainer = styled.div`
  position: relative;
  display: inline-block;

  & svg .base {
    fill: ${(props) => props.color ? props.color : '#ffffff'};
  }
`;

const findContrastColor = (color) => {
  if (!color || color.length < 7) return '#000000';

  var aRgbHex = color.slice(1).match(/.{1,2}/g);
  var aRgb = [
      parseInt(aRgbHex[0], 16),
      parseInt(aRgbHex[1], 16),
      parseInt(aRgbHex[2], 16)
  ];
  
  const brightness = (299*aRgb[0] + 587*aRgb[1] + 114*aRgb[2]) / 1000;

  return brightness > 100 ? '#000000': '#ffffff';
};

const getSizeMult = (size) => {
  switch(size) {
    case 'tiny':
      return 0.4;
    case 'small':
      return 0.6;
    case 'medium':
      return 0.8;
    case 'big':
      return 1;
    default: 
      return 0.8;
  }
};

const DieLabel = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  text-align: center;
  color: ${(props) => props.dieColor ? findContrastColor(props.dieColor) : '#000000'};
  font-weight: 600;
  user-select: none;
  z-index: 2;
  padding: 0;
  margin: 0;

  ${(props) => {
    const size = getSizeMult(props.size);
    const height = props.size === 'small' ? 0.95 : 1;

    switch (props.sides) {
      case 20:
        return `
          top: ${height * 30}%;
          font-size: ${size * 22}px;
        `;
      case 12:
        return `
          top: ${height * 29}%;
          font-size: ${size * 28}px;
        `;
      case 10:
        return `
          top: ${height * 38}%;
          font-size: ${size * 30}px;
        `;
      case 8:
        return `
          top: ${height * 27}%;
          font-size: ${size * 30}px;
        `;
      case 6:
        return `
          top: ${height * 29}%;
          font-size: ${size * 30}px;
        `;
      case 4:
        return `
          top: ${height * 41}%;
          width: 97%;
          font-size: ${size * 24}px;
          transform: scaleY(75%);
        `;
      default:
        return `
          top: ${height * 29}%;
          font-size: ${size * 28}px;
        `;
    }
  } }
`;

export default function Die(props) {

  const makeLabel = (diceType, value, dieColor) => {
    return value === undefined ? '' : 
      <DieLabel sides={diceType} dieColor={dieColor} size={props.size}>{value}</DieLabel>;
  };

  const size = getSizeMult(props.size);
  const params = {
    width:  `${100 * size}px`,
    height: `${100 * size}px`
  };

  const makeDice = (sides) => {
    switch (sides) {
      case 20:
        return <D20Image {...params} />;
      case 12:
        return <D12Image {...params} />;
      case 10:
        return <D10Image {...params} />;
      case 8:
        return <D8Image {...params} />;
      case 6:
        return <D6Image {...params} />;
      case 4:
        return <D4Image {...params} />;
      default:
        return <CustomDieImage {...params} />;
    }
  };

  return (
    <DieContainer color={props.color}>
      {makeDice(props.sides)}
      {makeLabel(props.sides, props.value, props.color)}
    </DieContainer>
  );
}