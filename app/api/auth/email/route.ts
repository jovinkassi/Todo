// app/api/auth/email/route.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const isPasswordValid = user.password ? await bcrypt.compare(password, user.password) : false;

      if (!isPasswordValid) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

    

      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
        expiresIn: '7d',
      });
      return NextResponse.json({ token, userId: user?.id ?? null });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: { email, password: hashedPassword },
      });



      const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET!, {
        expiresIn: '7d',
      });
      return NextResponse.json({ token, userId:  user?.id ?? null });    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
