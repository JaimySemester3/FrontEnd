import { useEffect, useState } from "react"
import Task from "./Task.js";

function TaskList() {
const [taskList, setTaskList] = useState([]);
const [newTaskName, setNewTaskName] = useState("");

const fetchTasks = async () => {
  try {
    const response = await fetch("https://localhost:7140/api/Tasks");
    if (response.ok) {
      const data = await response.json();
      setTaskList(data);
    } else {
      console.error("Failed to fetch tasks");
    }
  } catch (error) {
    console.error("Error fetching tasks", error);
  }
};

    useEffect(() => {
        fetchTasks()
    }, [])
    const addTask = async (taskName) => {
      try {
        const response = await fetch("https://localhost:7140/api/Tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            TaskName: taskName,
          }),
        });
  
        if (response.ok) {
          const data = await response.json();
          setTaskList([...taskList, data]);
          setNewTaskName("");
        } else {
          console.error("Failed to add task");
        }
      } catch (error) {
        console.error("Error adding task", error);
      }
    };

    const deleteTask = async (taskId) => {
      try {
        const response = await fetch(`https://localhost:7140/api/Tasks/${taskId}`, {
          method: "DELETE",
        });
  
        if (response.ok) {
          setTaskList(taskList.filter((item) => item.id !== taskId));
        } else {
          console.error("Failed to delete task");
        }
      } catch (error) {
        console.error("Error deleting task", error);
      }
    };

    const handleAddTaskClick = () => {
        addTask(newTaskName);
        setNewTaskName("");
    };
    
    const handleNewTaskNameChange = (event) => {
        setNewTaskName(event.target.value);
    };

  return (
    <>
        <input type="text" value={newTaskName} onChange={handleNewTaskNameChange} />
        <button onClick={handleAddTaskClick}>Add Task</button>
        {taskList.map((item, index) => (
            <p key={index}>
                <Task taskName={item.taskName} taskId={item.id} onDelete={deleteTask}/>
            </p>
        ))}
    </>
  );
}

export default TaskList;
