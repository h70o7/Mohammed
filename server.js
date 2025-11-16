// server.js (مثال على خادم Node.js)
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config(); // لتحميل المتغيرات من ملف .env

const app = express();
const port = 3000;

// Middleware: لقبول البيانات بصيغة JSON
app.use(express.json());

// إعداد قاعدة البيانات
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// 🚀 المسار الأول: تسجيل مستخدم جديد
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'الرجاء إدخال جميع الحقول' });
    }

    try {
        // 1. تشفير كلمة المرور (لأمان الحسابات)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 2. استعلام SQL لإضافة المستخدم
        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id, username, email',
            [username, email, hashedPassword]
        );

        // 3. الرد على العميل
        res.status(201).json({ 
            message: 'تم التسجيل بنجاح', 
            user: result.rows[0] 
        });

    } catch (error) {
        console.error('خطأ في التسجيل:', error);
        // تحقق من خطأ تكرار اسم المستخدم/الإيميل
        if (error.code === '23505') { 
            return res.status(409).json({ error: 'اسم المستخدم أو الإيميل مستخدم بالفعل.' });
        }
        res.status(500).json({ error: 'حدث خطأ في الخادم.' });
    }
});

// تشغيل الخادم
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
