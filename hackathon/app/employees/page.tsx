"use client"
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

interface Employees {
  id: number;
  name: string;
  dob: string;
  email: string;
  image: string;
}

export default function Home() {
  const [employees, setEmployees] = useState<Employees[]>([]);
  const [newEmployee, setNewEmployee] = useState({
    id: Math.floor(Math.random() * 999999999),
    name: "",
    dob: "",
    email: "",
    image: "",
  });
  const [isEditing, setIsEditing] = useState(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEmployee({
      ...newEmployee,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !newEmployee.name ||
      !newEmployee.dob ||
      !newEmployee.email ||
      !newEmployee.image
    ) {
      Swal.fire({
        icon: "error",
        title: "Lỗi Thêm nhân viên",
      });
      return;
    }

    try {
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `/api/employees/${newEmployee.id}`
        : "/api/employees";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEmployee),
      });

      if (response.ok) {
        const data = await response.json();

        if (isEditing) {
          setEmployees((prevEmployees) =>
            prevEmployees.map((emp) => (emp.id === newEmployee.id ? data : emp))
          );
          Swal.fire({
            icon: "success",
            title: "Cập nhật Thành Công!",
          });
        } else {
          setEmployees([...employees, data]);
          Swal.fire({
            icon: "success",
            title: "Thêm Thành Công!",
          });
        }

        setNewEmployee({ id: 0, name: "", dob: "", email: "", image: "" });
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        if (errorData.error === "Lỗi Email") {
          Swal.fire({
            icon: "error",
            title: "Lỗi Email",
            text: "Email đã tồn tại. Vui lòng sử dụng email khác.",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: errorData.error,
          });
        }
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Có lỗi xảy ra khi xử lý yêu cầu.",
      });
    }
  };

  const handleEdit = (employee: Employees) => {
    setNewEmployee(employee);
    setIsEditing(true);
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn xóa?",
      text: "Bạn sẽ không thể khôi phục dữ liệu này!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`/api/employees/${id}`, {
            method: "DELETE",
          });

          if (response.ok) {
            const data = await response.json();
            setEmployees(data);
            Swal.fire(
              "Đã xóa!",
              "Nhân viên đã được xóa thành công.",
              "success"
            );
          } else {
            const errorData = await response.json();
            Swal.fire({
              icon: "error",
              title: "Error",
              text: errorData.error,
            });
          }
        } catch (error) {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "Lỗi xóa nhân viên",
          });
        }
      }
    });
  };

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
                    <button
                      className="bg-gray-200 text-gray-700 px-2 py-1 rounded mr-2"
                      onClick={() => handleEdit(employee)}
                    >
                      Sửa
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDelete(employee.id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-span-4 bg-white p-4 shadow-md rounded">
          <h2 className="text-lg font-semibold mb-4">
            {isEditing ? "Cập nhật nhân viên" : "Thêm mới nhân viên"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Tên nhân viên</label>
              <input
                type="text"
                name="name"
                value={newEmployee.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Ngày sinh</label>
              <input
                type="date"
                name="dob"
                value={newEmployee.dob}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Hình ảnh</label>
              <input
                type="text"
                name="image"
                value={newEmployee.image}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={newEmployee.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white w-full py-2 rounded"
            >
              {isEditing ? "Cập nhật" : "Thêm"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
