import { useState, useEffect, useRef } from 'react';
import starterData from '../data.json';
import { AvatarGroup } from '@mui/material';
import { Avatar } from '@mui/material';
import CustomizedDialogs from './components/AddTaskPrompt';
import TaskListPrompt from './components/AddListPrompt';
import Trotacka from './assets/trotacka.svg';
import Comments from './assets/comments.svg';
import Subtasks from './assets/subtasks.svg';
const App = () => {
  //useRefs
  const dropdownRef = useRef();
  const menuRef = useRef();
  //useStates
  
  const [data, setData] = useState(starterData);
  const [activeList, setActiveList] = useState(null);
  const [activePrompt, setActivePrompt] = useState(0);
  const [newTaskSubmitted, setNewTaskSubmitted] = useState(false);

  //& info from input
  const [newTaskName, setNewTaskName] = useState('');
  const [isNewTaskImportant, setIsNewTaskImportant] = useState(false);
  const [newTaskListId, setNewTaskListId] = useState('');
  const [taskAdding, setTaskAdding] = useState(false);
  //& for taskListPrompt

  const [taskListPromptOpen, setTaskListPromptOpen] = useState(false);
  const [newTaskListName, setNewTaskListName] = useState('');
  const [taskListAdding, setTaskListAdding] = useState(false);
  const [taskListSubmitted, setTaskListSubmitted] = useState(false);
  //functions

  const renderLabels = (task) => {
    if (!task.labels) return null;
    return (
      task.labels.length > 0 && (
        <div className="flex gap-2 pt-3 items-center">
          {task.labels.map((taskLabel) => {
            return data.labels.slice(0, 5).map((label) => {
              return taskLabel === label.id && <div key={label.id} className={`w-[0.6rem] h-[0.6rem] rounded-[100%] opacity-80 mt-[2px]`} style={{ backgroundColor: label.color }}></div>;
            });
          })}
          {task.labels.length > 5 && <span className="text-gray-400"> +{task.labels.length - 5}</span>}
        </div>
      )
    );
  };

  const renderAvatars = (task) => {
    if (!task.asignee) return null;
    return (
      <div className="avatars absolute right-2 bottom-2 flex">
        <AvatarGroup>
          {task.assignee.map((assignee) => {
            return data.users.map((user) => {
              return assignee === user.id && <Avatar key={user.id} alt={user.name} src={user.avatar_url} />;
            });
          })}
        </AvatarGroup>
      </div>
    );
  };

  const renderTaskNameAndTaskDates = (task) => {
    return (
      <div className="flex flex-col">
        <span>{task.name}</span>
        {task.due_on ? (
          <span className="text-gray-600 font-bold">
            {task.start_on != null && `${processedDate(task.start_on)}. - `}
            {processedDate(task.due_on) && processedDate(task.due_on) + '.'}
          </span>
        ) : null}
      </div>
    );
  };
  const renderSubtasks = (task) => {
    if (!task.open_subtasks) return null;
    return (
      task.open_subtasks > 0 && (
        <div className="flex items-center gap-1 pt-3">
          <img src={Subtasks} alt="" />
          <span className="text-gray-400">{task.open_subtasks}</span>
        </div>
      )
    );
  };
  const renderComments = (task) => {
    if (!task.comments_count) return null;
    return (
      task.comments_count > 0 && (
        <div className="flex items-center gap-1 pt-3">
          <img src={Comments} alt="" />
          <span className="text-gray-400">{task.comments_count}</span>
        </div>
      )
    );
  };

  const processedDate = (unprocessedDate) => {
    const options = { month: 'short', day: 'numeric' };
    const d = new Date(unprocessedDate);
    const finalD = d.toLocaleDateString('en-US', options);
    return finalD;
  };

  //event handlers
  const handleDots = (id) => {
    activeList === id.id ? setActiveList("") : setActiveList(id.id);
  };

  const handleAddTask = (list) => {
    setActivePrompt(list.id);
  };

  const handleAddTaskList = () => {
    setActiveList("");
    setTaskListPromptOpen(true);
  };
  const addTask = () => {
    newTaskSubmitted &&
      setData({
        ...data,
        tasks: [
          ...data.tasks,
          {
            id: data.tasks.length,
            name: newTaskName,
            is_important: isNewTaskImportant,
            task_list_id: data.task_lists.filter((list) => list.name === newTaskListId)[0]?.id,
          },
        ],
      });
    setTaskAdding(false);
    setNewTaskSubmitted(false);
  };
  const addTaskList = () => {
    taskListSubmitted &&
      setData({
        ...data,
        task_lists: [
          ...data.task_lists,
          {
            id: data.task_lists.length + 1,
            open_tasks: 1,
            name: newTaskListName,
          },
        ],
      });
    setTaskListAdding(false);
    setTaskListSubmitted(false);
  };

  const moveToTrash = (list) => {
    setActiveList("");
    setData({
      ...data,
      task_lists: data.task_lists.filter((id) => {
        return id.id !== list.id;
      }),
    });
  };

  //useEffects
  useEffect(() => {
    addTaskList();
  }, [taskListAdding]);

  useEffect(() => {
    addTask();
  }, [taskAdding]);

  useEffect(() => {
    if (menuRef.current) {
      menuRef.current.classList.add('animate-[openDropdown_0.3s_cubic-bezier(0.19,1,0.22,1)]');
    }
  }, [activeList]);

  return (
    <div className="App flex pl-10 gap-10">
      {data.task_lists
        .sort((a, b) => a.position - b.position)
        .map((list) => {
          return (
            list.open_tasks > 0 && (
              <div key={list.id} className="bg-main-bg flex flex-col min-w-[300px] gap-3 pt-5 ">
                <div className="flex gap-3">
                  <span className="text-gray-600 font-bold ml-3 mt-[0.3px]">{list?.name}</span>
                  <span className="text-gray-400 font-bold">({list?.open_tasks})</span>
                </div>
                <div className="relative" ref={dropdownRef}>
                  <button className="absolute right-4 bottom-[0.78rem]" onClick={() => handleDots(list)}>
                    <img src={Trotacka} alt="" className=" fill-gray-600" />
                  </button>
                  {list.id === activeList && (
                    <div
                      ref={menuRef}
                      className="w-[250px] h-[75px] left-[85%] rounded-[15px] top-[5%] flex flex-col items-start justify-center gap-1 border border-gray bg-white absolute z-[999] origin-top-left"
                    >
                      <button className="pl-5 w-[100%] pr-5 text-left h-[50%] transition-[0.1s] rounded-tl-[15px] rounded-tr-[15px] hover:bg-gray-200">Complete</button>
                      <button onClick={() => moveToTrash(list)} className="pl-5 w-[100%] pr-5 text-left h-[50%] transition-[0.1s] rounded-bl-[15px] rounded-br-[15px] hover:bg-gray-200">
                        Move to trash
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 max-h-[90vh] overflow-auto">
                  {data.tasks.map((task) => {
                    return (
                      task.task_list_id === list.id && (
                        <div
                          key={task.id}
                          className={`bg-white text-left max-w-[300px] shadow-md rounded-[10px]
                      ${task.is_important && 'border-l-4 border-l-red-600 animate-[openDropdown_0.3s_cubic-bezier(0.19,1,0.22,1)]'}
                      `}
                        >
                          <div className="card-content flex flex-col p-3 relative">
                            {renderTaskNameAndTaskDates(task)}
                            <div className="flex gap-2">
                              {renderLabels(task)}
                              {renderSubtasks(task)}
                              {renderComments(task)}
                            </div>
                            {renderAvatars(task)}
                          </div>
                        </div>
                      )
                    );
                  })}
                  <div className="">
                    <button
                      onClick={() => {
                        handleAddTask(list);
                      }}
                      className=" text-purple-500 font-bold self-start ml-4 "
                    >
                      + Add a Task
                    </button>
                    {list.id === activePrompt && (
                      <CustomizedDialogs
                        listName={list.name}
                        newTaskListId={list.name}
                        setOpen={true}
                        activePrompt={(state) => setActivePrompt(state)}
                        newTaskName={(state) => setNewTaskName(state)}
                        isNewTaskImportant={(state) => setIsNewTaskImportant(state)}
                        taskAdding={(state) => setTaskAdding(state)}
                        taskListId={(state) => setNewTaskListId(state)}
                        newTaskSubmitted={(state) => setNewTaskSubmitted(state)}
                      />
                    )}
                  </div>
                </div>
              </div>
            )
          );
        })}
      <div className="">
        <button onClick={() => handleAddTaskList()} className="bg-white text-gray-400 rounded-[15%] mt-[11px] pb-1 px-5 shadow-md text-3xl hover:shadow-xl transition-[0.1s]">
          +
        </button>
        <TaskListPrompt
          setOpen={taskListPromptOpen}
          isClosed={(state) => setTaskListPromptOpen(state)}
          newTaskListName={(state) => setNewTaskListName(state)}
          taskListAdding={(state) => setTaskListAdding(state)}
          taskListSubmitted={(state) => setTaskListSubmitted(state)}
        />
      </div>
    </div>
  );
};

export default App;
