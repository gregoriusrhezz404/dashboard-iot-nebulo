// --- 1. KONFIGURASI FIREBASE ---
// Salin ini dari Dashboard Firebase Anda (Project Settings > General > Scroll ke bawah)
const firebaseConfig = {
    apiKey: "AIzaSyDxxxxxxxxx...",  // GANTI DENGAN PUNYA ANDA
    authDomain: "proyek-anda.firebaseapp.com",
    databaseURL: "https://proyek-anda-default-rtdb.firebaseio.com", // GANTI INI WAJIB
    projectId: "proyek-anda",
    storageBucket: "proyek-anda.appspot.com",
    messagingSenderId: "123456...",
    appId: "1:123456..."
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// --- 2. LOGIKA MENGAMBIL DATA ---
// Kita "mendengarkan" folder scan_result di database
const scanRef = database.ref('device_001/scan_result'); // Sesuaikan path dengan kode ESP32

scanRef.on('value', (snapshot) => {
    const dataRaw = snapshot.val(); // Mengambil data teks
    console.log("Data diterima:", dataRaw); // Cek di Console Browser
    renderWifiList(dataRaw);
});

// --- 3. FUNGSI MERAPIKAN TAMPILAN (Logic Render) ---
function renderWifiList(rawData) {
    const listContainer = document.getElementById("wifiList");

    // Jika data kosong
    if (!rawData || rawData === "Tidak ada WiFi") {
        listContainer.innerHTML = '<li class="loading">Tidak ada jaringan ditemukan</li>';
        return;
    }

    // Pecah data text menjadi Array
    const networks = rawData.split(", ");
    
    // Proses parsing (memisahkan Nama dan Angka)
    let parsedNetworks = networks.map(net => {
        // Regex untuk ambil nama dan angka dalam kurung
        const match = net.match(/^(.*)\s\(([-0-9]+)dBm\)$/);
        if (match) {
            return {
                ssid: match[1],
                rssi: parseInt(match[2])
            };
        }
        return null;
    }).filter(n => n !== null);

    // Urutkan dari sinyal terkuat
    parsedNetworks.sort((a, b) => b.rssi - a.rssi);

    // Bersihkan tampilan lama
    listContainer.innerHTML = "";

    // Buat tampilan baru (Looping)
    parsedNetworks.forEach(net => {
        // Tentukan status sinyal untuk warna icon
        let signalClass = "weak";
        let signalText = "Lemah";
        
        if (net.rssi > -60) { signalClass = "strong"; signalText = "Kuat"; }
        else if (net.rssi > -75) { signalClass = "medium"; signalText = "Sedang"; }

        // Buat elemen HTML (li)
        const li = document.createElement("li");
        li.className = "wifi-item";
        
        // Aksi saat diklik
        li.onclick = function() {
            // Nanti di sini tambahkan logika memunculkan popup password
            alert("Anda memilih WiFi: " + net.ssid); 
        };

        // Isi HTML dalam list
        li.innerHTML = `
            <div class="wifi-name">${net.ssid}</div>
            <div class="wifi-signal">
                ${signalText} (${net.rssi})
                <div class="signal-icon ${signalClass}"></div>
            </div>
        `;
        
        listContainer.appendChild(li);
    });
}
