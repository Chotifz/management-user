const User = require('../models/User');
const bcrypt = require('bcryptjs');

const createUser = async (req, res) => {    
    try {
        const { name, email, password, phone, departement } = req.body;

        const existingUser = await User.findOne({ email });

        if(existingUser) {
            return res.json({
                success: false,
                message: 'User sudah ada, silahkan login',
            })
        }
        
        const hashedPassword = await bcrypt.hash(password, 12);
       
        const newUser = new User({ 
            name, 
            email, 
            password: hashedPassword,
            phone,
            departement,});
        await newUser.save();
        res.status(201).json({
            success: true,
            message: 'User berhasil dibuat',
            data: newUser,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message });
    }
}

const getAllUsers = async (req, res) => {    
    try {
        const users = await User.find();
        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });   
    }
}

const getUserById = async (req, res) => {
    try {
        const { id } = req.params
        
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({success: false, message: 'Akun tidak ditemukan' });
        }
        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, departement } = req.body;

        if (!name && !email && !phone && !departement) {
            return res.status(400).json({success: false, message: 'Tidak ada data yang diperbarui' });
        }
        const user = await User.findById(id);                       
        if (!user) {
            return res.status(404).json({success: false, message: 'Akun tidak ditemukan' });
        }
        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone; 
        if (departement) user.departement = departement;
        await user.save();
        res.status(200).json({
            success: true,
            message: 'User berhasil diperbarui',
            data: user,
        });
    }
    catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({success: false, message: 'User tidak ditemukan' });
        }
        await User.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: 'User berhasil dihapus',
        });
    }
    catch (error) {
        res.status(500).json({success: true, message: error.message });
    }
}

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
}