import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import this if you want to redirect the user after logout
import authService from '../redux/authService';

function LogoutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout(dispatch, navigate); 
  };

  return (
    <p onClick={handleLogout} className="pl-5 w-full flex flex-row items-center h-11 focus:outline-none  hover:bg-gray-100 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-red-500 pr-6 mt-2 ">
            <span class="inline-flex justify-center items-center ml-5 mr-5">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </span>
            <span class="ml-2 text-sm tracking-wide truncate">Logout</span>
    </p>
  );
}

export default LogoutButton;