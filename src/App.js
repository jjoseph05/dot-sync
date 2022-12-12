import './App.css';
import firebase from './utils/firebase';
import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, set } from "firebase/database";

function App() {
  const defaultDotPosition = { x: 300, y: 150 }
  const [remoteDotPosition, setRemoteDotPosition] = useState(defaultDotPosition);
  const [dotPosition, setDotPosition] = useState(defaultDotPosition);
  const [isDragging, setIsDragging] = useState(false);
  const database = getDatabase(firebase);

  //onvalue, listend for event
  useEffect(() =>{
    const positionDB = ref(database, `users/john`);
    onValue(positionDB, (snapshot) => {
      let dbDotPosition = snapshot.val();
      setRemoteDotPosition({ x: dbDotPosition.x, y: dbDotPosition.y })
    });

  }, [database])

  //set, write to db
  useEffect(() =>{
    const db = getDatabase();
    set(ref(db, 'users/john'), {
      x: dotPosition.x,
      y: dotPosition.y
    });

  }, [dotPosition])

  useEffect(() => {
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging]);

  const handleDragMove = (e) => {
    setDotPosition({
      x: dotPosition.x + e.movementX,
      y: dotPosition.y + e.movementY,
    });
  };

  const handlePointerDown = (e) => {
    // When remote client initiates drag after dotPosition has been updated
    // dotPosition is not fully in sync with remoteDotPosition causing a jump when clicking
    // this resolves that, though it feels like a workaround
    // intuition says there is a more optimal solution for this
    setDotPosition({ x: remoteDotPosition.x , y: remoteDotPosition.y });
    setIsDragging(true);
  }

  const handlePointerUp = (e) => {
    setIsDragging(false);
  }

  const handlePointerMove = (e) => {
    if (isDragging) {
      handleDragMove(e);
    }
  }

  let position = isDragging ? dotPosition : remoteDotPosition;
  let dotSize = 20;

  return (
    <div
      onPointerMove={handlePointerMove}
      className="App"
      style={{ backgroundColor: 'brown', width: '100%', minHeight: '1024px'}}
    >
      <h2>Hello, dot-sync</h2>
        <div
          onPointerDown={handlePointerDown}
          style={{
            backgroundColor: 'white',
            border: '2px solid black',
            borderRadius: '50%',
            cursor: 'pointer',
            height: `${dotSize}px`,
            transform: `translateX(${position.x}px) translateY(${position.y}px) translateZ(0)`,
            width: `${dotSize}px`
          }}>
        </div>
      {position
        ? <p>x: {position.x}, y: {position.y }</p>
        : <p>loading initial coordinates</p>}
    </div>
  );
}

export default App;
