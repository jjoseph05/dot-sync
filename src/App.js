import './App.css';
import firebase from './utils/firebase';
import {useEffect, useState} from 'react';
import { getDatabase, ref, child, get, onValue, set } from "firebase/database";

function App() {
  const [coordinateslist, setCoordinateslist] = useState();
  const [latestPosition, setLatestPosition] = useState();
  const [movedToXy, setMovedToXy] = useState({x:0, y:1});
  const database = getDatabase(firebase);


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

  const handleClick = (e) => {
    console.log("I clicked ", e);
    setMovedToXy({ x:e.pageX, y:e.pageY});
  }

  console.log('this is the first test');
  console.log('cords', coordinateslist);
  console.log('pozition-realtime', latestPosition);

  //  let {x, y} = coordinateslist;
  // console.log('x', x);
  // console.log('y', y);

  return (
    <div onClick={handleClick} className="App" style={{ backgroundColor: 'brown', width: '100%', height: '500px'}}>
      <h2>Hello, dot-sync</h2>
      <div
        id="theDot"
        style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          border: '2px solid black',
          backgroundColor: 'white'
        }}>
      </div>
      {latestPosition
        ? <p>x {latestPosition.x}, y {latestPosition.y}</p>
        : <p>oops, something broke</p>}
    </div>
  );
}

export default App;
