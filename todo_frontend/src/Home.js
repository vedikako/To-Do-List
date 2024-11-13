import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { BsCircleFill, BsFillCheckCircleFill, BsFillTrashFill, BsPencil } from 'react-icons/bs';

const Home = () => {
    const [todos, setTodos] = useState([]);
    const [updatetask, setUpdatetask] = useState('');
    const [taskid, setTaskid] = useState('');
    const [newTask, setNewTask] = useState(''); // State to track the new task input

    useEffect(() => {
        axios.get('http://localhost:5000/get')
            .then(result => setTodos(result.data))
            .catch(err => console.log(err));
    }, []);

    // Function to handle editing a task (toggle completion)
    const edit = (id) => {
        axios.put(`http://localhost:5000/edit/${id}`)
            .then(result => {
                const updatedTodos = todos.map(todo => {
                    if (todo._id === id) {
                        return { ...todo, done: !todo.done };
                    }
                    return todo;
                });
                setTodos(updatedTodos);
            })
            .catch(err => console.log(err));
    };

    // Function to handle updating a task's content
    const Update = (id, updatedTask) => {
        axios.put(`http://localhost:5000/update/${id}`, { task: updatedTask })
            .then(result => {
                const updatedTodos = todos.map(todo => {
                    if (todo._id === id) {
                        return { ...todo, task: updatedTask };
                    }
                    return todo;
                });
                setTodos(updatedTodos);
                setTaskid('');
                setUpdatetask('');
            })
            .catch(err => console.log(err));
    };

    // Function to handle deleting a task
    const Hdelete = (id) => {
        axios.delete(`http://localhost:5000/delete/${id}`)
            .then(result => {
                const updatedTodos = todos.filter(todo => todo._id !== id);
                setTodos(updatedTodos);
            })
            .catch(err => console.log(err));
    };

    // Function to handle adding a new task
    const addNewTask = () => {
        if (newTask.trim()) {
            axios.post('http://localhost:5000/add', { task: newTask })
                .then(result => {
                    setTodos([...todos, result.data]);  // Add the new task to the list
                    setNewTask('');  // Clear the input field after adding
                })
                .catch(err => console.log(err));
        }
    };

    // Event handler to capture "Enter" key press and add the task
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            addNewTask(); // Call the function to add a new task when Enter is pressed
        }
    };

    return (
        <div className="container">
            <div className="window">
                {/* Header Section */}
                <header className="header">
                    <h1>Task Manager</h1>
                </header>

                {/* Create Task Form */}
                <div className="create-form">
                    <input 
                        type="text" 
                        value={newTask} 
                        onChange={(e) => setNewTask(e.target.value)} 
                        onKeyDown={handleKeyDown} // Listen for "Enter" key press
                        placeholder="Add a new task..."
                    />
                    <button onClick={addNewTask}>Add Task</button>
                </div>

                {/* Task List */}
                <div className="task-list">
                    {
                        todos.length === 0 ? <div className='task'>No tasks found</div> :
                            todos.map((todo) => (
                                <div className='task' key={todo._id}>
                                    <div className='checkbox'>
                                        {todo.done ? <BsFillCheckCircleFill className='icon' /> :
                                            <BsCircleFill className='icon' onClick={() => edit(todo._id)} />}
                                        {taskid === todo._id ? 
                                            <input type='text' value={updatetask} onChange={e => setUpdatetask(e.target.value)} />
                                            :
                                            <p className={todo.done ? 'through' : 'normal'}>{todo.task}</p>
                                        }
                                    </div>
                                    <div>
                                        <span>
                                            <BsPencil className='icon' onClick={() => {
                                                if (taskid === todo._id) {
                                                    Update(todo._id, updatetask);
                                                } else {
                                                    setTaskid(todo._id);
                                                    setUpdatetask(todo.task);
                                                }
                                            }} />
                                            <BsFillTrashFill className='icon' onClick={() => Hdelete(todo._id)} />
                                        </span>
                                    </div>
                                </div>
                            ))
                    }
                </div>
            </div>
        </div>
    );
};

export default Home;
