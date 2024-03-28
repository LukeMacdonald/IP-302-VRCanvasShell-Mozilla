import React, { useEffect, useState } from "react";
import { getProfile } from "../api/endpoints";
import LogoutButton from "../components/buttons/LogoutButton";
import Courses from "../components/Courses";
import UpdateKeyModal from "../components/modals/ApiKey";

function Home() {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const setVisible = () => {
    setShowModal(true);
  };
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Make the first request
        const foundUser = await getProfile();
        setUser(foundUser);
        // Handle someData as needed
      } catch (error) {
        console.error("An error occurred:", error);
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
            <hr className="w-full" />
            <h2 className="text-md tracking-wide ml-4 mt-2 ">
              Personal Information
            </h2>
            <p className="ml-5 w-full flex flex-row items-center h-11 focus:outline-none  text-gray-600  border-l-4 border-transparent  pr-6">
              <span className="inline-flex justify-center items-center ml-4 mr-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
              </span>
              <span className="ml-2 text-sm tracking-wide truncate">
                {user?.name} ({user?.login_id})
              </span>
            </p>
            <p className="ml-5 w-full flex flex-row items-center h-11 focus:outline-none  text-gray-600  border-l-4 border-transparent pr-6">
              <span className="inline-flex justify-center items-center ml-4 mr-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  ></path>
                </svg>
              </span>
              <span className="ml-2 text-sm tracking-wide truncate">
                {user?.primary_email}
              </span>
            </p>
            <h2 className="text-md tracking-wide ml-4 mt-2">Settings</h2>
            <p
              onClick={setVisible}
              className="ml-5 mt-2 w-full flex flex-row items-center h-11 focus:outline-none  text-gray-600  border-l-4 border-transparent  pr-6"
            >
              <span className="inline-flex justify-center items-center ml-4 mr-2">
                <svg
                  className="w-5 h-5 ml-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.0667 5C21.6586 5.95805 22 7.08604 22 8.29344C22 11.7692 19.1708 14.5869 15.6807 14.5869C15.0439 14.5869 13.5939 14.4405 12.8885 13.8551L12.0067 14.7333C11.272 15.465 11.8598 15.465 12.1537 16.0505C12.1537 16.0505 12.8885 17.075 12.1537 18.0995C11.7128 18.6849 10.4783 19.5045 9.06754 18.0995L8.77362 18.3922C8.77362 18.3922 9.65538 19.4167 8.92058 20.4412C8.4797 21.0267 7.30403 21.6121 6.27531 20.5876C6.22633 20.6364 5.952 20.9096 5.2466 21.6121C4.54119 22.3146 3.67905 21.9048 3.33616 21.6121L2.45441 20.7339C1.63143 19.9143 2.1115 19.0264 2.45441 18.6849L10.0963 11.0743C10.0963 11.0743 9.3615 9.90338 9.3615 8.29344C9.3615 4.81767 12.1907 2 15.6807 2C16.4995 2 17.282 2.15509 18 2.43738"
                    stroke="#1C274C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17.8851 8.29353C17.8851 9.50601 16.8982 10.4889 15.6807 10.4889C14.4633 10.4889 13.4763 9.50601 13.4763 8.29353C13.4763 7.08105 14.4633 6.09814 15.6807 6.09814C16.8982 6.09814 17.8851 7.08105 17.8851 8.29353Z"
                    stroke="#1C274C"
                    strokeWidth="1.5"
                  />
                </svg>{" "}
              </span>
              <span className="ml-4 text-sm tracking-wide truncate">
                Update API Key
              </span>
            </p>
            <LogoutButton />
          </div>
          <UpdateKeyModal showModal={showModal} setShowModal={setShowModal} />
        </div>
        <div className="w-3/4 h-screen pt-20">
          <Courses />
        </div>
      </div>
    </div>
  );
}
export default Home;
