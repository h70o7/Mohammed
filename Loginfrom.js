import React, { useState } from 'react';

const LOGIN_URL = 'http://localhost:3000/api/login'; 

function LoginForm({ onLoginSuccess }) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('... جارٍ محاولة تسجيل الدخول');
        setIsSuccess(false);

        try {
            const response = await fetch(LOGIN_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // تسجيل الدخول ناجح
                setMessage('✅ ' + data.message);
                setIsSuccess(true);
                
                // 1. تخزين الرمز المميز (Token) في التخزين المحلي للمتصفح
                localStorage.setItem('instaCloneToken', data.token); 
                
                // 2. استدعاء دالة خارجية لتغيير حالة التطبيق (مثل الانتقال إلى الصفحة الرئيسية)
                if (onLoginSuccess) {
                    onLoginSuccess(data.user);
                }
                
            } else {
                // خطأ في تسجيل الدخول
                setMessage('❌ ' + data.error);
                setIsSuccess(false);
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            setMessage('❌ تعذر الاتصال بالخادم. الرجاء التأكد من الاتصال.');
            setIsSuccess(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2>تسجيل الدخول</h2>
            
            {message && (
                <p style={isSuccess ? styles.successMessage : styles.errorMessage}>
                    {message}
                </p>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
                
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
                    دخول
                </button>
            </form>
        </div>
    );
}

// التنسيقات (مستخدمة من ملف RegisterForm للتوحيد)
const styles = {
    container: { /* ... */ },
    form: { /* ... */ },
    input: { /* ... */ },
    button: { /* ... */ },
    errorMessage: { /* ... */ },
    successMessage: { /* ... */ }
};

export default LoginForm;
