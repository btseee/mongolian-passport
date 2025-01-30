import React from 'react';
import World from '@react-map/world'; 

const WorldMap: React.FC = () => {
  return (
    <World
      type={"select-multiple"}
      size={1200}
      mapColor="#3498db"
      strokeColor="#2c3e50"
      strokeWidth={1.5}
      hoverColor="#e74c3c"
      selectColor="#f1c40f"
      hints={true}
      hintTextColor="#ffffff"
      hintBackgroundColor="#2c3e50"
      hintPadding="8px"
      onSelect={(state: string | null, selectedStates?: string[]) => {
        if (state) {
          console.log("Selected State:", state, "All Selected States:", selectedStates);
        }
      }}
      borderStyle="solid"
      disableClick={true}
      hintBorderRadius={5}
      disableHover={false}
      key={Math.random()}
    />
  );
}

export default WorldMap;