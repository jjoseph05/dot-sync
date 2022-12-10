import './App.css';
import firebase from './utils/firebase';
import DragMove from "./DragMove";
import {useEffect, useState, useRef} from 'react';
import { getDatabase, ref, onValue, set } from "firebase/database";

function App() {
  const [remoteTranslate, setRemoteTranslate] = useState({x:0, y:1});
  const [translate, setTranslate] = useState({x:0, y:1});
  const [isDragging, setIsDragging] = useState(false);
  const database = getDatabase(firebase);
  const dotRef = useRef(null);
  let dragValue;

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
    const element = dotRef.current;
    if (element) {
      // element.addEventListener('mousedown', handlePointerDown);
      window.addEventListener('mouseup', handlePointerUp);
      // element.addEventListener('mousemove', handlePointerMove);

      return () => {
        element.removeEventListener('mousedown', handlePointerDown);
        window.removeEventListener('mouseup', handlePointerUp);
        element.removeEventListener('mousemove', handlePointerMove);
      };
    }

    return () => {};
  }, [translate, isDragging]);

  const handleDragMove = (e) => {
    console.log(e);
    // debugger;
    setTranslate({
      x: e.pageX,
      y: e.pageY
    });
  };

  const handlePointerDown = (e) => {
    setIsDragging(true);
    dragValue = dotRef;
  }
  const handlePointerUp = (e) => {
    setIsDragging(false);
    dragValue = null;
  }

  const handlePointerMove = (e) => {
    if (isDragging) {
      handleDragMove(e);

      // let x = e.pageX;
      // let y = e.pageY;
      //     dotRef.current.style.left = (x-5) + "px";
      //     dotRef.current.style.top = (y-5) + "px";
      }
  }
  let postion = isDragging ? translate : remoteTranslate;
  return (
    <div
      onMouseMove={handlePointerMove}
      onMouseDown={handlePointerDown}
      // onMouseUp={handleMouseUp}
      className="App"
      style={{ backgroundColor: 'brown', width: '100%', height: '500px'}}
    >
      <h2>Hello, dot-sync</h2>
        <div
          ref={dotRef}
          style={{
            backgroundColor: 'white',
            border: '2px solid black',
            borderRadius: '50%',
            height: '10px',
            // transform: `translateX(${translate.x}px) translateY(${translate.y}px)`,
            position: 'absolute',
            top: `${postion.y - 5}px`,
            left: `${postion.x - 5}px`,
            width: '10px'
          }}>
        </div>
      {postion
        ? <p>x: {postion.x}, y {postion.y }, driverStatus: {!!postion.driver ? 'you be driving' : 'sitting shotgun'}</p>
        : <p>oops, something broke</p>}
    </div>
  );
}

export default App;
