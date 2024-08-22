"use client";
import { useState, useEffect } from "react";

interface Employees {
  id: number;
  name: string;
  dob: string;
  email: string;
  image: string;
}

export default function Home() {
  const [employees, setEmployees] = useState<Employees[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("/api/employees");
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">STT</th>
                <th className="border border-gray-300 p-2">Tên nhân viên</th>
                <th className="border border-gray-300 p-2">Ngày sinh</th>
                <th className="border border-gray-300 p-2">Hình ảnh</th>
                <th className="border border-gray-300 p-2">Email</th>
                <th className="border border-gray-300 p-2">Chức năng</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, index) => (
                <tr key={employee.id} className="text-center">
                  <td className="border border-gray-300 p-2">{index + 1}</td>
                  <td className="border border-gray-300 p-2">
                    {employee.name}
                  </td>
                  <td className="border border-gray-300 p-2">{employee.dob}</td>
                  <td className="border border-gray-300 p-2">
                    <img
                      src={employee.image}
                      alt={employee.name}
                      className="w-12 h-12 object-cover rounded-full mx-auto"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    {employee.email}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <button className="bg-gray-200 text-gray-700 px-2 py-1 rounded mr-2">
                      Sửa
                    </button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded">
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-span-4 bg-white p-4 shadow-md rounded">
          <h2 className="text-lg font-semibold mb-4">Thêm mới nhân viên</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Tên nhân viên</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Ngày sinh</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Hình ảnh</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white w-full py-2 rounded"
            >
              Thêm
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
