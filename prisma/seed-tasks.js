import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Sample tasks data
  const tasks = [
    {
      name: "Web Design",
      description: "CRM Website need to be work properly with all features",
      status: "NOT_STARTED",
      priority: "HIGH",
      paymentStatus: "NOT_PAID",
      startDate: new Date("2025-04-10"),
      tags: ["bug", "follow up"],
      assignees: [
        { name: "Sarah", email: "sarah@example.com" },
        { name: "John", email: "john@example.com" },
      ],
    },
    {
      name: "Dashboard",
      description: "Collect all CRM data for website design",
      status: "NOT_STARTED",
      priority: "HIGH",
      tags: ["todo", "review"],
      startDate: new Date("2025-04-10"),
      assignees: [
        { name: "Mike", email: "mike@example.com" },
        { name: "Anna", email: "anna@example.com" },
      ],
    },
    {
      name: "Analytics",
      description: "This design system need to be more responsive",
      status: "NOT_STARTED",
      priority: "MEDIUM",
      tags: ["important", "review"],
      startDate: new Date("2025-04-12"),
      assignees: [{ name: "David", email: "david@example.com" }],
    },
    {
      name: "App Design",
      description: "Fitness App design need some real data integration",
      status: "NOT_STARTED",
      priority: "HIGH",
      paymentStatus: "PARTIALLY_PAID",
      startDate: new Date("2025-04-15"),
      tags: ["tomorrow", "bug"],
      assignees: [
        { name: "Emma", email: "emma@example.com" },
        { name: "Chris", email: "chris@example.com" },
      ],
    },
    {
      name: "Brand Design",
      description: "Design a logo for fitness product and brand identity",
      status: "IN_PROGRESS",
      priority: "HIGH",
      paymentStatus: "PARTIALLY_PAID",
      startDate: new Date("2025-04-05"),
      tags: ["bug", "follow up"],
      assignees: [{ name: "Lisa", email: "lisa@example.com" }],
    },
    {
      name: "iOS App",
      description: "First design wireframe & then work on development",
      status: "TESTING",
      priority: "HIGH",
      paymentStatus: "PAID",
      startDate: new Date("2025-04-06"),
      tags: ["important", "bug"],
      assignees: [
        { name: "Tom", email: "tom@example.com" },
        { name: "Kate", email: "kate@example.com" },
      ],
    },
    {
      name: "Design System",
      description: "First design wireframe & then work on components",
      status: "COMPLETED",
      priority: "HIGH",
      paymentStatus: "PAID",
      startDate: new Date("2025-04-02"),
      tags: ["todo", "review"],
      assignees: [{ name: "Alex", email: "alex@example.com" }],
    },
  ];

  // Create tasks with subtasks
  for (const taskData of tasks) {
    const { assignees, ...task } = taskData;

    const createdTask = await prisma.task.create({
      data: {
        ...task,
        assignees: {
          create: assignees,
        },
      },
    });

    // Add subtask for some tasks
    if (task.name === "Web Design" || task.name === "App Design") {
      await prisma.task.create({
        data: {
          name: task.name === "Web Design" ? "Dashboard" : "Full App Design",
          description: "First design wireframe & then work on development",
          status: task.status,
          priority: "HIGH",
          startDate: new Date("2025-04-15"),
          tags: ["follow up"],
          parentId: createdTask.id,
          assignees: {
            create: [{ name: "Sub User", email: "subuser@example.com" }],
          },
        },
      });
    }
  }

  console.log("Sample tasks created successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
