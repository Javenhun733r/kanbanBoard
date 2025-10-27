import { ColumnStatus, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(`Початок сідінгу...`);

  await prisma.card.deleteMany();
  await prisma.board.deleteMany();
  console.log('Існуючі дані очищено.');

  const devBoard = await prisma.board.create({
    data: {
      uniqueHashedId: 'TEST-001',
      name: 'Startup Project Kanban Board (Dev)',
    },
  });

  const marketingBoard = await prisma.board.create({
    data: {
      uniqueHashedId: 'MARKETING-007',
      name: 'Marketing Campaign Launch',
    },
  });

  const hrBoard = await prisma.board.create({
    data: {
      uniqueHashedId: 'HR-011',
      name: 'Q4 Recruiting Pipeline',
    },
  });

  console.log(`Створено 3 заповнені тестові дошки.`);

  await prisma.card.createMany({
    data: [
      {
        boardId: devBoard.id,
        title: 'Налаштування інфраструктури',
        description: 'Вирішення конфліктів залежностей Vite/NestJS.',
        column: ColumnStatus.ToDo,
        orderIndex: 0,
      },
      {
        boardId: devBoard.id,
        title: 'Реалізація логіки D&D',
        description: 'Обчислення нових orderIndex.',
        column: ColumnStatus.ToDo,
        orderIndex: 1,
      },
      {
        boardId: devBoard.id,
        title: 'Реалізація API (CRUD/D&D)',
        description: 'Вся логіка Controller/Service/Repository готова.',
        column: ColumnStatus.InProgress,
        orderIndex: 0,
      },
      {
        boardId: devBoard.id,
        title: 'Підключення Redux RTK Query',
        description: 'Налаштування API slice та store.',
        column: ColumnStatus.InProgress,
        orderIndex: 1,
      },
      {
        boardId: devBoard.id,
        title: 'Фіналізація архітектури',
        description: 'Ізоляція сервісного шару від типів Prisma.',
        column: ColumnStatus.Done,
        orderIndex: 0,
      },
    ],
  });
  await prisma.card.createMany({
    data: [
      {
        boardId: marketingBoard.id,
        title: 'Створити A/B тести для лендингу',
        description: 'Розробити два варіанти заголовка та CTA.',
        column: ColumnStatus.ToDo,
        orderIndex: 0,
      },
      {
        boardId: marketingBoard.id,
        title: 'Написати 10 ідей для блогу',
        description: 'Потрібні ідеї з SEO-оптимізацією.',
        column: ColumnStatus.InProgress,
        orderIndex: 0,
      },
      {
        boardId: marketingBoard.id,
        title: 'Запуск рекламної кампанії в Google Ads',
        description: 'Бюджет 5000 грн, націлення на ЦА.',
        column: ColumnStatus.Done,
        orderIndex: 0,
      },
    ],
  });
  await prisma.card.createMany({
    data: [
      {
        boardId: hrBoard.id,
        title: 'Опублікувати вакансію Middle React',
        description: 'Розмістити на Djinni та LinkedIn.',
        column: ColumnStatus.ToDo,
        orderIndex: 0,
      },
      {
        boardId: hrBoard.id,
        title: 'Переглянути резюме кандидатів',
        description: 'Сьогодні заплановано 15 резюме.',
        column: ColumnStatus.InProgress,
        orderIndex: 0,
      },
      {
        boardId: hrBoard.id,
        title: 'Фінальне інтерв’ю Senior Backend',
        description: 'Заплановано на 16:00.',
        column: ColumnStatus.Done,
        orderIndex: 0,
      },
    ],
  });

  console.log('Сідінг завершено.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
