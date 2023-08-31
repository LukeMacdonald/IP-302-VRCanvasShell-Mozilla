import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Signin from './pages/Signin';
import Files from './pages/Files';
import Home from './pages/Home';
import CreateRoom from './pages/CreateRoom';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Signin/>} />
          <Route path="/files" element={<Files/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/room/create" element={<CreateRoom/>}/>
          <Route path="/error" element={<NotFound/>}/>
        </Routes>
      </Router>
    </div>
  );
}
export default App;

