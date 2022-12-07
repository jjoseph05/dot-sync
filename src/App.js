import './App.css';
import firebase from './utils/firebase';
import {useEffect, useState} from 'react';
import { getDatabase, ref, child, get, onValue } from "firebase/database";


function App() {
  const [coordinateslist, setCoordinateslist] = useState();
  const [latestPosition, setLatestPosition] = useState();
  const database = getDatabase(firebase);

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

  useEffect(() =>{
    // let coordSyncData = [];
    const coordinates = ref(database, `users/john`);
    onValue(coordinates, (snapshot) => {
      const data = snapshot.val();
      setLatestPosition(data);
      // console.log('strar syc7',data);
    });

    // setCoordinateslist(coordData);
  }, [database])

  console.log('this is the first test');
  console.log('cords', coordinateslist);
  console.log('pozition-realtime', latestPosition);

  //  let {x, y} = coordinateslist;
  // console.log('x', x);
  // console.log('y', y);

  return (
    <div className="App">
      <h2>Hello, dot-sync</h2>
      {coordinateslist
        ? coordinateslist.map((coordinate) => {console.log('okkk',coordinate)})
        : <p>fuccck</p>}
    </div>
  );
}

export default App;
