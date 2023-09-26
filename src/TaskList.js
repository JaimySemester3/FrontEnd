import { useEffect, useState } from "react"
import Task from "./Task.js";

function TaskList() {
const [taskList, setTaskList] = useState([]);
const [newTaskName, setNewTaskName] = useState("");

    const fetchTasks = () => {
        fetch("https://localhost:7140/Task")
            .then(response => {
                return response.json();
            })
            .then(data => {
                setTaskList(data)
            })
    }

    useEffect(() => {
        fetchTasks()
    }, [])

    const addTask = (taskName) => {
        fetch("https://localhost:7140/Task", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: taskName
          })
        })
          .then(response => response.json())
          .then(data => setTaskList([...taskList, data]))
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
                <Task taskName={item.name}/>
            </p>
        ))}
    </>
  );
}

export default TaskList;
