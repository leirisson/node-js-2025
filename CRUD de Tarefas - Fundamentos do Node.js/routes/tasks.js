// routes/tasks.js
const url = require('url');
const {
  createTaskController,
  listTasksController,
  updateTaskController,
  deleteTaskController,
  completeTaskController
} = require('../controllers/tasksController');

function handleTasksRoute(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const { pathname, query } = parsedUrl;

  // POST /tasks
  if (req.method === 'POST' && pathname === '/tasks') {
    return createTaskController(req, res);
  }

  // GET /tasks
  if (req.method === 'GET' && pathname === '/tasks') {
    req.query = query;
    return listTasksController(req, res);
  }

  // PUT /tasks/:id
  if (req.method === 'PUT' && /^\/tasks\/\d+$/.test(pathname)) {
    const id = pathname.split('/')[2];
    return updateTaskController(req, res, id);
  }

  // DELETE /tasks/:id
  if (req.method === 'DELETE' && /^\/tasks\/\d+$/.test(pathname)) {
    const id = pathname.split('/')[2];
    return deleteTaskController(res, id);
  }

  // PATCH /tasks/:id/complete
  if (req.method === 'PATCH' && /^\/tasks\/\d+\/complete$/.test(pathname)) {
    const id = pathname.split('/')[2];
    return completeTaskController(res, id);
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ erro: 'Rota não encontrada' }));
}

module.exports = { handleTasksRoute };