---
title: 在线翻译
date: 2026-07-28 10:00:00
comments: false
toc: false
donate: false
share: false
---

<style>
.trans-tool { max-width:800px; margin:0 auto; padding:20px; font-family:system-ui,sans-serif; }
.trans-tool h2 { text-align:center; color:var(--color-primary,#8b5cf6); }
.trans-tool .subtitle { text-align:center; color:var(--color-meta,#8b8b8b); margin-bottom:24px; }
.trans-main { display:flex; gap:16px; margin:20px 0; }
.trans-main > div { flex:1; min-width:0; }
.trans-lang-bar { display:flex; align-items:center; gap:8px; margin-bottom:8px; flex-wrap:wrap; }
.trans-lang-bar select { padding:6px 12px; font-size:14px; border:2px solid var(--border-color,#d1d5db); border-radius:6px; background:var(--card-bg,var(--blog-bg,#fff)); color:var(--color-text,var(--fg,#333)); cursor:pointer; }
.trans-lang-bar .swap-btn { width:32px; height:32px; border:2px solid var(--border-color,#d1d5db); border-radius:50%; background:var(--card-bg,var(--blog-bg,#fff)); color:var(--color-text,var(--fg,#333)); cursor:pointer; font-size:16px; display:flex; align-items:center; justify-content:center; transition:all 0.3s; flex-shrink:0; }
.trans-lang-bar .swap-btn:hover { background:#8b5cf6; color:#fff; border-color:#8b5cf6; }
.trans-input-wrap textarea { width:100%; height:260px; padding:14px; font-size:16px; line-height:1.7; border:2px solid var(--border-color,#d1d5db); border-radius:10px; background:var(--card-bg,var(--blog-bg,#fff)); color:var(--color-text,var(--fg,#333)); resize:vertical; box-sizing:border-box; font-family:system-ui,sans-serif; }
.trans-input-wrap textarea:focus { border-color:#8b5cf6; outline:none; box-shadow:0 0 0 3px rgba(139,92,246,0.1); }
.trans-output-wrap { position:relative; }
.trans-output-box { width:100%; height:260px; padding:14px; font-size:16px; line-height:1.7; border:2px solid var(--border-color,#d1d5db); border-radius:10px; background:var(--card-bg,var(--blog-bg,#fff)); color:var(--color-text,var(--fg,#333)); resize:vertical; box-sizing:border-box; font-family:system-ui,sans-serif; overflow-y:auto; white-space:pre-wrap; word-break:break-word; }
.trans-output-actions { display:flex; gap:8px; margin-top:8px; justify-content:flex-end; }
.trans-output-actions button { padding:6px 14px; font-size:13px; border:1px solid var(--border-color,#d1d5db); border-radius:6px; background:var(--card-bg,var(--blog-bg,#fff)); color:var(--color-text,var(--fg,#333)); cursor:pointer; transition:all 0.2s; }
.trans-output-actions button:hover { background:#8b5cf6; color:#fff; border-color:#8b5cf6; }
.trans-btn-wrap { text-align:center; margin:16px 0; }
.trans-btn-wrap button { padding:12px 48px; font-size:17px; background:#8b5cf6; color:#fff; border:none; border-radius:8px; cursor:pointer; transition:all 0.2s; }
.trans-btn-wrap button:hover { background:#7c3aed; }
.trans-btn-wrap button:disabled { background:#c4b5fd; cursor:not-allowed; }
.trans-error { color:#ef4444; text-align:center; padding:8px; font-size:14px; margin-top:8px; }
.trans-quick-actions { display:flex; gap:8px; margin:12px 0; justify-content:center; flex-wrap:wrap; }
.trans-quick-actions button { padding:8px 18px; font-size:14px; border:1px solid var(--border-color,#d1d5db); border-radius:20px; background:var(--card-bg,var(--blog-bg,#fff)); color:var(--color-text,var(--fg,#333)); cursor:pointer; transition:all 0.2s; }
.trans-quick-actions button:hover { background:#8b5cf6; color:#fff; border-color:#8b5cf6; }
.trans-char-count { text-align:right; font-size:12px; color:var(--color-meta,#aaa); margin-top:4px; }
.trans-tabs { display:flex; gap:0; margin-bottom:20px; border-bottom:2px solid var(--border-color,#e5e7eb); justify-content:center; }
.trans-tab { padding:10px 28px; font-size:15px; background:transparent; border:none; border-bottom:3px solid transparent; color:var(--color-meta,#8b8b8b); cursor:pointer; transition:all 0.2s; margin-bottom:-2px; }
.trans-tab.active { color:#8b5cf6; border-bottom-color:#8b5cf6; font-weight:600; }
.trans-tab:hover { color:#8b5cf6; }
@media (max-width:640px) { .trans-main { flex-direction:column; } .trans-input-wrap textarea, .trans-output-box { height:180px; } }
</style>

<div class="trans-tool" id="trans-tool">
<h2>🌐 在线翻译</h2>
<p class="subtitle">支持中文、英文、日文互译</p>
<div class="trans-tabs">
<button class="trans-tab active" data-tab="text">📝 文本翻译</button>
<button class="trans-tab" data-tab="select">🖱️ 划词翻译</button>
</div>
<div class="trans-panel" id="trans-panel-text">
<div class="trans-quick-actions">
<button onclick="quickClear()">🗑️ 清空</button>
<button onclick="quickPaste()">📋 粘贴</button>
<button onclick="quickSwap()">🔄 交换语言</button>
</div>
<div class="trans-lang-bar">
<select id="transFrom" onchange="onLangChange()">
<option value="auto" selected>🌍 自动检测</option>
<option value="zh">🇨🇳 中文</option>
<option value="en">🇬🇧 英文</option>
<option value="ja">🇯🇵 日文</option>
</select>
<button class="swap-btn" onclick="swapLang()" title="交换语言">⇄</button>
<select id="transTo">
<option value="zh">🇨🇳 中文</option>
<option value="en" selected>🇬🇧 英文</option>
<option value="ja">🇯🇵 日文</option>
</select>
</div>
<div class="trans-main">
<div class="trans-input-wrap">
<textarea id="transInput" placeholder="输入要翻译的文本..." oninput="updateCharCount()"></textarea>
<div class="trans-char-count"><span id="transCharCount">0</span> / 5000 字</div>
</div>
<div class="trans-output-wrap">
<div class="trans-output-box" id="transOutput">翻译结果将显示在这里...</div>
<div class="trans-output-actions">
<button onclick="copyTransResult()">📋 复制结果</button>
<button onclick="speakText('transOutput')">🔊 朗读</button>
</div>
</div>
</div>
<div class="trans-btn-wrap">
<button id="transBtn" onclick="doTranslate()">✨ 翻译</button>
</div>
<div class="trans-error" id="transError" style="display:none;"></div>
</div>
<div class="trans-panel" id="trans-panel-select" style="display:none;">
<div style="background:var(--card-bg,var(--blog-bg,#f9fafb)); border-radius:12px; padding:32px; text-align:center; border:1px solid var(--border-color,#e5e7eb);">
<div style="font-size:48px; margin-bottom:16px;">🖱️</div>
<h3 style="color:var(--color-text,var(--fg,#333));">划词翻译说明</h3>
<p style="color:var(--color-meta,#8b8b8b); line-height:1.8;">在<b>任意页面</b>选中文字，会自动弹出翻译弹窗。<br>支持翻译为中文、英文或日文，并可一键复制结果。</p>
<p style="color:var(--color-meta,#8b8b8b); font-size:14px;">💡 提示：划词翻译已在全站启用，无需额外操作即可使用。</p>
<div style="margin-top:24px; padding:16px; background:var(--bg,#f3f4f6); border-radius:8px;">
<p style="font-weight:600; color:var(--color-text,var(--fg,#333)); margin-bottom:8px;">⌨️ 翻译快捷键说明：</p>
<table style="margin:0 auto; font-size:14px; color:var(--color-meta,#8b8b8b);">
<tr><td style="padding:4px 12px; text-align:right;">选中文字 → 弹窗出现</td><td style="padding:4px 12px;">鼠标选中任意文本</td></tr>
<tr><td style="padding:4px 12px; text-align:right;">译中</td><td style="padding:4px 12px;">翻译为中文</td></tr>
<tr><td style="padding:4px 12px; text-align:right;">EN</td><td style="padding:4px 12px;">翻译为英文</td></tr>
<tr><td style="padding:4px 12px; text-align:right;">日</td><td style="padding:4px 12px;">翻译为日文</td></tr>
<tr><td style="padding:4px 12px; text-align:right;">复制</td><td style="padding:4px 12px;">复制翻译结果</td></tr>
</table>
</div>
</div>
</div>
</div>

<script>
(function(){
  'use strict';
  document.querySelectorAll('.trans-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      var target = this.getAttribute('data-tab');
      document.querySelectorAll('.trans-tab').forEach(function(t) { t.classList.remove('active'); });
      this.classList.add('active');
      document.querySelectorAll('.trans-panel').forEach(function(p) { p.style.display = 'none'; });
      document.getElementById('trans-panel-' + target).style.display = '';
    });
  });

  function doTranslate() {
    var input = document.getElementById('transInput').value.trim();
    if (!input) return;
    var from = document.getElementById('transFrom').value;
    var to = document.getElementById('transTo').value;
    var outputEl = document.getElementById('transOutput');
    var errorEl = document.getElementById('transError');
    var btn = document.getElementById('transBtn');
    btn.disabled = true;
    btn.textContent = '⏳ 翻译中...';
    errorEl.style.display = 'none';
    outputEl.textContent = '翻译中...';
    var langPair = (from === 'auto') ? ('Auto|' + langToCode(to)) : (langToCode(from) + '|' + langToCode(to));
    fetch('https://api.mymemory.translated.net/get?q=' + encodeURIComponent(input) + '&langpair=' + langPair)
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data.responseStatus === 200 || (data.responseData && data.responseData.translatedText)) {
          outputEl.textContent = data.responseData.translatedText;
        } else {
          throw new Error('API error');
        }
      })
      .catch(function() {
        return fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=' + (from === 'auto' ? 'auto' : from) + '&tl=' + to + '&dt=t&q=' + encodeURIComponent(input))
          .then(function(res) { return res.json(); })
          .then(function(data) {
            if (data && data[0]) outputEl.textContent = data[0].map(function(item) { return item[0]; }).join('');
            else throw new Error('Google API error');
          });
      })
      .catch(function() {
        outputEl.textContent = '翻译失败';
        errorEl.textContent = '❌ 翻译服务暂不可用，请稍后重试';
        errorEl.style.display = 'block';
      })
      .finally(function() {
        btn.disabled = false;
        btn.textContent = '✨ 翻译';
      });
  }

  function langToCode(lang) { var map = { zh: 'zh-CN', en: 'en-GB', ja: 'ja-JP' }; return map[lang] || lang; }
  function updateCharCount() { document.getElementById('transCharCount').textContent = document.getElementById('transInput').value.length; }
  function copyTransResult() { var t = document.getElementById('transOutput').textContent; if (t && t !== '翻译结果将显示在这里...' && t !== '翻译中...' && t !== '翻译失败') { copyToClipboard(t); } }
  function copyToClipboard(text) {
    if (navigator.clipboard) { navigator.clipboard.writeText(text).then(function() { showToast('✅ 已复制到剪贴板'); }); }
    else { var ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.left = '-9999px'; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); showToast('✅ 已复制到剪贴板'); }
  }
  function speakText(id) { var t = document.getElementById(id).textContent; if (t && 'speechSynthesis' in window) { var u = new SpeechSynthesisUtterance(t); var langMap = { zh: 'zh-CN', en: 'en-US', ja: 'ja-JP' }; u.lang = langMap[document.getElementById('transTo').value] || 'en-US'; window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); } }
  function swapLang() { var f = document.getElementById('transFrom'); var t = document.getElementById('transTo'); if (f.value === 'auto') return; var tmp = f.value; f.value = t.value; t.value = tmp; }
  function quickClear() { document.getElementById('transInput').value = ''; document.getElementById('transOutput').textContent = '翻译结果将显示在这里...'; document.getElementById('transError').style.display = 'none'; updateCharCount(); }
  function quickPaste() { if (navigator.clipboard) { navigator.clipboard.readText().then(function(text) { document.getElementById('transInput').value = text; updateCharCount(); }).catch(function() { showToast('⚠️ 无法读取剪贴板，请手动粘贴'); }); } }
  function quickSwap() { var i = document.getElementById('transInput').value; var o = document.getElementById('transOutput').textContent; if (o && o !== '翻译结果将显示在这里...' && o !== '翻译中...' && o !== '翻译失败') { document.getElementById('transInput').value = o; document.getElementById('transOutput').textContent = i; updateCharCount(); swapLang(); } }
  function showToast(msg) { var t = document.createElement('div'); t.textContent = msg; t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#333;color:#fff;padding:10px 24px;border-radius:8px;font-size:14px;z-index:99999;pointer-events:none;animation:krFadeInOut 2s ease forwards;'; document.body.appendChild(t); setTimeout(function() { t.remove(); }, 2100); }
  document.addEventListener('keydown', function(e) { if (e.ctrlKey && e.key === 'Enter' && document.activeElement === document.getElementById('transInput')) { e.preventDefault(); doTranslate(); } });
  window.doTranslate = doTranslate;
  window.updateCharCount = updateCharCount;
  window.copyTransResult = copyTransResult;
  window.speakText = speakText;
  window.swapLang = swapLang;
  window.quickClear = quickClear;
  window.quickPaste = quickPaste;
  window.quickSwap = quickSwap;
  window.onLangChange = function() { var f = document.getElementById('transFrom'); var t = document.getElementById('transTo'); if (f.value !== 'auto' && f.value === t.value) { t.value = (f.value === 'zh') ? 'en' : (f.value === 'en') ? 'zh' : 'en'; } };
})();
</script>
<style>
@keyframes krFadeInOut { 0% { opacity:0; transform:translateX(-50%) translateY(10px); } 15% { opacity:1; transform:translateX(-50%) translateY(0); } 70% { opacity:1; } 100% { opacity:0; } }
</style>
