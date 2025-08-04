import prisma from '../utils/prismaClient.js';
import sendResponse from '../utils/sendResponse.js';

export const searchUsers = async (req, res) => {
  const { email } = req.query;
  const userId = req.user.id;

  try {
    if (!email) return sendResponse(res, 400, false, 'Email is required');

    const users = await prisma.user.findMany({
      where: {
        email: {
          contains: email,
          mode: 'insensitive',
        },
        NOT: {
          id: userId,
        },
      },
      select: {
        id: true,
        email: true,
      },
      take: 5,
    });

    sendResponse(res, 200, true, 'Users found', users);
  } catch (err) {
    sendResponse(res, 500, false, 'Failed to search users');
  }
};