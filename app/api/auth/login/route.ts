import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { loginSchema } from '@/lib/utils/validation';
import { createAccessToken, createRefreshToken, setSession } from '@/lib/auth/session';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = loginSchema.parse(body);

        // Find user
        const user = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Verify password
        const validPassword = await bcrypt.compare(
            validatedData.password,
            user.passwordHash
        );

        if (!validPassword) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Check 2FA if enabled
        if (user.twoFactorEnabled && !validatedData.twoFactorCode) {
            return NextResponse.json(
                { error: '2FA code required' },
                { status: 401 }
            );
        }

        // In a real app, verify 2FA code here
        // For now, we'll skip this verification

        // Create tokens
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };

        const accessToken = await createAccessToken(payload);
        const refreshToken = await createRefreshToken(payload);

        // Set cookies
        await setSession(accessToken, refreshToken);

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
