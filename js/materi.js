import { supabase } from './script.js';

async function getMateri() {
    const { data: materiList, error } = await supabase
        .from('materi')
        .select(`
            id_materi,
            judul,
            deskripsi,
            file_url,
            thumbnail_url,
            created_at,
            user (
                nama
            )
        `);

    if (error) {
        console.error('Error fetching materi:', error);
        return;
    }

    renderMateri(materiList);
}

function renderMateri(materiList) {
    const container = document.querySelector('.box-container');
    container.innerHTML = '';
    let materiCounter = 1;

    if (materiList.length === 0) {
        container.innerHTML = '<p class="empty">Belum ada materi yang tersedia.</p>';
        return;
    }

    materiList.forEach(materi => {
        const box = document.createElement('div');
        box.classList.add('box');

        const thumbDiv = document.createElement('div');
        thumbDiv.classList.add('thumb');

        if (materi.thumbnail_url) {
            const img = document.createElement('img');
            img.src = materi.thumbnail_url;
            img.alt = materi.judul + ' Thumbnail';
            thumbDiv.appendChild(img);
        } else {
            const icon = document.createElement('i');
            icon.classList.add('fas', 'fa-file-pdf');
            thumbDiv.appendChild(icon);
        }

        const predikat = document.createElement('p');
        predikat.classList.add('predikat');
        predikat.textContent = `Materi ke-${materiCounter++}`;

        const title = document.createElement('h3');
        title.classList.add('title');
        title.textContent = materi.judul;

        const tutorName = document.createElement('p');
        tutorName.classList.add('tutor-name');
        tutorName.textContent = `Oleh: ${materi.user?.nama || 'Pengguna Tidak Dikenal'}`;

        const description = document.createElement('p');
        description.classList.add('description');
        description.textContent = materi.deskripsi;

        const link = document.createElement('a');
        link.href = `pdf-viewer.html?materiId=${materi.id_materi}`;
        link.classList.add('inline-btn');
        link.textContent = 'Lihat Materi';

        box.appendChild(predikat);
        box.appendChild(thumbDiv);
        box.appendChild(title);
        box.appendChild(tutorName);
        box.appendChild(description);
        box.appendChild(link);

        container.appendChild(box);
    });
}

// Call the main function to fetch and render materi
document.addEventListener('DOMContentLoaded', () => {
    getMateri();
});