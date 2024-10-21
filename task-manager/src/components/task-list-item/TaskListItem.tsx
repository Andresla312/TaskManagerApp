import React, { useState } from 'react';
import './TaskListItem.scss';
import { FaCheckCircle, FaRegCircle, FaTrash, FaEdit } from 'react-icons/fa';

export interface ITaskListItemProps {
    id: string;
    completed: boolean;
    task: string;
    description: string;
    dueDate: string;
    priority: 'Low' | 'Medium' | 'High';
    onStatusToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (
        id: string,
        updatedTask: string,
        updatedDescription: string,
        updatedDueDate: string,
        updatedPriority: 'Low' | 'Medium' | 'High'
    ) => void;
}

export default function TaskListItem(props: ITaskListItemProps) {
    const { id, completed, task, description, dueDate, priority, onStatusToggle, onDelete, onEdit } = props;

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedTask, setEditedTask] = useState<string>(task);
    const [editedDescription, setEditedDescription] = useState<string>(description);
    const [editedDueDate, setEditedDueDate] = useState<string>(dueDate);
    const [editedPriority, setEditedPriority] = useState<'Low' | 'Medium' | 'High'>(priority);

    const handleSave = () => {
        // Validate inputs if necessary
        if (editedTask.trim() === '' || editedDescription.trim() === '') {
            alert('Task name and description cannot be empty.');
            return;
        }
        onEdit(id, editedTask, editedDescription, editedDueDate, editedPriority);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedTask(task);
        setEditedDescription(description);
        setEditedDueDate(dueDate);
        setEditedPriority(priority);
        setIsEditing(false);
    };

    return (
        <div className={`TaskListItem-root ${completed ? 'completed' : ''}`}>
            <div className="TaskListItem-content">
                <div className="TaskListItem-status" onClick={() => onStatusToggle(id)}>
                    {completed ? <FaCheckCircle className="completed-icon" /> : <FaRegCircle className="pending-icon" />}
                </div>

                {isEditing ? (
                    <div className="TaskListItem-editForm">
                        <input
                            type="text"
                            value={editedTask}
                            onChange={(e) => setEditedTask(e.target.value)}
                            className="TaskListItem-input"
                            placeholder="Task Name"
                        />
                        <input
                            type="text"
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            className="TaskListItem-input"
                            placeholder="Task Description"
                        />
                        <input
                            type="date"
                            value={editedDueDate}
                            onChange={(e) => setEditedDueDate(e.target.value)}
                            className="TaskListItem-input"
                            placeholder="Due Date"
                        />
                        <select
                            value={editedPriority}
                            onChange={(e) => setEditedPriority(e.target.value as 'Low' | 'Medium' | 'High')}
                            className="TaskListItem-input"
                            aria-label="Priority"
                        >
                            <option value="Low">Low Priority</option>
                            <option value="Medium">Medium Priority</option>
                            <option value="High">High Priority</option>
                        </select>
                        <div className="TaskListItem-editButtons">
                            <button className="TaskListItem-btn save" onClick={handleSave}>Save</button>
                            <button className="TaskListItem-btn cancel" onClick={handleCancel}>Cancel</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="TaskListItem-text">
                            <h1>{task}</h1>
                            <p>{description}</p>
                            <p className="TaskListItem-meta">Due: {dueDate} | Priority: {priority}</p>
                        </div>
                        <div className="TaskListItem-actions">
                            <FaEdit className="edit-icon" onClick={() => setIsEditing(true)} title="Edit Task" />
                            <FaTrash className="delete-icon" onClick={() => onDelete(id)} title="Delete Task" />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
