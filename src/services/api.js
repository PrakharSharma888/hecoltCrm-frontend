const BASE_URL = "https://hecolt-crm-backend.vercel.app/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  login: async (email, password) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error("Login failed");
      }
      const data = await response.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user)); // Store user info if needed
      }
      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  getDashboardStats: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dashboard/stats`, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch stats");
      return await response.json();
    } catch (error) {
      console.error("Get stats error:", error);
      throw error;
    }
  },

  getRecentActivity: async () => {
    try {
      const response = await fetch(`${BASE_URL}/dashboard/activity`, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch activity");
      return await response.json();
    } catch (error) {
      console.error("Get activity error:", error);
      throw error;
    }
  },

  getTasks: async () => {
    try {
      const response = await fetch(`${BASE_URL}/tasks`, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch tasks");
      return await response.json();
    } catch (error) {
      console.error("Get tasks error:", error);
      throw error;
    }
  },

  createTask: async (taskData) => {
    try {
      const response = await fetch(`${BASE_URL}/tasks`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(taskData),
      });
      if (!response.ok) throw new Error("Failed to create task");
      return await response.json();
    } catch (error) {
      console.error("Create task error:", error);
      throw error;
    }
  },

  updateTask: async (taskId, updates) => {
    try {
      const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update task");
      return await response.json();
    } catch (error) {
      console.error("Update task error:", error);
      throw error;
    }
  },

  getClients: async () => {
    try {
      const response = await fetch(`${BASE_URL}/clients`, {
        headers: getHeaders(),
      });

      // If endpoint doesn't exist (404) or other errors, return empty array
      if (!response.ok) {
        if (response.status === 404) {
          console.warn("Clients endpoint not found, returning empty array");
          return [];
        }
        if (response.status === 401) {
          console.error("Unauthorized - token may be invalid");
          // Don't throw, just return empty to prevent logout
          return [];
        }
        throw new Error("Failed to fetch clients");
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Get clients error:", error);
      // Return empty array instead of throwing to prevent crashes
      return [];
    }
  },

  addClient: async (clientData) => {
    try {
      const response = await fetch(`${BASE_URL}/clients`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(clientData),
      });
      if (!response.ok) throw new Error("Failed to add client");
      return await response.json();
    } catch (error) {
      console.error("Add client error:", error);
      throw error;
    }
  },

  getUsers: async () => {
    try {
      const response = await fetch(`${BASE_URL}/users`, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      return await response.json();
    } catch (error) {
      console.error("Get users error:", error);
      throw error;
    }
  },

  assignTask: async (taskId, userId) => {
    try {
      const response = await fetch(`${BASE_URL}/tasks/${taskId}/assign`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error("Failed to assign task");
      return await response.json();
    } catch (error) {
      console.error("Assign task error:", error);
      throw error;
    }
  },

  unassignTask: async (taskId, userId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/tasks/${taskId}/assign/${userId}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        },
      );
      if (!response.ok) throw new Error("Failed to unassign task");
      return await response.json();
    } catch (error) {
      console.error("Unassign task error:", error);
      throw error;
    }
  },

  updateTaskAssignees: async (taskId, userIds) => {
    try {
      const response = await fetch(`${BASE_URL}/tasks/${taskId}/assignees`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ userIds }),
      });
      if (!response.ok) throw new Error("Failed to update task assignees");
      return await response.json();
    } catch (error) {
      console.error("Update task assignees error:", error);
      throw error;
    }
  },

  getComments: async (taskId) => {
    try {
      const response = await fetch(`${BASE_URL}/tasks/${taskId}/comments`, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch comments");
      return await response.json();
    } catch (error) {
      console.error("Get comments error:", error);
      throw error; // Return empty array or throw? decided to throw to handle in UI
    }
  },

  addComment: async (taskId, text, userId) => {
    console.log("Adding comment:", { taskId, text, userId });
    try {
      const response = await fetch(`${BASE_URL}/tasks/${taskId}/comments`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ text, userId, user: userId }),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to add comment");
      }
      return await response.json();
    } catch (error) {
      console.error("Add comment error:", error);
      throw error;
    }
  },

  deleteTask: async (taskId) => {
    try {
      const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error("Failed to delete task");
      return await response.json();
    } catch (error) {
      console.error("Delete task error:", error);
      throw error;
    }
  },

  updateReviewStatus: async (taskId, reviewStatus) => {
    try {
      const response = await fetch(`${BASE_URL}/tasks/${taskId}/review`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({ reviewStatus }),
      });
      if (!response.ok) throw new Error("Failed to update review status");
      return await response.json();
    } catch (error) {
      console.error("Update review status error:", error);
      throw error;
    }
  },
};
