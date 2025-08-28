import { supabase } from './script.js';
 
   document.getElementById('register-form').addEventListener('submit', async function (e) {
      e.preventDefault(); // Mencegah reload halaman
      await window.register();
   });

   window.register = async function () {
     const nama = document.getElementById('nama').value
     const email = document.getElementById('email').value
     const password = document.getElementById('password').value

     const { data, error } = await supabase.auth.signUp({
       email,
       password
     })
 
     if (error) {
       alert('Gagal daftar: ' + error.message)
       return
     }
 
     const userId = data.user?.id
     if (!userId) {
       alert('User ID tidak ditemukan')
       return
     }
 
     const { error: insertError } = await supabase
       .from('user')
       .insert([{ user_id: userId, nama , email}])
 
     if (insertError) {
       alert('Gagal menyimpan data ke tabel user: ' + insertError.message)
     } else {
       alert('Daftar Akun Berhasil!')
       window.location.href = 'login.html'
     }
   }