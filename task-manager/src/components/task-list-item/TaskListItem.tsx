'use client';
import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import './TaskListItem.scss';
import { FaCheckCircle, FaRegCircle, FaTrash, FaEdit } from 'react-icons/fa';

export interface ITaskProps {
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

/**
 * Represents a single task item in the task list.
 * @param props - Properties passed to the TaskListItem component.
 * @returns A JSX element displaying the task item.
 */
export default function TaskListItem(props: ITaskProps) {
    const {
        id,
        completed,
        task,
        description,
        dueDate,
        priority,
        onStatusToggle,
        onDelete,
        onEdit,
        tabIndex,
    } = props;

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedTask, setEditedTask] = useState<string>(task);
    const [editedDescription, setEditedDescription] = useState<string>(description);
    const [editedDueDate, setEditedDueDate] = useState<string>(dueDate);
    const [editedPriority, setEditedPriority] = useState<'Low' | 'Medium' | 'High'>(priority);

    // Ref for the task item
    const taskRef = useRef<HTMLDivElement>(null);

    /**
     * Focuses the first input field when entering edit mode.
     */
    useEffect(() => {
        if (isEditing && taskRef.current) {
            const firstInput = taskRef.current.querySelector<HTMLInputElement>('input[type="text"]');
            firstInput?.focus();
        }
    }, [isEditing]);

    /**
     * Handles saving the edited task.
     */
    const save = () => {
        // Validate inputs
        if (editedTask.trim() === '' || editedDescription.trim() === '') {
            alert('Task name and description cannot be empty.');
            return;
        }
        onEdit(id, editedTask, editedDescription, editedDueDate, editedPriority);
        setIsEditing(false);
    };

    /**
     * Cancels the edit mode and resets the edited fields.
     */
    const cancel = () => {
        setEditedTask(task);
        setEditedDescription(description);
        setEditedDueDate(dueDate);
        setEditedPriority(priority);
        setIsEditing(false);
    };

    /**
     * Keyboard event handler for the edit form.
     * @param e - Keyboard event.
     */
    const editKeyDown = (
        e: KeyboardEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            save();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            cancel();
        }
    };

    /**
     * Keyboard event handler for the task item.
     * @param e - Keyboard event.
     */
    const taskKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
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

    /**
     * Focuses the previous task in the list.
     */
    const focusPreviousTask = () => {
        const current = taskRef.current;
        if (current) {
            const previous = current.previousElementSibling as HTMLElement | null;
            previous?.focus();
        }
    };

    /**
     * Focuses the next task in the list.
     */
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
            onKeyDown={taskKeyDown}
            role="listitem"
        >
            <div className="TaskListItem-content">
                <div
                    className="TaskListItem-status"
                    onClick={() => onStatusToggle(id)}
                    role="button"
                    tabIndex={-1}
                >
                    {completed ? (
                        <FaCheckCircle className="completed-icon" />
                    ) : (
                        <FaRegCircle className="pending-icon" />
                    )}
                </div>

                {isEditing ? (
                    <div className="TaskListItem-editForm">
                        <input
                            type="text"
                            value={editedTask}
                            onChange={(e) => setEditedTask(e.target.value)}
                            className="TaskListItem-input"
                            placeholder="Task Name"
                            onKeyDown={editKeyDown}
                        />
                        <input
                            type="text"
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            className="TaskListItem-input"
                            placeholder="Task Description"
                            onKeyDown={editKeyDown}
                        />
                        <input
                            type="date"
                            value={editedDueDate}
                            onChange={(e) => setEditedDueDate(e.target.value)}
                            className="TaskListItem-input"
                            placeholder="Due Date"
                            onKeyDown={editKeyDown}
                        />
                        <select
                            value={editedPriority}
                            onChange={(e) =>
                                setEditedPriority(e.target.value as 'Low' | 'Medium' | 'High')
                            }
                            className="TaskListItem-input"
                            onKeyDown={editKeyDown}
                        >
                            <option value="Low">Low Priority</option>
                            <option value="Medium">Medium Priority</option>
                            <option value="High">High Priority</option>
                        </select>
                        <div className="TaskListItem-editButtons">
                            <button
                                className="TaskListItem-btn save"
                                onClick={save}
                            >
                                Save
                            </button>
                            <button
                                className="TaskListItem-btn cancel"
                                onClick={cancel}
                            >
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
                                tabIndex={-1}
                            />
                            <FaTrash
                                className="delete-icon"
                                onClick={() => onDelete(id)}
                                title="Delete Task"
                                role="button"
                                tabIndex={-1}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
