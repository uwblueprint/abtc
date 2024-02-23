import { Prisma, PrismaClient, Status, ServiceRequestType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const userPromises = [];
  const serviceRequestPromises = [];

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

  // Seed service requests
  for (let i = 1; i <= 8; i++) {
    const randomUser = userPromises[i - 1];
    const serviceRequest: Prisma.serviceRequestCreateInput = {
      requestName: `ServiceRequest${i}`,
      requesterId: (await randomUser).id,
      location: `Location${i}`,
      shiftTime: new Date(),
      description: `Description${i}`,
      meal: `Meal${i}`,
      cookingMethod: `CookingMethod${i}`,
      frequency: `Frequency${i}`,
      requestType: i % 2 === 0 ? ServiceRequestType.YUMMY : ServiceRequestType.NOTYUMMY,
    };

    const serviceRequestCreationPromise = prisma.serviceRequest.create({
      data: serviceRequest,
    });
    serviceRequestPromises.push(serviceRequestCreationPromise);
  }

  await Promise.all([...userPromises, ...serviceRequestPromises]);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
