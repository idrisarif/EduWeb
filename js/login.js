import { supabase } from './script.js';

const loginForm = document.getElementById('login-form');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const { data: loginData, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            alert('Login gagal: ' + error.message);
            return;
        }

        const userId = loginData.user.id;
        
        const { data: userData, error: userError } = await supabase
            .from('user')
            .select('role, nama')
            .eq('user_id', userId)
            .single();
        
        if (userError) {
            alert('Gagal mengambil data user: ' + userError.message);
            return;
        }

        localStorage.setItem('user_id', userId);
        localStorage.setItem('role', userData.role);
        localStorage.setItem('nama', userData.nama);

        alert(`Selamat Datang, ${userData.role} ${userData.nama}!`);

        if (userData.role === 'Guru') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'home.html';
        }
    });
}