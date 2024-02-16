import { Prisma, PrismaClient, Status } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const platformSignupPromises: Promise<Prisma.platformSignUpCreateInput>[] = [];

  const users = await prisma.user.findMany();

  // Check if there are users to associate with platform signups
  if (users.length === 0) {
    throw new Error("No users found for seeding platform signups");
  }

  const platformSignups: Prisma.platformSignUpCreateInput[] = [];
  users.forEach((user) => {
    platformSignups.push({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      status: Status.PENDING,
    });
  });

  platformSignups.forEach((signupRequest) => {
    platformSignupPromises.push(
      prisma.platformSignUp.create({
        data: signupRequest,
      }),
    );
  });

  await Promise.all(platformSignupPromises);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
