import { supabase } from './script.js';

async function getMateriById(materiId) {
    const { data: materi, error } = await supabase
        .from('materi')
        .select(`
            id_materi,
            judul,
            deskripsi,
            file_url,
            user (
                nama
            )
        `)
        .eq('id_materi', materiId)
        .single();

    if (error || !materi) {
        console.error('Error fetching materi:', error);
        document.querySelector('.box-container').innerHTML = '<p class="empty">Materi tidak ditemukan.</p>';
        return;
    }

    renderMateri(materi);
}

function renderMateri(materi) {
    const container = document.querySelector('.box-container');
    container.innerHTML = '';
    
    const box = document.createElement('div');
    box.classList.add('box');

    const title = document.createElement('h3');
    title.classList.add('title');
    title.textContent = materi.judul;
    
    const tutorName = document.createElement('p');
    tutorName.classList.add('tutor-name');
    tutorName.textContent = `Oleh: ${materi.user?.nama || 'Pengguna Tidak Dikenal'}`;
    
    const description = document.createElement('p');
    description.classList.add('description');
    description.textContent = materi.deskripsi;
    
    const fileContainer = document.createElement('div');
    fileContainer.classList.add('pdf-viewer-container');
    
    const iframe = document.createElement('iframe');
    iframe.src = materi.file_url;
    iframe.title = materi.judul;
    
    fileContainer.appendChild(iframe);

    box.appendChild(title);
    box.appendChild(tutorName);
    box.appendChild(description);
    box.appendChild(fileContainer);

    container.appendChild(box);
}

// Check for materiId in the URL and load the materi
const params = new URLSearchParams(window.location.search);
const materiId = params.get('materiId');

if (materiId) {
    getMateriById(materiId);
} else {
    document.querySelector('.box-container').innerHTML = '<p class="empty">Tidak ada materi yang dipilih. Kembali ke halaman daftar.</p>';
}