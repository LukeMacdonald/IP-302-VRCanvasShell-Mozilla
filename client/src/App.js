import './App.css';
import Home from './pages/Home';
import CreateRoom from './pages/CreateRoom';
import NotFound from './pages/NotFound';
import Courses from './pages/Courses';
import CreateModule from './pages/CreateModule';
import SelectModuleFile from './components/files/SelectModuleFile';
import SelectCourseFile from './components/files/SelectCourseFile';
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import ModuleFiles from './components/files/ModuleFiles';
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="App">
      <Navbar/>
      <Router>
        <Routes>
          <Route path="/" element={<Courses/>}/> 
          <Route path="/courses" element={<Courses/>}/>
          <Route path="/files" element={<SelectModuleFile/>} />
          <Route path="/files/all" element={<SelectCourseFile/>} />
          <Route path="/courses/:courseID" element={<Home/>} />
          <Route path="/module/files" element={<ModuleFiles/>}/>
          <Route path="/courses/:courseID/modules/add" element={<CreateModule/>} />
          <Route path="courses/:courseID/:moduleID/room/add" element={<CreateRoom/>}/>
          <Route path="/error" element={<NotFound/>}/>
        </Routes>
      </Router>
    </div>
  );
}
export default App;

