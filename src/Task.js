import { useEffect, useState } from "react"
import './App.css';

function Task(props) {
  const [task, setTask] = useState({
    name : props.taskName,
    isCompleted : false,
  });

  const updateIsCompleted = () => {
    setTask(previousState => {
      return {...previousState, isCompleted: true}
    });
    fetch(`https://localhost:7140/api/Task/${props.taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        isCompleted: true
      })
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));
  }
  
  useEffect(() => {
    setTask(previousState => {
        return {...previousState, task : props.taskName}
      });
  }, [props, useState]);

  return (
    <>
      <p>{task.name} {String(task.isCompleted)}</p>
      <button onClick={updateIsCompleted}>Complete</button>
    </>
  );
}

export default Task;
