import './App.css';
import CourseDashboard from './pages/CourseDashboard';
import CreateRoom from './pages/CreateRoom';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import CreateModule from './pages/CreateModule';
import Login from './pages/Login';
import Signup from './pages/Signup';
import EditRoom from './pages/EditRoom';
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function App() {

  const token = localStorage.getItem("token");

  const routeConfig = [
    { path: "/", element: <Login /> },
    { path: "/signin", element: <Signup /> },
    { path: "/courses", element:  <Home />  },
    { path: "/courses/:courseID", element:  <CourseDashboard /> },
    { path: "/courses/:courseID/modules/add", element:  <CreateModule />  },
    { path: "/courses/:courseID/:moduleID/rooms/add", element:  <CreateRoom />  },
    { path: "/courses/:courseID/:moduleID/rooms/edit/:roomID", element: <EditRoom />  },

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

