import { Prisma, PrismaClient, ServiceRequestType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const serviceRequestPromises: Promise<any>[] = [];

  const users = await prisma.user.findMany();

  // Check if there are users to associate with service requests
  if (users.length === 0) {
    throw new Error("No users found for seeding service requests");
  }

  const serviceRequests: Prisma.serviceRequestCreateInput[] = [];
  users.forEach((user, idx) => {
    serviceRequests.push({
      requestName: `Site Service Request ${idx}`,
      requester: {
        connect: { id: user.id },
      },
      location: `Location ${idx}`,
      shiftTime: new Date(new Date().setDate(new Date().getDate() - idx)),
      description: `Description for Service Request ${idx}`,
      meal: `Meal ${idx}`,
      cookingMethod: `Cooking Method ${idx}`,
      frequency: `Frequency ${idx}`,
      requestType: ServiceRequestType.SITE,
    });
  });

  users.forEach((user, idx) => {
    serviceRequests.push({
      requestName: `Kitchen Service Request ${idx}`,
      requester: {
        connect: { id: user.id },
      },
      location: `Location ${idx}`,
      shiftTime: new Date(new Date().setDate(new Date().getDate() - idx)),
      description: `Description for Service Request ${idx}`,
      meal: `Meal ${idx}`,
      cookingMethod: `Cooking Method ${idx}`,
      frequency: `Frequency ${idx}`,
      requestType: ServiceRequestType.KITCHEN,
    });
  });

  serviceRequests.forEach((request) => {
    serviceRequestPromises.push(
      prisma.serviceRequest.create({
        data: request,
      }),
    );
  });

  await Promise.all(serviceRequestPromises);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
