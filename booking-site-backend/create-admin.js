// create-admin.js
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createAdmin() {
    try {
        const password = 'admin';
        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await prisma.user.create({
            data: {
                email: 'admin@admin.com',
                password: hashedPassword,
                name: 'Адміністратор',
                role: 'ADMIN'
            }
        });

        console.log('Администратор успешно создан:', admin);
    } catch (error) {
        console.error('Ошибка создания администратора:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();