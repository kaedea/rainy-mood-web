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
  
  // 检查是否已存在语言选择器
  if (document.querySelector('.language-selector')) {
    return;
  }
  
  // 添加语言切换器
  const langSelector = document.createElement('div');
  langSelector.className = 'language-selector';
  langSelector.innerHTML = `
    <select id="language-select">
      <option value="zh-CN">中文</option>
      <option value="en-US">English</option>
      <option value="ja-JP">日本語</option>
      <option value="ko-KR">한국어</option>
    </select>
  `;
  
  // 将语言选择器添加到页面
  const container = document.querySelector('.container');
  if (container) {
    container.appendChild(langSelector);
  }
  
  // 设置当前选中语言
  const select = document.getElementById('language-select');
  if (select) {
    select.value = getUserLanguage();
    select.addEventListener('change', (e) => {
      setLanguage(e.target.value);
    });
  }
}

// 导出到全局作用域
window.i18n = {
  t,
  setLanguage,
  getUserLanguage,
  initI18n,
  updateUIText
};