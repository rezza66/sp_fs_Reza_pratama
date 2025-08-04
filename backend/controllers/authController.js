import prisma from '../utils/prismaClient.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';
import sendResponse from '../utils/sendResponse.js';

export const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendResponse(res, 400, false, 'Email dan password wajib diisi');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return sendResponse(res, 400, false, 'Format email tidak valid');
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return sendResponse(res, 400, false, 'Email sudah terdaftar');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword }
    });

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;

    return sendResponse(res, 201, true, 'Registrasi berhasil', {
      user: userWithoutPassword,
      token
    });
  } catch (err) {
    return sendResponse(res, 500, false, 'Server error saat registrasi');
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendResponse(res, 400, false, 'Email dan password wajib diisi');
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return sendResponse(res, 400, false, 'Email atau password salah');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return sendResponse(res, 400, false, 'Email atau password salah');
    }

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;

    return sendResponse(res, 200, true, 'Login berhasil', {
      user: userWithoutPassword,
      token
    });
  } catch (err) {
    return sendResponse(res, 500, false, 'Server error saat login');
  }
};
