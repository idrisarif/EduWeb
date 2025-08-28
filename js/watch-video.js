import { supabase } from './script.js';

// Function to extract video parameters from the URL
function getVideoParamsFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        id: urlParams.get('id'),
        sumber: urlParams.get('sumber')
    };
}

// Function to fetch and display the video
async function loadVideo() {
    const { id, sumber } = getVideoParamsFromUrl();
    if (!id || !sumber) {
        console.error("ID atau sumber video tidak ditemukan di URL.");
        document.getElementById('videoTitle').innerText = "Video tidak ditemukan.";
        document.getElementById('videoDescription').innerText = "ID video tidak valid. Silakan kembali ke halaman sebelumnya.";
        return;
    }
    
    let query = supabase.from('video').select('judul, deskripsi, file_url, thumbnail_url, sumber');

    if (sumber === 'youtube') {
        query = query.eq('file_url', id);
    } else {
        query = query.eq('id_video', id);
    }

    const { data: video, error } = await query.single();

    if (error || !video) {
        console.error("Gagal mengambil data video:", error);
        document.getElementById('videoTitle').innerText = "Video tidak ditemukan.";
        document.getElementById('videoDescription').innerText = "Data video tidak ada atau tidak dapat diakses.";
        return;
    }
    
    const videoContainer = document.getElementById('videoContainer');
    
    // Clear any existing video content
    const existingVideoPlayer = videoContainer.querySelector('.video-player');
    if (existingVideoPlayer) {
        existingVideoPlayer.remove();
    }
    
    const videoPlayerDiv = document.createElement('div');
    videoPlayerDiv.classList.add('video-player');
    
    if (video.sumber === 'YouTube') {
        const videoId = video.file_url;
        if (videoId) {
            const youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}`;
            videoPlayerDiv.innerHTML = `<iframe width="100%" height="500px" src="${youtubeEmbedUrl}" title="${video.judul}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        } else {
            videoPlayerDiv.innerHTML = `<p style="text-align:center; color:red;">Gagal memuat video YouTube. ID video tidak ditemukan.</p>`;
        }
    } else {
        const thumbnailUrl = video.thumbnail_url || '';
        videoPlayerDiv.innerHTML = `<video src="${video.file_url}" controls poster="${thumbnailUrl}" style="width:100%; height:auto;" id="video"></video>`;
    }

    videoContainer.prepend(videoPlayerDiv);

    document.getElementById('videoTitle').innerText = video.judul;
    document.getElementById('videoDescription').innerText = video.deskripsi;
}

// Execute the function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadVideo();
});