import './App.css';
import CourseDashboard from './pages/CourseDashboard';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function App() {
  const token = localStorage.getItem("token");

  const routeConfig = [
    { path: "/", element: <Login /> },
    { path: "/signin", element: <Signup /> },
    { path: "/courses", element:  <Home /> },
    { path: "/courses/:courseID", element: token ? <CourseDashboard /> : <Navigate to="/" /> },
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

