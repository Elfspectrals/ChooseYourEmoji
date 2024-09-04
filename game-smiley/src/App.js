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
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  
  // Separate refs for each input
  const cloneInputRef = useRef(null);
  const impostorInputRef = useRef(null);
  
  // Separate pickers for each input
  const clonePickerRef = useRef(null);
  const impostorPickerRef = useRef(null);

  useEffect(() => {
    // Initialize pickers independently
    const clonePicker = new EmojiButton();
    const impostorPicker = new EmojiButton();

    clonePickerRef.current = clonePicker;
    impostorPickerRef.current = impostorPicker;

    clonePicker.on('emoji', selection => {
      const { emoji } = selection;
      if (cloneInputRef.current) {
        cloneInputRef.current.value = emoji;
        setCloneEmoji(emoji);
      }
    });

    impostorPicker.on('emoji', selection => {
      const { emoji } = selection;
      if (impostorInputRef.current) {
        impostorInputRef.current.value = emoji;
        setImpostorEmoji(emoji);
      }
    });
  }, []);

  const handleButtonClick = (pickerType) => {
    if (pickerType === 'clone' && cloneInputRef.current && clonePickerRef.current) {
      clonePickerRef.current.togglePicker(cloneInputRef.current);
    } else if (pickerType === 'impostor' && impostorInputRef.current && impostorPickerRef.current) {
      impostorPickerRef.current.togglePicker(impostorInputRef.current);
    }
  };

  const handleStartClick = () => {
    const totalCells = width * height;
    setImpostorIndex(Math.floor(Math.random() * totalCells));
    setGridVisible(true);
    setGameOver(false);
    setTimer(0);

    const id = setInterval(() => {
      setTimer(prevTime => prevTime + 1);
    }, 1000);
    setIntervalId(id);
  };

  const handleCellClick = (index) => {
    if (index === impostorIndex) {
      clearInterval(intervalId);
      setGameOver(true);
    }
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
            cursor: 'pointer',
          }}
          onClick={() => handleCellClick(i)}
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
        <>
          <div className="timer">
            Time: {timer}s
          </div>
          <div
            className="grid-container"
            style={{
              gridTemplateColumns: `repeat(${width}, 22px)`,
            }}
          >
            {renderGrid()}
          </div>
          {gameOver && <div className="game-over">You found the impostor in {timer} seconds!</div>}
        </>
      )}
    </div>
  );
}

export default App;
