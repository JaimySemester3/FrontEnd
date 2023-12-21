import { useEffect, useState } from "react"
import Task from "./Task.js";
import Button from '@mui/material/Button';
import { TextField } from "@mui/material";

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
          setTaskList(taskList.filter((item) => item.Id !== taskId));
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
        <TextField id="standard-basic" label="Standard" variant="standard" type="text" value={newTaskName} onChange={handleNewTaskNameChange} TextField/>
        <Button variant="contained" onClick={handleAddTaskClick}>Add task</Button>
        {taskList.map((item, index) => (
            <p key={index}>
                <Task taskName={item.taskName} taskId={item.Id} onDelete={deleteTask}/>
            </p>
        ))}
    </>
  );
}

export default TaskList;
