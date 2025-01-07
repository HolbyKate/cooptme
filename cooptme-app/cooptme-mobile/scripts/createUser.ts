const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createTestUser2() {
    const hashedPassword = await bcrypt.hash('Test123', 10);

    try {
        const user = await prisma.user.create({
            data: {
                email: 'test2@test.com',
                password: hashedPassword,
                firstName: 'Test2',
                lastName: 'User2'
            }
        });

        console.log('Utilisateur test2 créé:', user);
    } catch (error) {
        console.error('Erreur lors de la création:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createTestUser2();