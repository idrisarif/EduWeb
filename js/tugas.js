import { supabase } from './script.js';

let selectedTugasId = null;

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

async function loadAllTugas() {
    const { data, error } = await supabase
        .from('tugas')
        .select('id_tugas, judul, deskripsi, file_url, created_at, user:created_by(nama)')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Gagal mengambil data:', error);
        return;
    }

    const tableBody = document.getElementById('tugasTableBody');
    if (!tableBody) {
        console.error("Elemen dengan ID 'tugasTableBody' tidak ditemukan.");
        return;
    }
    tableBody.innerHTML = '';

    data.forEach(tugas => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td data-label="Judul">${tugas.judul}</td>
            <td data-label="Deskripsi">${tugas.deskripsi}</td>
            <td data-label="File Tugas"><a href="${tugas.file_url}" target="_blank">Lihat File</a></td>
            <td data-label="Dibuat Pada">${formatDate(tugas.created_at)}</td>
            <td data-label="Dibuat oleh">${tugas.user?.nama || 'Tidak diketahui'}</td>
            <td data-label="Aksi"><button onclick="openJawabModal('${tugas.id_tugas}')">Jawab</button></td>
        `;
        tableBody.appendChild(row);
    });
}

window.openJawabModal = function(id_tugas) {
    selectedTugasId = id_tugas;
    document.getElementById('jawabanModal').style.display = 'block';
};

window.closeModal = function() {
    document.getElementById('jawabanModal').style.display = 'none';
    document.getElementById('jawabanForm').reset();
};

// Event listener untuk form submission
document.addEventListener('DOMContentLoaded', () => {
    loadAllTugas();

    const form = document.getElementById('jawabanForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fileInput = document.getElementById('jawabanFile');
            const file = fileInput.files[0];

            if (!file) {
                alert("Silakan pilih file PDF terlebih dahulu.");
                return;
            }

            const namaFile = `${Date.now()}_${file.name.replace(/[^\w.-]/g, '_')}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('jawaban')
                .upload(namaFile, file, { upsert: true });

            if (uploadError) {
                alert('Gagal upload file: ' + uploadError.message);
                return;
            }

            const { data: publicData } = supabase.storage.from('jawaban').getPublicUrl(namaFile);
            const fileUrl = publicData.publicUrl;

            const userResponse = await supabase.auth.getUser();
            const userId = userResponse.data.user?.id;
            
            if (!userId) {
                alert('User tidak terotentikasi. Silakan login kembali.');
                return;
            }

            const { error: insertError } = await supabase.from('jawaban').insert([{
                id_tugas: selectedTugasId,
                file_url: fileUrl,
                created_by: userId
            }]);

            if (insertError) {
                alert('Gagal menyimpan jawaban: ' + insertError.message);
                return;
            }

            alert('Jawaban berhasil dikirim!');
            closeModal();
            loadAllTugas(); // Reload the list to show any changes
        });
    }
});