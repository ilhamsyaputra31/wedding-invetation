import { data } from '../assets/data/data.js';

// ============================================
// Admin Panel - Wedding Invitation
// ============================================

const STORAGE_KEY = 'wedding_data';
const GUEST_KEY = 'wedding_guests';

// ---- Helpers ----
const getBaseUrl = () => {
    const url = new URL(window.location.href);
    return `${url.origin}${url.pathname.replace(/admin\.html$/, 'index.html')}`;
};

const loadWeddingData = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
};

const saveWeddingData = (newData) => {
    const current = loadWeddingData();
    const merged = deepMerge(current, newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
};

const deepMerge = (target, source) => {
    const result = { ...target };
    for (const key of Object.keys(source)) {
        if (
            source[key] && typeof source[key] === 'object' &&
            !Array.isArray(source[key]) &&
            target[key] && typeof target[key] === 'object' &&
            !Array.isArray(target[key])
        ) {
            result[key] = deepMerge(target[key], source[key]);
        } else {
            result[key] = source[key];
        }
    }
    return result;
};

const showToast = (message, type = 'success') => {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<i class='bx ${type === 'success' ? 'bx-check-circle' : 'bx-error-circle'}'></i> ${message}`;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
};

const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Link berhasil disalin!');
    } catch {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
        showToast('Link berhasil disalin!');
    }
};

// ============================================
// Navigation
// ============================================
const initNavigation = () => {
    const links = document.querySelectorAll('.admin-sidebar nav a');
    const sections = document.querySelectorAll('.admin-section');
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.admin-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const headerTitle = document.querySelector('.admin-header h1');
    const headerDesc = document.querySelector('.admin-header p');

    const titles = {
        'pengantin': { title: 'Data Pengantin', desc: 'Edit informasi mempelai pria dan wanita' },
        'waktu': { title: 'Waktu & Tempat', desc: 'Atur tanggal, jam, dan lokasi acara' },
        'link': { title: 'Link', desc: 'Kelola link Google Calendar dan Google Maps' },
        'galeri': { title: 'Galeri', desc: 'Kelola foto-foto galeri undangan' },
        'bank': { title: 'Rekening', desc: 'Kelola informasi rekening untuk love gift' },
        'tamu': { title: 'Manajemen Tamu', desc: 'Kelola daftar tamu dan generate link undangan' },
    };

    const switchSection = (sectionId) => {
        links.forEach(l => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));

        const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
        const activeSection = document.getElementById(`section-${sectionId}`);

        if (activeLink) activeLink.classList.add('active');
        if (activeSection) activeSection.classList.add('active');

        if (titles[sectionId]) {
            headerTitle.textContent = titles[sectionId].title;
            headerDesc.textContent = titles[sectionId].desc;
        }

        // Close mobile sidebar
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
    };

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchSection(link.dataset.section);
        });
    });

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
    });

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
    });

    // Default section
    switchSection('pengantin');
};

// ============================================
// Section: Pengantin
// ============================================
const initPengantin = () => {
    const form = document.getElementById('form-pengantin');

    // Populate
    form.querySelector('#pria-nama').value = data.bride.L.name;
    form.querySelector('#pria-anak').value = data.bride.L.child;
    form.querySelector('#pria-ayah').value = data.bride.L.father;
    form.querySelector('#pria-ibu').value = data.bride.L.mother;
    form.querySelector('#pria-foto').value = data.bride.L.image;

    form.querySelector('#wanita-nama').value = data.bride.P.name;
    form.querySelector('#wanita-anak').value = data.bride.P.child;
    form.querySelector('#wanita-ayah').value = data.bride.P.father;
    form.querySelector('#wanita-ibu').value = data.bride.P.mother;
    form.querySelector('#wanita-foto').value = data.bride.P.image;

    form.querySelector('#couple-foto').value = data.bride.couple;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveWeddingData({
            bride: {
                L: {
                    id: 1,
                    name: form.querySelector('#pria-nama').value,
                    child: form.querySelector('#pria-anak').value,
                    father: form.querySelector('#pria-ayah').value,
                    mother: form.querySelector('#pria-ibu').value,
                    image: form.querySelector('#pria-foto').value,
                },
                P: {
                    id: 2,
                    name: form.querySelector('#wanita-nama').value,
                    child: form.querySelector('#wanita-anak').value,
                    father: form.querySelector('#wanita-ayah').value,
                    mother: form.querySelector('#wanita-ibu').value,
                    image: form.querySelector('#wanita-foto').value,
                },
                couple: form.querySelector('#couple-foto').value,
            }
        });
        showToast('Data pengantin berhasil disimpan!');
    });
};

// ============================================
// Section: Waktu & Tempat
// ============================================
const initWaktu = () => {
    const form = document.getElementById('form-waktu');

    // Populate Akad
    form.querySelector('#akad-hari').value = data.time.marriage.day;
    form.querySelector('#akad-tanggal').value = data.time.marriage.date;
    form.querySelector('#akad-bulan').value = data.time.marriage.month;
    form.querySelector('#akad-tahun').value = data.time.marriage.year;
    form.querySelector('#akad-mulai').value = data.time.marriage.hours.start;
    form.querySelector('#akad-selesai').value = data.time.marriage.hours.finish;

    // Populate Resepsi
    form.querySelector('#resepsi-hari').value = data.time.reception.day;
    form.querySelector('#resepsi-tanggal').value = data.time.reception.date;
    form.querySelector('#resepsi-bulan').value = data.time.reception.month;
    form.querySelector('#resepsi-tahun').value = data.time.reception.year;
    form.querySelector('#resepsi-mulai').value = data.time.reception.hours.start;
    form.querySelector('#resepsi-selesai').value = data.time.reception.hours.finish;

    // Alamat
    form.querySelector('#alamat').value = data.time.address;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveWeddingData({
            time: {
                marriage: {
                    day: form.querySelector('#akad-hari').value,
                    date: form.querySelector('#akad-tanggal').value,
                    month: form.querySelector('#akad-bulan').value,
                    year: form.querySelector('#akad-tahun').value,
                    hours: {
                        start: form.querySelector('#akad-mulai').value,
                        finish: form.querySelector('#akad-selesai').value,
                    }
                },
                reception: {
                    day: form.querySelector('#resepsi-hari').value,
                    date: form.querySelector('#resepsi-tanggal').value,
                    month: form.querySelector('#resepsi-bulan').value,
                    year: form.querySelector('#resepsi-tahun').value,
                    hours: {
                        start: form.querySelector('#resepsi-mulai').value,
                        finish: form.querySelector('#resepsi-selesai').value,
                    }
                },
                address: form.querySelector('#alamat').value,
            }
        });
        showToast('Waktu & tempat berhasil disimpan!');
    });
};

// ============================================
// Section: Link
// ============================================
const initLink = () => {
    const form = document.getElementById('form-link');

    form.querySelector('#link-calendar').value = data.link.calendar;
    form.querySelector('#link-map').value = data.link.map;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveWeddingData({
            link: {
                calendar: form.querySelector('#link-calendar').value,
                map: form.querySelector('#link-map').value,
            }
        });
        showToast('Link berhasil disimpan!');
    });
};

// ============================================
// Section: Galeri
// ============================================
const initGaleri = () => {
    const container = document.getElementById('galeri-container');
    const addInput = document.getElementById('galeri-add-url');
    const addBtn = document.getElementById('galeri-add-btn');

    let galeriData = [...data.galeri];

    const render = () => {
        if (galeriData.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class='bx bx-image'></i>
                    <p>Belum ada foto. Tambahkan foto pertama.</p>
                </div>`;
            return;
        }

        container.innerHTML = galeriData.map((item, index) => `
            <div class="galeri-item">
                <img src="${item.image}" alt="Galeri ${item.id}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect fill=%22%23222240%22 width=%22100%22 height=%22100%22/><text fill=%22%238888a8%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2214%22>${item.id}</text></svg>'">
                <div class="delete-overlay" data-index="${index}">
                    <i class='bx bx-trash'></i>
                </div>
            </div>
        `).join('');

        container.querySelectorAll('.delete-overlay').forEach(el => {
            el.addEventListener('click', () => {
                const idx = parseInt(el.dataset.index);
                galeriData.splice(idx, 1);
                // Re-assign IDs
                galeriData = galeriData.map((item, i) => ({ ...item, id: i + 1 }));
                saveGaleri();
                render();
            });
        });
    };

    const saveGaleri = () => {
        saveWeddingData({ galeri: galeriData });
        showToast('Galeri berhasil diupdate!');
    };

    addBtn.addEventListener('click', () => {
        const url = addInput.value.trim();
        if (!url) return showToast('Masukkan URL foto!', 'error');

        galeriData.push({ id: galeriData.length + 1, image: url });
        saveGaleri();
        render();
        addInput.value = '';
    });

    render();
};

