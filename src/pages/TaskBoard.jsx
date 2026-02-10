import React, { useEffect, useState } from "react";
import { api } from "../services/api";

const KanbanColumn = ({ title, count, color, children }) => (
  <div className="kanban-column flex flex-col gap-4 w-80 shrink-0">
    <div className="flex items-center justify-between px-1">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${color}`}></div>
        <h3 className="text-sm font-bold text-[#131018] dark:text-white uppercase tracking-wider">
          {title} ({count})
        </h3>
      </div>
      <button className="text-[#6d5e8d] hover:text-primary">
        <span className="material-symbols-outlined">more_horiz</span>
      </button>
    </div>
    <div className="flex flex-col gap-3">{children}</div>
  </div>
);

// Helper function to format duration
const formatDuration = (milliseconds) => {
  if (!milliseconds) return null;

  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    const remainingHours = hours % 24;
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
  } else if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return `${seconds}s`;
  }
};

// Helper function to calculate ongoing duration
const calculateOngoingDuration = (startedAt) => {
  if (!startedAt) return null;
  const now = new Date();
  const start = new Date(startedAt);
  return now - start;
};

const TaskCard = ({
  task,
  isCompleted,
  onStatusChange,
  onManageAssignees,
  onOpenComments,
  onDelete,
  onReview,
}) => {
  const [currentTime, setCurrentTime] = React.useState(Date.now());

  // Update timer every minute for in-progress tasks
  React.useEffect(() => {
    if (
      (task.status === "inProgress" || task.status === "underReview") &&
      task.startedAt
    ) {
      const interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [task.status, task.startedAt]);

  const getAvatar = (assignee) => {
    if (typeof assignee === "object") {
      return (
        assignee.avatar ||
        assignee.profilePicture ||
        "https://ui-avatars.com/api/?name=" + (assignee.name || "User")
      );
    }
    return assignee;
  };

  return (
    <div
      className={`bg-white dark:bg-[#1c142e] p-4 rounded-xl shadow-sm border border-[#dedae7] dark:border-[#2d2445] hover:border-primary/50 cursor-pointer group transition-all ${isCompleted ? "grayscale-[0.2]" : ""}`}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          {isCompleted ? (
            <span className="text-xs font-bold text-green-500 uppercase flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">
                check_circle
              </span>
              Done
            </span>
          ) : (
            <span
              className={`text-xs font-bold uppercase ${task.client === "Wait List" ? "px-2 py-0.5 rounded bg-orange-100 text-orange-600" : "text-[#6d5e8d] dark:text-[#a094b8]"} ${task.client === "Designing" ? "text-blue-500" : ""}`}
            >
              {task.client}
            </span>
          )}

          <select
            value={task.status}
            onChange={(e) => onStatusChange(task, e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="text-xs font-bold uppercase bg-transparent border-0 text-orange-500 focus:ring-0 cursor-pointer"
          >
            <option value="todo">To Do</option>
            <option value="inProgress">In Progress</option>
            <option value="underReview">Under Review</option>
            <option
              value="completed"
              disabled={task.reviewStatus === "rejected"}
              className={
                task.reviewStatus === "rejected" ? "text-gray-400" : ""
              }
            >
              Completed{" "}
              {task.reviewStatus === "rejected"
                ? "(Rejected tasks cannot be completed)"
                : ""}
            </option>
          </select>
        </div>

        <h4
          className={`text-sm font-bold text-[#131018] dark:text-white group-hover:text-primary transition-colors ${isCompleted ? "line-through decoration-[#6d5e8d]" : ""} ${!isCompleted ? "line-clamp-2 leading-snug" : ""}`}
        >
          {task.title}
        </h4>

        {task.progress && (
          <div className="w-full bg-background-light dark:bg-[#2d2445] h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-blue-500 h-full w-2/3"></div>
          </div>
        )}

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5 text-[#6d5e8d] dark:text-[#a094b8]">
            {isCompleted ? (
              <span className="text-xs font-medium">
                Completed {task.completedDate}
              </span>
            ) : (
              <>
                <span
                  className={`material-symbols-outlined text-sm ${task.priority === "high" ? "text-red-500" : ""}`}
                >
                  {task.priority === "high"
                    ? "priority_high"
                    : "calendar_today"}
                </span>
                <span className="text-xs font-medium">{task.date}</span>
              </>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenComments(task);
              }}
              className="hover:text-primary transition-colors flex items-center gap-1 ml-2"
              title="Comments"
            >
              <span className="material-symbols-outlined text-[18px]">
                chat_bubble
              </span>
              {task.commentsCount > 0 && (
                <span className="text-xs font-medium">
                  {task.commentsCount}
                </span>
              )}
            </button>
          </div>

          {/* Time Tracking Display */}
          <div className="flex items-center gap-1.5">
            {task.status === "completed" && task.timeSpent ? (
              <div className="flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded-md text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
                <span className="material-symbols-outlined text-[16px]">
                  schedule
                </span>
                <span className="text-xs font-bold">
                  {formatDuration(task.timeSpent)}
                </span>
              </div>
            ) : task.status === "inProgress" && task.startedAt ? (
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-md text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                <span className="material-symbols-outlined text-[16px]">
                  timer
                </span>
                <span className="text-xs font-bold">
                  {formatDuration(calculateOngoingDuration(task.startedAt))}
                </span>
              </div>
            ) : task.status === "underReview" && task.startedAt ? (
              <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 dark:bg-orange-900/20 rounded-md text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                <span className="material-symbols-outlined text-[16px]">
                  pending
                </span>
                <span className="text-xs font-bold">
                  {formatDuration(calculateOngoingDuration(task.startedAt))}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Review Status Section - Only for underReview tasks */}
        {!isCompleted && task.status === "underReview" && (
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            {task.reviewStatus === "approved" ? (
              <span className="px-2 py-1 text-xs font-bold text-green-600 bg-green-100 rounded-lg border border-green-200">
                ✓ Approved
              </span>
            ) : task.reviewStatus === "rejected" ? (
              <span className="px-2 py-1 text-xs font-bold text-red-600 bg-red-100 rounded-lg border border-red-200">
                ✗ Rejected
              </span>
            ) : (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onReview(task, "approved");
                  }}
                  className="px-3 py-1 text-xs font-bold text-green-600 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
                  title="Approve"
                >
                  ✓ Approve
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onReview(task, "rejected");
                  }}
                  className="px-3 py-1 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors"
                  title="Reject"
                >
                  ✗ Reject
                </button>
              </>
            )}
          </div>
        )}

        {/* Assignees and Actions Section */}
        <div className="flex items-center gap-2 mt-2">
          {task.assignees && task.assignees.length > 0 ? (
            <div className="flex -space-x-2">
              {task.assignees.map((assignee, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border-2 border-white dark:border-[#1c142e] bg-cover"
                  style={{ backgroundImage: `url('${getAvatar(assignee)}')` }}
                  title={typeof assignee === "object" ? assignee.name : ""}
                ></div>
              ))}
            </div>
          ) : (
            (task.assigneeInitials || task.priority) && (
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                {task.assigneeInitials || "MK"}
              </div>
            )
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onManageAssignees(task);
            }}
            className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Manage Assignees"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (
                window.confirm("Are you sure you want to delete this task?")
              ) {
                onDelete(task);
              }
            }}
            className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
            title="Delete Task"
          >
            <span className="material-symbols-outlined text-[16px]">
              delete
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

