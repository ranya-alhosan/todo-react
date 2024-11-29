// Import necessary React hooks: useState (for state management) and useEffect (for side effects like saving to localStorage)
import { useState, useEffect } from "react"; 

// Import the external CSS file for styling the app
import "./App.css"; 

function App() {
  // State to track the current input value for a new or edited task
  const [task, setTask] = useState(""); 

  // State to store the list of tasks; initializes from localStorage if available
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks"); // Retrieve tasks from localStorage
    return savedTasks ? JSON.parse(savedTasks) : [];  // Parse tasks if found, else start with an empty array
  });

  // State to indicate whether the app is in "edit mode"
  const [isEditing, setIsEditing] = useState(false); 

  // State to track the task being edited, including its index and value
  const [currentTask, setCurrentTask] = useState({ index: null, value: "" }); 

  // Save tasks to localStorage whenever the `tasks` state changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks)); // Convert tasks array to a JSON string for storage
  }, [tasks]); // Dependency array: runs effect only when `tasks` changes

  // Handles adding a new task or updating an existing one
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (!isEditing) { // If not in edit mode, add a new task
      if (task.trim()) { // Ensure the task isn't just whitespace
        setTasks([...tasks, task.trim()]); // Add the new task to the task list
        setTask(""); // Clear the input field
      }
    } else { // If in edit mode, update the existing task
      const updatedTasks = tasks.map((t, index) =>
        index === currentTask.index ? currentTask.value : t // Update the matching task
      );
      setTasks(updatedTasks); // Save the updated task list
      setIsEditing(false); // Exit edit mode
      setCurrentTask({ index: null, value: "" }); // Reset the current task state
    }
  };

  // Enter edit mode and load the selected task's value into the input
  const handleEdit = (index) => {
    setIsEditing(true); // Enable edit mode
    setCurrentTask({ index, value: tasks[index] }); // Set the task being edited
  };

  // Deletes a task from the list
  const handleDelete = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index); // Remove the selected task
    setTasks(newTasks); // Update the task list state
  };

  // Render the app UI
  return (
    <div className="app-container"> {/* Main container for the app */}
      <h1>My To-Do List</h1> {/* Header for the app */}

      {/* Form to add or edit tasks */}
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text" // Input field for entering tasks
          value={isEditing ? currentTask.value : task} // Show task value or currentTask in edit mode
          onChange={(e) => { // Update the input value
            if (isEditing) { // If in edit mode, update the current task's value
              setCurrentTask({ ...currentTask, value: e.target.value });
            } else { // Otherwise, update the new task value
              setTask(e.target.value);
            }
          }}
          placeholder="Add or edit a task" // Placeholder text for the input field
          className="task-input" // CSS class for styling
        />
        <button type="submit" className="add-btn">
          {isEditing ? "Update Task" : "Add Task"} {/* Button text changes based on mode */}
        </button>
        {isEditing && ( // Show "Cancel" button only in edit mode
          <button
            type="button" // Prevent form submission
            onClick={() => setIsEditing(false)} // Exit edit mode when clicked
            className="cancel-btn"
          >
            Cancel
          </button>
        )}
      </form>

      {/* List of tasks */}
      <ul className="task-list">
        {tasks.map((t, index) => ( // Map over the tasks array
          <li key={index} className="task-item"> {/* Each task item */}
            <span className="task-text">{t}</span> {/* Display the task text */}
            <button onClick={() => handleEdit(index)} className="edit-btn">
              Edit {/* Button to edit the task */}
            </button>
            <button onClick={() => handleDelete(index)} className="delete-btn">
              Delete {/* Button to delete the task */}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App; // Export the component so it can be used in other files
