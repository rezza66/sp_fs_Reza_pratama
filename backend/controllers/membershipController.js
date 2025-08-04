import prisma from "../utils/prismaClient.js";
import sendResponse from "../utils/sendResponse.js";

export const inviteMember = async (req, res) => {
  const { projectId } = req.params;
  const { email } = req.body;
  const userId = req.user.id;

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.ownerId !== userId)
      return sendResponse(res, 403, false, "Unauthorized to invite");

    const userToInvite = await prisma.user.findUnique({ where: { email } });
    if (!userToInvite) return sendResponse(res, 404, false, "User not found");

    const exists = await prisma.membership.findUnique({
      where: {
        userId_projectId: {
          userId: userToInvite.id,
          projectId,
        },
      },
    });
    if (exists) return sendResponse(res, 400, false, "User already member");

    await prisma.membership.create({
      data: {
        userId: userToInvite.id,
        projectId,
      },
    });

    sendResponse(res, 201, true, "Member invited", {
      userId: userToInvite.id,
      email: userToInvite.email,
      projectId,
    });
  } catch (err) {
    sendResponse(res, 500, false, "Failed to invite member");
  }
};

export const getProjectMembers = async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user.id;

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { members: { include: { user: true } } },
    });

    if (
      !project ||
      (project.ownerId !== userId &&
        !project.members.some((m) => m.userId === userId))
    )
      return sendResponse(res, 403, false, "Unauthorized");

    const members = project.members.map((m) => m.user);
    sendResponse(res, 200, true, "Project members", members);
  } catch (err) {
    sendResponse(res, 500, false, "Failed to get members");
  }
};

export const removeMember = async (req, res) => {
  const { projectId, userId } = req.params;
  const currentUserId = req.user.id;

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project || project.ownerId !== currentUserId)
      return sendResponse(res, 403, false, "Only owner can remove member");

    await prisma.membership.delete({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    });

    sendResponse(res, 200, true, "Member removed");
  } catch (err) {
    sendResponse(res, 500, false, "Failed to remove member");
  }
};
