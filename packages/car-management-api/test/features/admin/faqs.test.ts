import { CreateFaqSchema, UpdateFaqSchema } from "@/api/admin/features/faqs/schema";
import app from "@/index";
import { prisma } from "@/lib/db";
import { beforeEach, describe, expect, it } from "vitest";
import { z } from "zod";
import { clearTestDb, createTestTenantAndAdminUsers, type TestAdminUserWithToken } from "../../helper";

describe("Admin API: /api/v1/admin/tenants/:tenantId/faqs", () => {
  let adminUser: TestAdminUserWithToken;
  let tenantId: string;

  beforeEach(async () => {
    await clearTestDb(prisma);
    ({ tenantId, adminUser } = await createTestTenantAndAdminUsers(prisma));
  });

  it("should create a new faq", async () => {
    const newFaq: z.infer<typeof CreateFaqSchema> = {
      question: "What is Gemini?",
      answer: "A powerful AI model.",
      icon: "test-icon",
    };
    const response = await app.request(`/api/v1/admin/tenants/${tenantId}/faqs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminUser.token}`,
      },
      body: JSON.stringify(newFaq),
    });
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body).toMatchObject(newFaq);
  });

  it("should get all faqs", async () => {
    await prisma.faq.create({
      data: {
        question: "Existing Question",
        answer: "Existing Answer",
        icon: "test-icon",
        tenantId: tenantId,
      },
    });

    const response = await app.request(`/api/v1/admin/tenants/${tenantId}/faqs`, {
      method: "GET",
      headers: { Authorization: `Bearer ${adminUser.token}` },
    });
    expect(response.status).toBe(200);
    const body: any = await response.json();
    expect(Array.isArray(body.items)).toBe(true);
    expect(body.total).toBe(1);
    expect(body.items.some((s: any) => s.question === "Existing Question" && s.icon === "test-icon")).toBe(true);
  });

  it("should get a faq by id", async () => {
    const faq = await prisma.faq.create({
      data: {
        question: "Find me",
        answer: "Here I am",
        icon: "test-icon",
        tenantId: tenantId,
      },
    });
    const response = await app.request(`/api/v1/admin/tenants/${tenantId}/faqs/${faq.id}`, {
      headers: {
        Authorization: `Bearer ${adminUser.token}`,
      },
    });
    expect(response.status).toBe(200);
    const body: any = await response.json();
    expect(body.id).toBe(faq.id);
    expect(body.question).toBe("Find me");
    expect(body.icon).toBe("test-icon");
  });

  it("should update a faq", async () => {
    const faq = await prisma.faq.create({
      data: {
        question: "Original Question",
        answer: "Original Answer",
        icon: "original-icon",
        tenantId: tenantId,
      },
    });
    const updatedFaqData: z.infer<typeof UpdateFaqSchema> = {
      question: "Updated Question",
      answer: "Updated Answer",
      icon: "updated-icon",
    };
    const response = await app.request(`/api/v1/admin/tenants/${tenantId}/faqs/${faq.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminUser.token}`,
      },
      body: JSON.stringify(updatedFaqData),
    });
    expect(response.status).toBe(200);
    const body: any = await response.json();
    expect(body).toMatchObject(updatedFaqData);
  });

  it("should delete a faq", async () => {
    const faqToDelete = await prisma.faq.create({
      data: {
        question: "Delete me",
        answer: "I am to be deleted",
        icon: "delete-icon",
        tenantId: tenantId,
      },
    });
    const response = await app.request(`/api/v1/admin/tenants/${tenantId}/faqs/${faqToDelete.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${adminUser.token}`,
      },
    });
    expect(response.status).toBe(204);

    const findResponse = await app.request(`/api/v1/admin/tenants/${tenantId}/faqs/${faqToDelete.id}`, {
      headers: {
        Authorization: `Bearer ${adminUser.token}`,
      },
    });
    expect(findResponse.status).toBe(404);
  });
});

describe("Admin API: /api/v1/admin/tenants/:tenantId/faqs for TENANT_VIEWER", () => {
  let tenantViewerUser: TestAdminUserWithToken;
  let tenantId: string;
  let faqId: string;

  beforeEach(async () => {
    await clearTestDb(prisma);
    const setup = await createTestTenantAndAdminUsers(prisma);
    tenantViewerUser = setup.tenantViewerUser;
    tenantId = setup.tenantId;

    const faq = await prisma.faq.create({
      data: {
        question: "Readable Question",
        answer: "Readable Answer",
        icon: "readable-icon",
        tenantId,
      },
    });
    faqId = faq.id;
  });

  it("should allow getting all faqs", async () => {
    const response = await app.request(`/api/v1/admin/tenants/${tenantId}/faqs`, {
      headers: { Authorization: `Bearer ${tenantViewerUser.token}` },
    });
    expect(response.status).toBe(200);
    const body: any = await response.json();
    expect(body.total).toBe(1);
    expect(body.items[0].id).toBe(faqId);
  });

  it("should allow getting a faq by id", async () => {
    const response = await app.request(`/api/v1/admin/tenants/${tenantId}/faqs/${faqId}`, {
      headers: { Authorization: `Bearer ${tenantViewerUser.token}` },
    });
    expect(response.status).toBe(200);
    const body: any = await response.json();
    expect(body.id).toBe(faqId);
  });

  it("should forbid creating a new faq", async () => {
    const newFaq: z.infer<typeof CreateFaqSchema> = {
      question: "Forbidden Question",
      answer: "Forbidden Answer",
      icon: "forbidden-icon",
    };
    const response = await app.request(`/api/v1/admin/tenants/${tenantId}/faqs`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tenantViewerUser.token}` },
      body: JSON.stringify(newFaq),
    });
    expect(response.status).toBe(403);
  });

  it("should forbid updating a faq", async () => {
    const updatedFaqData: z.infer<typeof UpdateFaqSchema> = {
      question: "Forbidden Update",
      answer: "Forbidden Answer",
      icon: "forbidden-icon",
    };
    const response = await app.request(`/api/v1/admin/tenants/${tenantId}/faqs/${faqId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tenantViewerUser.token}` },
      body: JSON.stringify(updatedFaqData),
    });
    expect(response.status).toBe(403);
  });

  it("should forbid deleting a faq", async () => {
    const response = await app.request(`/api/v1/admin/tenants/${tenantId}/faqs/${faqId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${tenantViewerUser.token}` },
    });
    expect(response.status).toBe(403);
  });
});
