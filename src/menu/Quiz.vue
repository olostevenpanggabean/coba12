<template>
  <div class="quiz-container">
    <div class="quiz-header">
      <h1>Kuis {{ currentJurusan }}</h1>
      <div class="quiz-info">
        <span class="semester-badge">Semester {{ currentSemester }}</span>
        <span class="score">Skor: {{ score }}/{{ totalQuestions }}</span>
      </div>
    </div>

    <div v-if="!quizStarted" class="subject-selection">
      <h2>Pilih Mata Kuliah</h2>
      <div class="subject-cards">
        <div 
          v-for="subject in availableSubjects" 
          :key="subject.id"
          class="subject-card"
          @click="selectSubject(subject)"
        >
          <h3>{{ subject.name }}</h3>
          <p>{{ subject.description }}</p>
          <span class="question-count">{{ subject.questions.length }} soal</span>
        </div>
      </div>
    </div>

    <div v-if="quizStarted && currentQuestion" class="quiz-area">
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: (currentQuestionIndex + 1) / totalQuestions * 100 + '%' }"
        ></div>
      </div>
      
      <div class="question-counter">
        Soal {{ currentQuestionIndex + 1 }} dari {{ totalQuestions }}
      </div>

      <div class="question-card">
        <h3>{{ currentQuestion.question }}</h3>
        
        <div class="options-list">
          <div 
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            class="option-item"
            :class="{ 
              'selected': selectedOption === index,
              'correct': showResult && index === currentQuestion.correctAnswer,
              'incorrect': showResult && selectedOption === index && index !== currentQuestion.correctAnswer
            }"
            @click="selectOption(index)"
          >
            <span class="option-letter">{{ String.fromCharCode(65 + index) }}</span>
            <span class="option-text">{{ option }}</span>
          </div>
        </div>

        <div v-if="showResult" class="result-feedback">
          <div v-if="selectedOption === currentQuestion.correctAnswer" class="correct-feedback">
            <i class="icon-check">✓</i>
            <span>Benar! {{ currentQuestion.explanation }}</span>
          </div>
          <div v-else class="incorrect-feedback">
            <i class="icon-close">✗</i>
            <span>Salah. {{ currentQuestion.explanation }}</span>
          </div>
        </div>

        <div class="quiz-actions">
          <button 
            v-if="!showResult" 
            class="submit-btn" 
            :disabled="selectedOption === null"
            @click="submitAnswer"
          >
            Submit Jawaban
          </button>
          <button 
            v-if="showResult" 
            class="next-btn"
            @click="nextQuestion"
          >
            {{ currentQuestionIndex + 1 < totalQuestions ? 'Soal Berikutnya' : 'Selesai' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="quizCompleted" class="quiz-result">
      <div class="result-card">
        <h2>Kuis Selesai!</h2>
        <div class="final-score">
          <span class="score-number">{{ score }}</span>
          <span class="score-total">/ {{ totalQuestions }}</span>
        </div>
        <div class="score-percentage">
          {{ Math.round((score / totalQuestions) * 100) }}%
        </div>
        
        <div class="grade-info">
          <span class="grade-label">Grade:</span>
          <span class="grade-value" :class="gradeClass">{{ grade }}</span>
        </div>

        <div class="result-actions">
          <button class="retry-btn" @click="retryQuiz">Ulangi Kuis</button>
          <button class="back-btn" @click="backToSubjects">Pilih Mata Kuliah Lain</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { useBelajarStore } from '@/stores/useBelajarStore' // Tidak lagi digunakan jika tidak terhubung

export default {
  name: 'QuizPage',
  data() {
    return {
      currentJurusan: 'Teknik Informatika', // Default: Teknik Informatika
      currentSemester: 4,               // Default: Semester 4
      quizStarted: false, // Tetap false, agar user klik dulu mata kuliahnya
      currentQuestionIndex: 0,
      selectedOption: null,
      showResult: false,
      score: 0,
      quizCompleted: false,
      selectedSubject: null,
      
      // Data soal berdasarkan jurusan (20 soal per jurusan)
      questionsByJurusan: {
        'Teknik Informatika': [
          {
            question: 'Apa yang dimaksud dengan kompleksitas waktu Big O?',
            options: [
              'Waktu eksekusi program dalam detik',
              'Ukuran memori yang digunakan',
              'Pertumbuhan waktu eksekusi relatif terhadap ukuran input',
              'Jumlah baris kode dalam program'
            ],
            correctAnswer: 2,
            explanation: 'Big O menggambarkan bagaimana waktu eksekusi algoritma tumbuh seiring dengan pertambahan ukuran input.'
          },
          {
            question: 'Struktur data apa yang menggunakan prinsip LIFO?',
            options: ['Queue', 'Stack', 'Array', 'Linked List'],
            correctAnswer: 1,
            explanation: 'Stack menggunakan prinsip LIFO (Last In, First Out) dimana elemen terakhir yang masuk adalah yang pertama keluar.'
          },
          {
            question: 'Algoritma sorting mana yang memiliki kompleksitas waktu rata-rata O(n log n)?',
            options: ['Bubble Sort', 'Selection Sort', 'Merge Sort', 'Insertion Sort'],
            correctAnswer: 2,
            explanation: 'Merge Sort memiliki kompleksitas waktu O(n log n) pada kasus rata-rata dan terburuk.'
          },
          {
            question: 'Apa kepanjangan dari HTML?',
            options: [
              'Hyper Text Markup Language',
              'High Tech Modern Language',
              'Home Tool Markup Language',
              'Hyperlink and Text Markup Language'
            ],
            correctAnswer: 0,
            explanation: 'HTML adalah singkatan dari HyperText Markup Language, bahasa markup untuk membuat halaman web.'
          },
          {
            question: 'CSS digunakan untuk?',
            options: [
              'Menambahkan interaktivitas',
              'Styling dan layout halaman web',
              'Mengelola database',
              'Membuat server web'
            ],
            correctAnswer: 1,
            explanation: 'CSS (Cascading Style Sheets) digunakan untuk styling dan mengatur layout halaman web.'
          },
          {
            question: 'Bahasa pemrograman mana yang bersifat interpreted?',
            options: ['C++', 'Java', 'Python', 'Go'],
            correctAnswer: 2,
            explanation: 'Python adalah bahasa pemrograman interpreted yang tidak perlu dikompilasi sebelum dijalankan.'
          },
          {
            question: 'Apa fungsi utama dari database?',
            options: [
              'Menampilkan data',
              'Menyimpan dan mengelola data',
              'Mengenkripsi data',
              'Menghapus data'
            ],
            correctAnswer: 1,
            explanation: 'Database berfungsi untuk menyimpan, mengelola, dan mengorganisir data secara efisien.'
          },
          {
            question: 'Protokol apa yang digunakan untuk transfer file di internet?',
            options: ['HTTP', 'FTP', 'SMTP', 'POP3'],
            correctAnswer: 1,
            explanation: 'FTP (File Transfer Protocol) digunakan khusus untuk transfer file di internet.'
          },
          {
            question: 'Apa yang dimaksud dengan OOP?',
            options: [
              'Object Oriented Programming',
              'Online Office Platform',
              'Operating Office Program',
              'Open Office Protocol'
            ],
            correctAnswer: 0,
            explanation: 'OOP adalah paradigma pemrograman yang menggunakan konsep objek dan class.'
          },
          {
            question: 'Manakah yang bukan merupakan tipe data primitif?',
            options: ['int', 'float', 'boolean', 'array'],
            correctAnswer: 3,
            explanation: 'Array adalah tipe data non-primitif yang merupakan kumpulan dari tipe data primitif.'
          },
          {
            question: 'Apa fungsi dari compiler?',
            options: [
              'Menjalankan program',
              'Mengubah source code menjadi machine code',
              'Menghapus error',
              'Membuat dokumentasi'
            ],
            correctAnswer: 1,
            explanation: 'Compiler mengubah source code menjadi machine code yang dapat dijalankan oleh komputer.'
          },
          {
            question: 'Algoritma pencarian mana yang paling efisien untuk array yang sudah terurut?',
            options: ['Linear Search', 'Binary Search', 'Jump Search', 'Interpolation Search'],
            correctAnswer: 1,
            explanation: 'Binary Search memiliki kompleksitas O(log n) untuk array yang sudah terurut.'
          },
          {
            question: 'Apa yang dimaksud dengan recursion?',
            options: [
              'Perulangan dengan for',
              'Fungsi yang memanggil dirinya sendiri',
              'Pengulangan tanpa batas',
              'Fungsi yang tidak memiliki return'
            ],
            correctAnswer: 1,
            explanation: 'Recursion adalah teknik dimana fungsi memanggil dirinya sendiri untuk menyelesaikan masalah.'
          },
          {
            question: 'Manakah yang merupakan bahasa markup?',
            options: ['JavaScript', 'Python', 'HTML', 'C++'],
            correctAnswer: 2,
            explanation: 'HTML adalah bahasa markup yang digunakan untuk membuat struktur halaman web.'
          },
          {
            question: 'Apa fungsi dari API?',
            options: [
              'Menghubungkan aplikasi dengan database',
              'Interface untuk komunikasi antar aplikasi',
              'Mengamankan aplikasi',
              'Mengoptimalkan performa'
            ],
            correctAnswer: 1,
            explanation: 'API (Application Programming Interface) adalah interface yang memungkinkan komunikasi antar aplikasi.'
          },
          {
            question: 'Manakah yang bukan termasuk dalam prinsip SOLID?',
            options: [
              'Single Responsibility Principle',
              'Open/Closed Principle',
              'Liskov Substitution Principle',
              'Data Abstraction Principle'
            ],
            correctAnswer: 3,
            explanation: 'SOLID terdiri dari 5 prinsip: SRP, OCP, LSP, ISP, dan DIP. Data Abstraction bukan bagian dari SOLID.'
          },
          {
            question: 'Apa yang dimaksud dengan version control?',
            options: [
              'Mengontrol versi software',
              'Sistem untuk melacak perubahan kode',
              'Membuat backup kode',
              'Menghapus kode lama'
            ],
            correctAnswer: 1,
            explanation: 'Version control adalah sistem untuk melacak dan mengelola perubahan kode sepanjang waktu.'
          },
          {
            question: 'Framework mana yang digunakan untuk pengembangan aplikasi web dengan JavaScript?',
            options: ['Laravel', 'Django', 'React', 'Spring'],
            correctAnswer: 2,
            explanation: 'React adalah framework JavaScript yang populer untuk pengembangan aplikasi web.'
          },
          {
            question: 'Apa yang dimaksud dengan debugging?',
            options: [
              'Menulis kode baru',
              'Menghapus kode',
              'Mencari dan memperbaiki error',
              'Mengoptimalkan kode'
            ],
            correctAnswer: 2,
            explanation: 'Debugging adalah proses mencari dan memperbaiki error atau bug dalam kode program.'
          },
          {
            question: 'Manakah yang merupakan database relasional?',
            options: ['MongoDB', 'Redis', 'MySQL', 'Cassandra'],
            correctAnswer: 2,
            explanation: 'MySQL adalah database relasional yang menggunakan SQL untuk manajemen data.'
          }
        ],
        'Teknik Elektro': [
          {
            question: 'Hukum Ohm menyatakan bahwa?',
            options: ['V = I × R', 'P = V × I', 'I = V / P', 'R = P / V'],
            correctAnswer: 0,
            explanation: 'Hukum Ohm menyatakan bahwa tegangan (V) sama dengan arus (I) dikali resistansi (R).'
          },
          {
            question: 'Satuan daya listrik adalah?',
            options: ['Volt', 'Ampere', 'Watt', 'Ohm'],
            correctAnswer: 2,
            explanation: 'Watt adalah satuan daya listrik dalam sistem internasional (SI).'
          },
          {
            question: 'Apa yang dimaksud dengan arus AC?',
            options: [
              'Arus searah',
              'Arus bolak-balik',
              'Arus tinggi',
              'Arus rendah'
            ],
            correctAnswer: 1,
            explanation: 'AC (Alternating Current) adalah arus bolak-balik yang berubah arah secara periodik.'
          },
          {
            question: 'Komponen elektronik yang berfungsi sebagai penguat sinyal adalah?',
            options: ['Resistor', 'Kapasitor', 'Transistor', 'Dioda'],
            correctAnswer: 2,
            explanation: 'Transistor adalah komponen elektronik yang dapat berfungsi sebagai penguat sinyal.'
          },
          {
            question: 'Satuan frekuensi adalah?',
            options: ['Volt', 'Hertz', 'Ampere', 'Ohm'],
            correctAnswer: 1,
            explanation: 'Hertz (Hz) adalah satuan frekuensi yang menyatakan jumlah getaran per detik.'
          },
          {
            question: 'Apa fungsi dari kapasitor?',
            options: [
              'Menyimpan energi listrik',
              'Mengubah arus',
              'Mengatur tegangan',
              'Menghantarkan listrik'
            ],
            correctAnswer: 0,
            explanation: 'Kapasitor berfungsi untuk menyimpan energi listrik dalam bentuk medan listrik.'
          },
          {
            question: 'Hukum Kirchhoff I menyatakan?',
            options: [
              'Jumlah tegangan dalam loop tertutup sama dengan nol',
              'Jumlah arus yang masuk sama dengan jumlah arus yang keluar',
              'Daya sama dengan tegangan dikali arus',
              'Resistansi berbanding lurus dengan panjang'
            ],
            correctAnswer: 1,
            explanation: 'Hukum Kirchhoff I (KCL) menyatakan bahwa jumlah arus yang masuk ke suatu titik sama dengan jumlah arus yang keluar.'
          },
          {
            question: 'Transformator berfungsi untuk?',
            options: [
              'Mengubah AC menjadi DC',
              'Mengubah DC menjadi AC',
              'Menaikkan atau menurunkan tegangan AC',
              'Menyimpan energi listrik'
            ],
            correctAnswer: 2,
            explanation: 'Transformator berfungsi untuk menaikkan atau menurunkan tegangan AC berdasarkan prinsip induksi elektromagnetik.'
          },
          {
            question: 'Apa yang dimaksud dengan impedansi?',
            options: [
              'Tahanan terhadap arus DC',
              'Tahanan terhadap arus AC',
              'Kuat arus maksimum',
              'Tegangan maksimum'
            ],
            correctAnswer: 1,
            explanation: 'Impedansi adalah tahanan total terhadap arus AC yang terdiri dari resistansi, reaktansi induktif, dan reaktansi kapasitif.'
          },
          {
            question: 'Dioda berfungsi sebagai?',
            options: [
              'Penguat sinyal',
              'Penyearah arus',
              'Penyimpan energi',
              'Pengatur tegangan'
            ],
            correctAnswer: 1,
            explanation: 'Dioda berfungsi sebagai penyearah arus karena hanya dapat menghantarkan arus dalam satu arah.'
          },
          {
            question: 'Apa yang dimaksud dengan grounding?',
            options: [
              'Menghubungkan ke tanah untuk keamanan',
              'Meningkatkan tegangan',
              'Mengurangi arus',
              'Memperbesar resistansi'
            ],
            correctAnswer: 0,
            explanation: 'Grounding adalah menghubungkan sistem listrik ke tanah untuk keamanan dan stabilitas.'
          },
          {
            question: 'Satuan induktansi adalah?',
            options: ['Farad', 'Henry', 'Ohm', 'Coulomb'],
            correctAnswer: 1,
            explanation: 'Henry (H) adalah satuan induktansi yang mengukur kemampuan komponen untuk menyimpan energi dalam medan magnet.'
          },
          {
            question: 'Apa yang dimaksud dengan resonansi dalam rangkaian RLC?',
            options: [
              'Arus minimum',
              'Tegangan maksimum',
              'Impedansi minimum',
              'Resistansi maksimum'
            ],
            correctAnswer: 2,
            explanation: 'Resonansi terjadi ketika reaktansi induktif sama dengan reaktansi kapasitif, menghasilkan impedansi minimum.'
          },
          {
            question: 'Motor listrik bekerja berdasarkan prinsip?',
            options: [
              'Induksi elektromagnetik',
              'Efek fotolistrik',
              'Gaya Lorentz',
              'Efek termoelektrik'
            ],
            correctAnswer: 2,
            explanation: 'Motor listrik bekerja berdasarkan gaya Lorentz yang bekerja pada konduktor berarus dalam medan magnet.'
          },
          {
            question: 'Apa fungsi dari relay?',
            options: [
              'Mengubah tegangan',
              'Saklar yang dikendalikan secara elektrik',
              'Menyimpan energi',
              'Mengatur frekuensi'
            ],
            correctAnswer: 1,
            explanation: 'Relay adalah saklar yang dikendalikan secara elektrik untuk mengontrol rangkaian dengan daya yang lebih besar.'
          },
          {
            question: 'Apa yang dimaksud dengan power factor?',
            options: [
              'Perbandingan daya aktif terhadap daya semu',
              'Perbandingan tegangan terhadap arus',
              'Perbandingan resistansi terhadap impedansi',
              'Perbandingan frekuensi terhadap waktu'
            ],
            correctAnswer: 0,
            explanation: 'Power factor adalah perbandingan daya aktif terhadap daya semu yang menunjukkan efisiensi penggunaan daya.'
          },
          {
            question: 'Apa yang dimaksud dengan short circuit?',
            options: [
              'Rangkaian terbuka',
              'Hubungan langsung tanpa beban',
              'Rangkaian dengan resistansi tinggi',
              'Rangkaian dengan tegangan rendah'
            ],
            correctAnswer: 1,
            explanation: 'Short circuit adalah kondisi dimana terjadi hubungan langsung antara dua titik tanpa melalui beban.'
          },
          {
            question: 'Generator listrik bekerja berdasarkan prinsip?',
            options: [
              'Hukum Ohm',
              'Induksi elektromagnetik',
              'Efek termoelektrik',
              'Gaya Coulomb'
            ],
            correctAnswer: 1,
            explanation: 'Generator listrik bekerja berdasarkan prinsip induksi elektromagnetik yang mengubah energi mekanik menjadi energi listrik.'
          },
          {
            question: 'Apa yang dimaksud dengan bandwidth dalam sistem komunikasi?',
            options: [
              'Lebar jalur frekuensi',
              'Kecepatan data',
              'Kuat sinyal',
              'Jarak transmisi'
            ],
            correctAnswer: 0,
            explanation: 'Bandwidth adalah lebar jalur frekuensi yang dapat dilewati oleh sinyal dalam sistem komunikasi.'
          },
          {
            question: 'Apa fungsi dari stabilizer tegangan?',
            options: [
              'Menaikkan tegangan',
              'Menurunkan tegangan',
              'Menjaga tegangan tetap stabil',
              'Mengubah AC menjadi DC'
            ],
            correctAnswer: 2,
            explanation: 'Stabilizer tegangan berfungsi untuk menjaga tegangan output tetap stabil meskipun tegangan input berfluktuasi.'
          }
        ],
        'Manajemen': [
          {
            question: 'Apa yang dimaksud dengan ROI?',
            options: [
              'Return on Investment',
              'Rate of Interest',
              'Revenue of Income',
              'Ratio of Investment'
            ],
            correctAnswer: 0,
            explanation: 'ROI (Return on Investment) adalah rasio yang mengukur efisiensi investasi.'
          },
          {
            question: 'Laporan keuangan utama perusahaan meliputi?',
            options: [
              'Neraca saja',
              'Laporan laba rugi saja',
              'Neraca, laporan laba rugi, dan laporan arus kas',
              'Laporan pajak saja'
            ],
            correctAnswer: 2,
            explanation: 'Laporan keuangan utama terdiri dari neraca, laporan laba rugi, dan laporan arus kas.'
          },
          {
            question: 'Apa yang dimaksud dengan manajemen?',
            options: [
              'Proses perencanaan dan pengawasan',
              'Cara mengelola keuangan',
              'Sistem informasi perusahaan',
              'Struktur organisasi'
            ],
            correctAnswer: 0,
            explanation: 'Manajemen adalah proses perencanaan, pengorganisasian, pengarahan, dan pengawasan sumber daya untuk mencapai tujuan.'
          },
          {
            question: 'Fungsi manajemen yang pertama adalah?',
            options: ['Organizing', 'Planning', 'Leading', 'Controlling'],
            correctAnswer: 1,
            explanation: 'Planning (perencanaan) adalah fungsi manajemen yang pertama dalam proses manajemen.'
          },
          {
            question: 'Apa yang dimaksud dengan SWOT analysis?',
            options: [
              'Analisis keuangan',
              'Strengths, Weaknesses, Opportunities, Threats',
              'Sistem informasi manajemen',
              'Struktur organisasi'
            ],
            correctAnswer: 1,
            explanation: 'SWOT adalah analisis kekuatan, kelemahan, peluang, dan ancaman dalam perencanaan strategis.'
          },
          {
            question: 'Gaya kepemimpinan yang melibatkan bawahan dalam pengambilan keputusan adalah?',
            options: ['Autocratic', 'Democratic', 'Laissez-faire', 'Bureaucratic'],
            correctAnswer: 1,
            explanation: 'Gaya kepemimpinan democratic melibatkan partisipasi bawahan dalam pengambilan keputusan.'
          },
          {
            question: 'Apa yang dimaksud dengan organizational behavior?',
            options: [
              'Perilaku konsumen',
              'Perilaku individu dan kelompok dalam organisasi',
              'Strategi pemasaran',
              'Manajemen keuangan'
            ],
            correctAnswer: 1,
            explanation: 'Organizational behavior adalah studi tentang perilaku individu dan kelompok dalam organisasi.'
          },
          {
            question: 'Teori motivasi yang dikembangkan oleh Abraham Maslow adalah?',
            options: [
              'Two-factor theory',
              'Hierarchy of needs',
              'Equity theory',
              'Expectancy theory'
            ],
            correctAnswer: 1,
            explanation: 'Maslow mengembangkan teori hierarchy of needs yang menjelaskan tingkatan kebutuhan manusia.'
          },
          {
            question: 'Apa yang dimaksud dengan span of control?',
            options: [
              'Jumlah bawahan yang dapat diawasi secara efektif',
              'Tingkat kewenangan manajer',
              'Jangka waktu kontrol',
              'Sistem pengawasan'
            ],
            correctAnswer: 0,
            explanation: 'Span of control adalah jumlah bawahan yang dapat diawasi secara efektif oleh seorang manajer.'
          },
          {
            question: 'Proses komunikasi yang efektif memerlukan?',
            options: [
              'Pengirim dan penerima',
              'Pengirim, pesan, media, penerima, dan feedback',
              'Media komunikasi yang baik',
              'Waktu yang tepat'
            ],
            correctAnswer: 1,
            explanation: 'Komunikasi efektif memerlukan pengirim, pesan, media, penerima, dan feedback sebagai komponen lengkap.'
          },
          {
            question: 'Apa yang dimaksud dengan budaya organisasi?',
            options: [
              'Peraturan perusahaan',
              'Nilai, norma, dan keyakinan bersama dalam organisasi',
              'Struktur organisasi',
              'Sistem reward and punishment'
            ],
            correctAnswer: 1,
            explanation: 'Budaya organisasi adalah nilai, norma, dan keyakinan bersama yang menjadi karakteristik organisasi.'
          },
          {
            question: 'Manajemen strategis meliputi?',
            options: [
              'Perencanaan jangka pendek',
              'Formulasi, implementasi, dan evaluasi strategi',
              'Manajemen operasional',
              'Pengawasan keuangan'
            ],
            correctAnswer: 1,
            explanation: 'Manajemen strategis meliputi formulasi, implementasi, dan evaluasi strategi jangka panjang.'
          },
          {
            question: 'Apa yang dimaksud dengan change management?',
            options: [
              'Mengubah struktur organisasi',
              'Proses mengelola perubahan dalam organisasi',
              'Mengganti manajemen',
              'Mengubah produk'
            ],
            correctAnswer: 1,
            explanation: 'Change management adalah proses mengelola perubahan dalam organisasi secara terstruktur.'
          },
          {
            question: 'Teori X dan Y dikembangkan oleh?',
            options: ['Henri Fayol', 'Frederick Taylor', 'Douglas McGregor', 'Max Weber'],
            correctAnswer: 2,
            explanation: 'Teori X dan Y dikembangkan oleh Douglas McGregor tentang asumsi manajer terhadap pekerja.'
          },
          {
            question: 'Apa yang dimaksud dengan delegation?',
            options: [
              'Memberikan wewenang kepada bawahan',
              'Mengambil keputusan sendiri',
              'Mengawasi pekerjaan',
              'Memberikan reward'
            ],
            correctAnswer: 0,
            explanation: 'Delegation adalah proses memberikan wewenang dan tanggung jawab kepada bawahan.'
          },
          {
            question: 'Fungsi controlling dalam manajemen bertujuan untuk?',
            options: [
              'Membuat rencana',
              'Memastikan aktivitas sesuai dengan rencana',
              'Mengorganisir sumber daya',
              'Memotivasi karyawan'
            ],
            correctAnswer: 1,
            explanation: 'Controlling berfungsi untuk memastikan bahwa aktivitas organisasi berjalan sesuai dengan rencana yang telah ditetapkan.'
          },
          {
            question: 'Manakah yang termasuk dalam empat P pemasaran?',
            options: [
              'Profit, People, Process, Price',
              'Product, Price, Place, Promotion',
              'Planning, Performance, Placement, Profit',
              'Policy, People, Product, Promotion'
            ],
            correctAnswer: 1,
            explanation: 'Empat P pemasaran adalah Product, Price, Place, dan Promotion, yang merupakan elemen dasar bauran pemasaran.'
          },
          {
            question: 'Apa tujuan dari manajemen sumber daya manusia (SDM)?',
            options: [
              'Meningkatkan penjualan produk',
              'Mengelola keuangan perusahaan',
              'Mengoptimalkan pemanfaatan karyawan untuk mencapai tujuan organisasi',
              'Mengembangkan teknologi baru'
            ],
            correctAnswer: 2,
            explanation: 'Manajemen SDM bertujuan untuk mengelola dan mengembangkan karyawan agar berkontribusi optimal pada tujuan organisasi.'
          },
          {
            question: 'Konsep "Total Quality Management" (TQM) berfokus pada?',
            options: [
              'Pengurangan biaya produksi',
              'Peningkatan kualitas secara menyeluruh melalui partisipasi semua anggota',
              'Peningkatan kecepatan distribusi',
              'Pengembangan produk baru'
            ],
            correctAnswer: 1,
            explanation: 'TQM adalah pendekatan manajemen yang berfokus pada peningkatan kualitas berkelanjutan dengan melibatkan seluruh karyawan.'
          },
          {
            question: 'Apa yang dimaksud dengan "break-even point" dalam analisis bisnis?',
            options: [
              'Titik di mana perusahaan mulai menghasilkan keuntungan besar',
              'Titik di mana total pendapatan sama dengan total biaya',
              'Titik di mana investasi awal telah kembali',
              'Titik di mana produksi mencapai kapasitas maksimum'
            ],
            correctAnswer: 1,
            explanation: 'Break-even point adalah titik di mana perusahaan tidak mengalami laba atau rugi, karena total pendapatan menutupi total biaya.'
          }
        ],
        'Akuntansi': [
          {
            question: 'Persamaan dasar akuntansi adalah?',
            options: [
              'Aset = Liabilitas - Ekuitas',
              'Aset = Liabilitas + Ekuitas',
              'Pendapatan = Beban + Laba',
              'Kas = Pendapatan - Beban'
            ],
            correctAnswer: 1,
            explanation: 'Persamaan dasar akuntansi adalah Aset = Liabilitas + Ekuitas, yang menunjukkan keseimbangan sumber daya perusahaan.'
          },
          {
            question: 'Apa yang dimaksud dengan debit dalam akuntansi?',
            options: [
              'Sisi kiri akun T',
              'Sisi kanan akun T',
              'Selalu berarti penambahan',
              'Selalu berarti pengurangan'
            ],
            correctAnswer: 0,
            explanation: 'Debit adalah sisi kiri dalam format akun T, dan efeknya pada akun tergantung pada jenis akun tersebut.'
          },
          {
            question: 'Prinsip akuntansi yang menyatakan bahwa transaksi harus dicatat pada periode terjadinya, bukan saat kas diterima atau dibayar, adalah?',
            options: [
              'Prinsip Biaya Historis',
              'Prinsip Konsistensi',
              'Prinsip Akrual',
              'Prinsip Entitas Ekonomi'
            ],
            correctAnswer: 2,
            explanation: 'Prinsip akrual mewajibkan pencatatan transaksi saat terjadi, terlepas dari arus kas.'
          },
          {
            question: 'Laporan keuangan yang menunjukkan posisi keuangan perusahaan pada tanggal tertentu adalah?',
            options: ['Laporan Laba Rugi', 'Laporan Arus Kas', 'Neraca', 'Laporan Perubahan Modal'],
            correctAnswer: 2,
            explanation: 'Neraca (Statement of Financial Position) menyajikan informasi aset, liabilitas, dan ekuitas pada satu titik waktu.'
          },
          {
            question: 'Apa tujuan utama dari auditing?',
            options: [
              'Membuat laporan keuangan',
              'Menilai kinerja manajemen',
              'Memberikan opini atas kewajaran laporan keuangan',
              'Merencanakan strategi bisnis'
            ],
            correctAnswer: 2,
            explanation: 'Tujuan auditing adalah memberikan opini independen tentang kewajaran penyajian laporan keuangan perusahaan.'
          },
          {
            question: 'Istilah "depresiasi" dalam akuntansi merujuk pada?',
            options: [
              'Penurunan nilai kas',
              'Penurunan nilai persediaan',
              'Alokasi biaya aset tetap sepanjang umur manfaatnya',
              'Peningkatan nilai investasi'
            ],
            correctAnswer: 2,
            explanation: 'Depresiasi adalah proses akuntansi untuk mengalokasikan biaya perolehan aset tetap selama masa manfaatnya.'
          },
          {
            question: 'Manakah yang termasuk dalam aset lancar?',
            options: ['Tanah', 'Gedung', 'Kas', 'Peralatan'],
            correctAnswer: 2,
            explanation: 'Kas adalah aset lancar karena dapat dikonversi menjadi uang tunai dalam waktu kurang dari satu tahun.'
          },
          {
            question: 'Apa yang dimaksud dengan "pendapatan diterima di muka"?',
            options: [
              'Pendapatan yang sudah dihasilkan tetapi belum diterima kasnya',
              'Pendapatan yang sudah diterima kasnya tetapi belum dihasilkan',
              'Pendapatan yang sudah diterima dan sudah dihasilkan',
              'Pendapatan yang tidak pernah diterima kasnya'
            ],
            correctAnswer: 1,
            explanation: 'Pendapatan diterima di muka adalah kewajiban karena perusahaan telah menerima pembayaran tetapi belum memberikan barang atau jasa.'
          },
          {
            question: 'Metode penilaian persediaan yang mengasumsikan barang pertama masuk adalah barang pertama keluar adalah?',
            options: ['FIFO', 'LIFO', 'Average Cost', 'Specific Identification'],
            correctAnswer: 0,
            explanation: 'FIFO (First-In, First-Out) mengasumsikan unit persediaan yang dibeli atau diproduksi pertama kali akan dijual pertama kali.'
          },
          {
            question: 'Pajak Pertambahan Nilai (PPN) adalah jenis pajak?',
            options: [
              'Pajak langsung',
              'Pajak tidak langsung',
              'Pajak properti',
              'Pajak penghasilan'
            ],
            correctAnswer: 1,
            explanation: 'PPN adalah pajak tidak langsung yang dikenakan atas konsumsi barang dan jasa.'
          },
          {
            question: 'Apa fungsi utama jurnal umum dalam siklus akuntansi?',
            options: [
              'Tempat posting semua transaksi',
              'Catatan awal transaksi bisnis secara kronologis',
              'Menyusun laporan keuangan',
              'Menghitung laba rugi'
            ],
            correctAnswer: 1,
            explanation: 'Jurnal umum adalah buku entri asli di mana semua transaksi dicatat pertama kali secara kronologis.'
          },
          {
            question: 'Manakah yang merupakan akun kontra aset?',
            options: ['Kas', 'Piutang Usaha', 'Akumulasi Depresiasi', 'Persediaan'],
            correctAnswer: 2,
            explanation: 'Akumulasi Depresiasi adalah akun kontra aset yang mengurangi nilai buku aset tetap.'
          },
          {
            question: 'Rasio keuangan yang mengukur kemampuan perusahaan membayar kewajiban jangka pendek adalah?',
            options: [
              'Rasio Utang terhadap Ekuitas',
              'Rasio Cepat (Quick Ratio)',
              'Margin Laba Bersih',
              'Perputaran Persediaan'
            ],
            correctAnswer: 1,
            explanation: 'Rasio Cepat mengukur likuiditas jangka pendek dengan mengecualikan persediaan dari aset lancar.'
          },
          {
            question: 'Apa yang dimaksud dengan "amortisasi" dalam akuntansi?',
            options: [
              'Penurunan nilai aset berwujud',
              'Penurunan nilai aset tidak berwujud',
              'Penyisihan piutang tak tertagih',
              'Pembayaran kembali utang'
            ],
            correctAnswer: 1,
            explanation: 'Amortisasi adalah proses pengalokasian biaya aset tidak berwujud sepanjang umur manfaatnya.'
          },
          {
            question: 'Konsep "Materialitas" dalam auditing berarti?',
            options: [
              'Semua kesalahan harus diperbaiki',
              'Informasi dianggap material jika dapat mempengaruhi keputusan pengguna laporan keuangan',
              'Auditor harus selalu menemukan semua penipuan',
              'Laporan keuangan harus selalu sempurna'
            ],
            correctAnswer: 1,
            explanation: 'Materialitas adalah ambang batas di mana suatu salah saji atau kelalaian dalam laporan keuangan dapat mempengaruhi keputusan ekonomi pengguna.'
          },
          {
            question: 'Jenis laporan audit di mana auditor menyatakan bahwa laporan keuangan disajikan secara wajar dalam semua hal yang material adalah?',
            options: [
              'Opini Wajar Tanpa Pengecualian',
              'Opini Wajar Dengan Pengecualian',
              'Opini Tidak Wajar',
              'Opini Tidak Menyatakan Pendapat'
            ],
            correctAnswer: 0,
            explanation: 'Opini Wajar Tanpa Pengecualian adalah opini terbaik yang diberikan auditor, menunjukkan laporan keuangan bebas salah saji material.'
          },
          {
            question: 'Apa fungsi dari buku besar (ledger) dalam akuntansi?',
            options: [
              'Mencatat transaksi harian',
              'Mengumpulkan informasi dari jurnal dan mengelompokkannya per akun',
              'Membuat daftar semua aset perusahaan',
              'Melaporkan laba perusahaan'
            ],
            correctAnswer: 1,
            explanation: 'Buku besar adalah kumpulan semua akun yang digunakan perusahaan, merangkum transaksi dari jurnal.'
          },
          {
            question: 'Pajak Penghasilan (PPh) adalah pajak yang dikenakan atas?',
            options: [
              'Nilai barang dan jasa yang dijual',
              'Keuntungan yang diperoleh perusahaan atau individu',
              'Kepemilikan properti',
              'Pendapatan dari impor barang'
            ],
            correctAnswer: 1,
            explanation: 'Pajak Penghasilan (PPh) adalah pajak yang dikenakan atas penghasilan atau keuntungan yang diterima oleh individu atau badan usaha.'
          },
          {
            question: 'Manakah yang BUKAN termasuk karakteristik kualitatif laporan keuangan menurut kerangka konseptual akuntansi?',
            options: [
              'Relevansi',
              'Keterbandingan',
              'Ketepatan Waktu',
              'Biaya'
            ],
            correctAnswer: 3,
            explanation: 'Karakteristik kualitatif laporan keuangan meliputi relevansi, keterwakilan jujur, keterbandingan, ketepatan waktu, dan dapat diverifikasi. Biaya adalah batasan, bukan karakteristik.'
          },
          {
            question: 'Apa yang dimaksud dengan "goodwill" dalam akuntansi?',
            options: [
              'Nilai sisa aset setelah disusutkan',
              'Aset tidak berwujud yang muncul dari reputasi dan merek perusahaan',
              'Keuntungan dari penjualan aset',
              'Jumlah utang yang belum dibayar'
            ],
            correctAnswer: 1,
            explanation: 'Goodwill adalah aset tidak berwujud yang merepresentasikan reputasi baik dan nilai lebih suatu bisnis di atas nilai aset bersihnya.'
          }
        ]
      }
    }
  },
  computed: {
    availableSubjects() {
      // Mengembalikan daftar subjek untuk currentJurusan yang sudah hardcode.
      // Ini akan menampilkan "Kuis Umum Teknik Informatika" sebagai satu-satunya opsi.
      const jurusanQuestions = this.questionsByJurusan[this.currentJurusan]
      if (jurusanQuestions) {
        return [{
          id: this.currentJurusan,
          name: `Kuis Umum ${this.currentJurusan}`,
          description: `Uji pengetahuan Anda tentang dasar-dasar ${this.currentJurusan}.`,
          questions: jurusanQuestions
        }]
      }
      return []
    },
    currentQuestion() {
      if (!this.selectedSubject || !this.selectedSubject.questions) return null
      return this.selectedSubject.questions[this.currentQuestionIndex]
    },
    totalQuestions() {
      return this.selectedSubject ? this.selectedSubject.questions.length : 0
    },
    grade() {
      const percentage = (this.score / this.totalQuestions) * 100
      if (percentage >= 90) return 'A'
      if (percentage >= 80) return 'B'
      if (percentage >= 70) return 'C'
      if (percentage >= 60) return 'D'
      return 'E'
    },
    gradeClass() {
      return {
        'grade-a': this.grade === 'A',
        'grade-b': this.grade === 'B',
        'grade-c': this.grade === 'C',
        'grade-d': this.grade === 'D',
        'grade-e': this.grade === 'E'
      }
    }
  },
  mounted() {
    // loadUserProfile(); // Tidak lagi diperlukan karena jurusan sudah di-hardcode
  },
  methods: {
    // loadUserProfile() { // Method ini tidak lagi diperlukan
    //   const store = useBelajarStore()
    //   const profil = store.getCurrentProfil()
      
    //   if (profil) {
    //     this.currentJurusan = profil.jurusan
    //     this.currentSemester = profil.semester
    //   } else {
    //     // Jika tidak ada profil, arahkan ke halaman pemilihan jurusan (opsional)
    //     this.$router.push('/pilih-jurusan')
    //   }
    // },
    selectSubject(subject) {
      this.selectedSubject = subject
      this.quizStarted = true
      this.resetQuiz()
    },
    selectOption(index) {
      if (!this.showResult) {
        this.selectedOption = index
      }
    },
    submitAnswer() {
      this.showResult = true
      if (this.selectedOption === this.currentQuestion.correctAnswer) {
        this.score++
      }
    },
    nextQuestion() {
      if (this.currentQuestionIndex + 1 < this.totalQuestions) {
        this.currentQuestionIndex++
        this.selectedOption = null
        this.showResult = false
      } else {
        this.quizCompleted = true
      }
    },
    resetQuiz() {
      this.currentQuestionIndex = 0
      this.selectedOption = null
      this.showResult = false
      this.score = 0
      this.quizCompleted = false
    },
    retryQuiz() {
      this.resetQuiz()
    },
    backToSubjects() {
      this.quizStarted = false
      this.selectedSubject = null
      this.resetQuiz()
    }
  }
}
</script>

<style scoped>
.quiz-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.quiz-header {
  text-align: center;
  margin-bottom: 30px;
}

.quiz-header h1 {
  color: #003049;
  margin-bottom: 10px;
}

.quiz-info {
  display: flex;
  justify-content: center;
  gap: 20px;
  align-items: center;
}

.semester-badge {
  background: #ffd60a;
  color: #003049;
  padding: 5px 15px;
  border-radius: 20px;
  font-weight: 600;
}

.score {
  color: #005f90;
  font-weight: 600;
}

.subject-selection {
  background: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.subject-selection h2 {
  color: #003049;
  margin-bottom: 20px;
  text-align: center;
}

.subject-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.subject-card {
  background: #f7f9fc;
  border: 2px solid #e1e8ed;
  border-radius: 10px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.subject-card:hover {
  border-color: #005f90;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.subject-card h3 {
  color: #003049;
  margin-bottom: 10px;
}

.subject-card p {
  color: #666;
  margin-bottom: 10px;
}

.question-count {
  background: #005f90;
  color: white;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.quiz-area {
  background: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.progress-bar {
  background: #e1e8ed;
  height: 8px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.progress-fill {
  background: #005f90;
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.question-counter {
  text-align: center;
  color: #666;
  margin-bottom: 20px;
}

.question-card h3 {
  color: #003049;
  margin-bottom: 20px;
  font-size: 18px;
}

.options-list {
  margin-bottom: 20px;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-item:hover {
  border-color: #005f90;
  background: #f7f9fc;
}

.option-item.selected {
  border-color: #005f90;
  background: #e6f3ff;
}

.option-item.correct {
  border-color: #28a745;
  background: #d4edda;
}

.option-item.incorrect {
  border-color: #dc3545;
  background: #f8d7da;
}

.option-letter {
  background: #005f90;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  margin-right: 15px;
  flex-shrink: 0;
}

.option-text {
  flex-grow: 1;
  color: #333;
}

.result-feedback {
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  font-weight: bold;
}

.correct-feedback {
  background-color: #d4edda;
  color: #28a745;
}

.incorrect-feedback {
  background-color: #f8d7da;
  color: #dc3545;
}

.result-feedback .icon-check,
.result-feedback .icon-close {
  font-size: 20px;
  margin-right: 10px;
}

.quiz-actions {
  text-align: center;
  margin-top: 30px;
}

.submit-btn,
.next-btn {
  padding: 12px 25px;
  background-color: #003049;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-btn:disabled {
  background-color: #9db4c0;
  cursor: not-allowed;
}

.submit-btn:hover:not(:disabled),
.next-btn:hover {
  background-color: #005f90;
}

.quiz-result {
  background: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.result-card {
  padding: 20px;
}

.result-card h2 {
  color: #003049;
  margin-bottom: 20px;
}

.final-score {
  font-size: 48px;
  font-weight: bold;
  color: #005f90;
  margin-bottom: 10px;
}

.score-number {
  font-size: 1em;
}

.score-total {
  font-size: 0.6em;
  color: #666;
}

.score-percentage {
  font-size: 24px;
  color: #003049;
  margin-bottom: 20px;
}

.grade-info {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 30px;
}

.grade-label {
  color: #666;
  margin-right: 10px;
}

.grade-value {
  padding: 5px 15px;
  border-radius: 20px;
  color: white;
}

.grade-a { background-color: #28a745; } /* Green */
.grade-b { background-color: #005f90; } /* Blue */
.grade-c { background-color: #ffd60a; color: #003049; } /* Yellow */
.grade-d { background-color: #fd7e14; } /* Orange */
.grade-e { background-color: #dc3545; } /* Red */

.result-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.retry-btn, .back-btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s;
}

.retry-btn {
  background-color: #005f90;
  color: white;
  border: none;
}

.retry-btn:hover {
  background-color: #003049;
}

.back-btn {
  background-color: #f7f9fc;
  color: #003049;
  border: 2px solid #003049;
}

.back-btn:hover {
  background-color: #e1e8ed;
}

@media (max-width: 768px) {
  .quiz-container {
    padding: 15px;
  }
  
  .subject-cards {
    grid-template-columns: 1fr;
  }

  .submit-btn, .next-btn {
    width: 100%;
    margin-top: 10px;
  }

  .result-actions {
    flex-direction: column;
  }
}
</style>