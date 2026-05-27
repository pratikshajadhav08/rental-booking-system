import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminLayout from "./AdminLayout";

export default function Users() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const { data } = await api.get("/admin/users");
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (id, role) => {
    await api.put(`/admin/users/${id}/role`, { role });
    fetchUsers();
  };

  const deleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;
    await api.delete(`/admin/users/${id}`);
    fetchUsers();
  };

  return (
    <AdminLayout title="Users">
      <div className="bg-white border border-stone-100 rounded-2xl overflow-hidden">
        {users.map((user) => (
          <div key={user._id} className="grid md:grid-cols-4 gap-3 p-4 border-b last:border-b-0">
            <div>
              <p className="font-bold text-stone-900">{user.name}</p>
              <p className="text-sm text-stone-400">{user.email}</p>
            </div>
            <select
              value={user.role}
              onChange={(event) => updateRole(user._id, event.target.value)}
              className="border border-stone-200 rounded-xl px-3 py-2 text-sm"
            >
              <option value="user">User</option>
              <option value="host">Host</option>
              <option value="admin">Admin</option>
            </select>
            <p className="text-sm text-stone-500">
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </p>
            <button
              onClick={() => deleteUser(user._id)}
              className="justify-self-start md:justify-self-end text-sm font-bold text-rose-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
