---
title: IP 地址查询
date: 2026-07-26 10:00:00
comments: false
toc: false
donate: false
share: false
---

<style>
.ip-tool { max-width:640px; margin:0 auto; padding:20px; font-family:system-ui,sans-serif; }
.ip-tool h2 { text-align:center; color:var(--color-primary,#6366f1); }
.ip-card { background:var(--card-bg,var(--blog-bg,#f9fafb)); border-radius:12px; padding:24px; margin:20px 0; border:1px solid var(--border-color,#e5e7eb); }
.ip-row { display:flex; justify-content:space-between; padding:12px 0; border-bottom:1px solid var(--border-color,#e5e7eb); }
.ip-row:last-child { border-bottom:none; }
.ip-label { color:var(--color-meta,#8b8b8b); font-size:14px; }
.ip-value { font-weight:600; font-size:15px; color:var(--color-text,var(--fg,#333)); }
.ip-search { display:flex; gap:10px; margin:20px 0; }
.ip-search input { flex:1; padding:12px 16px; font-size:16px; border:2px solid var(--border-color,#d1d5db); border-radius:8px; background:var(--card-bg,var(--blog-bg,#fff)); color:var(--color-text,var(--fg,#333)); }
.ip-search input::placeholder { color:var(--color-meta,#9ca3af); }
.ip-search button { padding:12px 24px; background:#6366f1; color:#fff; border:none; border-radius:8px; cursor:pointer; font-size:16px; white-space:nowrap; }
.ip-search button:hover { background:#4f46e5; }
.ip-search button:disabled { background:#a5b4fc; cursor:not-allowed; }
.ip-loading { text-align:center; padding:40px; color:var(--color-meta,#888); }
.ip-error { color:#ef4444; text-align:center; padding:20px; }
</style>

<div class="ip-tool" id="ip-tool">
  <h2>🌐 IP 地址查询</h2>
  <p style="text-align:center;color:var(--color-meta,#8b8b8b);">查询 IP 地址的归属地、运营商等信息</p>

  <div id="myIpCard" class="ip-card">
    <div class="ip-loading">正在获取您的 IP 信息...</div>
  </div>

  <div class="ip-search">
    <input type="text" id="ipInput" placeholder="输入要查询的 IP 地址..." onkeydown="if(event.key==='Enter')queryIP()">
    <button id="searchBtn" onclick="queryIP()">🔍 查询</button>
  </div>
  <div id="searchResult"></div>
</div>

<script>
function renderFields(data) {
  var fields = [
    ['IP 地址', data.ip || data.query],
    ['国家/地区', data.country_name || data.country],
    ['省份', data.region],
    ['城市', data.city],
    ['运营商', data.org],
    ['ISP', data.isp],
    ['时区', data.timezone],
    ['经纬度', data.latitude ? data.latitude + ', ' + data.longitude : '']
  ];
  var html = '';
  for (var i = 0; i < fields.length; i++) {
    if (fields[i][1]) {
      html += '<div class="ip-row"><span class="ip-label">' + fields[i][0] + '</span><span class="ip-value">' + fields[i][1] + '</span></div>';
    }
  }
  return html;
}

function queryMyIP() {
  fetch('https://ipapi.co/json/')
    .then(function(r) { return r.json(); })
    .then(function(d) {
      d.ip = d.ip;
      d.query = d.ip;
      var html = renderFields(d);
      document.getElementById('myIpCard').innerHTML = html;
    })
    .catch(function() {
      document.getElementById('myIpCard').innerHTML = '<div class="ip-error">获取 IP 信息失败，请检查网络连接</div>';
    });
}

function queryIP() {
  var ip = document.getElementById('ipInput').value.trim();
  if (!ip) {
    document.getElementById('searchResult').innerHTML = '<div class="ip-error">请输入 IP 地址</div>';
    return;
  }
  var btn = document.getElementById('searchBtn');
  btn.disabled = true;
  btn.textContent = '查询中...';
  document.getElementById('searchResult').innerHTML = '<div class="ip-loading">🔍 正在查询...</div>';

  fetch('https://ipapi.co/' + ip + '/json/')
    .then(function(r) { return r.json(); })
    .then(function(d) {
      btn.disabled = false;
      btn.textContent = '🔍 查询';
      if (d.error) {
        document.getElementById('searchResult').innerHTML = '<div class="ip-error">查询失败: ' + (d.reason || '无效的 IP 地址') + '</div>';
        return;
      }
      var html = renderFields(d);
      document.getElementById('searchResult').innerHTML = '<div class="ip-card">' + html + '</div>';
    })
    .catch(function() {
      btn.disabled = false;
      btn.textContent = '🔍 查询';
      document.getElementById('searchResult').innerHTML = '<div class="ip-error">网络请求失败，请稍后重试</div>';
    });
}

queryMyIP();
</script>
