import './App.css';
import CourseDashboard from './pages/CourseDashboard';
import CreateRoom from './pages/CreateRoom';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import CreateModule from './pages/CreateModule';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function App() {
  const token = localStorage.getItem("token");

  const routeConfig = [
    { path: "/", element: <Login /> },
    { path: "/signin", element: <Signup /> },
    { path: "/courses", element: token ? <Home /> : <Navigate to="/" /> },
    { path: "/courses/:courseID", element: token ? <CourseDashboard /> : <Navigate to="/" /> },
    { path: "/courses/:courseID/modules/add", element: token ? <CreateModule /> : <Navigate to="/" /> },
    { path: "/courses/:courseID/:moduleID/rooms/add", element: token ? <CreateRoom /> : <Navigate to="/" /> },
    { path: "/error", element: <NotFound /> },
    { path: "*", element: <Navigate to="/" /> }, // Fallback route
  ];

  return (
    <div className="App">
      <Router>
        <Routes>
          {routeConfig.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={route.element}
            />
          ))}
        </Routes>
      </Router>
    </div>
  );
}

export default App;

