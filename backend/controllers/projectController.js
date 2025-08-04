import prisma from "../utils/prismaClient.js";
import sendResponse from "../utils/sendResponse.js";

export const createProject = async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;

  try {
    const project = await prisma.project.create({
      data: {
        name,
        ownerId: userId,
      },
    });
    sendResponse(res, 201, true, "Project created", project);
  } catch (err) {
    sendResponse(res, 500, false, "Error creating project");
  }
};

export const getProjects = async (req, res) => {
  const userId = req.user.id;

  try {
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } }
        ]
      },
      distinct: ['id'],
      include: {
        owner: {
          select: { id: true, email: true }
        },
        members: {
          select: {
            user: {
              select: { id: true, email: true }
            }
          }
        },
        _count: {
          select: { tasks: true }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    sendResponse(res, 200, true, 'All projects', projects);
  } catch (err) {
    console.error(err);
    sendResponse(res, 500, false, 'Error fetching projects');
  }
};

export const getProjectById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
        members: { include: { user: true } },
        owner: true,
      },
    });

    if (!project) {
      return sendResponse(res, 404, false, "Project not found");
    }

    const isOwner = project.ownerId === userId;
    const isMember = project.members.some((m) => m.userId === userId);

    if (!isOwner && !isMember) {
      return sendResponse(res, 403, false, "Access denied");
    }

    sendResponse(res, 200, true, "Project detail", project);
  } catch (err) {
    console.error(err);
    sendResponse(res, 500, false, "Error fetching project");
  }
};


export const updateProject = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const userId = req.user.id;

  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project || project.ownerId !== userId)
      return sendResponse(res, 403, false, "Unauthorized");

    const updated = await prisma.project.update({
      where: { id },
      data: { name },
    });
    sendResponse(res, 200, true, "Project updated", updated);
  } catch (err) {
    sendResponse(res, 500, false, "Error updating project");
  }
};

export const deleteProject = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const project = await prisma.project.findUnique({ where: { id } });

    if (!project || project.ownerId !== userId) {
      return sendResponse(res, 403, false, "Unauthorized");
    }

    await prisma.task.deleteMany({ where: { projectId: id } });

    await prisma.membership.deleteMany({ where: { projectId: id } });

    await prisma.project.delete({ where: { id } });

    sendResponse(res, 200, true, "Project deleted");
  } catch (err) {
    sendResponse(res, 500, false, "Error deleting project");
  }
};

