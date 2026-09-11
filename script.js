/**
 * Unix Timestamp Converter - Client-Side Engine
 * Author: bordia98
 * 100% Client-Side - Zero Tracking - Zero Data Sent
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Theme Management (Default Light)
  // --------------------------------------------------------------------------
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;

  const savedTheme = localStorage.getItem('theme') || 'light';
  root.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = root.getAttribute('data-theme') || 'light';
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
    showToast(`Switched to ${nextTheme} theme`);
  });

  // --------------------------------------------------------------------------
  // 2. Toast System
  // --------------------------------------------------------------------------
  const toastEl = document.getElementById('toast');
  let toastTimer = null;

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2200);
  }

  // --------------------------------------------------------------------------
  // 3. Tab Switching
  // --------------------------------------------------------------------------
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const targetPanel = document.getElementById(`tab-${btn.dataset.tab}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // --------------------------------------------------------------------------
  // 4. Live Clock
  // --------------------------------------------------------------------------
  const currentEpochSec = document.getElementById('currentEpochSec');
  const currentEpochMs = document.getElementById('currentEpochMs');
  const pauseEpochBtn = document.getElementById('pauseEpochBtn');
  const pauseIcon = document.getElementById('pauseIcon');
  const pauseLabel = document.getElementById('pauseLabel');
  const copyCurrentEpochBtn = document.getElementById('copyCurrentEpochBtn');
  const useCurrentInConverterBtn = document.getElementById('useCurrentInConverterBtn');

  let clockRunning = true;
  let clockInterval = null;

  function updateLiveClock() {
    if (!clockRunning) return;
    const now = Date.now();
    currentEpochSec.textContent = Math.floor(now / 1000).toString();
    currentEpochMs.textContent = now.toString();
  }

  clockInterval = setInterval(updateLiveClock, 50);
  updateLiveClock();

  pauseEpochBtn.addEventListener('click', () => {
    clockRunning = !clockRunning;
    if (clockRunning) {
      pauseIcon.textContent = '⏸️';
      pauseLabel.textContent = 'Pause Clock';
      showToast('Live clock resumed');
    } else {
      pauseIcon.textContent = '▶️';
      pauseLabel.textContent = 'Resume Clock';
      showToast('Live clock paused');
    }
  });

  copyCurrentEpochBtn.addEventListener('click', async () => {
    const sec = currentEpochSec.textContent;
    try {
      await navigator.clipboard.writeText(sec);
      showToast(`Copied timestamp (${sec}) to clipboard!`);
    } catch {
      showToast('Failed to copy');
    }
  });

  // --------------------------------------------------------------------------
  // 5. Epoch to Date & Multiple Timezones
  // --------------------------------------------------------------------------
  const epochInput = document.getElementById('epochInput');
  const detectedUnitBadge = document.getElementById('detectedUnitBadge');
  const epochErrorMsg = document.getElementById('epochErrorMsg');
  const timezoneResultsBody = document.getElementById('timezoneResultsBody');
  const resRelative = document.getElementById('resRelative');
  const resDayOfYear = document.getElementById('resDayOfYear');
  const resWeekNum = document.getElementById('resWeekNum');
  const resLeapYear = document.getElementById('resLeapYear');
  const setNowEpochBtn = document.getElementById('setNowEpochBtn');
  const clearEpochInputBtn = document.getElementById('clearEpochInputBtn');
  const epochUnitRadios = document.querySelectorAll('input[name="epochUnit"]');

  const TARGET_TIMEZONES = [
    { id: 'UTC', name: 'UTC (Coordinated Universal Time)', badge: 'UTC', isUtc: true },
    { id: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC', name: `Local Browser (${Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local'})`, badge: 'Local' },
    { id: 'America/New_York', name: 'New York (Eastern Time - EST/EDT)', badge: 'US/East' },
    { id: 'America/Los_Angeles', name: 'Los Angeles (Pacific Time - PST/PDT)', badge: 'US/West' },
    { id: 'Europe/London', name: 'London (GMT / BST)', badge: 'UK' },
    { id: 'Europe/Berlin', name: 'Berlin / Paris / Rome (CET/CEST)', badge: 'Europe' },
    { id: 'Asia/Tokyo', name: 'Tokyo (Japan Standard Time - JST)', badge: 'Japan' },
    { id: 'Asia/Singapore', name: 'Singapore / Beijing (SGT / CST)', badge: 'Asia' },
    { id: 'Asia/Kolkata', name: 'India (Indian Standard Time - IST)', badge: 'India' },
    { id: 'Australia/Sydney', name: 'Sydney (AEST / AEDT)', badge: 'Australia' }
  ];

  function getSelectedUnit() {
    const checked = document.querySelector('input[name="epochUnit"]:checked');
    return checked ? checked.value : 'auto';
  }

  function parseEpochToMs(rawInput, unitMode) {
    const cleaned = rawInput.trim();
    if (!cleaned) return null;
    const num = Number(cleaned);
    if (isNaN(num)) throw new Error('Input is not a valid number.');

    if (unitMode === 's') return { ms: num * 1000, detected: 'Seconds' };
    if (unitMode === 'ms') return { ms: num, detected: 'Milliseconds' };
    if (unitMode === 'us') return { ms: Math.round(num / 1000), detected: 'Microseconds' };
    if (unitMode === 'ns') return { ms: Math.round(num / 1000000), detected: 'Nanoseconds' };

    // Auto-detect based on string length / magnitude
    const len = cleaned.replace(/^-/, '').split('.')[0].length;
    if (len <= 11) {
      return { ms: num * 1000, detected: 'Seconds' };
    } else if (len <= 14) {
      return { ms: num, detected: 'Milliseconds' };
    } else if (len <= 17) {
      return { ms: Math.round(num / 1000), detected: 'Microseconds' };
    } else {
      return { ms: Math.round(num / 1000000), detected: 'Nanoseconds' };
    }
  }

  function formatRelativeTime(date) {
    const now = Date.now();
    const diffSec = Math.round((date.getTime() - now) / 1000);
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

    const absSec = Math.abs(diffSec);
    if (absSec < 60) return rtf.format(diffSec, 'second');
    const diffMin = Math.round(diffSec / 60);
    if (Math.abs(diffMin) < 60) return rtf.format(diffMin, 'minute');
    const diffHours = Math.round(diffMin / 60);
    if (Math.abs(diffHours) < 24) return rtf.format(diffHours, 'hour');
    const diffDays = Math.round(diffHours / 24);
    if (Math.abs(diffDays) < 30) return rtf.format(diffDays, 'day');
    const diffMonths = Math.round(diffDays / 30.4375);
    if (Math.abs(diffMonths) < 12) return rtf.format(diffMonths, 'month');
    const diffYears = Math.round(diffDays / 365.25);
    return rtf.format(diffYears, 'year');
  }

  function getDayOfYear(date) {
    const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 0));
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }

  function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  }

  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  function renderEpochResults() {
    const raw = epochInput.value.trim();
    if (!raw) {
      epochErrorMsg.style.display = 'none';
      detectedUnitBadge.textContent = 'Detected: None';
      timezoneResultsBody.innerHTML = `<tr><td colspan="3" class="empty-state">Enter an epoch timestamp above to see instant multi-timezone conversions.</td></tr>`;
      resRelative.textContent = '-';
      resDayOfYear.textContent = '-';
      resWeekNum.textContent = '-';
      resLeapYear.textContent = '-';
      return;
    }

    try {
      const mode = getSelectedUnit();
      const parsed = parseEpochToMs(raw, mode);
      if (!parsed) return;

      detectedUnitBadge.textContent = `Unit: ${parsed.detected}`;
      const date = new Date(parsed.ms);

      if (isNaN(date.getTime())) {
        throw new Error('Date is outside valid timestamp range.');
      }

      epochErrorMsg.style.display = 'none';

      // Populate Timezones Table
      timezoneResultsBody.innerHTML = '';
      TARGET_TIMEZONES.forEach(tz => {
        const tr = document.createElement('tr');

        // Formatter
        const options = {
          timeZone: tz.id,
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZoneName: 'short'
        };

        let formattedStr = '';
        try {
          formattedStr = new Intl.DateTimeFormat('en-US', options).format(date);
          if (tz.isUtc) {
            formattedStr += `  (${date.toISOString()})`;
          }
        } catch {
          formattedStr = date.toUTCString();
        }

        tr.innerHTML = `
          <td>
            <span class="tz-badge ${tz.isUtc ? 'tz-utc' : ''}">${tz.badge}</span>
            <span style="font-weight: 500; margin-left: 0.4rem;">${tz.name}</span>
          </td>
          <td><span class="time-val">${formattedStr}</span></td>
          <td style="text-align: right;">
            <button class="btn-copy" data-copy="${formattedStr}">Copy</button>
          </td>
        `;

        timezoneResultsBody.appendChild(tr);
      });

      // Bind copy buttons in timezone table
      timezoneResultsBody.querySelectorAll('.btn-copy').forEach(btn => {
        btn.addEventListener('click', async () => {
          const text = btn.getAttribute('data-copy');
          try {
            await navigator.clipboard.writeText(text);
            showToast('Copied formatted date to clipboard!');
          } catch {
            showToast('Failed to copy');
          }
        });
      });

      // Meta Details
      resRelative.textContent = formatRelativeTime(date);
      resDayOfYear.textContent = `${getDayOfYear(date)} of ${isLeapYear(date.getUTCFullYear()) ? 366 : 365}`;
      resWeekNum.textContent = `Week ${getWeekNumber(date)}`;
      resLeapYear.textContent = isLeapYear(date.getUTCFullYear()) ? 'Yes (366 days)' : 'No (365 days)';
    } catch (err) {
      epochErrorMsg.style.display = 'block';
      epochErrorMsg.textContent = `Error: ${err.message}`;
      timezoneResultsBody.innerHTML = `<tr><td colspan="3" class="empty-state">Invalid timestamp.</td></tr>`;
      resRelative.textContent = '-';
      resDayOfYear.textContent = '-';
      resWeekNum.textContent = '-';
      resLeapYear.textContent = '-';
    }
  }

  epochInput.addEventListener('input', renderEpochResults);
  epochUnitRadios.forEach(r => r.addEventListener('change', renderEpochResults));

  setNowEpochBtn.addEventListener('click', () => {
    epochInput.value = Math.floor(Date.now() / 1000).toString();
    renderEpochResults();
    showToast('Loaded current epoch time');
  });

  clearEpochInputBtn.addEventListener('click', () => {
    epochInput.value = '';
    renderEpochResults();
    epochInput.focus();
  });

  useCurrentInConverterBtn.addEventListener('click', () => {
    // Switch to tab 1
    const tab1Btn = document.querySelector('.tab-btn[data-tab="epoch-to-date"]');
    if (tab1Btn) tab1Btn.click();
    epochInput.value = currentEpochSec.textContent;
    renderEpochResults();
    showToast('Applied current timestamp to converter');
  });

  // --------------------------------------------------------------------------
  // 6. Date to Epoch Converter
  // --------------------------------------------------------------------------
  const datePickerInput = document.getElementById('datePickerInput');
  const timePickerInput = document.getElementById('timePickerInput');
  const timezonePicker = document.getElementById('timezonePicker');
  const setPickerNowBtn = document.getElementById('setPickerNowBtn');

  const outSeconds = document.getElementById('outSeconds');
  const outMillis = document.getElementById('outMillis');
  const outMicros = document.getElementById('outMicros');
  const outNanos = document.getElementById('outNanos');

  function initDatePickerWithNow() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    datePickerInput.value = `${yyyy}-${mm}-${dd}`;

    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    timePickerInput.value = `${hh}:${min}:${ss}`;
    calculateEpochFromPicker();
  }

  function calculateEpochFromPicker() {
    const dateVal = datePickerInput.value;
    const timeVal = timePickerInput.value || '00:00:00';
    const tz = timezonePicker.value;

    if (!dateVal) return;

    try {
      let targetMs;
      if (tz === 'UTC') {
        targetMs = Date.parse(`${dateVal}T${timeVal}Z`);
      } else if (tz === 'LOCAL') {
        targetMs = new Date(`${dateVal}T${timeVal}`).getTime();
      } else {
        // Parse in specific timezone using date string representation
        const isoString = `${dateVal}T${timeVal}`;
        const tempDate = new Date(isoString);
        // Find offset difference between target tz and local
        const targetLocaleStr = tempDate.toLocaleString('en-US', { timeZone: tz });
        const localLocaleStr = tempDate.toLocaleString('en-US');
        const offsetDiff = new Date(localLocaleStr) - new Date(targetLocaleStr);
        targetMs = tempDate.getTime() + offsetDiff;
      }

      if (isNaN(targetMs)) throw new Error('Invalid Date input');

      const sec = Math.floor(targetMs / 1000);
      outSeconds.textContent = sec.toString();
      outMillis.textContent = targetMs.toString();
      outMicros.textContent = (BigInt(targetMs) * 1000n).toString();
      outNanos.textContent = (BigInt(targetMs) * 1000000n).toString();
    } catch {
      outSeconds.textContent = 'Invalid Date';
      outMillis.textContent = '-';
      outMicros.textContent = '-';
      outNanos.textContent = '-';
    }
  }

  datePickerInput.addEventListener('input', calculateEpochFromPicker);
  timePickerInput.addEventListener('input', calculateEpochFromPicker);
  timezonePicker.addEventListener('change', calculateEpochFromPicker);
  setPickerNowBtn.addEventListener('click', () => {
    initDatePickerWithNow();
    showToast('Reset date/time picker to current moment');
  });

  // Copy buttons for Date to Epoch
  document.querySelectorAll('.copy-out').forEach(btn => {
    btn.addEventListener('click', async () => {
      const targetId = btn.getAttribute('data-target');
      const val = document.getElementById(targetId)?.textContent;
      if (val && val !== '-') {
        try {
          await navigator.clipboard.writeText(val);
          showToast(`Copied ${val} to clipboard!`);
        } catch {
          showToast('Failed to copy');
        }
      }
    });
  });

  // --------------------------------------------------------------------------
  // 7. Batch Converter Tab
  // --------------------------------------------------------------------------
  const batchInput = document.getElementById('batchInput');
  const runBatchBtn = document.getElementById('runBatchBtn');
  const sampleBatchBtn = document.getElementById('sampleBatchBtn');
  const clearBatchBtn = document.getElementById('clearBatchBtn');
  const batchCount = document.getElementById('batchCount');
  const batchResultsBody = document.getElementById('batchResultsBody');
  const exportCsvBtn = document.getElementById('exportCsvBtn');

  let batchData = [];

  function processBatch() {
    const raw = batchInput.value.trim();
    if (!raw) {
      batchResultsBody.innerHTML = `<tr><td colspan="4" class="empty-state">No timestamps entered.</td></tr>`;
      batchCount.textContent = '0';
      exportCsvBtn.disabled = true;
      batchData = [];
      return;
    }

    const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    batchData = [];
    batchResultsBody.innerHTML = '';

    lines.forEach(line => {
      try {
        const parsed = parseEpochToMs(line, 'auto');
        if (!parsed) return;
        const d = new Date(parsed.ms);
        if (isNaN(d.getTime())) return;

        const utcStr = d.toISOString();
        const localStr = d.toLocaleString();
        const relStr = formatRelativeTime(d);

        batchData.push({
          raw: line,
          utc: utcStr,
          local: localStr,
          relative: relStr
        });

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><code>${line}</code></td>
          <td>${utcStr}</td>
          <td>${localStr}</td>
          <td>${relStr}</td>
        `;
        batchResultsBody.appendChild(tr);
      } catch {
        // Skip invalid line
      }
    });

    batchCount.textContent = batchData.length;
    exportCsvBtn.disabled = batchData.length === 0;
    if (batchData.length > 0) {
      showToast(`Processed ${batchData.length} timestamps`);
    }
  }

  runBatchBtn.addEventListener('click', processBatch);

  sampleBatchBtn.addEventListener('click', () => {
    const now = Math.floor(Date.now() / 1000);
    batchInput.value = [
      now - 86400 * 30,
      now - 86400 * 7,
      now - 86400,
      now,
      now + 86400,
      now + 86400 * 7,
      1773446400
    ].join('\n');
    processBatch();
    showToast('Loaded batch sample timestamps');
  });

  clearBatchBtn.addEventListener('click', () => {
    batchInput.value = '';
    processBatch();
    batchInput.focus();
  });

  exportCsvBtn.addEventListener('click', () => {
    if (batchData.length === 0) return;
    let csv = 'Timestamp,UTC ISO 8601,Local Time,Relative\n';
    batchData.forEach(row => {
      csv += `"${row.raw}","${row.utc}","${row.local}","${row.relative}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timestamps-converted-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported CSV file!');
  });

  // --------------------------------------------------------------------------
  // 8. Cheat Sheet Generator
  // --------------------------------------------------------------------------
  const cheatSheetBody = document.getElementById('cheatSheetBody');

  function renderCheatSheet() {
    const now = new Date();
    const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const startOfYear = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
    const plus1Hour = new Date(now.getTime() + 3600 * 1000);
    const plus1Day = new Date(now.getTime() + 86400 * 1000);
    const plus1Week = new Date(now.getTime() + 86400 * 7 * 1000);
    const plus1Month = new Date(now.getTime() + 86400 * 30 * 1000);
    const year2038Bug = new Date(2147483647 * 1000);

    const items = [
      { name: 'Start of Today (00:00:00 UTC)', date: startOfToday },
      { name: 'Start of Current Month', date: startOfMonth },
      { name: 'Start of Current Year', date: startOfYear },
      { name: '+1 Hour from Now', date: plus1Hour },
      { name: '+1 Day from Now', date: plus1Day },
      { name: '+1 Week from Now', date: plus1Week },
      { name: '+1 Month from Now', date: plus1Month },
      { name: 'Year 2038 Bug (32-bit Max Int Overflow)', date: year2038Bug }
    ];

    cheatSheetBody.innerHTML = '';
    items.forEach(item => {
      const sec = Math.floor(item.date.getTime() / 1000);
      const iso = item.date.toISOString();

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${item.name}</strong></td>
        <td><code>${sec}</code></td>
        <td>${iso}</td>
        <td>
          <button class="btn-copy" data-copy="${sec}">Copy Epoch</button>
        </td>
      `;
      cheatSheetBody.appendChild(tr);
    });

    cheatSheetBody.querySelectorAll('.btn-copy').forEach(btn => {
      btn.addEventListener('click', async () => {
        const text = btn.getAttribute('data-copy');
        try {
          await navigator.clipboard.writeText(text);
          showToast(`Copied ${text} to clipboard!`);
        } catch {
          showToast('Failed to copy');
        }
      });
    });
  }

  // Initialize initial states
  initDatePickerWithNow();
  renderCheatSheet();
  // Set default initial converted view with current timestamp
  epochInput.value = Math.floor(Date.now() / 1000).toString();
  renderEpochResults();
});
