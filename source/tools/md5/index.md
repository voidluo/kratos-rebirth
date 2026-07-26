---
title: MD5 在线加密
date: 2026-07-26 10:00:00
comments: false
toc: false
donate: false
share: false
---

<style>
.md5-tool { max-width:640px; margin:0 auto; padding:20px; font-family:system-ui,sans-serif; }
.md5-tool h2 { text-align:center; color:var(--color-primary,#f59e0b); }
.md5-input-wrap { margin:20px 0; }
.md5-input-wrap textarea { width:100%; height:120px; padding:14px; font-size:16px; border:2px solid #ddd; border-radius:8px; background:var(--bg,#fff); color:var(--fg,#333); resize:vertical; box-sizing:border-box; }
.md5-result { display:flex; gap:10px; margin:16px 0; }
.md5-result input { flex:1; padding:12px 16px; font-size:16px; font-family:monospace; border:2px solid #ddd; border-radius:8px; background:var(--bg,#fff); color:var(--fg,#333); }
.md5-result button { padding:12px 20px; background:#f59e0b; color:#fff; border:none; border-radius:8px; cursor:pointer; font-size:16px; white-space:nowrap; }
.md5-result button:hover { background:#d97706; }
.md5-btn { width:100%; padding:14px; font-size:18px; background:#f59e0b; color:#fff; border:none; border-radius:8px; cursor:pointer; margin-bottom:4px; }
.md5-btn:hover { background:#d97706; }
.md5-upper-row { display:flex; align-items:center; gap:24px; margin:8px 0; }
.md5-upper-row label { display:flex; align-items:center; gap:6px; cursor:pointer; }
.md5-upper-row input[type=checkbox] { width:18px; height:18px; }
.md5-hint { color:#888; font-size:13px; text-align:center; margin-top:8px; }
</style>

<div class="md5-tool" id="md5-tool">
  <h2>🔑 MD5 在线加密</h2>
  <p style="text-align:center;color:#888;">输入文本，即时生成 MD5 哈希值</p>

  <div class="md5-input-wrap">
    <textarea id="md5Input" placeholder="在此输入要加密的文本..." oninput="calcMD5()"></textarea>
  </div>

  <div class="md5-upper-row">
    <label><input type="checkbox" id="md5Upper" onchange="calcMD5()"> 大写输出</label>
    <label><input type="checkbox" id="md5Short" onchange="calcMD5()"> 16位（截短）</label>
  </div>

  <div class="md5-result">
    <input type="text" id="md5Result" readonly placeholder="MD5 结果将显示在这里...">
    <button onclick="copyMD5()">📋 复制</button>
  </div>

  <div class="md5-hint">⚠️ MD5 不可逆加密，无法解密还原原文</div>
</div>

<script src="https://cdn.jsdelivr.net/npm/blueimp-md5@2.19.0/js/md5.min.js"></script>
<script>
function calcMD5() {
  var input = document.getElementById('md5Input').value;
  if (!input) { document.getElementById('md5Result').value = ''; return; }
  var hash = md5(input);
  if (document.getElementById('md5Upper').checked) hash = hash.toUpperCase();
  if (document.getElementById('md5Short').checked) hash = hash.substring(8, 24);
  document.getElementById('md5Result').value = hash;
}

function copyMD5() {
  var val = document.getElementById('md5Result').value;
  if (!val) return;
  navigator.clipboard.writeText(val).then(function() {
    var btn = document.querySelector('.md5-result button');
    btn.textContent = '✅ 已复制';
    setTimeout(function() { btn.textContent = '📋 复制'; }, 1500);
  });
}
</script>
