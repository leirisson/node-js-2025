// services/taskService.js
const fs = require('fs');
const path = require('path');
const { nowISO } = require('../utils/dateUtils');

const DB_PATH = path.join(__dirname, '..', 'data', 'tasks.json');

function readTasks() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Erro ao ler tasks.json:', err);
    return [];
  }
}

function writeTasks(tasks) {
  fs.writeFileSync(DB_PATH, JSON.stringify(tasks, null, 2), 'utf8');
}

function findTaskById(id) {
  const tasks = readTasks();
  return tasks.find(t => t.id === id) || null;
}

function createTask(title, description) {
  const tasks = readTasks();
  
  const newTask = {
    id: Date.now().toString(), // simples, único por timestamp
    title,
    description,
    completed_at: null,
    created_at: nowISO(),
    updated_at: nowISO()
  };

  tasks.push(newTask);
  writeTasks(tasks);
  return newTask;
}

function getAllTasks({ title, description } = {}) {
  let tasks = readTasks();

  if (title) {
    const searchTerm = title.toLowerCase();
    tasks = tasks.filter(t => t.title.toLowerCase().includes(searchTerm));
  }

  if (description) {
    const searchTerm = description.toLowerCase();
    tasks = tasks.filter(t => t.description.toLowerCase().includes(searchTerm));
  }

  return tasks;
}

function updateTask(id, updates) {
  const tasks = readTasks();
  const index = tasks.findIndex(t => t.id === id);
  
  if (index === -1) return null;

  const task = tasks[index];
  const updatedTask = {
    ...task,
    ...updates,
    updated_at: nowISO()
  };

  tasks[index] = updatedTask;
  writeTasks(tasks);
  return updatedTask;
}

function deleteTask(id) {
  const tasks = readTasks();
  const initialLength = tasks.length;
  const filtered = tasks.filter(t => t.id !== id);
  
  if (filtered.length === initialLength) return false; // não encontrou

  writeTasks(filtered);
  return true;
}

function toggleComplete(id) {
  const task = findTaskById(id);
  if (!task) return null;

  const updated = updateTask(id, {
    completed_at: task.completed_at ? null : nowISO()
  });

  return updated;
}

module.exports = {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  toggleComplete,
  findTaskById
};