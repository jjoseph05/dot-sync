import './App.css';
import firebase from './utils/firebase';
import {useEffect, useState, useRef} from 'react';
import { getDatabase, ref, onValue, set } from "firebase/database";

function App() {
  //TODO: document.width / 2 , document.height / 2] NG! needs to be the same on different szied clients, use something based on 0,0
  //TODO: Rename translate &6 remoteTranslate, maybe dotPosition
  //TODO: 
  const defaultDotPosition = { x: 0, y: 0 }
  const [remoteTranslate, setRemoteTranslate] = useState(defaultDotPosition);
  const [translate, setTranslate] = useState(defaultDotPosition);
  const [isDragging, setIsDragging] = useState(false);
  const database = getDatabase(firebase);
  const dotRef = useRef(null);

  //onvalue listend for event
  useEffect(() =>{
    const position = ref(database, `users/john`);
    onValue(position, (snapshot) => {
      let data = snapshot.val();
        setRemoteTranslate({ x: data.x, y: data.y})
    });

  }, [database])

  //set, write to db
  useEffect(() =>{
      const db = getDatabase();
      set(ref(db, 'users/john'), {
        x: translate.x,
        y: translate.y,
        driver: false
      });
  }, [translate])

  useEffect(() => {
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging]);

  const handleDragMove = (e) => {
    setTranslate({
      x: e.pageX,
      y: e.pageY
    });
  };

  const handlePointerDown = (e) => {
    console.log(e);
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
  let postion = isDragging ? translate : remoteTranslate;
  return (
    <div
      onPointerMove={handlePointerMove}
      className="App"
      style={{ backgroundColor: 'brown', width: '100%', minHeight: '1024px'}}
    >
      <h2>Hello, dot-sync</h2>
        <div
          ref={dotRef}
          onPointerDown={handlePointerDown}
          style={{
            backgroundColor: 'white',
            border: '2px solid black',
            borderRadius: '50%',
            cursor: 'pointer',
            height: '10px',
            position: 'absolute',
            top: `${postion.y - 5}px`,
            left: `${postion.x - 5}px`,
            width: '10px'
          }}>
        </div>
      {postion
        ? <p>x: {postion.x}, y: {postion.y }</p>
        : <p>loading initial coordinates</p>}
    </div>
  );
}

export default App;
