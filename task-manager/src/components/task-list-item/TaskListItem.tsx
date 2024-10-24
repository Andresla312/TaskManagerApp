import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
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
    tabIndex?: number;
}

export default function TaskListItem(props: ITaskListItemProps) {
    const { id, completed, task, description, dueDate, priority, onStatusToggle, onDelete, onEdit, tabIndex } = props;

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedTask, setEditedTask] = useState<string>(task);
    const [editedDescription, setEditedDescription] = useState<string>(description);
    const [editedDueDate, setEditedDueDate] = useState<string>(dueDate);
    const [editedPriority, setEditedPriority] = useState<'Low' | 'Medium' | 'High'>(priority);

    // Ref for the task item
    const taskRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isEditing && taskRef.current) {
            const firstInput = taskRef.current.querySelector<HTMLInputElement>('input[type="text"]');
            firstInput?.focus();
        }
    }, [isEditing]);

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

    // Keyboard event handler for Edit Task form
    const handleEditKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            handleCancel();
        }
    };

    // Keyboard event handler for Task Item
    const handleTaskKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (isEditing) return; // Ignore if in editing mode

        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                onStatusToggle(id);
                break;
            case 'e':
            case 'E':
                e.preventDefault();
                setIsEditing(true);
                break;
            case 'Delete':
                e.preventDefault();
                onDelete(id);
                break;
            case 'ArrowUp':
                e.preventDefault();
                focusPreviousTask();
                break;
            case 'ArrowDown':
                e.preventDefault();
                focusNextTask();
                break;
            default:
                break;
        }
    };

    // Function to focus the previous task
    const focusPreviousTask = () => {
        const current = taskRef.current;
        if (current) {
            const previous = current.previousElementSibling as HTMLElement | null;
            previous?.focus();
        }
    };

    // Function to focus the next task
    const focusNextTask = () => {
        const current = taskRef.current;
        if (current) {
            const next = current.nextElementSibling as HTMLElement | null;
            next?.focus();
        }
    };

    return (
        <div
            className={`TaskListItem-root ${completed ? 'completed' : ''}`}
            tabIndex={tabIndex}
            ref={taskRef}
            onKeyDown={handleTaskKeyDown}
            role="listitem"
            aria-label={`Task: ${task}`}
        >
            <div className="TaskListItem-content">
                <div
                    className="TaskListItem-status"
                    onClick={() => onStatusToggle(id)}
                    aria-label={completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                    role="button"
                    tabIndex={-1} // Not focusable separately
                >
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
                            onKeyDown={handleEditKeyDown}
                            aria-label="Edit Task Name"
                        />
                        <input
                            type="text"
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            className="TaskListItem-input"
                            placeholder="Task Description"
                            onKeyDown={handleEditKeyDown}
                            aria-label="Edit Task Description"
                        />
                        <input
                            type="date"
                            value={editedDueDate}
                            onChange={(e) => setEditedDueDate(e.target.value)}
                            className="TaskListItem-input"
                            placeholder="Due Date"
                            onKeyDown={handleEditKeyDown}
                            aria-label="Edit Due Date"
                        />
                        <select
                            value={editedPriority}
                            onChange={(e) => setEditedPriority(e.target.value as 'Low' | 'Medium' | 'High')}
                            className="TaskListItem-input"
                            aria-label="Edit Priority"
                            onKeyDown={handleEditKeyDown}
                        >
                            <option value="Low">Low Priority</option>
                            <option value="Medium">Medium Priority</option>
                            <option value="High">High Priority</option>
                        </select>
                        <div className="TaskListItem-editButtons">
                            <button className="TaskListItem-btn save" onClick={handleSave} aria-label="Save Task">
                                Save
                            </button>
                            <button className="TaskListItem-btn cancel" onClick={handleCancel} aria-label="Cancel Editing">
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="TaskListItem-text">
                            <h1>{task}</h1>
                            <p>{description}</p>
                            <p className="TaskListItem-meta">
                                Due: {dueDate} | Priority: {priority}
                            </p>
                        </div>
                        <div className="TaskListItem-actions">
                            <FaEdit
                                className="edit-icon"
                                onClick={() => setIsEditing(true)}
                                title="Edit Task"
                                role="button"
                                tabIndex={-1} // Not focusable separately
                                aria-label="Edit Task"
                            />
                            <FaTrash
                                className="delete-icon"
                                onClick={() => onDelete(id)}
                                title="Delete Task"
                                role="button"
                                tabIndex={-1} // Not focusable separately
                                aria-label="Delete Task"
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
