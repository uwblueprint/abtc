import { Prisma, PrismaClient, Status } from "@prisma/client";
import * as firebaseAdmin from "firebase-admin";

const prisma = new PrismaClient();
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_SVC_ACCOUNT_PRIVATE_KEY?.replace(
      /\\n/g,
      "\n",
    ),
    clientEmail: process.env.FIREBASE_SVC_ACCOUNT_CLIENT_EMAIL,
  }),
});

async function main() {
  const userPromises = [];

  for (let i = 1; i <= 4; i++) {
    const userNumber = i;
    // eslint-disable-next-line no-await-in-loop
    const firebaseUser = await firebaseAdmin.auth().createUser({
      email: `testVolunteer${userNumber}@gmail.com`,
      password: `abtcTestPassword`,
    });

    const randomUser: Prisma.userCreateInput = {
      authId: firebaseUser.uid,
      email: firebaseUser.email ?? "",
      firstName: `testVolunteerFirst${userNumber}`,
      lastName: `testVolunteerLast${userNumber}`,
      role: "VOLUNTEER",
      isAccepted: Status.PENDING,
      createdAt: new Date().toISOString(),
    };

    const userCreationPromise = prisma.user.create({
      data: randomUser,
    });
    userPromises.push(userCreationPromise);
  }

  for (let i = 1; i <= 4; i++) {
    const userNumber = i;
    // eslint-disable-next-line no-await-in-loop
    const firebaseUser = await firebaseAdmin.auth().createUser({
      email: `testAdmin${userNumber}@gmail.com`,
      password: `abtcTestPassword`,
    });

    const randomUser: Prisma.userCreateInput = {
      authId: firebaseUser.uid,
      email: firebaseUser.email ?? "",
      firstName: `testAdminFirst${userNumber}`,
      lastName: `testAdminLast${userNumber}`,
      role: "ADMIN",
      isAccepted: Status.PENDING,
      createdAt: new Date().toISOString(),
    };

    const userCreationPromise = prisma.user.create({
      data: randomUser,
    });
    userPromises.push(userCreationPromise);
  }

  for (let i = 1; i <= 2; i++) {
    const userNumber = i;
    // eslint-disable-next-line no-await-in-loop
    const firebaseUser = await firebaseAdmin.auth().createUser({
      email: `testVolunteer${userNumber}Accepted@gmail.com`,
      password: `abtcTestPassword`,
    });

    const randomUser: Prisma.userCreateInput = {
      authId: firebaseUser.uid,
      email: firebaseUser.email ?? "",
      firstName: `testVolunteerFirst${userNumber}Accepted`,
      lastName: `testVolunteerLast${userNumber}Accepted`,
      role: "VOLUNTEER",
      isAccepted: Status.ACCEPTED,
      createdAt: new Date().toISOString(),
    };

    const userCreationPromise = prisma.user.create({
      data: randomUser,
    });
    userPromises.push(userCreationPromise);
  }

  for (let i = 1; i <= 2; i++) {
    const userNumber = i;
    // eslint-disable-next-line no-await-in-loop
    const firebaseUser = await firebaseAdmin.auth().createUser({
      email: `testAdmin${userNumber}Accepted@gmail.com`,
      password: `abtcTestPassword`,
    });

    const randomUser: Prisma.userCreateInput = {
      authId: firebaseUser.uid,
      email: firebaseUser.email ?? "",
      firstName: `testAdminFirst${userNumber}Accepted`,
      lastName: `testAdminLast${userNumber}Accepted`,
      role: "ADMIN",
      isAccepted: Status.ACCEPTED,
      createdAt: new Date().toISOString(),
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
    console.log("Seeding users complete");
    await prisma.$disconnect();
    await firebaseAdmin.app().delete();
  });
