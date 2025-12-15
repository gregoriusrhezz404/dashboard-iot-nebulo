// script.js - HANYA LOGIKA TAMPILAN (UI)
// Koneksi Firebase sudah dihandle oleh NEWindex.html

// --- 1. LOGIKA MENGAMBIL DATA WIFI ---
// Path ini ("device_001/scan_result") harus diisi oleh ESP32 jika fitur scan WiFi aktif
// Jika ESP32 belum ada kode scan WiFi, list ini akan kosong/loading terus.
const scanRef = database.ref('device_001/scan_result'); 

scanRef.on('value', (snapshot) => {
    const dataRaw = snapshot.val();
    renderWifiList(dataRaw);
});

// --- 2. FUNGSI MERAPIKAN TAMPILAN ---
function renderWifiList(rawData) {
    const listContainer = document.getElementById("wifiList");

    if (!rawData || rawData === "Tidak ada WiFi") {
        listContainer.innerHTML = '<li class="loading">Menunggu scan WiFi dari alat...</li>';
        return;
    }

    // Parsing data string menjadi Array object
    const lines = rawData.split('\n');
    const parsedNetworks = lines.map(net => {
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

    listContainer.innerHTML = "";

    parsedNetworks.forEach(net => {
        let signalClass = "weak";
        let signalText = "Lemah";
        
        if (net.rssi > -60) { signalClass = "strong"; signalText = "Kuat"; }
        else if (net.rssi > -75) { signalClass = "medium"; signalText = "Sedang"; }

        const li = document.createElement("li");
        li.className = "wifi-item";
        
        li.onclick = function() {
            alert("Anda memilih WiFi: " + net.ssid); 
        };

        li.innerHTML = `
            <div class="wifi-name">${net.ssid}</div>
            <div class="wifi-signal">
                ${signalText} (${net.rssi} dBm)
                <span class="signal-icon ${signalClass}"></span>
            </div>
        `;
        listContainer.appendChild(li);
    });
}
