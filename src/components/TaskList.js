import { useEffect, useState } from "react"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
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

    const handleOnDragEnd = async (result) => {
        if (!result.destination) return;
        const items = Array.from(taskList);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Assign priority level to each task based on its position in the list
        const updatedItems = items.map((item, index) => {
            return {...item, priority: index + 1};
        });

        setTaskList(updatedItems);

        // Log the updated task list
        console.log("Updated task list:", updatedItems);

        // Send updated tasks to the backend
        for (const item of updatedItems) {
            try {
                const response = await fetch(`https://localhost:7140/api/Tasks/${item.Id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        priority: item.priority,
                    }),
                });

                if (!response.ok) {
                    console.error("Failed to update task priority");
                }
            } catch (error) {
                console.error("Error updating task priority", error);
            }
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
            <input type="text" value={newTaskName} onChange={handleNewTaskNameChange}/>
            <button onClick={handleAddTaskClick}>Add task</button>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="tasks">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {taskList.map((item, index) => (
                                <Draggable key={item.Id} draggableId={String(item.Id)} index={index}>
                                    {(provided) => (
                                        <p {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                            <Task taskName={item.taskName} taskId={item.Id} onDelete={deleteTask}/>
                                        </p>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </>
    );
}

export default TaskList;
