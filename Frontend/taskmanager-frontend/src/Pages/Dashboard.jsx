import { useEffect, useState } from "react";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import TaskForm from "../components/TaskForm";

export default function Dashboard() {

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 5;

  const loadTasks = async () => {
    try {

      const res = await api.get("/tasks", {
        params: { page, limit, search, status }
      });

      setTasks(res.data.data.tasks);
      setTotalPages(res.data.data.pagination.pages);

    } catch (err) {
      console.error(err);
    }
  };

  const loadStats = async () => {
    try {

      const res = await api.get("/tasks/stats");
      setStats(res.data.data);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadTasks();
    loadStats();
  }, [page, search, status]);

  const deleteTask = async (id) => {

    try {

      await api.delete(`/tasks/${id}`);
      loadTasks();
      loadStats();

    } catch (err) {
      console.error(err);
    }

  };

  const completeTask = async (id) => {

    try {

      await api.patch(`/tasks/${id}`, {
        status: "completed"
      });

      loadTasks();
      loadStats();

    } catch (err) {
      console.error(err);
    }

  };

  const getPriorityColor = (priority) => {

    if (priority === "high") return "bg-red-100 text-red-600";
    if (priority === "medium") return "bg-yellow-100 text-yellow-600";
    return "bg-green-100 text-green-600";

  };

  const getStatusColor = (status) => {

    if (status === "completed") return "bg-green-100 text-green-700";
    if (status === "in-progress") return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-700";

  };

  return (

    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Task Dashboard
        </h1>

        {/* Task Form */}

        <TaskForm
          reload={() => {
            loadTasks();
            loadStats();
          }}
        />

        {/* Search + Filter */}

        <div className="flex gap-3 mb-6">

          <input
            type="text"
            placeholder="Search tasks..."
            className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="px-4 py-2 border rounded-lg shadow-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

        </div>

        {/* Task List */}

        {tasks.length === 0 && (

          <div className="text-center text-gray-500 bg-white p-6 rounded shadow">
            No tasks found
          </div>

        )}

        {tasks.map((task) => (

          <div
            key={task._id}
            className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition mb-4"
          >

            <div className="flex justify-between items-start">

              <div>

                <h3 className="text-lg font-semibold text-gray-800">
                  {task.title}
                </h3>

                <p className="text-gray-500 mt-1">
                  {task.description}
                </p>

                <div className="flex gap-2 mt-3">

                  <span
                    className={`text-xs px-3 py-1 rounded-full ${getStatusColor(task.status)}`}
                  >
                    {task.status}
                  </span>

                  <span
                    className={`text-xs px-3 py-1 rounded-full ${getPriorityColor(task.priority)}`}
                  >
                    {task.priority}
                  </span>

                </div>

              </div>

              <div className="flex gap-4">

                {task.status !== "completed" && (

                  <button
                    className="text-green-600 font-medium hover:text-green-800"
                    onClick={() => completeTask(task._id)}
                  >
                    Complete
                  </button>

                )}

                <button
                  className="text-red-500 font-medium hover:text-red-700"
                  onClick={() => deleteTask(task._id)}
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        ))}

        {/* Pagination */}

        <div className="flex justify-center items-center gap-4 mt-6">

          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          <span className="text-gray-700 font-medium">
            Page {page} / {totalPages}
          </span>

          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>

        </div>

        {/* Stats */}

        <div className="grid grid-cols-3 gap-4 mt-10">

          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-gray-500 text-sm">Total Tasks</p>
            <h3 className="text-xl font-bold text-indigo-600">
              {stats.total || 0}
            </h3>
          </div>

          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-gray-500 text-sm">Completed</p>
            <h3 className="text-xl font-bold text-green-600">
              {stats.completed || 0}
            </h3>
          </div>

          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-gray-500 text-sm">Pending</p>
            <h3 className="text-xl font-bold text-orange-500">
              {stats.pending || 0}
            </h3>
          </div>

        </div>

      </div>

    </div>

  );

}