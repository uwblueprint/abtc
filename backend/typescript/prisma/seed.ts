import { Prisma, PrismaClient, Status } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const userPromises = [];

  for (let i = 1; i <= 4; i++) {
    const userNumber = i;
    const randomUser: Prisma.userCreateInput = {
      authId: `testVolunteer${userNumber}`,
      email: `testVolunteer${userNumber}@gmail.com`,
      firstName: `testVolunteerFirst${userNumber}`,
      lastName: `testVolunteerLast${userNumber}`,
      role: "VOLUNTEER",
      isAccepted: Status.PENDING,
    };

    const userCreationPromise = prisma.user.create({
      data: randomUser,
    });
    userPromises.push(userCreationPromise);
  }

  for (let i = 1; i <= 4; i++) {
    const userNumber = i;
    const randomUser: Prisma.userCreateInput = {
      authId: `testAdmin${userNumber}`,
      email: `testAdmin${userNumber}@gmail.com`,
      firstName: `testAdminFirst${userNumber}`,
      lastName: `testAdminLast${userNumber}`,
      role: "ADMIN",
      isAccepted: Status.PENDING,
    };

    const userCreationPromise = prisma.user.create({
      data: randomUser,
    });
    userPromises.push(userCreationPromise);
  }

  for (let i = 1; i <= 2; i++) {
    const userNumber = i;
    const randomUser: Prisma.userCreateInput = {
      authId: `testAdmin${userNumber}Accepted`,
      email: `testAdmin${userNumber}Accepted@gmail.com`,
      firstName: `testAdminFirst${userNumber}Accepted`,
      lastName: `testAdminLast${userNumber}Accepted`,
      role: "ADMIN",
      isAccepted: Status.ACCEPTED,
    };

    const userCreationPromise = prisma.user.create({
      data: randomUser,
    });
    userPromises.push(userCreationPromise);
  }

  for (let i = 1; i <= 2; i++) {
    const userNumber = i;
    const randomUser: Prisma.userCreateInput = {
      authId: `testAdmin${userNumber}Accepted`,
      email: `testAdmin${userNumber}Accepted@gmail.com`,
      firstName: `testAdminFirst${userNumber}Accepted`,
      lastName: `testAdminLast${userNumber}Accepted`,
      role: "VOLUNTEER",
      isAccepted: Status.ACCEPTED,
    };

    const userCreationPromise = prisma.user.create({
      data: randomUser,
    });
    userPromises.push(userCreationPromise);
  }

  await Promise.all(userPromises);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
