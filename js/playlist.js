import { supabase } from './script.js';

async function loadVideos() {
    const { data, error } = await supabase
        .from('video')
        .select('id_video, judul, thumbnail_url, file_url, sumber');

    if (error) {
        console.error('Gagal mengambil data video:', error);
        return;
    }

    const boxContainer = document.querySelector('.box-container');
    boxContainer.innerHTML = '';

    data.forEach(video => {
        let videoUrl;
        if (video.sumber === 'YouTube') {
            videoUrl = `watch-video.html?id=${video.file_url}&sumber=youtube`;
        } else {
            videoUrl = `watch-video.html?id=${video.id_video}&sumber=internal`;
        }
        
        const box = document.createElement('a');
        box.classList.add('box');
        box.href = videoUrl;

        const videoTitle = video.judul;
        const thumbnailUrl = video.thumbnail_url || 'images/post-1-1.png';
        
        box.innerHTML = `
            <i class="fas fa-play"></i>
            <img src="${thumbnailUrl}" alt="">
            <h3>${videoTitle}</h3>
        `;
        boxContainer.appendChild(box);
    });
}

// Call the function to load videos when the page content is ready
document.addEventListener('DOMContentLoaded', () => {
    loadVideos();
});