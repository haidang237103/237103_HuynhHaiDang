import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    employeeId: '', fullName: '', gender: 'Nam', dateOfBirth: '',
    department: '', position: '', email: '', phone: '', hireDate: '', status: 'Đang làm việc'
  });

  const fetchEmployees = async (query = '') => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/employees?search=${query}`);
      setEmployees(res.data);
    } catch (err) {
      setMessage('Lỗi khi tải danh sách nhân viên!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmployees(search);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_BASE}/employees/${editingId}`, form);
        setMessage('Cập nhật nhân viên thành công!');
      } else {
        await axios.post(`${API_BASE}/employees`, form);
        setMessage('Thêm nhân viên mới thành công!');
      }
      setForm({ employeeId: '', fullName: '', gender: 'Nam', dateOfBirth: '', department: '', position: '', email: '', phone: '', hireDate: '', status: 'Đang làm việc' });
      setEditingId(null);
      fetchEmployees();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  const handleEdit = (emp) => {
    setEditingId(emp._id);
    setForm(emp);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      try {
        await axios.delete(`${API_BASE}/employees/${id}`);
        setMessage('Xóa nhân viên thành công!');
        fetchEmployees();
      } catch (err) {
        setMessage('Lỗi khi xóa nhân viên!');
      }
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>QUẢN LÝ NHÂN SỰ - MSSV: 237103 - HUỲNH HẢI ĐĂNG</h2>
      {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}

      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Tìm theo Mã NV hoặc Họ tên..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          style={{ padding: '8px', width: '250px' }}
        />
        <button type="submit" style={{ padding: '8px 12px', marginLeft: '8px' }}>Tìm kiếm</button>
      </form>

      <h3>{editingId ? 'Cập nhật thông tin nhân viên' : 'Thêm mới nhân viên'}</h3>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', maxWidth: '600px', marginBottom: '20px' }}>
        <input name="employeeId" placeholder="Mã NV *" value={form.employeeId} onChange={handleChange} disabled={!!editingId} required />
        <input name="fullName" placeholder="Họ và tên *" value={form.fullName} onChange={handleChange} required />
        <input name="email" placeholder="Email *" value={form.email} onChange={handleChange} required />
        <input name="phone" placeholder="Số điện thoại" value={form.phone} onChange={handleChange} />
        <input name="department" placeholder="Phòng ban" value={form.department} onChange={handleChange} />
        <input name="position" placeholder="Chức vụ" value={form.position} onChange={handleChange} />
        <button type="submit" style={{ gridColumn: 'span 2', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}>
          {editingId ? 'Lưu cập nhật' : 'Thêm mới'}
        </button>
      </form>

      <h3>Danh sách nhân viên</h3>
      {loading ? <p>Đang tải dữ liệu...</p> : (
        <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th>Mã NV</th><th>Họ tên</th><th>Phòng ban</th><th>Chức vụ</th><th>Email</th><th>SĐT</th><th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp._id}>
                <td>{emp.employeeId}</td>
                <td>{emp.fullName}</td>
                <td>{emp.department}</td>
                <td>{emp.position}</td>
                <td>{emp.email}</td>
                <td>{emp.phone}</td>
                <td>
                  <button onClick={() => handleEdit(emp)}>Sửa</button>{' '}
                  <button onClick={() => handleDelete(emp._id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
