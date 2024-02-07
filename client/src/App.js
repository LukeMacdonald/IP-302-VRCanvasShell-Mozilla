import './App.css';
import {CourseDashboard, QuizDashboard} from './pages/Dashboards';
import CreateRoom from './pages/CreateRoom';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import { CreateModule } from './components/Module';
import { Login, Signup } from './pages/Authentication';
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthenticatedLayout, UnAuthenticatedLayout } from './components/Layout';
import QuizStart from './pages/QuizStart';


function App() {

  return (
    <div className="App min-w-full">
      <Router>
      <main role="main" className="main">
        <Routes>
          
          <Route path='*' element={<Navigate to="/"/>}/>
          
          <Route path='/' element={<UnAuthenticatedLayout/>}>
            <Route path='' element={<Login/>}/>
            <Route path='signup' element={<Signup/>}/>
          </Route>

          <Route path='/error' element={<NotFound/>}/>
          <Route path='/launch-quiz/:courseID/:quizID' element={<QuizStart/>}/>
            
          <Route path='/courses' element={<AuthenticatedLayout/>}>
            <Route path='' element={<Home/>}/>
            <Route path=':courseID' element={<CourseDashboard />}/>
            <Route path=':courseID/quizzes' element={<QuizDashboard/>}/>
            <Route path=':courseID/modules/add' element={<CreateModule/>}/>
            <Route path=':courseID/:moduleID/rooms/add' element={<CreateRoom/>}/>
          </Route>
    
        </Routes>

        </main>
        
      </Router>
    </div>
  );
}

export default App;

