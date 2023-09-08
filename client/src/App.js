import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Files from './pages/Files';
import Home from './pages/Home';
import CreateRoom from './pages/CreateRoom';
import NotFound from './pages/NotFound';
import Courses from './pages/Courses';
import CreateModule from './pages/CreateModule';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Courses/>}/> 
          <Route path="/courses" element={<Courses/>}/>
          <Route path="/files" element={<Files/>} />
          <Route path="/courses/:courseId" element={<Home/>} />
          <Route path="/courses/:courseId/modules/add" element={<CreateModule/>} />
          <Route path="courses/:coursesID/:moduleID/room/add" element={<CreateRoom/>}/>
          <Route path="/error" element={<NotFound/>}/>
        </Routes>
      </Router>
    </div>
  );
}
export default App;

