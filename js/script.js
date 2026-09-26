// ===== Data =====
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let chart = null;

const $ = (id) => document.getElementById(id);
const rupiah = (n) => 'Rp' + n.toLocaleString('id-ID');
const COLORS = { Food: '#22c55e', Transport: '#3b82f6', Fun: '#f97316' };

function save() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// ===== Tambah & hapus =====
function addTransaction() {
  const name = $('name').value.trim();
  const amount = parseFloat($('amount').value);
  const category = $('category').value;

  if (!name || isNaN(amount) || amount <= 0) {
    $('error').textContent = 'Semua kolom harus diisi, dan jumlah harus lebih dari 0.';
    $('error').hidden = false;
    return;
  }
  $('error').hidden = true;

  transactions.push({ id: Date.now(), name, amount, category });
  $('name').value = '';
  $('amount').value = '';
  save();
  render();
}

function deleteTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  save();
  render();
}

// ===== Tampilan =====
function render() {
  // Total
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  $('total').textContent = rupiah(total);

  // Daftar
  const list = $('list');
  list.innerHTML = '';
  if (transactions.length === 0) {
    list.innerHTML = '<li class="empty">Belum ada transaksi</li>';
  }
  transactions.slice().reverse().forEach((t) => {
    const li = document.createElement('li');
    const info = document.createElement('div');
    info.innerHTML = `<div></div><div class="amt">${rupiah(t.amount)}</div><span class="tag">${t.category}</span>`;
    info.firstChild.textContent = t.name; // textContent supaya aman dari HTML
    const btn = document.createElement('button');
    btn.className = 'del';
    btn.textContent = 'Hapus';
    btn.onclick = () => deleteTransaction(t.id);
    li.append(info, btn);
    list.appendChild(li);
  });

  renderChart();
}

function renderChart() {
  const cats = Object.keys(COLORS);
  const data = cats.map((c) =>
    transactions.filter((t) => t.category === c).reduce((s, t) => s + t.amount, 0)
  );
  if (chart) chart.destroy();
  chart = new Chart($('chart'), {
    type: 'pie',
    data: { labels: cats, datasets: [{ data, backgroundColor: cats.map((c) => COLORS[c]) }] },
    options: { plugins: { legend: { position: 'bottom' } } },
  });
}

$('add').addEventListener('click', addTransaction);
render();
