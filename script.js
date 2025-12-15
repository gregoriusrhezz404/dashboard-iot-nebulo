// ================= SENSOR DATA =================
// ESP32 mengirim data ke path: /sensor
db.ref('sensor').on('value', (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  // Sesuai struktur Firebase
  document.getElementById('val-temp').innerText =
    data.suhu !== undefined ? data.suhu : '--';

  document.getElementById('val-humid').innerText =
    data.soil1 !== undefined ? data.soil1 : '--';

  document.getElementById('last-update').innerText =
    new Date().toLocaleTimeString();

  console.log("Sensor:", data);
});

// ================= KONTROL POMPA =================
// ESP32 membaca / menulis ke path: /kontrol
db.ref('kontrol').on('value', (snapshot) => {
  const kontrol = snapshot.val();
  if (!kontrol) return;

  document.getElementById('label-pump').innerText =
    kontrol.pompa1 ? 'ON' : 'OFF';

  document.getElementById('label-mode').innerText = 'AUTO';

  console.log("Kontrol:", kontrol);
});
