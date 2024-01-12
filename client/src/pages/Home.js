import React, { useEffect, useState } from "react";
import { getProfile } from "../database/api";
import LogoutButton from "../components/LogoutButton";
import Courses from "../components/Courses";

function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Make the first request
        const foundUser = await getProfile();
        setUser(foundUser);
        // Handle someData as needed
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    fetchProfile();
  }, []);

  return ( 
    <div className="w-full h-screen">
      <div className="w-full flex items-start justify-start">
        <div className="w-80 h-screen flex flex-col items-start justify-between bg-white border-r pt-20">
          <div className="w-full flex flex-col items-start justify-start bg-white gap-1">
          <h1 className="text-xl tracking-wide ml-3 mt-3">Account Details</h1>
          <hr className="w-full"/>
          <h2 className="text-md tracking-wide ml-4 mt-2 ">Personal Information</h2>
          <p  class="ml-5 w-full flex flex-row items-center h-11 focus:outline-none  text-gray-600  border-l-4 border-transparent  pr-6">
            <span class="inline-flex justify-center items-center ml-4 mr-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </span>
            <span class="ml-2 text-sm tracking-wide truncate">{user?.name} ({user?.login_id})</span>
          </p> 
          <p  class="ml-5 w-full flex flex-row items-center h-11 focus:outline-none  text-gray-600  border-l-4 border-transparent pr-6">
            <span class="inline-flex justify-center items-center ml-4 mr-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
            </span>
            <span class="ml-2 text-sm tracking-wide truncate">{user?.primary_email}</span>
          </p>
          <h2 className="text-md tracking-wide ml-4 mt-2">Settings</h2>
          <LogoutButton/>

          </div>
        </div>
        <div className="w-3/4 h-screen pt-20">
          <Courses/>
        </div>
      </div>

    </div>
  );
}
export default Home;