/* ==========================================
   AZRI & NOVALIA
   WEDDING INVITATION SCRIPT
========================================== */

/* DATA YANG BISA DIEDIT */
const weddingConfig = {
  whatsappNumber: "6281234567890",

  mapsUrl: "https://maps.google.com/?q=Kediaman+Mempelai+Wanita",

  weddingDate: new Date(2026, 10, 14, 8, 0, 0),

  bank: {
    name: "BANK BRI",
    accountNumber: "013301087966507",
    accountOwner: "AZRI AL-FIYAN TANUWIJAYA",
  },

  // Maksimal jumlah ucapan yang ditampilkan
  maxWishes: 100,
};

/* ==========================================
   PERSONALISASI NAMA TAMU
========================================== */

const params = new URLSearchParams(window.location.search);
const guestName = params.get("to");
const guestElement = document.getElementById("guestName");

if (guestElement) {
  guestElement.textContent = guestName
    ? guestName.replace(/\+/g, " ")
    : "Tamu Undangan";
}

/* ==========================================
   LOADER
========================================== */

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");

  if (!loader) return;

  setTimeout(() => {
    loader.style.opacity = "0";
    loader.style.visibility = "hidden";

    setTimeout(() => {
      loader.remove();
    }, 850);
  }, 500);
});

/* ==========================================
   BUKA UNDANGAN
========================================== */

const openButton = document.getElementById("openInvitation");
const invitation = document.getElementById("invitation");
const musicButton = document.getElementById("musicToggle");
const music = document.getElementById("weddingMusic");

if (openButton) {
  openButton.addEventListener("click", async () => {
    // Tampilkan isi undangan
    if (invitation) {
      invitation.classList.remove("hidden");

      invitation.scrollIntoView({
        behavior: "smooth",
      });
    }

    // Tampilkan tombol musik
    if (musicButton) {
      musicButton.style.display = "grid";
    }

    // Putar musik otomatis
    if (music) {
      try {
        await music.play();

        if (musicButton) {
          musicButton.classList.add("playing");
          musicButton.setAttribute("aria-label", "Jeda musik");
          musicButton.setAttribute("title", "Jeda musik");
        }
      } catch (error) {
        console.log("Musik belum dapat diputar:", error);
      }
    }
  });
}

/* ==========================================
   COUNTDOWN
========================================== */

function updateCountdown() {
  const now = new Date();
  const distance = weddingConfig.weddingDate.getTime() - now.getTime();

  const countdown = document.querySelector(".countdown");
  const dateElements = ["days", "hours", "minutes", "seconds"];

  // Jika acara sudah dimulai
  if (distance <= 0) {
    dateElements.forEach((id) => {
      const element = document.getElementById(id);
      if (element) element.textContent = "00";
    });

    if (countdown) {
      countdown.setAttribute("aria-label", "Acara telah dimulai");
    }

    const caption = document.querySelector(".countdown-caption");

    if (caption) {
      caption.textContent = "Today is the day. Let the celebration begin!";
    }

    return;
  }

  // Menghitung waktu tersisa
  const values = {
    days: Math.floor(distance / 86400000),
    hours: Math.floor((distance % 86400000) / 3600000),
    minutes: Math.floor((distance % 3600000) / 60000),
    seconds: Math.floor((distance % 60000) / 1000),
  };

  // Memperbarui tampilan
  Object.entries(values).forEach(([key, value]) => {
    const element = document.getElementById(key);

    if (element) {
      element.textContent = String(value).padStart(2, "0");
    }
  });
}

// Jalankan countdown
updateCountdown();

// Perbarui setiap satu detik
setInterval(updateCountdown, 1000);

/* ==========================================
   GOOGLE MAPS
========================================== */

const mapsLink = document.getElementById("mapsLink");

if (mapsLink && weddingConfig.mapsUrl) {
  mapsLink.href = weddingConfig.mapsUrl;
}

/* ==========================================
   TANDA KASIH / REKENING
========================================== */

const bankName = document.getElementById("bankName");
const accountNumber = document.getElementById("accountNumber");
const accountOwner = document.getElementById("accountOwner");
const copyButton = document.getElementById("copyAccount");
const copyLabel = document.getElementById("copyLabel");
const copyFeedback = document.getElementById("copyFeedback");

// Mengisi informasi rekening dari konfigurasi.
if (weddingConfig.bank) {
  if (bankName) {
    bankName.textContent = weddingConfig.bank.name;
  }

  if (accountNumber) {
    accountNumber.textContent = weddingConfig.bank.accountNumber;
  }

  if (accountOwner) {
    accountOwner.textContent = weddingConfig.bank.accountOwner;
  }
}

// Tombol salin nomor rekening.
if (copyButton) {
  copyButton.addEventListener("click", async () => {
    const number = weddingConfig.bank.accountNumber;

    if (!number) {
      if (copyFeedback) {
        copyFeedback.textContent = "Nomor rekening belum tersedia.";
      }
      return;
    }

    try {
      // Salin menggunakan Clipboard API.
      await navigator.clipboard.writeText(number);

      if (copyLabel) {
        copyLabel.textContent = "Berhasil Disalin!";
      }

      if (copyFeedback) {
        copyFeedback.textContent = "Nomor rekening berhasil disalin.";
      }
    } catch (error) {
      // Fallback jika Clipboard API tidak tersedia.
      const temporaryInput = document.createElement("textarea");

      temporaryInput.value = number;
      temporaryInput.style.position = "fixed";
      temporaryInput.style.opacity = "0";

      document.body.appendChild(temporaryInput);
      temporaryInput.select();

      const copied = document.execCommand("copy");
      temporaryInput.remove();

      if (copied) {
        if (copyLabel) {
          copyLabel.textContent = "Berhasil Disalin!";
        }

        if (copyFeedback) {
          copyFeedback.textContent = "Nomor rekening berhasil disalin.";
        }
      } else {
        if (copyFeedback) {
          copyFeedback.textContent =
            "Silakan salin nomor rekening secara manual.";
        }
      }
    }

    // Mengembalikan tulisan tombol.
    setTimeout(() => {
      if (copyLabel) {
        copyLabel.textContent = "Salin Nomor Rekening";
      }

      if (copyFeedback) {
        copyFeedback.textContent = "";
      }
    }, 2500);
  });
}

