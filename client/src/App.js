import './App.css';
import Home from './pages/Home';
import CreateRoom from './pages/CreateRoom';
import NotFound from './pages/NotFound';
import Courses from './pages/Courses';
import CreateModule from './pages/CreateModule';
import Login from './pages/Login';
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Signup from './pages/Signup';

function App() {
  return (
    <div className="App"> 
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signin" element={<Signup />} />
          <Route path="/courses" element={<Courses/>}/> 
          <Route path="/courses/:courseID" element={<Home />} />
          <Route path="/courses/:courseID/modules/add" element={<CreateModule/>} />
          <Route path="courses/:courseID/:moduleID/rooms/add" element={<CreateRoom/>}/>
          <Route path="/error" element={<NotFound/>}/>
        </Routes>
      </Router>
    </div>
  );
}
export default App;

