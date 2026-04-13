const deepMerge = (target, source) => {
    const result = { ...target };
    for (const key of Object.keys(source)) {
        if (
            source[key] &&
            typeof source[key] === 'object' &&
            !Array.isArray(source[key]) &&
            target[key] &&
            typeof target[key] === 'object' &&
            !Array.isArray(target[key])
        ) {
            result[key] = deepMerge(target[key], source[key]);
        } else {
            result[key] = source[key];
        }
    }
    return result;
};

const defaultData = {
    bride: {
        L: {
            id: 1,
            name: 'Muhammad Rusdi',
            child: 'Putra ke 3',
            father: 'Junaidi Ismail',
            mother: 'Yun',
            image: './src/assets/images/galeri-1.jpeg'
        },
        P: {
            id: 2,
            name: 'Sarwesti Ayu',
            child: 'Putri ke 2',
            father: 'pak didi',
            mother: 'Ipsum',
            image: './src/assets/images/galeri-2.jpeg'
        },

        couple: './src/assets/images/galeri-3.jpeg'
    },

    time: {
        marriage: {
            year: '2030',
            month: 'November',
            date: '14',
            day: 'Kamis',
            hours: {
                start: '08.00',
                finish: 'Selesai'
            }
        },
        reception: {
            year: '2024',
            month: 'November',
            date: '14',
            day: 'Kamis',
            hours: {
                start: '11.00',
                finish: 'Selesai'
            }
        },
        address: 'Kp. Lorem, RT 000/ RW 000, Desa.Lorem, Kec.Ipsum, Kab.Lorem, Lorem (1234)'
    },

    link: {
        calendar: 'https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=N2Uxc2g1cDJwdTNyYjJyZ2Ryc3M4bmYwOTUgaWxoYW1zeWFwdXRyYTk3MUBt&tmsrc=ilhamsyaputra971%40gmail.com',
        map: 'https://maps.app.goo.gl/FxTt4JdGm2kaCf4y8',
    },

    galeri: [
        { id: 1, image: './src/assets/images/galeri-4.jpeg' },
        { id: 2, image: './src/assets/images/galeri-5.jpeg' },
        { id: 3, image: './src/assets/images/galeri-6.jpeg' },
        { id: 4, image: './src/assets/images/galeri-7.jpeg' },
        { id: 5, image: './src/assets/images/galeri-8.jpeg' },
        { id: 6, image: './src/assets/images/galeri-9.jpeg' },
        { id: 7, image: './src/assets/images/galeri-10.jpeg' },
        { id: 8, image: './src/assets/images/galeri-11.jpeg' },
        { id: 9, image: './src/assets/images/galeri-12.jpeg' }
    ],

    bank: [
        {
            id: 1,
            name: 'Lorem Ipsum',
            icon: './src/assets/images/bca.png',
            rekening: '12345678'
        },
        {
            id: 2,
            name: 'Ipsum Lorem',
            icon: './src/assets/images/bri.png',
            rekening: '12345678'
        },
    ],

    audio: './src/assets/audio/wedding.mp3',

    api: 'https://script.google.com/macros/s/AKfycbyydz6N4p2VWUG8zsXeURv6ap9RP8a4eC3x6N3x6qTDjMVr1cIBz9S0NsHw2rWvBOSXGg/exec',

    navbar: [
        {
            id: 1,
            teks: 'Home',
            icon: 'bx bxs-home-heart',
            path: '#home',
        },
        {
            id: 2,
            teks: 'Mempelai',
            icon: 'bx bxs-group',
            path: '#bride',
        },
        {
            id: 3,
            teks: 'Tanggal',
            icon: 'bx bxs-calendar-check',
            path: '#time',
        },
        {
            id: 4,
            teks: 'Galeri',
            icon: 'bx bxs-photo-album',
            path: '#galeri',
        },
        {
            id: 5,
            teks: 'Ucapan',
            icon: 'bx bxs-message-rounded-dots',
            path: '#wishas',
        },
    ],

    guests: []
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

// TODO: User -> Ganti dengan konfigurasi Firebase Anda
export const firebaseConfig = {
    apiKey: "AIzaSyCS3Lt5UwbTJGeBWo-EO_sQDEuajDdYlaI",
    authDomain: "wedding-invitation-740eb.firebaseapp.com",
    databaseURL: "https://wedding-invitation-740eb-default-rtdb.firebaseio.com",
    projectId: "wedding-invitation-740eb",
    storageBucket: "wedding-invitation-740eb.firebasestorage.app",
    messagingSenderId: "590507334176",
    appId: "1:590507334176:web:6dbe19a2e77d65be633a45",
    measurementId: "G-G45GFJ9JP7"
};

let firebaseDb = null;
if (firebaseConfig.apiKey) {
    const app = initializeApp(firebaseConfig);
    firebaseDb = getDatabase(app);
}

const savedDataLocal = JSON.parse(localStorage.getItem('wedding_data') || '{}');

// Fix: Hapus path gambar lama (.png) agar path baru (.jpeg) bisa tampil
if (savedDataLocal.bride) {
    if (savedDataLocal.bride.L?.image?.endsWith('.png')) delete savedDataLocal.bride.L.image;
    if (savedDataLocal.bride.P?.image?.endsWith('.png')) delete savedDataLocal.bride.P.image;
    if (savedDataLocal.bride.couple?.endsWith('.png')) delete savedDataLocal.bride.couple;
}
if (savedDataLocal.galeri?.[0]?.image?.endsWith('.png')) delete savedDataLocal.galeri;

let finalData = deepMerge(defaultData, savedDataLocal);

if (firebaseDb) {
    const dbRef = ref(firebaseDb, 'wedding_data');
    get(dbRef).then(snapshot => {
        if (snapshot.exists()) {
            const remoteData = snapshot.val();
            // Juga bersihkan data remote jika mengandung .png
            if (remoteData.bride) {
                if (remoteData.bride.L?.image?.endsWith('.png')) delete remoteData.bride.L.image;
                if (remoteData.bride.P?.image?.endsWith('.png')) delete remoteData.bride.P.image;
                if (remoteData.bride.couple?.endsWith('.png')) delete remoteData.bride.couple;
            }
            if (remoteData.galeri?.[0]?.image?.endsWith('.png')) delete remoteData.galeri;

            localStorage.setItem('wedding_data', JSON.stringify(remoteData));
        } else {
            set(dbRef, finalData).catch(err => console.error("Firebase seed error:", err));
        }
    }).catch(e => {
        console.error("Firebase fetch error:", e);
    });
}


export const db = firebaseDb;
export { ref, set, get };
export const data = finalData;
