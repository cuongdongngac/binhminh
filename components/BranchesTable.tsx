"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Users, Home, User, Search, Filter } from "lucide-react";

export interface BranchRow {
  id: number;
  name: string;
  code: string | null;
  parent_id: number | null;
  description: string | null;
  created_at: string | null;
  founder: string | null;
  church: string | null;
}

export default function BranchesTable() {
  const [branches, setBranches] = useState<BranchRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const supabase = createClient();

  useEffect(() => {
    const fetchBranches = async () => {
      const { data, error } = await supabase
        .from("branches")
        .select(
          "id, name, code, parent_id, description, created_at, founder, church",
        )
        .order("code", { ascending: true, nullsFirst: true });

      if (!error && data) {
        setBranches(data as BranchRow[]);
      }
      setLoading(false);
    };

    fetchBranches();
  }, []);

  const filteredBranches = branches.filter(
    (branch) =>
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.founder?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.church?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12">
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">
            Đang tải danh sách chi họ...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Search Bar */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm chi họ, mã chi, người sáng lập..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Bộ lọc</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Mã chi
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Tên chi họ
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Người sáng lập
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nhà thờ họ
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Mô tả
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredBranches.map((branch) => (
              <tr
                key={branch.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-semibold text-sm">
                        {branch.code ? branch.code.slice(-2) : "N/A"}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {branch.code || "—"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-900 font-medium">
                      {branch.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">
                      {branch.founder || "—"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <Home className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">
                      {branch.church || "—"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    <p
                      className="text-gray-600 truncate"
                      title={branch.description || undefined}
                    >
                      {branch.description || "—"}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredBranches.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <Users className="w-12 h-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">
                      {searchTerm
                        ? "Không tìm thấy chi họ phù hợp"
                        : "Chưa có dữ liệu chi họ"}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {searchTerm
                        ? "Thử tìm kiếm với từ khóa khác"
                        : "Hãy thêm chi họ đầu tiên"}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredBranches.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Hiển thị {filteredBranches.length} chi họ
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Trước
            </button>
            <span className="px-3 py-1 bg-blue-600 text-white rounded-lg">
              1
            </span>
            <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
