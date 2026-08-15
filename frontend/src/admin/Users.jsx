import React, { useState, useEffect } from 'react';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { getAdminUsers, updateUserStatus } from '../services/api';
import { Users as UsersIcon, Search, Shield, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const Users = () => {
  useEffect(() => {
    document.title = 'CSC Admin | Customer Account Management';
  }, []);

  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Toggle Activation Modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [toggling, setToggling] = useState(false);
  const [toggleMsg, setToggleMsg] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await getAdminUsers({
        page,
        limit: 15,
        search: search.trim() || undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined
      });

      if (res && res.success) {
        setUsersList(res.data || []);
        setTotalPages(res.totalPages || 1);
      } else {
        setError(res.message || 'Failed to fetch customer accounts.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error fetching users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleToggleActivation = async () => {
    if (!selectedUser) return;

    setToggling(true);
    try {
      const res = await updateUserStatus(selectedUser.id, !selectedUser.isActive);
      if (res && res.success) {
        setToggleMsg(res.message);
        setSelectedUser(null);
        await fetchUsers();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status.');
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Customer Account Management Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage customer accounts, inspect registered profiles, and toggle account activation.
          </p>
        </div>
      </div>

      {toggleMsg && <Alert type="success" title="Success">{toggleMsg}</Alert>}
      {error && <Alert type="error" title="Error">{error}</Alert>}

      {/* Filter & Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Name, Email, or Mobile..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input pl-10 text-xs py-2.5"
            />
          </div>
          <button type="submit" className="btn-primary text-xs py-2.5 px-5 cursor-pointer">
            Search
          </button>
        </form>

        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          className="form-input text-xs py-2.5 sm:w-44 font-semibold"
        >
          <option value="all">All Roles</option>
          <option value="customer">Customers</option>
          <option value="admin">Administrators</option>
        </select>
      </div>

      {loading ? (
        <Loading message="Loading customer account database..." />
      ) : usersList.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title="No Users Found"
          description="No customer accounts match your search filter."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Customer Name</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Mobile Number</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Account Status</th>
                  <th className="p-3">Registered On</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {usersList.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{u.fullName}</td>
                    <td className="p-3 text-slate-600">{u.email}</td>
                    <td className="p-3 font-mono">{u.mobile || 'N/A'}</td>
                    <td className="p-3 capitalize font-bold text-indigo-700">{u.role}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${
                        u.isActive !== false ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {u.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className={`text-xs font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                          u.isActive !== false
                            ? 'text-red-600 hover:bg-red-50 border border-red-200'
                            : 'text-emerald-600 hover:bg-emerald-50 border border-emerald-200'
                        }`}
                      >
                        {u.isActive !== false ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-tertiary text-xs py-1.5 px-3 flex items-center gap-1 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <span className="text-slate-500 font-medium">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-tertiary text-xs py-1.5 px-3 flex items-center gap-1 disabled:opacity-40"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center">
            <h3 className="text-lg font-bold text-slate-900">
              {selectedUser.isActive !== false ? 'Deactivate Account?' : 'Activate Account?'}
            </h3>
            <p className="text-xs text-slate-600">
              {selectedUser.isActive !== false
                ? `Deactivating "${selectedUser.fullName}" will prevent them from accessing protected customer features.`
                : `Activating "${selectedUser.fullName}" will restore their full account privileges.`}
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button onClick={() => setSelectedUser(null)} className="btn-tertiary text-xs py-2 px-4">
                Cancel
              </button>
              <button
                onClick={handleToggleActivation}
                disabled={toggling}
                className={`btn-primary text-xs py-2 px-5 cursor-pointer ${
                  selectedUser.isActive !== false ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {toggling ? 'Updating...' : 'Confirm Status Change'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Users;
