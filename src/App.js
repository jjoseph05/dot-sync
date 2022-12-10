import './App.css';
import firebase from './utils/firebase';
import {useEffect, useState, useRef} from 'react';
import { getDatabase, ref, onValue, set } from "firebase/database";

function App() {
  const [latestPosition, setLatestPosition] = useState();
  const [movedToXy, setMovedToXy] = useState({x:0, y:1});
  const database = getDatabase(firebase);
  const dotElementRef = useRef(null);
  let dragValue;

  //onvalue listend for event
  useEffect(() =>{
    const coordinates = ref(database, `users/john`);
    onValue(coordinates, (snapshot) => {
      let data = snapshot.val();

      setLatestPosition(data);
    });
    console.log('listen event fires');
  }, [database])

  //set, write to db
  useEffect(() =>{
      const db = getDatabase();
      set(ref(db, 'users/john'), {
        x: movedToXy.x,
        y: movedToXy.y
      });
  }, [movedToXy])

  const handleMouseDown = (e) => {
    dragValue = dotElementRef;
  }
  const handleMouseUp = (e) => {
    dragValue = null;
  }

  const handleMouseMove = (e) => {
      let x = e.pageX;
      let y = e.pageY;
      // if(dragValue !== null && dragValue !== undefined ) {
      //   dragValue.current.style.left = (x-5) + "px";
      //   dragValue.current.style.top = (y-5) + "px";
      // }
      setMovedToXy({x,y});
  }
  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className="App"
      style={{ backgroundColor: 'brown', width: '100%', height: '500px'}}
    >
      <h2>Hello, dot-sync</h2>
      <div
        id="theDot"
        ref={dotElementRef}
        style={{
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          border: '2px solid black',
          backgroundColor: 'white',
          position: "absolute"
        }}>
      </div>
      {latestPosition
        ? <p>x {latestPosition.x}, y {latestPosition.y}</p>
        : <p>oops, something broke</p>}
    </div>
  );
}

export default App;