const CreateTaskModal = ({ onClose, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [status, setStatus] = useState("todo");
  const [isLoading, setIsLoading] = useState(false);

  const [clients, setClients] = useState([]);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await api.getClients();
        setClients(data);
      } catch (error) {
        console.error("Failed to load clients", error);
      }
    };
    loadClients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.createTask({ title, client, status });
      onSuccess();
    } catch (error) {
      console.error("Failed to create task", error);
      alert("Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1c142e] rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
            Create New Task
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Task Title
            </span>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-[#150f23] text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm h-10 px-3 border"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Client Name
            </span>
            <select
              required
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-[#150f23] text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm h-10 px-3 border"
            >
              <option value="">Select a client</option>
              {clients.map((c) => (
                <option key={c.id || c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-[#150f23] text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm h-10 px-3 border"
            >
              <option value="todo">To Do</option>
              <option value="inProgress">In Progress</option>
              <option value="underReview">Under Review</option>
              <option value="completed">Completed</option>
            </select>
          </label>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1c142e] border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-70"
            >
              {isLoading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ManageAssigneesModal = ({ task, onClose, onSuccess }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await api.getUsers().catch(() => []); // Fallback to empty if fails
        setUsers(data || []);
      } catch (error) {
        console.error("Failed to load users", error);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const isAssigned = (userId) => {
    return task.assignees?.some((a) => a._id === userId || a === userId);
  };

  const handleToggle = async (user) => {
    const userId = user._id || user.id;
    setProcessing(userId);
    try {
      if (isAssigned(userId)) {
        await api.unassignTask(task.id || task._id, userId);
      } else {
        await api.assignTask(task.id || task._id, userId);
      }
      onSuccess(); // Refresh parent
    } catch (error) {
      console.error("Operation failed", error);
      alert("Operation failed");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1c142e] rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
            Manage Assignees
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-4 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="text-center py-4">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No users found.
            </div>
          ) : (
            <div className="space-y-2">
              {users.map((user) => {
                const assigned = isAssigned(user._id || user.id);
                const isProcessing = processing === (user._id || user.id);
                return (
                  <div
                    key={user._id || user.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary bg-cover"
                        style={
                          user.avatar
                            ? { backgroundImage: `url('${user.avatar}')` }
                            : {}
                        }
                      >
                        {!user.avatar &&
                          (user.name ? user.name.charAt(0) : "U")}
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name || user.email || "Unknown User"}
                      </span>
                    </div>
                    <button
                      onClick={() => handleToggle(user)}
                      disabled={isProcessing}
                      className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                        assigned
                          ? "bg-red-100 text-red-600 hover:bg-red-200"
                          : "bg-green-100 text-green-600 hover:bg-green-200"
                      }`}
                    >
                      {isProcessing ? "..." : assigned ? "Remove" : "Assign"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatusChangeModal = ({
  isOpen,
  onClose,
  onConfirm,
  currentStatus,
  newStatus,
}) => {
  const [comment, setComment] = useState("");
  const [approver, setApprover] = useState("");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (isOpen && newStatus === "underReview") {
      setLoadingUsers(true);
      api
        .getUsers()
        .then(setUsers)
        .catch(console.error)
        .finally(() => setLoadingUsers(false));
    }
  }, [isOpen, newStatus]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1c142e] rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
            Update Status
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Please provide a reason or comment for changing the status from{" "}
            <strong className="uppercase">{currentStatus}</strong> to{" "}
            <strong className="uppercase">{newStatus}</strong>.
          </p>
          <textarea
            className="w-full p-3 border rounded-lg dark:bg-[#150f23] dark:border-gray-700 dark:text-white focus:ring-primary focus:border-primary"
            rows="3"
            placeholder="Required comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            autoFocus
          ></textarea>
          {newStatus === "underReview" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Approver *
              </label>
              {loadingUsers ? (
                <div className="text-sm text-gray-500">Loading users...</div>
              ) : (
                <select
                  value={approver}
                  onChange={(e) => setApprover(e.target.value)}
                  className="w-full p-3 border rounded-lg dark:bg-[#150f23] dark:border-gray-700 dark:text-white focus:ring-primary focus:border-primary"
                >
                  <option value="">-- Select an approver --</option>
                  {users.map((user) => (
                    <option
                      key={user._id || user.id}
                      value={user._id || user.id}
                    >
                      {user.name || user.email || "Unknown User"}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1c142e] border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (
                  comment.trim() &&
                  (newStatus !== "underReview" || approver)
                ) {
                  onConfirm(comment, approver);
                  setComment("");
                  setApprover("");
                }
              }}
              disabled={
                !comment.trim() || (newStatus === "underReview" && !approver)
              }
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TaskCommentsModal = ({ task, onClose, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (task) {
      api
        .getComments(task.id || task._id)
        .then(setComments)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const userId = currentUser?.id || currentUser?._id;
      if (!userId) {
        alert("User ID not found. Please log in again.");
        return;
      }
      await api.addComment(task.id || task._id, newComment, userId);
      setNewComment("");
      api.getComments(task.id || task._id).then(setComments);
    } catch (e) {
      console.error(e);
      alert("Failed to add comment");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1c142e] rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center shrink-0">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
            Comments: {task?.title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : comments.length === 0 ? (
            <div className="text-center text-gray-500">No comments yet.</div>
          ) : (
            comments.map((c, i) => (
              <div
                key={i}
                className="bg-gray-50 dark:bg-[#150f23] p-3 rounded-lg"
              >
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  {c.text || c.content}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs font-bold text-primary">
                    {typeof (c.user || c.author) === "object"
                      ? c.user?.name ||
                        c.author?.name ||
                        c.user?.email ||
                        "User"
                      : c.user || c.author || "User"}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {new Date(c.date || c.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t border-gray-200 dark:border-gray-800 shrink-0 bg-gray-50 dark:bg-[#150f23]"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Type a comment..."
              className="flex-1 rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1c142e] text-gray-900 dark:text-white px-4 py-2 text-sm focus:ring-primary focus:border-primary border"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-bold hover:bg-primary/90 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TaskBoard = () => {
  const [tasks, setTasks] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [managingTask, setManagingTask] = useState(null); // Track which task is being managed
  const [viewingCommentsTask, setViewingCommentsTask] = useState(null); // Track task for comments
  const [statusChangeRequest, setStatusChangeRequest] = useState(null); // Track status change request

  const [activeTab, setActiveTab] = useState("all");
  const [currentUser, setCurrentUser] = useState(null);

  const fetchTasks = () => {
    api.getTasks().then(setTasks).catch(console.error);
  };

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }
    fetchTasks();
  }, []);

  const getFilteredTasks = () => {
    if (!tasks) return {};
    if (activeTab === "all") return tasks;

    const filtered = {};
    Object.keys(tasks).forEach((status) => {
      filtered[status] = tasks[status].filter((task) => {
        if (activeTab === "assignedToMe") {
          if (!currentUser) return false;
          const userId = currentUser.id || currentUser._id;
          return task.assignees?.some((a) => {
            const aId = typeof a === "object" ? a._id || a.id : a;
            return aId === userId;
          });
        }
        return true;
      });
    });
    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  const handleStatusChangeTrigger = (task, newStatus) => {
    // Prevent rejected tasks from moving to completed
    if (task.reviewStatus === "rejected" && newStatus === "completed") {
      alert(
        "Rejected tasks cannot be marked as completed. Please move to In Progress first and resubmit for review.",
      );
      return;
    }
    setStatusChangeRequest({ task, newStatus });
  };

  const confirmStatusChange = async (comment, approverId) => {
    if (!statusChangeRequest) return;
    const { task, newStatus } = statusChangeRequest;
    const taskId = task.id || task._id;

    // Optimistic update
    setTasks((prevTasks) => {
      const newTasks = { ...prevTasks };
      let taskToMove = null;

      Object.keys(newTasks).forEach((status) => {
        if (newTasks[status]) {
          const taskIndex = newTasks[status].findIndex(
            (t) => (t.id || t._id) === taskId,
          );
          if (taskIndex !== -1) {
            taskToMove = newTasks[status][taskIndex];
            newTasks[status] = [
              ...newTasks[status].slice(0, taskIndex),
              ...newTasks[status].slice(taskIndex + 1),
            ];
          }
        }
      });

      if (taskToMove) {
        const updatedTask = { ...taskToMove, status: newStatus };
        if (!newTasks[newStatus]) {
          newTasks[newStatus] = [];
        }
        newTasks[newStatus] = [...newTasks[newStatus], updatedTask];
      }
      return newTasks;
    });

    try {
      const updateData = { status: newStatus };

      // Track timeline: Set startedAt when moving to inProgress
      if (newStatus === "inProgress" && !task.startedAt) {
        updateData.startedAt = new Date().toISOString();
      }

      // Track timeline: Set completedAt and calculate duration when completing
      if (newStatus === "completed" && task.startedAt) {
        updateData.completedAt = new Date().toISOString();
        const startTime = new Date(task.startedAt);
        const endTime = new Date(updateData.completedAt);
        const durationMs = endTime - startTime;
        updateData.timeSpent = durationMs; // Store in milliseconds
      }

      if (newStatus === "underReview" && approverId) {
        updateData.approver = approverId;
      }

      // Reset review status when moving back to inProgress
      if (newStatus === "inProgress" && task.reviewStatus) {
        updateData.reviewStatus = null;
      }

      await api.updateTask(taskId, updateData);
      const userId = currentUser?.id || currentUser?._id;
      if (userId) {
        await api.addComment(
          taskId,
          `Status changed from ${task.status} to ${newStatus}. Reason: ${comment}`,
          userId,
        );
      }
      fetchTasks();
    } catch (error) {
      console.error("Failed to update task status", error);
      fetchTasks(); // Revert to server state on error
      alert("Failed to update task status");
    } finally {
      setStatusChangeRequest(null);
    }
  };

  const handleReviewAction = async (task, status) => {
    try {
      await api.updateReviewStatus(task.id || task._id, status);
      setTasks((prev) => {
        const newTasks = { ...prev };
        Object.keys(newTasks).forEach((key) => {
          if (newTasks[key]) {
            newTasks[key] = newTasks[key].map((t) =>
              (t.id || t._id) === (task.id || task._id)
                ? { ...t, reviewStatus: status }
                : t,
            );
          }
        });
        return newTasks;
      });
    } catch (e) {
      console.error(e);
      alert("Failed to update review status");
    }
  };

  const handleDeleteTask = async (task) => {
    try {
      await api.deleteTask(task.id || task._id);
      setTasks((prevTasks) => {
        const newTasks = { ...prevTasks };
        Object.keys(newTasks).forEach((status) => {
          if (newTasks[status]) {
            newTasks[status] = newTasks[status].filter(
              (t) => (t.id || t._id) !== (task.id || task._id),
            );
          }
        });
        return newTasks;
      });
    } catch (error) {
      console.error("Failed to delete task", error);
      alert("Failed to delete task");
    }
  };

  if (!tasks) return <div>Loading...</div>;

  const renderColumn = (status, title, colorCode) => (
    <div className="kanban-column flex flex-col gap-4 w-80 shrink-0">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${colorCode}`}></div>
          <h3 className="text-sm font-bold text-[#131018] dark:text-white uppercase tracking-wider">
            {title} ({filteredTasks[status]?.length || 0})
          </h3>
        </div>
        <button className="text-[#6d5e8d] hover:text-primary">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {filteredTasks[status]?.map((task) => (
          <TaskCard
            key={task.id || task._id}
            task={task}
            isCompleted={status === "completed"}
            onStatusChange={handleStatusChangeTrigger}
            onManageAssignees={setManagingTask}
            onOpenComments={setViewingCommentsTask}
            onDelete={handleDeleteTask}
            onReview={handleReviewAction}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchTasks();
          }}
        />
      )}
      {managingTask && (
        <ManageAssigneesModal
          task={managingTask}
          onClose={() => setManagingTask(null)}
          onSuccess={() => {
            fetchTasks(); // Reload tasks to see updated assignees
          }}
        />
      )}
      {viewingCommentsTask && (
        <TaskCommentsModal
          task={viewingCommentsTask}
          currentUser={currentUser}
          onClose={() => setViewingCommentsTask(null)}
        />
      )}
      <StatusChangeModal
        isOpen={!!statusChangeRequest}
        currentStatus={statusChangeRequest?.task?.status}
        newStatus={statusChangeRequest?.newStatus}
        onClose={() => setStatusChangeRequest(null)}
        onConfirm={confirmStatusChange}
      />

      {/* Board Filters/Tabs */}
      <div className="px-8 pt-4 bg-background-light dark:bg-background-dark shrink-0">
        <div className="flex items-center justify-between border-b border-[#dedae7] dark:border-[#2d2445]">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("all")}
              className={`border-b-2 pb-3 pt-2 text-sm font-bold transition-colors ${
                activeTab === "all"
                  ? "border-primary text-primary"
                  : "border-transparent text-[#6d5e8d] dark:text-[#a094b8] hover:text-[#131018] dark:hover:text-white"
              }`}
            >
              All Tasks
            </button>
            <button
              onClick={() => setActiveTab("assignedToMe")}
              className={`border-b-2 pb-3 pt-2 text-sm font-bold transition-colors ${
                activeTab === "assignedToMe"
                  ? "border-primary text-primary"
                  : "border-transparent text-[#6d5e8d] dark:text-[#a094b8] hover:text-[#131018] dark:hover:text-white"
              }`}
            >
              Assigned to Me
            </button>
            <button
              onClick={() => setActiveTab("archived")}
              className={`border-b-2 pb-3 pt-2 text-sm font-bold transition-colors ${
                activeTab === "archived"
                  ? "border-primary text-primary"
                  : "border-transparent text-[#6d5e8d] dark:text-[#a094b8] hover:text-[#131018] dark:hover:text-white"
              }`}
            >
              Archived
            </button>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm font-bold mb-3"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Task
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-auto p-8 flex gap-6 items-start bg-background-light dark:bg-background-dark">
        {renderColumn("todo", "To Do", "bg-gray-400")}
        {renderColumn("inProgress", "In Progress", "bg-blue-500")}
        {renderColumn("underReview", "Under Review", "bg-orange-500")}
        {renderColumn("completed", "Completed", "bg-green-500")}
      </div>
    </div>
  );
};

export default TaskBoard;
