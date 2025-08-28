import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Centralized Supabase Initialization
const supabaseUrl = 'https://kwahwerhxkqpnhxllavm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3YWh3ZXJoeGtxcG5oeGxsYXZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxODQ4OTUsImV4cCI6MjA2Mjc2MDg5NX0.8-HqAo5AEK5nPU86mTAme8SQv-egMYPDy39wJ-3bEwg';
export const supabase = createClient(supabaseUrl, supabaseKey);

// UI and Navigation Functions
let toggleBtn = document.getElementById('toggle-btn');
let body = document.body;
let profile = document.querySelector('.header .flex .profile');
let sideBar = document.querySelector('.side-bar');
let menuBtn = document.querySelector('#menu-btn');
let closeBtn = document.querySelector('#close-btn');
let logoutBtn = document.getElementById('logoutBtn');

// Dark Mode Functions
const enableDarkMode = () => {
    toggleBtn.classList.replace('fa-sun', 'fa-moon');
    body.classList.add('dark');
    localStorage.setItem('dark-mode', 'enabled');
};

const disableDarkMode = () => {
    toggleBtn.classList.replace('fa-moon', 'fa-sun');
    body.classList.remove('dark');
    localStorage.setItem('dark-mode', 'disabled');
};

if (localStorage.getItem('dark-mode') === 'enabled') {
    enableDarkMode();
}

if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        if (localStorage.getItem('dark-mode') === 'disabled') {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    });
}

// User Profile and Sidebar
const userBtn = document.getElementById('user-btn');
if (userBtn) {
    userBtn.addEventListener('click', () => {
        profile.classList.toggle('active');
    });
}

if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        sideBar.classList.toggle('active');
        body.classList.toggle('active');
    });
}

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        sideBar.classList.remove('active');
        body.classList.remove('active');
    });
}

window.addEventListener('scroll', () => {
    profile.classList.remove('active');
    if (window.innerWidth < 1200) {
        sideBar.classList.remove('active');
        body.classList.remove('active');
    }
});

// Authentication and User Data Functions
async function checkAuthAndRedirect() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = 'login.html';
    }
}

async function updateUserName() {
    const userNameElement = document.getElementById('userName');
    if (!userNameElement) return;

    const storedName = localStorage.getItem('nama');
    if (storedName) {
        userNameElement.innerText = storedName;
    } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data, error } = await supabase
                .from('user')
                .select('nama')
                .eq('user_id', user.id)
                .single();
            if (data) {
                userNameElement.innerText = data.nama;
                localStorage.setItem('nama', data.nama);
            } else {
                console.error('Gagal mengambil nama pengguna:', error);
            }
        }
    }
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            alert('Gagal logout: ' + error.message);
            return;
        }
        localStorage.clear();
        window.location.href = 'login.html';
    });
}

// Initial functions to run on page load for authenticated pages
document.addEventListener('DOMContentLoaded', () => {
    const protectedPages = ['/home.html', '/courses.html', '/courses2.html', '/playlist.html', '/watch-video.html', '/pdf-viewer.html'
    , '/admin.html', '/admin-courses.html', '/admin-courses2.html', '/admin-courses3.html', '/admin-playlist.html', '/admin-user.html'];
    if (protectedPages.some(page => window.location.pathname.endsWith(page))) {
        checkAuthAndRedirect();
        updateUserName();
    }
});