import { useEffect, useState } from "react"
import '../App.css';

function Task(props) {
  const [task, setTask] = useState({
    name : props.taskName,
    isCompleted : false,
  });

  const updateIsCompleted = () => {
    setTask(previousState => {
      return {...previousState, isCompleted: true}
    });
    fetch(`http://localhost:7140/api/Task/${props.taskId}`, {
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
  
  const handleDeleteClick = () => {
    props.onDelete(props.taskId);
  };

  useEffect(() => {
    setTask(previousState => {
        return {...previousState, task : props.taskName}
      });
  }, [props, useState]);

  return (
    <>
      <p>{task.name}</p>
      <button onClick={updateIsCompleted}>Complete</button>
      <button onClick={handleDeleteClick}>Delete</button>
    </>
  );
}

export default Task;
