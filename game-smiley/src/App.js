import React, { useRef, useState, useEffect } from 'react';
import { EmojiButton } from '@joeattardi/emoji-button';
import './App.css';

function App() {
  const [cloneEmoji, setCloneEmoji] = useState('');
  const [impostorEmoji, setImpostorEmoji] = useState('');
  const [impostorIndex, setImpostorIndex] = useState(null);
  const [gridVisible, setGridVisible] = useState(false);
  const [width] = useState(10); // Fixed width for 10x10 grid
  const [height] = useState(10); // Fixed height for 10x10 grid
  const cloneInputRef = useRef(null);
  const impostorInputRef = useRef(null);
  const pickerRef = useRef(null);
  const [currentPicker, setCurrentPicker] = useState(null);

  useEffect(() => {
    const picker = new EmojiButton();
    pickerRef.current = picker;

    picker.on('emoji', selection => {
      const { emoji } = selection;

      if (currentPicker === 'clone') {
        if (cloneInputRef.current) {
          cloneInputRef.current.value = emoji;
          setCloneEmoji(emoji);
        }
      } else if (currentPicker === 'impostor') {
        if (impostorInputRef.current) {
          impostorInputRef.current.value = emoji;
          setImpostorEmoji(emoji);
        }
      }
    });
  }, [currentPicker]);

  const handleButtonClick = (pickerType) => {
    setCurrentPicker(pickerType);
    if (pickerRef.current) {
      if (pickerType === 'clone' && cloneInputRef.current) {
        pickerRef.current.togglePicker(cloneInputRef.current);
      } else if (pickerType === 'impostor' && impostorInputRef.current) {
        pickerRef.current.togglePicker(impostorInputRef.current);
      }
    }
  };

  const handleStartClick = () => {
    const totalCells = width * height;
    setImpostorIndex(Math.floor(Math.random() * totalCells));
    setGridVisible(true);
  };

  const renderGrid = () => {
    const grid = [];
    const totalCells = width * height;
    for (let i = 0; i < totalCells; i++) {
      grid.push(
        <div
          key={i}
          className="grid-item"
          style={{
            width: '22px',
            height: '22px',
          }}
        >
          {i === impostorIndex ? impostorEmoji : cloneEmoji}
        </div>
      );
    }
    return grid;
  };

  return (
    <div className="App">
      <input
        ref={cloneInputRef}
        type="text"
        placeholder="Sélectionner les clones"
        onClick={() => handleButtonClick('clone')}
      />
      <input
        ref={impostorInputRef}
        type="text"
        placeholder="Sélectionner l'imposteur"
        onClick={() => handleButtonClick('impostor')}
      />
      <button onClick={handleStartClick} disabled={!cloneEmoji || !impostorEmoji}>
        Start
      </button>
      {gridVisible && (
        <div
          className="grid-container"
          style={{
            gridTemplateColumns: `repeat(${width}, 22px)`,
          }}
        >
          {renderGrid()}
        </div>
      )}
    </div>
  );
}

export default App;
