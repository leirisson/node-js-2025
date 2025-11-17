// controllers/tasksController.js
const {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  toggleComplete,
  findTaskById
} = require('../services/taskService');

function createTaskController(req, res) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      
      if (!data.title || typeof data.title !== 'string') {
        return res.writeHead(400).end(JSON.stringify({ erro: 'title é obrigatório e deve ser string' }));
      }

      const task = createTask(data.title.trim(), data.description?.trim() || '');
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(task));
    } catch (err) {
      res.writeHead(400).end(JSON.stringify({ erro: 'JSON inválido' }));
    }
  });
}

function listTasksController(req, res) {
  const { title, description } = req.query || {};
  const tasks = getAllTasks({ title, description });
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(tasks));
}

function updateTaskController(req, res, id) {
  const task = findTaskById(id);
  if (!task) {
    res.writeHead(404).end(JSON.stringify({ erro: 'Tarefa não encontrada' }));
    return;
  }

  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      const { title, description } = data;

      if (title === undefined && description === undefined) {
        return res.writeHead(400).end(JSON.stringify({ erro: 'Pelo menos title ou description devem ser enviados' }));
      }

      const updated = updateTask(id, {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && { description: description.trim() })
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updated));
    } catch (err) {
      res.writeHead(400).end(JSON.stringify({ erro: 'JSON inválido' }));
    }
  });
}

function deleteTaskController(res, id) {
  const success = deleteTask(id);
  if (!success) {
    res.writeHead(404).end(JSON.stringify({ erro: 'Tarefa não encontrada' }));
    return;
  }
  res.writeHead(204);
  res.end();
}

function completeTaskController(res, id) {
  const updated = toggleComplete(id);
  if (!updated) {
    res.writeHead(404).end(JSON.stringify({ erro: 'Tarefa não encontrada' }));
    return;
  }
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(updated));
}

module.exports = {
  createTaskController,
  listTasksController,
  updateTaskController,
  deleteTaskController,
  completeTaskController
};