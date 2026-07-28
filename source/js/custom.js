/**
 * Kratos:Rebirth 自定义功能脚本
 * 功能1: 标签页崩溃/恢复动画
 * 功能2: 一言(Hitokoto) API 集成
 * 功能3: 中英日三语翻译模块
 */
(function () {
    'use strict';

    // closest() polyfill
    if (!Element.prototype.closest) {
        Element.prototype.closest = function (selector) {
            var el = this;
            while (el) {
                if (el.matches(selector)) return el;
                el = el.parentElement;
            }
            return null;
        };
    }

    // ==================== 功能1: 标签页崩溃/恢复动画 ====================
    var originTitle = document.title;
    var titleTimer = null;
    var crashTexts = {
        'zh-CN': { crash: '╭(°A°`)╮ 页面崩溃啦 ~', restore: '(ฅ>ω<*ฅ) 噫又好了~ ' },
        'en': { crash: '╭(°A°`)╮ Opps, page crashes ~', restore: '(ฅ>ω<*ฅ) Eh, restore again~ ' },
        'ja': { crash: '╭(°A°`)╮ クラッシュした ~', restore: '(ฅ>ω<*ฅ) また直った~ ' }
    };

    function getCrashLang() {
        var savedLang = localStorage.getItem('kr-custom-lang') || 'zh-CN';
        return crashTexts[savedLang] || crashTexts['zh-CN'];
    }

    document.addEventListener('visibilitychange', function () {
        var texts = getCrashLang();
        if (document.hidden) {
            document.title = texts.crash;
            if (titleTimer) clearTimeout(titleTimer);
        } else {
            document.title = texts.restore + originTitle;
            titleTimer = setTimeout(function () {
                document.title = originTitle;
            }, 2000);
        }
    });

    // ==================== 功能2: 一言(Hitokoto) API 集成 ====================
    function initHitokoto() {
        // 仅在首页显示
        var path = window.location.pathname;
        if (path !== '/' && path !== '/index.html') return;

        var bannerDesc = document.querySelector('.kratos-cover .desc, .kratos-cover .desc2');
        if (!bannerDesc) return;

        // 创建一言容器
        var hitokotoEl = document.createElement('div');
        hitokotoEl.className = 'kr-hitokoto';
        hitokotoEl.innerHTML =
            '<div class="kr-hitokoto-content"></div>' +
            '<div class="kr-hitokoto-from"></div>';
        bannerDesc.appendChild(hitokotoEl);

        // 从 API 获取数据
        fetch('https://v1.hitokoto.cn/?c=a&c=b&c=c&c=d&c=e&c=f&c=g&c=h&c=i&c=j&c=k&c=l')
            .then(function (res) { return res.json(); })
            .then(function (data) {
                var contentEl = hitokotoEl.querySelector('.kr-hitokoto-content');
                var fromEl = hitokotoEl.querySelector('.kr-hitokoto-from');
                var text = data.hitokoto.trim();
                var pointer = 0;
                var typeSpeed = 120;

                // 打字机效果
                function typeWriter() {
                    if (pointer <= text.length) {
                        contentEl.textContent = text.substr(0, pointer);
                        pointer++;
                        setTimeout(typeWriter, typeSpeed);
                    } else {
                        // 显示来源
                        var from = (data.from_who && data.from_who.trim())
                            ? data.from_who.trim()
                            : data.from.trim();
                        fromEl.textContent = 'by —— ' + from;
                        fromEl.style.opacity = '1';
                    }
                }
                typeWriter();
            })
            .catch(function () {
                hitokotoEl.querySelector('.kr-hitokoto-content').textContent = '生活不止眼前的苟且，还有诗和远方。';
                hitokotoEl.querySelector('.kr-hitokoto-from').textContent = 'by —— 一言';
                hitokotoEl.querySelector('.kr-hitokoto-from').style.opacity = '1';
            });
    }

    // ==================== 功能3: 划词翻译 ====================
    function initSelectTranslate() {
        var popup = document.createElement('div');
        popup.className = 'kr-trans-popup';
        popup.id = 'kr-trans-popup';
        popup.style.display = 'none';
        popup.innerHTML =
            '<div class="kr-trans-buttons">' +
            '  <span class="kr-trans-btn" data-to="zh">译中</span>' +
            '  <span class="kr-trans-btn" data-to="en">EN</span>' +
            '  <span class="kr-trans-btn" data-to="ja">日</span>' +
            '  <span class="kr-trans-copy">复制</span>' +
            '</div>' +
            '<div class="kr-trans-result"></div>';
        document.body.appendChild(popup);

        var selectedText = '';
        var popupVisible = false;

        document.addEventListener('mouseup', function (e) {
            setTimeout(function () {
                var sel = window.getSelection();
                selectedText = sel.toString().trim();

                if (selectedText.length > 0 && selectedText.length < 500) {
                    var range = sel.getRangeAt(0);
                    var rect = range.getBoundingClientRect();
                    popup.style.left = (rect.left + rect.width / 2) + 'px';
                    popup.style.top = (window.scrollY + rect.top - 50) + 'px';
                    popup.style.display = 'block';
                    popup.style.transform = 'translate(-50%, -100%)';
                    popup.querySelector('.kr-trans-result').textContent = '';
                    popupVisible = true;
                } else if (popupVisible && !e.target.closest('#kr-trans-popup')) {
                    popup.style.display = 'none';
                    popupVisible = false;
                }
            }, 10);
        });

        // 翻译按钮点击
        popup.addEventListener('click', function (e) {
            var btn = e.target.closest('.kr-trans-btn');
            if (btn && selectedText) {
                var toLang = btn.getAttribute('data-to');
                translateText(selectedText, toLang, function (result) {
                    popup.querySelector('.kr-trans-result').textContent = result;
                });
            }

            var copyBtn = e.target.closest('.kr-trans-copy');
            if (copyBtn) {
                var resultText = popup.querySelector('.kr-trans-result').textContent || selectedText;
                navigator.clipboard.writeText(resultText).then(function () {
                    copyBtn.textContent = '已复制!';
                    setTimeout(function () { copyBtn.textContent = '复制'; }, 1500);
                }).catch(function () {
                    // fallback
                    var ta = document.createElement('textarea');
                    ta.value = resultText;
                    ta.style.position = 'fixed';
                    ta.style.left = '-9999px';
                    document.body.appendChild(ta);
                    ta.select();
                    document.execCommand('copy');
                    document.body.removeChild(ta);
                    copyBtn.textContent = '已复制!';
                    setTimeout(function () { copyBtn.textContent = '复制'; }, 1500);
                });
            }
        });
    }

    function translateText(text, toLang, callback) {
        // 使用 MyMemory 免费翻译 API（无需 API Key，每天 5000 字符限额）
        var langMap = { zh: 'zh-CN', en: 'en-GB', ja: 'ja-JP' };
        var targetLang = langMap[toLang] || 'en-GB';

        var url = 'https://api.mymemory.translated.net/get?q=' +
            encodeURIComponent(text) +
            '&langpair=zh-CN|' + targetLang;

        fetch(url)
            .then(function (res) { return res.json(); })
            .then(function (data) {
                if (data.responseData && data.responseData.translatedText) {
                    callback(data.responseData.translatedText);
                } else {
                    callback('翻译失败，请稍后重试');
                }
            })
            .catch(function () {
                // 备用：使用 Google Translate API (非官方)
                var googleUrl = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=' +
                    targetLang.split('-')[0] + '&dt=t&q=' + encodeURIComponent(text);
                fetch(googleUrl)
                    .then(function (res) { return res.json(); })
                    .then(function (data) {
                        if (data && data[0]) {
                            var result = data[0].map(function (item) { return item[0]; }).join('');
                            callback(result);
                        } else {
                            callback('翻译失败，请稍后重试');
                        }
                    })
                    .catch(function () {
                        callback('翻译服务暂不可用');
                    });
            });
    }

    // ==================== 初始化 ====================
    function fixFooterCredits() {
        // 替换页脚主题名和作者链接
        var copyright = document.querySelector('.kratos-copyright');
        if (!copyright) return;
        var links = copyright.querySelectorAll('a');
        links.forEach(function (a) {
            if (a.href && a.href.indexOf('github.com/Candinya/Kratos-Rebirth') !== -1) {
                a.textContent = 'VOID-MAPLE';
                a.href = 'https://github.com/voidluo/void-maple';
            }
            if (a.href && a.href.indexOf('graph/contributors') !== -1) {
                a.textContent = 'Void Maple';
                a.href = 'https://github.com/voidluo/void-maple';
            }
        });
    }

    var selectTranslateInited = false;

    function init() {
        fixFooterCredits();
        initHitokoto();
        if (!selectTranslateInited) {
            initSelectTranslate();
            selectTranslateInited = true;
        }
    }

    // DOM 加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // PJAX 支持：监听多种可能的 PJAX/页面切换事件
    function onPageChange() {
        // 清理旧的一言
        var oldHitokoto = document.querySelector('.kr-hitokoto');
        if (oldHitokoto) oldHitokoto.remove();
        // 更新原始标题（PJAX 后标题可能改变）
        originTitle = document.title;
        // 重新初始化
        initHitokoto();
    }

    // 方式1: 历史记录变化 (popstate)
    window.addEventListener('popstate', function () {
        setTimeout(onPageChange, 300);
    });

    // 方式2: 监听 kratos-rebirth 的 PJAX 回调
    document.addEventListener('pjax:complete', onPageChange);
    document.addEventListener('pjax:success', onPageChange);

    // 方式3: 如果 window.kr 有自定义回调
    if (window.kr && typeof window.kr === 'object') {
        var origPjax = window.kr.onPjaxComplete;
        window.kr.onPjaxComplete = function () {
            onPageChange();
            if (origPjax) origPjax();
        };
    }
})();
