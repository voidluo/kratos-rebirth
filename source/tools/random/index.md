---
title: 随机密码生成器
date: 2026-07-26 10:00:00
comments: false
toc: false
donate: false
share: false
---

<style>
.pwd-tool { max-width:600px; margin:0 auto; padding:20px; font-family:system-ui,sans-serif; }
.pwd-tool h2 { text-align:center; color:var(--color-primary,#10b981); }
.pwd-options { margin:20px 0; }
.pwd-options label { display:flex; align-items:center; gap:8px; margin:10px 0; cursor:pointer; }
.pwd-row { display:flex; align-items:center; gap:12px; margin:12px 0; }
.pwd-row span { font-weight:bold; font-size:16px; min-width:40px; }
.pwd-row input[type=range] { flex:1; }
.pwd-row select { padding:6px 12px; font-size:16px; border:2px solid #ddd; border-radius:6px; background:var(--bg,#fff); color:var(--fg,#333); }
.pwd-options input[type=checkbox] { width:18px; height:18px; }
.pwd-generate { width:100%; padding:14px; font-size:18px; background:#10b981; color:#fff; border:none; border-radius:8px; cursor:pointer; margin-top:10px; }
.pwd-generate:hover { background:#059669; }
.pwd-list { margin-top:24px; display:flex; flex-direction:column; gap:8px; }
.pwd-item { display:flex; flex-wrap:wrap; align-items:center; gap:10px; padding:10px; border:1px solid var(--border-color,#ddd); border-radius:6px; margin:6px 0; font-family:monospace; background:var(--card-bg,var(--bg,#fff)); }
.pwd-item span { flex:1 1 0; min-width:0; word-break: break-all; overflow-wrap: anywhere; color:var(--color-text,var(--fg,#111)); }
.pwd-item button { flex:0 0 auto; min-width:100px; padding:8px 14px; background:#6366f1; color:#fff; border:none; border-radius:6px; cursor:pointer; white-space:nowrap; }
.pwd-item button:hover { background:#4f46e5; }
.pwd-placeholder { text-align:center; color:#aaa; padding:40px 0; }
</style>

<div class="pwd-tool" id="password-tool">
  <h2>🔐 随机密码生成器</h2>
  <p style="text-align:center;color:#888;">随机生成安全密码，可自定义长度与字符组合</p>

  <div class="pwd-options">
    <div class="pwd-row">
      <span>长度:</span>
      <input type="range" id="pwdLen" min="4" max="64" value="16" oninput="document.getElementById('pwdLenVal').textContent=this.value">
      <span id="pwdLenVal" style="min-width:30px;">16</span>
    </div>
    <div class="pwd-row">
      <span>个数:</span>
      <select id="pwdCount">
        <option value="1">1</option>
        <option value="3">3</option>
        <option value="5" selected>5</option>
        <option value="10">10</option>
        <option value="20">20</option>
      </select>
    </div>
    <label><input type="checkbox" id="useUpper" checked> 包含大写字母 (A-Z)</label>
    <label><input type="checkbox" id="useLower" checked> 包含小写字母 (a-z)</label>
    <label><input type="checkbox" id="useNum" checked> 包含数字 (0-9)</label>
    <label><input type="checkbox" id="useSym"> 包含符号 (!@#$%^&*)</label>
  </div>

  <button class="pwd-generate" onclick="genPasswords()">🎲 生成密码</button>

  <div id="list" class="pwd-list">
    <div class="pwd-placeholder">👆 点击上方按钮生成密码</div>
  </div>
</div>

<script>
function genPasswords() {
  var len = +document.getElementById('pwdLen').value;
  var cnt = +document.getElementById('pwdCount').value;
  var u = document.getElementById('useUpper').checked;
  var l = document.getElementById('useLower').checked;
  var n = document.getElementById('useNum').checked;
  var s = document.getElementById('useSym').checked;
  var chars = '';
  if (u) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (l) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (n) chars += '0123456789';
  if (s) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  if (!chars) { document.getElementById('list').innerHTML = '<p style="color:red;text-align:center;">请至少选择一种字符类型</p>'; return; }

  var passwords = [];
  for (var j = 0; j < cnt; j++) {
    var arr = new Uint32Array(len);
    crypto.getRandomValues(arr);
    var pwd = '';
    for (var i = 0; i < len; i++) {
      pwd += chars[arr[i] % chars.length];
    }
    passwords.push(pwd);
  }
  var html = '';
  for (var k = 0; k < passwords.length; k++) {
    var pwd = passwords[k].replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    html += '<div class="pwd-item" data-pwd="' + pwd.replace(/"/g,'&quot;') + '"><span>' + pwd + '</span><button>📋 复制</button></div>';
  }
  document.getElementById('list').innerHTML = html;
}

document.getElementById('list').addEventListener('click', function(e) {
  var btn = e.target.closest('button');
  if (!btn) return;
  var item = btn.closest('.pwd-item');
  if (!item) return;
  var text = item.getAttribute('data-pwd') || item.querySelector('span').textContent;
  navigator.clipboard.writeText(text).then(function() {
    btn.textContent = '✅ 已复制';
    setTimeout(function() { btn.textContent = '📋 复制'; }, 1500);
  });
});
</script>
