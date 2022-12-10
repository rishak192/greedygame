import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Drag from './TableComponents/drag';

function App() {
  return (
  <div className="App">

    <Drag/>

    {/* <BrowserRouter>
      <Routes>
        <Route path="/analytics" element={<Drag/>}>
        </Route>
      </Routes>
    </BrowserRouter> */}

  </div>
  );
}

export default App;
