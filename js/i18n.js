// i18n 国际化配置
const i18n = {
  'zh-CN': {
    'rain': '雨声',
    'forest': '森林',
    'ocean': '海洋',
    'city': '城市',
    'language': '切换语言',
    'share': '分享此页面',
    'donate': '请我一杯咖啡',
    'copyLink': '🔗 复制链接',
    'favorite': '⭐ 收藏',
    'mobileShare': '📱 分享',
    'paypal': '💳 PayPal',
    'wechat': '💬 微信',
    'alipay': '💰 支付宝',
    'qrTitle': '扫码支付',
    'qrTip': '请使用相应的App扫描二维码完成支付'
  },
  'en-US': {
    'rain': 'Rainy',
    'forest': 'Forest',
    'ocean': 'Ocean',
    'city': 'City',
    'language': 'Switch Language',
    'share': 'Share this page',
    'donate': 'Buy me a coffee',
    'copyLink': '🔗 Copy Link',
    'favorite': '⭐ Favorite',
    'mobileShare': '📱 Share',
    'paypal': '💳 PayPal',
    'wechat': '💬 WeChat',
    'alipay': '💰 Alipay',
    'qrTitle': 'Scan to Pay',
    'qrTip': 'Please use the corresponding app to scan the QR code to complete the payment'
  },
  'ja-JP': {
    'rain': 'あめ',
    'forest': 'もり',
    'ocean': 'うみ',
    'city': 'まち',
    'language': '言語を切り替える',
    'share': 'このページを共有',
    'donate': '応援する',
    'copyLink': '🔗 コピー',
    'favorite': '⭐ お気に入り',
    'mobileShare': '📱 共有',
    'paypal': '💳 PayPal',
    'wechat': '💬 WeChat',
    'alipay': '💰 Alipay',
    'qrTitle': 'スキャンして支払う',
    'qrTip': '対応するアプリでQRコードをスキャンして、支払いを完了してください'
  },
  'ko-KR': {
    'rain': '비소리',
    'forest': '숲',
    'ocean': '바다',
    'city': '도시',
    'language': '언어 변경',
    'share': '이 페이지 공유',
    'donate': '후원하기',
    'copyLink': '🔗 링크 복사',
    'favorite': '⭐ 즐겨찾기',
    'mobileShare': '📱 공유',
    'paypal': '💳 PayPal',
    'wechat': '💬 WeChat',
    'alipay': '💰 Alipay',
    'qrTitle': '스캔하여 결제',
    'qrTip': '해당 앱으로 QR 코드를 스캔하여 결제를 완료하세요'
  }
};

// 获取用户语言偏好
function getUserLanguage() {
  const savedLang = localStorage.getItem('rainyMoodLang');
  if (savedLang) return savedLang;
  
  const browserLang = navigator.language || navigator.userLanguage;
  const supportedLangs = Object.keys(i18n);
  
  // 匹配完整语言代码
  if (supportedLangs.includes(browserLang)) {
    return browserLang;
  }
  
  // 匹配语言前缀
  const langPrefix = browserLang.split('-')[0];
  const matchedLang = supportedLangs.find(lang => lang.startsWith(langPrefix));
  if (matchedLang) {
    return matchedLang;
  }
  
  return 'en-US'; // 默认语言
}

// 设置语言
function setLanguage(lang) {
  localStorage.setItem('rainyMoodLang', lang);
  updateUIText();
}

// 获取翻译文本
function t(key, lang = null) {
  const targetLang = lang || getUserLanguage();
  return i18n[targetLang]?.[key] || i18n['en-US'][key] || key;
}

// 更新UI文本
function updateUIText() {
  // 更新工具按钮tooltip
  const toolButtons = document.querySelectorAll('.utility-btn[data-i18n]');
  toolButtons.forEach(button => {
    const key = button.dataset.i18n;
    if (key) {
      button.setAttribute('data-tooltip', t(key));
    }
  });

  // 更新菜单项 - 直接替换完整文本（包含emoji）
  const menuOptions = document.querySelectorAll('.utility-option[data-i18n]');
  menuOptions.forEach(option => {
    const key = option.dataset.i18n;
    if (key) {
      option.innerHTML = t(key);
    }
  });

  // 更新播放列表项目
  const playlistItems = document.querySelectorAll('.playlist-item');
  playlistItems.forEach(item => {
    const key = item.dataset.key;
    if (key) {
      const span = item.querySelector('span[data-i18n]');
      if (span) {
        span.textContent = t(key);
      }
    }
  });

  // 更新二维码模态框文本
  const qrTitle = document.getElementById('qrTitle');
  if (qrTitle) {
    qrTitle.textContent = t('qrTitle');
  }

  const qrTip = document.querySelector('.qr-tip');
  if (qrTip) {
    qrTip.textContent = t('qrTip');
  }
}

// 初始化i18n
function initI18n() {
  updateUIText();
  
  // 检查是否已存在语言按钮
  const existingLangBtn = document.getElementById('languageBtn');
  if (existingLangBtn) {
    // 使用已存在的语言按钮
    const langBtn = existingLangBtn;
    langBtn.setAttribute('data-i18n', 'language');
  } else {
    // 创建语言按钮（兼容旧版本）
    const container = document.querySelector('.container');
    let utilityBar = document.querySelector('.utility-bar');
    if (!utilityBar) {
      utilityBar = document.createElement('div');
      utilityBar.className = 'utility-bar';
      if (container) {
        container.appendChild(utilityBar);
      }
    }
    
    const langBtn = document.createElement('button');
    langBtn.className = 'utility-btn';
    langBtn.id = 'languageBtn';
    langBtn.setAttribute('data-i18n', 'language');
    langBtn.innerHTML = '<span class="utility-icon">🌐</span>';
    utilityBar.insertBefore(langBtn, utilityBar.firstChild);
  }
  
  // 创建语言选择下拉菜单
  const langDropdown = document.createElement('div');
  langDropdown.className = 'utility-dropdown';
  langDropdown.id = 'language-dropdown';
  langDropdown.innerHTML = `
    <button class="utility-option" data-lang="zh-CN">中文</button>
    <button class="utility-option" data-lang="en-US">English</button>
    <button class="utility-option" data-lang="ja-JP">日本語</button>
    <button class="utility-option" data-lang="ko-KR">한국어</button>
  `;
  
  // 添加下拉菜单到容器
  const container = document.querySelector('.container');
  if (container) {
    container.appendChild(langDropdown);
  }
  
  // 设置语言按钮点击事件
  const languageBtn = document.getElementById('languageBtn');
  if (languageBtn) {
    languageBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const dropdown = document.getElementById('language-dropdown');
      dropdown.classList.toggle('show');
      
      // 关闭其他下拉菜单
      const otherDropdowns = document.querySelectorAll('.utility-dropdown:not(#language-dropdown)');
      otherDropdowns.forEach(d => d.classList.remove('show'));
    });
  }
  
  // 设置语言选项点击事件
  const langOptions = document.querySelectorAll('#language-dropdown .utility-option');
  langOptions.forEach(option => {
    option.addEventListener('click', (e) => {
      const lang = e.target.dataset.lang;
      setLanguage(lang);
      document.getElementById('language-dropdown').classList.remove('show');
    });
  });
  
  // 点击其他地方关闭下拉菜单
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.language-selector') && !e.target.closest('#language-dropdown')) {
      document.getElementById('language-dropdown').classList.remove('show');
    }
  });
}

// 导出到全局作用域
window.i18n = {
  t,
  setLanguage,
  getUserLanguage,
  initI18n,
  updateUIText
};