/* ==========================================
   DAFTAR UCAPAN
========================================== */

const wishesStorageKey = "azriNovaliaWeddingWishes";
const wishesList = document.getElementById("wishesList");

/* Mengambil ucapan dari browser */
function getWishes() {
  try {
    const savedWishes = localStorage.getItem(wishesStorageKey);
    const parsedWishes = savedWishes ? JSON.parse(savedWishes) : [];

    return Array.isArray(parsedWishes) ? parsedWishes : [];
  } catch (error) {
    console.error("Gagal membaca daftar ucapan:", error);
    return [];
  }
}

/* Menyimpan ucapan ke browser */
function saveWishes(wishes) {
  try {
    localStorage.setItem(wishesStorageKey, JSON.stringify(wishes));
    return true;
  } catch (error) {
    console.error("Gagal menyimpan daftar ucapan:", error);
    return false;
  }
}

/* Menampilkan daftar ucapan */
function renderWishes() {
  if (!wishesList) return;

  const wishes = getWishes();

  wishesList.replaceChildren();

  if (wishes.length === 0) {
    const emptyMessage = document.createElement("p");

    emptyMessage.className = "empty-wishes";
    emptyMessage.textContent = "Belum ada ucapan. Jadilah yang pertama!";

    wishesList.appendChild(emptyMessage);
    return;
  }

  wishes
    .slice()
    .reverse()
    .forEach((wish) => {
      const item = document.createElement("article");
      item.className = "wish-item";

      const name = document.createElement("h4");
      name.className = "wish-name";
      name.textContent = wish.name;

      const attendance = document.createElement("span");
      attendance.className = "wish-attendance";
      attendance.textContent = wish.attendance || "Konfirmasi belum tersedia";

      const message = document.createElement("p");
      message.className = "wish-message";
      message.textContent = wish.message;

      const date = document.createElement("p");
      date.className = "wish-date";
      date.textContent = wish.date;

      item.append(name, attendance, message, date);
      wishesList.appendChild(item);
    });
}

/* ==========================================
   FORM RSVP DAN UCAPAN
========================================== */

const rsvpForm = document.getElementById("rsvpForm");

if (rsvpForm) {
  rsvpForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const attendance = document.getElementById("attendance").value;
    const message = document.getElementById("message").value.trim();

    if (!name || !attendance || !message) {
      alert("Mohon lengkapi seluruh formulir.");
      return;
    }

    const wishes = getWishes();
    const maxWishes = Number(weddingConfig.maxWishes) || 100;

    if (wishes.length >= maxWishes) {
      alert("Mohon maaf, kapasitas penyimpanan ucapan telah mencapai batas.");
      return;
    }

    const newWish = {
      name,
      attendance,
      message,
      date: new Date().toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    };

    wishes.push(newWish);

    const saved = saveWishes(wishes);

    if (!saved) {
      alert("Ucapan belum berhasil disimpan. Silakan coba kembali.");
      return;
    }

    renderWishes();
    rsvpForm.reset();

    /* Mengirim konfirmasi melalui WhatsApp */
    const whatsappMessage = [
      "Assalamu'alaikum, saya ingin mengirimkan konfirmasi undangan pernikahan Azri & Novalia.",
      "",
      `Nama: ${name}`,
      `Kehadiran: ${attendance}`,
      `Ucapan/Doa: ${message}`,
    ].join("\n");

    const whatsappNumber = weddingConfig.whatsappNumber;

    if (whatsappNumber) {
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    } else {
      alert("Ucapan berhasil disimpan, tetapi nomor WhatsApp belum diatur.");
    }
  });
}

/* Tampilkan ucapan saat halaman dibuka */
renderWishes();

/* ==========================================
   TOMBOL PLAY / PAUSE MUSIK
========================================== */

if (musicButton && music) {
  musicButton.addEventListener("click", async () => {
    if (music.paused) {
      try {
        await music.play();

        musicButton.classList.add("playing");
        musicButton.setAttribute("aria-label", "Jeda musik");
        musicButton.setAttribute("title", "Jeda musik");
      } catch (error) {
        console.error("Musik gagal diputar:", error);
      }
    } else {
      music.pause();

      musicButton.classList.remove("playing");
      musicButton.setAttribute("aria-label", "Putar musik");
      musicButton.setAttribute("title", "Putar musik");
    }
  });

  /* Sinkronisasi tampilan tombol dengan audio */
  music.addEventListener("pause", () => {
    musicButton.classList.remove("playing");
    musicButton.setAttribute("aria-label", "Putar musik");
    musicButton.setAttribute("title", "Putar musik");
  });

  music.addEventListener("play", () => {
    musicButton.classList.add("playing");
    musicButton.setAttribute("aria-label", "Jeda musik");
    musicButton.setAttribute("title", "Jeda musik");
  });
}

/* ==========================================
   ANIMASI SCROLL
========================================== */

const revealTargets = document.querySelectorAll(
  ".section-pad > *, .event-card, .person, .gallery-photo, .gift-card, .wish-item",
);

revealTargets.forEach((element) => {
  element.classList.add("reveal");
});

const observer = new IntersectionObserver(
  (entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        currentObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
  },
);

revealTargets.forEach((element) => {
  observer.observe(element);
});
