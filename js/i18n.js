// i18n 国际化配置
const i18n = {
  'zh-CN': {
    'rain': '雨声',
    'forest': '森林',
    'ocean': '海洋',
    'city': '城市'
  },
  'en-US': {
    'rain': 'Rainy',
    'forest': 'Forest',
    'ocean': 'Ocean',
    'city': 'City'
  },
  'ja-JP': {
    'rain': 'あめ',
    'forest': 'もり',
    'ocean': 'うみ',
    'city': 'まち'
  },
  'ko-KR': {
    'rain': '비소리',
    'forest': '숲',
    'ocean': '바다',
    'city': '도시'
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
}

// 初始化i18n
function initI18n() {
  updateUIText();
  
  // 检查是否已存在语言按钮
  const existingLangBtn = document.getElementById('languageBtn');
  if (existingLangBtn) {
    // 使用已存在的语言按钮
    const langBtn = existingLangBtn;
    langBtn.title = '切换语言';
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
    langBtn.title = '切换语言';
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