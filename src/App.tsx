import { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [todo, setTodos] = useState<Array<{ text: string; priority: number; isFadingOut: boolean; id: number; timestamp: string ; isCompleted: boolean }>>([]);
    const [newTodo, setNewTodo] = useState<string>('');
    const [editIndex, setEditIndex] = useState(null);
    const [editValue, setEditValue] = useState<string>('');
    const [prioTodo, setPrioTodo] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        const savedTodos = localStorage.getItem('todo');
        console.log("Retrieved todos from localStorage:", savedTodos);
        if (savedTodos) {
            setTodos(JSON.parse(savedTodos));
        }
    }, []);
    
    useEffect(() => {
        console.log("Updating localStorage with todos:", todo);
        localStorage.setItem('todo', JSON.stringify(todo));
    }, [todo]);

    function HandleInput(event: any) {
        setNewTodo(event.target.value);
        console.log(setNewTodo);
    }

    const addTodo = () => {
        const ifPrioIsUsed = todo.some((todoItem) => todoItem.priority === prioTodo && !todoItem.isFadingOut);
        if (ifPrioIsUsed) {
            setErrorMessage('Priority number already used');
        } else {
            const newTodos = [...todo, { text: newTodo, priority: prioTodo, isFadingOut: false, id: Date.now(),timestamp: new Date().toLocaleString(), isCompleted: false }];
            newTodos.sort((a, b) => a.priority - b.priority);
            setTodos(newTodos);
            setPrioTodo(0);
            setNewTodo('');
            setErrorMessage('');
        }
    };
    

    const removeTodo = (id: number) => {
        setTodos((currentTodos) => currentTodos.map((todoItem) => (todoItem.id === id ? { ...todoItem, isFadingOut: true } : todoItem)));

        setTimeout(() => {
            setTodos((currentTodos) => {
                const newTodos = currentTodos.filter((todoItem) => !todoItem.isFadingOut);
                newTodos.sort((a, b) => a.priority - b.priority);
                return newTodos;
            });
        }, 500);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setTodos((currentTodos) => currentTodos.filter((todoItem) => !todoItem.isFadingOut));
        }, 500);

        return () => clearTimeout(timer);
    }, [todo]);



    function HandleEditInput(event: any) {
        setEditValue(event.target.value);
    }

    function HandlePrioInput(event: any) {
        setPrioTodo(event.target.value);
    }

    const editTodo = (index: any) => {
        setEditIndex(index);
        setEditValue(todo[index].text);
    };

    const saveTodo = () => {
        if (editIndex !== null) {
            let todoCopy = [...todo];
            todoCopy[editIndex].text = editValue;
            setTodos(todoCopy);
            setEditIndex(null);
        }
    };

    const toggleComplete = (id: number) => {
        setTodos((currentTodos) => currentTodos.map((todoItem) => (todoItem.id === id ? { ...todoItem, isCompleted: !todoItem.isCompleted } : todoItem)));
    };

    return (
        <div>
            <h1>Todolist</h1>
            <input type="text" className="input-text" value={newTodo} onChange={HandleInput} placeholder="Add todo" />
            <input type="number" className="input-number" min={1} value={prioTodo} onChange={HandlePrioInput} placeholder="Priority" />
            {errorMessage && <p>{errorMessage}</p>}
            <button onClick={addTodo} className="add-button">
                Add
            </button>
            {todo.map((todoItem, index) => (
                <div key={todoItem.id} className={`todo-item ${todoItem.isFadingOut ? 'fade-out' : ''}`}>
                    <div className="todo-content">
                        {index === editIndex ? (
                            <input type="text" value={editValue} onChange={HandleEditInput} />
                        ) : (
                            <p>
                                {todoItem.text} <br></br> Prio  : {todoItem.priority} <br></br>{todoItem.timestamp}
                            </p>
                        )}
                        <input type="checkbox" checked={todoItem.isCompleted} onChange={() => toggleComplete(todoItem.id)} />
                    </div>
                    <button onClick={() => removeTodo(todoItem.id)}>Remove</button>
                    <button className='edit-input' onClick={() => editTodo(index)}>Edit</button>
                    <button onClick={saveTodo}>Save</button>
                </div>
            ))}
        </div>
    );
}

export default App;
