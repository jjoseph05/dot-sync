import './App.css';
import { getTestCoords } from './utils/firebase'

function App() {
  console.log('this is the first test');
  const coords = getTestCoords();
  console.log('cords', coords);

  return (
    <div className="App">
      <h2>Hello, dot-sync</h2>
    </div>
  );
}

export default App;
