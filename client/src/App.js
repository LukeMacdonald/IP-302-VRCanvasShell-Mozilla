import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Signin from './pages/Signin';
import Files from './pages/Files';
import Home from './pages/Home';
import CreateRoom from './pages/CreateRoom';
import NotFound from './pages/NotFound';
import Courses from './pages/Courses';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Signin/>} />
          <Route path="/files" element={<Files/>} />
          <Route path="/courses/:courseId" element={<Home/>} />
          <Route path="/room/create" element={<CreateRoom/>}/>
          <Route path="/error" element={<NotFound/>}/>
          <Route path="/courses" element={<Courses/>}/>
        </Routes>
      </Router>
    </div>
  );
}
export default App;

