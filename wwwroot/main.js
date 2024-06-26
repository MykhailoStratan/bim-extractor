import { initViewer, loadModel } from './viewer.js';
import { initTree } from './sidebar.js';

const login = document.getElementById('login');
const sidebarToggle = document.getElementById('hubs-toggle');
const sidebar = document.getElementById('sidebar');
const preview = document.getElementById('preview');
const dashboard = document.getElementById('dashboard');


sidebar.style.width = '25%';

sidebarToggle.onclick = () => {
    const panels = document.querySelectorAll('.docking-panel');
    if (sidebar.style.width == '25%') {
        sidebar.style.width = '0%';
        dashboard.style.left = '0px';
        dashboard.style.width = '50%';
        console.log(panels)
        panels.forEach(p => p.style.width = '45%');
    } else {
        sidebar.style.width = '25%';
        dashboard.style.left = '25%';
        dashboard.style.width = '25%';
        panels.forEach(p => p.style.width = '100%');
    }
}

let savedProjectId = localStorage.getItem("savedProjectId") || '';

const saveProjectBtn = document.getElementById('hubs-save-btn');
const openSavedProjectBtn = document.getElementById('hubs-open-saved-btn');

try {
    const resp = await fetch('/api/auth/profile');
    if (resp.ok) {
        const user = await resp.json();
        login.innerText = `Logout (${user.name})`;
        login.onclick = () => {
            const iframe = document.createElement('iframe');
            iframe.style.visibility = 'hidden';
            iframe.src = 'https://accounts.autodesk.com/Authentication/LogOut';
            document.body.appendChild(iframe);
            iframe.onload = () => {
                window.location.replace('/api/auth/logout');
                document.body.removeChild(iframe);
            };
        }
        const viewer = await initViewer(document.getElementById('preview'));

        if (savedProjectId) {
            openSavedProjectBtn.classList.add('active');
        
            openSavedProjectBtn.onclick = async () => {

                if (savedProjectId) {
                    loadModel(viewer, savedProjectId);
                }
            }
            
        }

        initTree('#tree', (id) => { 
            loadModel(viewer, window.btoa(id).replace(/=/g, ''));

            saveProjectBtn.classList.add('active');
            openSavedProjectBtn.onclick = () => {

                if (savedProjectId) {
                    loadModel(viewer, savedProjectId);
                }
            }
            console.log(window.btoa(id).replace(/=/g, ''));
            saveProjectBtn.onclick = () => {
                
                localStorage.setItem("savedProjectId", window.btoa(id).replace(/=/g, ''));
                savedProjectId = localStorage.getItem("savedProjectId") || '';
                if (savedProjectId) {
                    openSavedProjectBtn.classList.add('active');
                }
            }
        });
        

    } else {
        login.innerText = 'Login';
        login.onclick = () => window.location.replace('/api/auth/login');
    }
    login.style.visibility = 'visible';
} catch (err) {
    alert('Could not initialize the application. See console for more details.');
    console.error(err);
}