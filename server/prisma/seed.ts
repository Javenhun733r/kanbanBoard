import { ColumnStatus, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding...`);

  await prisma.card.deleteMany();
  await prisma.board.deleteMany();
  console.log('Existing data cleared.');

  const devBoard = await prisma.board.create({
    data: {
      uniqueHashedId: 'TEST-001',
      name: 'Startup Project Kanban Board (Dev)',
    },
  });

  const marketingBoard = await prisma.board.create({
    data: {
      uniqueHashedId: 'TEST-002',
      name: 'Marketing Campaign Launch',
    },
  });

  const hrBoard = await prisma.board.create({
    data: {
      uniqueHashedId: 'TEST-003',
      name: 'Q4 Recruiting Pipeline',
    },
  });

  console.log(`Created 3 populated test boards.`);

  await prisma.card.createMany({
    data: [
      {
        boardId: devBoard.id,
        title: 'Infrastructure Setup',
        description: 'Resolve dependency conflicts between Vite and NestJS.',
        column: ColumnStatus.ToDo,
        orderIndex: 0,
      },
      {
        boardId: devBoard.id,
        title: 'Implement D&D Logic',
        description: 'Calculate and update new orderIndex values.',
        column: ColumnStatus.ToDo,
        orderIndex: 1,
      },
      {
        boardId: devBoard.id,
        title: 'Implement API (CRUD/D&D)',
        description: 'All Controller/Service/Repository logic completed.',
        column: ColumnStatus.InProgress,
        orderIndex: 0,
      },
      {
        boardId: devBoard.id,
        title: 'Integrate Redux RTK Query',
        description: 'Configure API slice and store.',
        column: ColumnStatus.InProgress,
        orderIndex: 1,
      },
      {
        boardId: devBoard.id,
        title: 'Finalize Architecture',
        description: 'Isolate the service layer from Prisma types.',
        column: ColumnStatus.Done,
        orderIndex: 0,
      },
    ],
  });
  await prisma.card.createMany({
    data: [
      {
        boardId: marketingBoard.id,
        title: 'Create A/B tests for landing page',
        description: 'Develop two variations for the headline and CTA.',
        column: ColumnStatus.ToDo,
        orderIndex: 0,
      },
      {
        boardId: marketingBoard.id,
        title: 'Write 10 blog post ideas',
        description: 'Need ideas with SEO optimization focus.',
        column: ColumnStatus.InProgress,
        orderIndex: 0,
      },
      {
        boardId: marketingBoard.id,
        title: 'Launch Google Ads campaign',
        description: 'Budget $5000, targeting the core audience.',
        column: ColumnStatus.Done,
        orderIndex: 0,
      },
    ],
  });
  await prisma.card.createMany({
    data: [
      {
        boardId: hrBoard.id,
        title: 'Post Middle React vacancy',
        description: 'Publish job opening on Djinni and LinkedIn.',
        column: ColumnStatus.ToDo,
        orderIndex: 0,
      },
      {
        boardId: hrBoard.id,
        title: 'Review candidate resumes',
        description: '15 resumes scheduled for today.',
        column: ColumnStatus.InProgress,
        orderIndex: 0,
      },
      {
        boardId: hrBoard.id,
        title: 'Final interview Senior Backend',
        description: 'Scheduled for 4:00 PM.',
        column: ColumnStatus.Done,
        orderIndex: 0,
      },
    ],
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