// ============================================
// Section: Bank
// ============================================
const initBank = () => {
    const container = document.getElementById('bank-container');
    const form = document.getElementById('form-bank-add');

    let bankData = [...data.bank];

    const render = () => {
        if (bankData.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class='bx bx-credit-card'></i>
                    <p>Belum ada rekening. Tambahkan rekening pertama.</p>
                </div>`;
            return;
        }

        container.innerHTML = bankData.map((item, index) => `
            <div class="bank-item">
                <div class="bank-info">
                    <h4>${item.name}</h4>
                    <p>No. Rek: ${item.rekening}</p>
                    <p style="font-size: 0.75rem; color: var(--admin-text-muted)">Icon: ${item.icon}</p>
                </div>
                <button class="btn btn-danger btn-sm" data-index="${index}">
                    <i class='bx bx-trash'></i> Hapus
                </button>
            </div>
        `).join('');

        container.querySelectorAll('.btn-danger').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.index);
                bankData.splice(idx, 1);
                bankData = bankData.map((item, i) => ({ ...item, id: i + 1 }));
                saveBank();
                render();
            });
        });
    };

    const saveBank = () => {
        saveWeddingData({ bank: bankData });
        showToast('Data rekening berhasil diupdate!');
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = form.querySelector('#bank-nama').value.trim();
        const rekening = form.querySelector('#bank-rekening').value.trim();
        const icon = form.querySelector('#bank-icon').value.trim();

        if (!name || !rekening) return showToast('Nama dan No. Rekening wajib diisi!', 'error');

        bankData.push({
            id: bankData.length + 1,
            name,
            rekening,
            icon: icon || './src/assets/images/bca.png'
        });
        saveBank();
        render();
        form.reset();
    });

    render();
};

// ============================================
// Section: Tamu
// ============================================
const initTamu = () => {
    const form = document.getElementById('form-tamu');
    const tbody = document.getElementById('guest-tbody');
    const statTotal = document.getElementById('stat-total');
    const statLink = document.getElementById('stat-link');
    const searchInput = document.getElementById('guest-search');

    let guests = [...(data.guests || [])];

    const render = (filter = '') => {
        const filtered = filter
            ? guests.filter(g => g.name.toLowerCase().includes(filter.toLowerCase()))
            : guests;

        statTotal.textContent = guests.length;
        statLink.textContent = guests.length;

        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; padding: 2rem; color: var(--admin-text-muted)">
                        ${filter ? 'Tidak ada tamu yang cocok' : 'Belum ada tamu. Tambahkan tamu pertama!'}
                    </td>
                </tr>`;
            return;
        }

        tbody.innerHTML = filtered.map((guest, index) => {
            const link = `${getBaseUrl()}?to=${encodeURIComponent(guest.name)}`;
            const waLink = `https://wa.me/?text=${encodeURIComponent(`Assalamualaikum Wr. Wb.\n\nKepada Yth. ${guest.name},\n\nDengan segala kerendahan hati, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.\n\nKlik link berikut untuk membuka undangan:\n${link}\n\nMerupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.\n\nTerima kasih.\nWassalamualaikum Wr. Wb.`)}`;

            return `
                <tr>
                    <td><strong>${guest.name}</strong></td>
                    <td><span class="guest-link">${link}</span></td>
                    <td>
                        <div class="guest-actions">
                            <button class="btn btn-outline btn-sm btn-copy" data-link="${link}">
                                <i class='bx bx-copy'></i> Salin
                            </button>
                            <a href="${waLink}" target="_blank" class="btn btn-whatsapp btn-sm">
                                <i class='bx bxl-whatsapp'></i> Kirim
                            </a>
                            <button class="btn btn-danger btn-sm btn-delete" data-index="${index}">
                                <i class='bx bx-trash'></i>
                            </button>
                        </div>
                    </td>
                </tr>`;
        }).join('');

        // Copy handlers
        tbody.querySelectorAll('.btn-copy').forEach(btn => {
            btn.addEventListener('click', () => copyToClipboard(btn.dataset.link));
        });

        // Delete handlers
        tbody.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.index);
                guests.splice(idx, 1);
                saveWeddingData({ guests });
                render(searchInput.value);
            });
        });
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = form.querySelector('#tamu-nama');
        const name = nameInput.value.trim();

        if (!name) return showToast('Nama tamu wajib diisi!', 'error');
        if (guests.some(g => g.name.toLowerCase() === name.toLowerCase())) {
            return showToast('Tamu dengan nama ini sudah ada!', 'error');
        }

        guests.push({ name, createdAt: new Date().toISOString() });
        saveWeddingData({ guests });
        render(searchInput.value);
        nameInput.value = '';
        showToast(`Tamu "${name}" berhasil ditambahkan!`);
    });

    searchInput.addEventListener('input', (e) => {
        render(e.target.value);
    });

    // Bulk add
    const bulkBtn = document.getElementById('bulk-add-btn');
    const bulkTextarea = document.getElementById('bulk-names');

    bulkBtn.addEventListener('click', () => {
        const names = bulkTextarea.value
            .split('\n')
            .map(n => n.trim())
            .filter(n => n && !guests.some(g => g.name.toLowerCase() === n.toLowerCase()));

        if (names.length === 0) return showToast('Tidak ada nama baru untuk ditambahkan!', 'error');

        names.forEach(name => {
            guests.push({ name, createdAt: new Date().toISOString() });
        });
        saveWeddingData({ guests });
        render(searchInput.value);
        bulkTextarea.value = '';
        showToast(`${names.length} tamu berhasil ditambahkan!`);
    });

    // Copy all links
    const copyAllBtn = document.getElementById('copy-all-links');
    copyAllBtn.addEventListener('click', () => {
        if (guests.length === 0) return showToast('Belum ada tamu!', 'error');
        const allLinks = guests.map(g =>
            `${g.name}: ${getBaseUrl()}?to=${encodeURIComponent(g.name)}`
        ).join('\n');
        copyToClipboard(allLinks);
    });

    render();
};

// ============================================
// Initialize
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initPengantin();
    initWaktu();
    initLink();
    initGaleri();
    initBank();
    initTamu();
});
