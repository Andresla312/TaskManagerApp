// src/pages/Page.tsx

'use client';
import React, { useState, useEffect, KeyboardEvent, useRef } from 'react';
import './page.scss';
import TaskListItem from '@/components/task-list-item/TaskListItem';
import HelpModal from '@/components/help-modal/HelpModal';
import { v4 as uuidv4 } from 'uuid';

export interface ITask {
  id: string;
  completed: boolean;
  task: string;
  description: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  creationDate: string;
}

type SortCriteria = 'dueDate' | 'priority' | 'creationDate';
type SortOrder = 'asc' | 'desc';

export default function Home() {
  const [view, setView] = useState<'all' | 'todo' | 'completed'>('all');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const [tasks, setTasks] = useState<ITask[]>([

  ]);

  const [newTask, setNewTask] = useState<Omit<ITask, 'id' | 'creationDate'>>({
    completed: false,
    task: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'Medium',
  });

  const [sortCriteria, setSortCriteria] = useState<SortCriteria>('creationDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const allTabRef = useRef<HTMLDivElement>(null);
  const todoTabRef = useRef<HTMLDivElement>(null);
  const completedTabRef = useRef<HTMLDivElement>(null);

  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

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

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?') {
        e.preventDefault();
        setIsHelpOpen(true);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown as any);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown as any);
    };
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
      const taskToAdd: ITask = {
        ...newTask,
        id: uuidv4(),
        creationDate: new Date().toISOString(),
      };
      setTasks([...tasks, taskToAdd]);
      setNewTask({
        completed: false,
        task: '',
        description: '',
        dueDate: new Date().toISOString().split('T')[0],
        priority: 'Medium',
      });
      taskNameRef.current?.focus();
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

  const handleEditTask = (
      id: string,
      updatedTask: string,
      updatedDescription: string,
      updatedDueDate: string,
      updatedPriority: 'Low' | 'Medium' | 'High'
  ) => {
    const updatedTasks = tasks.map((task) =>
        task.id === id
            ? {
              ...task,
              task: updatedTask,
              description: updatedDescription,
              dueDate: updatedDueDate,
              priority: updatedPriority,
            }
            : task
    );
    setTasks(updatedTasks);
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    let compare = 0;
    if (sortCriteria === 'dueDate' || sortCriteria === 'creationDate') {
      const dateA = new Date(a[sortCriteria]).getTime();
      const dateB = new Date(b[sortCriteria]).getTime();
      compare = dateA - dateB;
    } else if (sortCriteria === 'priority') {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      compare = priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    return sortOrder === 'asc' ? compare : -compare;
  });

  const filteredTasks = sortedTasks.filter((task) => {
    if (view === 'all') return true;
    if (view === 'todo') return !task.completed;
    if (view === 'completed') return task.completed;
    return true;
  });

  const taskNameRef = useRef<HTMLInputElement>(null);

  const handleAddTaskKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTask();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setNewTask({
        completed: false,
        task: '',
        description: '',
        dueDate: new Date().toISOString().split('T')[0],
        priority: 'Medium',
      });
    }
  };

  const handleTabKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const tabs = [allTabRef, todoTabRef, completedTabRef];
    const currentIndex = tabs.findIndex((tab) => tab.current === document.activeElement);

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % tabs.length;
      tabs[nextIndex].current?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      tabs[prevIndex].current?.focus();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (currentIndex === 0) setView('all');
      if (currentIndex === 1) setView('todo');
      if (currentIndex === 2) setView('completed');
    }
  };

  return (
      <div className="Home-root">
        <div className="Home-container">
          {/* Theme Toggle */}
          <div className="Home-header">
            <button
                onClick={toggleTheme}
                className="Home-themeToggle"

            >
              {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>
          </div>

          <div
              className="Home-tabs"
              role="tablist"

              onKeyDown={handleTabKeyDown}
          >
            <div
                ref={allTabRef}
                role="tab"
                tabIndex={0}

                className={`Home-tab ${view === 'all' ? 'selected' : ''}`}
                onClick={() => setView('all')}
            >
              All
            </div>
            <div
                ref={todoTabRef}
                role="tab"
                tabIndex={0}

                className={`Home-tab ${view === 'todo' ? 'selected' : ''}`}
                onClick={() => setView('todo')}
            >
              To Do
            </div>
            <div
                ref={completedTabRef}
                role="tab"
                tabIndex={0}

                className={`Home-tab ${view === 'completed' ? 'selected' : ''}`}
                onClick={() => setView('completed')}
            >
              Completed
            </div>
          </div>

          <div className="Home-sortingControls">
            <label htmlFor="sortCriteria">Sort By:</label>
            <select
                id="sortCriteria"
                value={sortCriteria}
                onChange={(e) => setSortCriteria(e.target.value as SortCriteria)}
                className="Home-select"

            >
              <option value="creationDate">Creation Date</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
            </select>

            <label htmlFor="sortOrder">Order:</label>
            <select
                id="sortOrder"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                className="Home-select"

            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          <div className="Home-taskList" role="list">
            {filteredTasks.length > 0 ? (
                filteredTasks.map((task, index) => (
                    <TaskListItem
                        key={task.id}
                        id={task.id}
                        task={task.task}
                        completed={task.completed}
                        description={task.description}
                        dueDate={task.dueDate}
                        priority={task.priority}
                        onStatusToggle={handleToggleTask}
                        onDelete={handleDeleteTask}
                        onEdit={handleEditTask}
                        tabIndex={0}
                    />
                ))
            ) : (
                <p className="No-tasks-message">No tasks to display.</p>
            )}
          </div>

          <div className="Home-footer">
            <div className="Home-footerInputs">
              <input
                  ref={taskNameRef}
                  value={newTask.task}
                  onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                  placeholder="Task Name"
                  className="Home-input"

                  onKeyDown={handleAddTaskKeyDown}
              />
              <input
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Task Description"
                  className="Home-input"

                  onKeyDown={handleAddTaskKeyDown}
              />
              <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="Home-input"

                  onKeyDown={handleAddTaskKeyDown}
              />
              <select
                  value={newTask.priority}
                  onChange={(e) =>
                      setNewTask({ ...newTask, priority: e.target.value as 'Low' | 'Medium' | 'High' })
                  }
                  className="Home-input"

                  onKeyDown={handleAddTaskKeyDown}
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
            </div>
            <div className="Home-footerButtons">
              <button
                  className="Home-footerBtn cancel"
                  onClick={() =>
                      setNewTask({
                        completed: false,
                        task: '',
                        description: '',
                        dueDate: new Date().toISOString().split('T')[0],
                        priority: 'Medium',
                      })
                  }

              >
                Cancel
              </button>
              <button className="Home-footerBtn add" onClick={handleAddTask} >
                Add Task
              </button>
            </div>
          </div>

          <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
        </div>
      </div>
  );
}
