import React, { useState } from 'react';

// تأكد من أن الخادم يعمل على هذا الرابط
const BACKEND_URL = 'http://localhost:3000/api/register'; 

function RegisterForm() {
    // حالة (State) لتخزين بيانات النموذج
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    // حالة لتخزين رسائل النظام (نجاح/خطأ)
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    // دالة للتعامل مع تغييرات الحقول
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // دالة للتعامل مع إرسال النموذج
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('... جارٍ التسجيل');
        setIsSuccess(false);

        try {
            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // التسجيل ناجح (حالة 201)
                setMessage('✅ ' + data.message + ' يمكنك الآن تسجيل الدخول.');
                setIsSuccess(true);
                setFormData({ username: '', email: '', password: '' }); // تفريغ النموذج
            } else {
                // خطأ من الخادم (مثال: مستخدم موجود بالفعل)
                setMessage('❌ خطأ في التسجيل: ' + data.error);
                setIsSuccess(false);
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            setMessage('❌ تعذر الاتصال بالخادم. تحقق من تشغيل خادم Node.js.');
            setIsSuccess(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2>إنشاء حساب جديد (مثل إنستغرام)</h2>
            
            {/* عرض رسالة النظام */}
            {message && (
                <p style={isSuccess ? styles.successMessage : styles.errorMessage}>
                    {message}
                </p>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
                
                <input
                    type="text"
                    name="username"
                    placeholder="اسم المستخدم"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
                
                <input
                    type="email"
                    name="email"
                    placeholder="البريد الإلكتروني"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
                
                <input
                    type="password"
                    name="password"
                    placeholder="كلمة المرور"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
                
                <button type="submit" style={styles.button}>
                    تسجيل
                </button>
            </form>
        </div>
    );
}

// تنسيقات بسيطة (يمكن استبدالها بـ CSS حقيقي)
const styles = {
    container: {
        maxWidth: '400px',
        margin: '50px auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        textAlign: 'center',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    input: {
        marginBottom: '15px',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '16px',
    },
    button: {
        padding: '10px 15px',
        backgroundColor: '#405de6', // لون أزرق مثل انستغرام
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    errorMessage: {
        color: '#ff4444',
        fontWeight: 'bold',
        marginBottom: '15px',
    },
    successMessage: {
        color: '#28a745',
        fontWeight: 'bold',
        marginBottom: '15px',
    }
};

export default RegisterForm;
