global.crypto = require('crypto'); const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Employee = require('./models/Employee');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is healthy' });
});

app.get('/api/employees', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { employeeId: { $regex: search, $options: 'i' } },
          { fullName: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const employees = await Employee.find(query);
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/employees', async (req, res) => {
  const { employeeId, fullName, email } = req.body;
  if (!employeeId || !fullName || !email) {
    return res.status(400).json({ message: 'employeeId, fullName và email là bắt buộc' });
  }
  
  try {
    const existing = await Employee.findOne({ employeeId });
    if (existing) {
      return res.status(400).json({ message: 'Mã nhân viên đã tồn tại' });
    }
    const newEmployee = new Employee(req.body);
    const saved = await newEmployee.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/employees/:id', async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    res.json({ message: 'Xóa nhân viên thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const cors = require('cors'); app.use(cors());
