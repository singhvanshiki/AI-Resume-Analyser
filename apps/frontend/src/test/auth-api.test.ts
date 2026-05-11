import MockAdapter from "axios-mock-adapter";

import { authApi } from "@/lib/api/auth";
import { rawClient } from "@/lib/api/client";

const mock = new MockAdapter(rawClient);

describe("authApi", () => {
  it("logs in and returns tokens", async () => {
    mock.onPost("/auth/login").reply(200, {
      access_token: "access-token",
      refresh_token: "refresh-token",
      token_type: "bearer",
      user: {
        id: "user-1",
        email: "user@example.com",
        full_name: "Test User",
        role: "student",
        created_at: "2025-01-01T00:00:00Z",
      },
    });

    const response = await authApi.login({
      email: "user@example.com",
      password: "password123",
    });

    expect(response.access_token).toBe("access-token");
    expect(response.user.role).toBe("student");
  });
});
