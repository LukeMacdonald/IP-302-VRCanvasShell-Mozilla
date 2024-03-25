import React, { useEffect, useState } from "react";
import { getModules, getQuizzes } from "../database/api";
import { useNavigate } from "react-router-dom";
import { Module, CreateModule } from "../components/Module";
import QuizCard from "../components/Quiz";
import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";

function CourseDashboard() {
  const course = useSelector((state) => state.course.value);

  const [modules, setModules] = useState({});

  const [showCreateModuleModal, setShowCreateModuleModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedModules = await getModules(course.id);
        setModules(fetchedModules);
      } catch (error) {
        // navigate("/error");
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [course, navigate, showCreateModuleModal]);

  const handleAddModuleClick = (event) => {
    event.preventDefault();
    setShowCreateModuleModal(true);
  };

  return (
    <div className="w-full pt-20 flex items-start justify-between">
      <Sidebar courseName={course.name} />
      <div className="w-full ml-72 mr-5">
        <div className="flex items-center justify-between my-2">
          <h2 className="text-2xl font-semibold sm:text-xl">Modules</h2>
          <div className="flex gap-4">
            <button
              className="bg-slate-900 hover:bg-slate-500 px-3 py-2 rounded-md text-light md:text-sm xs:text-xs"
              onClick={handleAddModuleClick}
            >
              New Module
            </button>
          </div>
        </div>
        <hr />
        <div className="flex flex-wrap flex-row items-center justify-center">
          {Object.entries(modules).map(([moduleId, module]) => (
            <div className="w-full min-w-full m-3" key={String(moduleId)}>
              <Module moduleName={module.name} moduleID={module.module_id} />
            </div>
          ))}
        </div>
        {showCreateModuleModal && (
          <CreateModule
            showCreateModuleModal={showCreateModuleModal}
            setShowCreateModuleModal={setShowCreateModuleModal}
            updateModules={setModules}
          />
        )}
      </div>
    </div>
  );
}

function QuizDashboard() {
  const course = useSelector((state) => state.course.value);

  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedQuizzes = await getQuizzes(course.id);
        setQuizzes(fetchedQuizzes);
      } catch (error) {
        // navigate("/error");
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [course]);

  return (
    <div className="w-full pt-[8%] flex items-center justify-between">
      <Sidebar courseName={course.name} />
      <div className=" w-full ml-72 mr-5 flex flex-col items-start justify-between">
        <h2 className="text-2xl font-semibold">Quizzes</h2>
        <hr className="w-full" />
        {quizzes.map((quiz, index) => (
          <QuizCard key={index} quiz={quiz} courseID={course.id} />
        ))}
      </div>
    </div>
  );
}

export { CourseDashboard, QuizDashboard };

