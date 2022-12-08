import './App.css';
import firebase from './utils/firebase';
import {useEffect, useState, useRef} from 'react';
import { getDatabase, ref, child, get, onValue, set } from "firebase/database";

function App() {
  const [coordinateslist, setCoordinateslist] = useState();
  const [latestPosition, setLatestPosition] = useState();
  const [movedToXy, setMovedToXy] = useState({x:0, y:1});
  const database = getDatabase(firebase);
  // TODO: turn this into a ref
  const dotElementRef = useRef(null);
  let dragValue;

  //Get - read data once
  useEffect(() =>{
    const coordinateRef = ref(database);
    let coordData = [];
    get(child(coordinateRef, `users/john`)).then((snapshot) => {
      if (snapshot.exists()) {
        // console.log(snapshot.val());
        coordData.push(snapshot.val());
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
    setCoordinateslist(coordData);
  }, [database])

  //onvalue listend for events
  useEffect(() =>{
    // let coordSyncData = [];
    const coordinates = ref(database, `users/john`);
    onValue(coordinates, (snapshot) => {
      const data = snapshot.val();
      console.log("sycho", data);
      setLatestPosition(data);
      // console.log('strar syc7',data);
    });

    // setCoordinateslist(coordData);
  }, [database])

  useEffect(() =>{
    // function writeUserData(userId, name, email, imageUrl) {
      console.log('it was me. the post pusher.');
      console.log(movedToXy);
      const db = getDatabase();
      set(ref(db, 'users/john'), {
        x: movedToXy.x,
        y: movedToXy.y
      });
    // }
  }, [movedToXy])

  useEffect(() =>{
  
  }, [])

  const handleClick = (e) => {
    console.log("I clicked ", e);
    setMovedToXy({ x:e.pageX, y:e.pageY});
  }

  const handleMouseEvent = (e) => {

    if (e.type === 'mousedown') {
      dragValue = dotElementRef;
    }

    if (e.type === 'mouseup') {
      dragValue = null;
    }
    if (e.type === 'mousemove' && (dragValue !== undefined && dragValue !== null )) {
      debugger;
      let x = e.pageX;
      console.log(x);
      let y = e.pageY;
      console.log(y);
      setMovedToXy(x,y);
      console.log(dragValue);
      debugger;

      dragValue.current.style.left = (x-5) + "px";
      dragValue.current.style.top = (y-5) + "px";
    }
  }
  console.log('this is the first test');
  console.log('cords', coordinateslist);
  console.log('pozition-realtime', latestPosition);

  return (
    <div onMouseMove={handleMouseEvent} onMouseDown={handleMouseEvent} onMouseUp={handleMouseEvent} className="App" style={{ backgroundColor: 'brown', width: '100%', height: '500px'}}>
      <h2>Hello, dot-sync</h2>
      <div
        id="theDot"
        ref={dotElementRef}
        style={{
          width: '10px',
          height: '10px',
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
