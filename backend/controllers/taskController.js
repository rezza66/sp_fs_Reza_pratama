import prisma from '../utils/prismaClient.js';
import sendResponse from '../utils/sendResponse.js';

export const createTask = async (req, res) => {
  const { title, description, status, assigneeId } = req.body;
  const { projectId } = req.params;
  const userId = req.user.id;

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { members: true },
    });
    if (!project || (project.ownerId !== userId && !project.members.some(m => m.userId === userId))) {
      return sendResponse(res, 403, false, 'Unauthorized');
    }

    const task = await prisma.task.create({
      data: { title, description, status, projectId, assigneeId },
      include: {
        assignee: true,
      },
    });

    sendResponse(res, 201, true, 'Task created', task);
  } catch (err) {
    sendResponse(res, 500, false, 'Error creating task');
  }
};


export const getTasksByProject = async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user.id;

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { members: true },
    });
    if (!project || (project.ownerId !== userId && !project.members.some(m => m.userId === userId))) {
      return sendResponse(res, 403, false, 'Unauthorized');
    }

    const tasks = await prisma.task.findMany({ where: { projectId } });
    sendResponse(res, 200, true, 'Project tasks', tasks);
  } catch (err) {
    sendResponse(res, 500, false, 'Error fetching tasks');
  }
};

export const getTaskById = async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user.id;

  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: { include: { members: true } },
      },
    });
    if (!task || (task.project.ownerId !== userId && !task.project.members.some(m => m.userId === userId))) {
      return sendResponse(res, 403, false, 'Unauthorized');
    }
    sendResponse(res, 200, true, 'Task detail', task);
  } catch (err) {
    sendResponse(res, 500, false, 'Error fetching task');
  }
};

export const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, description, status, assigneeId } = req.body;
  const userId = req.user.id;

  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: { include: { members: true } },
      },
    });
    if (!task || (task.project.ownerId !== userId && !task.project.members.some(m => m.userId === userId))) {
      return sendResponse(res, 403, false, 'Unauthorized');
    }

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: { title, description, status, assigneeId },
    });
    sendResponse(res, 200, true, 'Task updated', updated);
  } catch (err) {
    sendResponse(res, 500, false, 'Error updating task');
  }
};

export const deleteTask = async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user.id;

  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: { include: { members: true } },
      },
    });
    if (!task || (task.project.ownerId !== userId && !task.project.members.some(m => m.userId === userId))) {
      return sendResponse(res, 403, false, 'Unauthorized');
    }

    await prisma.task.delete({ where: { id: taskId } });
    sendResponse(res, 200, true, 'Task deleted');
  } catch (err) {
    sendResponse(res, 500, false, 'Error deleting task');
  }
};

export const updateTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;
  const userId = req.user.id;

  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: { include: { members: true } },
      },
    });
    if (!task || (task.project.ownerId !== userId && !task.project.members.some(m => m.userId === userId))) {
      return sendResponse(res, 403, false, 'Unauthorized');
    }

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: { status },
    });
    sendResponse(res, 200, true, 'Status updated', updated);
  } catch (err) {
    sendResponse(res, 500, false, 'Error updating status');
  }
};