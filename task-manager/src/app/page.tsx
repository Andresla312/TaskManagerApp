// Home.tsx

'use client';
import React, { useState, useEffect } from 'react';
import './page.scss';
import TaskListItem from '@/components/task-list-item/TaskListItem';
import { v4 as uuidv4 } from 'uuid';

export interface ITask {
  id: string;
  completed: boolean;
  task: string;
  description: string;
}

export default function Home() {
  const [view, setView] = useState<'all' | 'todo' | 'completed'>('all');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const [tasks, setTasks] = useState<ITask[]>([
    {
      id: uuidv4(),
      completed: false,
      task: 'Finish Classwork',
      description: 'We need to build a todo list in React.',
    },
    {
      id: uuidv4(),
      completed: false,
      task: 'Graduate UP',
      description: 'I need to pass all classes or my parents will kill me.',
    },
  ]);

  const [newTask, setNewTask] = useState<Omit<ITask, 'id'>>({
    completed: false,
    task: '',
    description: '',
  });

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme as 'light' | 'dark');
      document.documentElement.setAttribute('data-theme', storedTheme);
    }

    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleAddTask = () => {
    if (newTask.task.trim() !== '' && newTask.description.trim() !== '') {
      const taskToAdd: ITask = { ...newTask, id: uuidv4() };
      setTasks([...tasks, taskToAdd]);
      setNewTask({ completed: false, task: '', description: '' });
    } else {
      alert('Please enter both task name and description.');
    }
  };

  const handleDeleteTask = (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  const handleToggleTask = (id: string) => {
    const updatedTasks = tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const handleEditTask = (id: string, updatedTask: string, updatedDescription: string) => {
    const updatedTasks = tasks.map((task) =>
        task.id === id ? { ...task, task: updatedTask, description: updatedDescription } : task
    );
    setTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter((task) => {
    if (view === 'all') return true;
    if (view === 'todo') return !task.completed;
    if (view === 'completed') return task.completed;
    return true;
  });

  return (
      <div className="Home-root">
        <div className="Home-container">
          {/* Theme Toggle */}
          <div className="Home-header">
            <button onClick={toggleTheme} className="Home-themeToggle" aria-label="Toggle Theme">
              {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>
          </div>

          {/* Tab Selector */}
          <div className="Home-tabs">
            <div
                onClick={() => setView('all')}
                className={`Home-tab ${view === 'all' ? 'selected' : ''}`}
            >
              All
            </div>
            <div
                onClick={() => setView('todo')}
                className={`Home-tab ${view === 'todo' ? 'selected' : ''}`}
            >
              To Do
            </div>
            <div
                onClick={() => setView('completed')}
                className={`Home-tab ${view === 'completed' ? 'selected' : ''}`}
            >
              Completed
            </div>
          </div>

          {/* Task List */}
          <div className="Home-taskList">
            {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                    <TaskListItem
                        key={task.id}
                        id={task.id}
                        task={task.task}
                        completed={task.completed}
                        description={task.description}
                        onStatusToggle={handleToggleTask}
                        onDelete={handleDeleteTask}
                        onEdit={handleEditTask}
                    />
                ))
            ) : (
                <p className="No-tasks-message">No tasks to display.</p>
            )}
          </div>

          {/* Footer / Add Task */}
          <div className="Home-footer">
            <div className="Home-footerInputs">
              <input
                  value={newTask.task}
                  onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                  placeholder="Task Name"
                  className="Home-input"
                  aria-label="Task Name"
              />
              <input
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Task Description"
                  className="Home-input"
                  aria-label="Task Description"
              />
            </div>
            <div className="Home-footerButtons">
              <button
                  className="Home-footerBtn cancel"
                  onClick={() => setNewTask({ completed: false, task: '', description: '' })}
                  aria-label="Cancel Adding Task"
              >
                Cancel
              </button>
              <button className="Home-footerBtn add" onClick={handleAddTask} aria-label="Add Task">
                Add Task
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}
