// Cookie 工具函数
function setCookie(name, value, days = 30) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

document.addEventListener('DOMContentLoaded', function() {
    // 初始化国际化
    if (window.i18n) {
        window.i18n.initI18n();
    }
    // 获取DOM元素
    const playButton = document.getElementById('playButton');
    const playIcon = playButton.querySelector('.play-icon');
    const volumeSlider = document.getElementById('volumeSlider');
    const canvas = document.getElementById('raindrop-canvas');
    const glassBackground = document.querySelector('.glass-background');
    const playlistItems = document.querySelectorAll('.playlist-item');
    const timerButton = document.getElementById('timerButton');
    const timerPicker = document.getElementById('timerPicker');
    const hoursInput = document.getElementById('hoursInput');
    const minutesInput = document.getElementById('minutesInput');
    const setTimerBtn = document.getElementById('setTimer');
    const cancelTimerBtn = document.getElementById('cancelTimer');
    const volumeDisplay = document.getElementById('volumeDisplay');
    const countdownDisplay = document.getElementById('countdownDisplay');
    
    // 从cookie恢复设置
    const savedVolume = getCookie('volume');
    if (savedVolume) {
        volumeSlider.value = savedVolume;
    }
    
    const savedAudio = getCookie('selectedAudio');
    const savedBackground = getCookie('selectedBackground');
    
    // 初始化音量显示
    volumeDisplay.textContent = volumeSlider.value;
    // 初始化倒计时显示
    countdownDisplay.classList.add('hidden');
    
    // 初始化 raindrop-fx
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // 当前播放状态
    let isPlaying = false;
    
    // 计时器相关变量
    let countdownInterval = null;
    let endTime = null;
    
    // 当前选中的音频和背景
    let currentAudio = savedAudio || './audio/rain-sound.mp3';
    let currentBackground = savedBackground || './img/rainy-background.svg';

    // 初始化设备相关的UI
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const favoriteBtn = document.getElementById('favoriteBtn');
    const mobileShareBtn = document.getElementById('mobileShareBtn');
    const copyLinkBtn = document.querySelector('[data-share="copy"]');
    
    if (isMobile) {
        // 移动端：复制、分享
        if (copyLinkBtn) copyLinkBtn.style.display = 'block';
        if (favoriteBtn) favoriteBtn.style.display = 'none';
        if (mobileShareBtn) mobileShareBtn.style.display = 'block';
    } else {
        // 桌面端：复制、收藏、分享
        if (copyLinkBtn) copyLinkBtn.style.display = 'block';
        if (favoriteBtn) favoriteBtn.style.display = 'block';
        if (mobileShareBtn) mobileShareBtn.style.display = 'block';
    }

    // 初始化 raindrop-fx
    let raindropFx;
    const backgroundImage = new Image();
    backgroundImage.src = currentBackground;
    backgroundImage.onload = () => {
        raindropFx = new RaindropFX({
            canvas: canvas,
            background: backgroundImage,
        });
        raindropFx.start();
    };
    
    // 创建音频对象
    const audioPlayer = new Audio();
    audioPlayer.loop = true; // 设置循环播放
    
    // 设置初始音量
    audioPlayer.volume = (savedVolume || volumeSlider.value) / 100;
    
    // 添加错误处理
    audioPlayer.onerror = function() {
        console.warn('音频文件加载失败: ' + currentAudio);
        alert('音频文件未找到，请按照 audio/README.md 中的说明添加音频文件。');
    };
    
    // 恢复播放列表选中状态
    if (savedAudio) {
        playlistItems.forEach(item => {
            if ('./audio/' + item.getAttribute('data-audio') === savedAudio) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    // 尝试加载音频
    audioPlayer.src = currentAudio;
    
    // 播放/暂停按钮点击事件
    playButton.addEventListener('click', function() {
        if (audioPlayer.paused) {
            audioPlayer.play().catch(error => {
                console.error('播放失败:', error);
            });
            playButton.classList.add('playing');
            isPlaying = true;
        } else {
            audioPlayer.pause();
            playButton.classList.remove('playing');
            isPlaying = false;
        }
    });
    
    // 音量控制
    volumeSlider.addEventListener('input', function() {
        audioPlayer.volume = this.value / 100;
        volumeDisplay.textContent = this.value;
        setCookie('volume', this.value);
    });
    
    // 播放列表项点击事件
    playlistItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有项的active类
            playlistItems.forEach(i => i.classList.remove('active'));
            
            // 为当前点击项添加active类
            this.classList.add('active');
            
            // 获取音频和背景数据
            const newAudio = './audio/' + this.getAttribute('data-audio');
            const newBackground = './img/' + this.getAttribute('data-background');
            
            // 如果音频发生变化，则切换音频
            if (newAudio !== currentAudio) {
                // 保存当前播放状态
                const wasPlaying = !audioPlayer.paused;
                
                // 暂停当前音频
                audioPlayer.pause();
                
                // 更新音频源
                audioPlayer.src = newAudio;
                currentAudio = newAudio;
                
                // 如果之前在播放，则继续播放新音频
                if (wasPlaying) {
                    audioPlayer.play().catch(error => {
                        console.error('播放失败:', error);
                    });
                    playButton.classList.add('playing');
                }
            }
            
            // 更新背景图片
            if (newBackground !== currentBackground) {
                // 使用CSS过渡效果平滑切换背景
                glassBackground.style.opacity = '0';
                
                setTimeout(() => {
                    const newBgImage = new Image();
                    newBgImage.src = newBackground;
                    newBgImage.onload = () => {
                        raindropFx.setBackground(newBgImage);
                        
                        glassBackground.style.backgroundImage = `url('${newBackground}')`;
                        glassBackground.style.opacity = '1';
                        currentBackground = newBackground;
                        setCookie('selectedBackground', newBackground);
                    };
                }, 300);
            }
            
            // 保存音频选择到cookie
            setCookie('selectedAudio', newAudio);
        });
    });
    
    // 计时器按钮点击事件 - 显示/隐藏计时器选择器
    timerButton.addEventListener('click', function() {
        // 如果正在倒计时，点击则取消倒计时
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
            endTime = null;
            countdownDisplay.classList.add('hidden');
            return;
        }
        
        // 显示/隐藏计时器选择器
        timerPicker.classList.toggle('show');
    });
    
    // 点击页面其他区域关闭计时器选择器
    document.addEventListener('click', function(event) {
        if (!timerButton.contains(event.target) && !timerPicker.contains(event.target)) {
            timerPicker.classList.remove('show');
        }
    });
    
    // 设置计时器按钮点击事件
    setTimerBtn.addEventListener('click', function() {
        const hours = parseInt(hoursInput.value) || 0;
        const minutes = parseInt(minutesInput.value) || 0;
        
        // 检查时间是否有效（至少1分钟）
        if (hours === 0 && minutes === 0) {
            alert('请至少设置1分钟的时间');
            return;
        }
        
        // 计算结束时间
        const totalMilliseconds = (hours * 60 * 60 + minutes * 60) * 1000;
        endTime = Date.now() + totalMilliseconds;
        
        // 开始倒计时
        startCountdown();
        
        // 隐藏计时器选择器
        timerPicker.classList.remove('show');
    });
    
    // 取消计时器按钮点击事件
    cancelTimerBtn.addEventListener('click', function() {
        timerPicker.classList.remove('show');
    });
    
    // 开始倒计时函数
    function startCountdown() {
        // 清除之前的倒计时
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
        
        // 显示 countdownDisplay
        countdownDisplay.classList.remove('hidden');
        // 更新倒计时显示
        updateCountdownDisplay();
        
        // 设置倒计时间隔
        countdownInterval = setInterval(() => {
            // 更新倒计时显示
            if (!updateCountdownDisplay()) {
                // 倒计时结束
                clearInterval(countdownInterval);
                countdownInterval = null;
                endTime = null;
                
                // 停止音频播放
                audioPlayer.pause();
                playButton.classList.remove('playing');
                isPlaying = false;
                
                // 隐藏显示
                countdownDisplay.classList.add('hidden');
            }
        }, 1000);
    }
    
    // 更新倒计时显示函数
    function updateCountdownDisplay() {
        if (!endTime) return false;
        
        const now = Date.now();
        const timeLeft = endTime - now;
        
        // 检查倒计时是否结束
        if (timeLeft <= 0) {
            countdownDisplay.classList.add('hidden');
            return false;
        }
        
        // 计算剩余时间
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        // 格式化时间显示
        let displayText = '';
        if (hours > 0) {
            displayText += `${hours}:`;
        }
        displayText += `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // 更新倒计时显示
countdownDisplay.textContent = displayText;
        
        return true;
    }
    
    // 轻量级分享和捐款功能
    const shareBtn = document.getElementById('shareBtn');
    const donateBtn = document.getElementById('donateBtn');
    const shareDropdown = document.getElementById('shareDropdown');
    const donateDropdown = document.getElementById('donateDropdown');
    
    // Tooltip自动隐藏功能
    let tooltipTimeout = null;
    
    function hideTooltips() {
        const tooltips = document.querySelectorAll('.utility-btn[data-tooltip]');
        tooltips.forEach(btn => {
            btn.style.setProperty('--tooltip-opacity', '0');
            btn.style.setProperty('--tooltip-visibility', 'hidden');
        });
    }
    
    function showTooltip(btn) {
        // 清除之前的定时器
        if (tooltipTimeout) {
            clearTimeout(tooltipTimeout);
        }
        
        // 显示tooltip
        btn.style.setProperty('--tooltip-opacity', '1');
        btn.style.setProperty('--tooltip-visibility', 'visible');
        
        // 2 秒后隐藏tooltip
        tooltipTimeout = setTimeout(() => {
            hideTooltips();
        }, 1500);
    }
    
    // 分享按钮点击事件
    shareBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        shareDropdown.classList.toggle('show');
        donateDropdown.classList.remove('show');
    });
    
    // 捐款按钮点击事件
    donateBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        donateDropdown.classList.toggle('show');
        shareDropdown.classList.remove('show');
    });
    
    // 分享选项点击事件
    document.querySelectorAll('.utility-option').forEach(option => {
        if (option.closest('#shareDropdown')) {
            option.addEventListener('click', function() {
                const action = this.getAttribute('data-share');
                
                if (action === 'copy') {
                    navigator.clipboard.writeText(window.location.href).then(() => {
                        // 使用更轻量的提示方式
                        this.textContent = '✅ 已复制';
                        setTimeout(() => {
                            this.textContent = '🔗 复制链接';
                        }, 1500);
                    }).catch(() => {
                        const tempInput = document.createElement('input');
                        tempInput.value = window.location.href;
                        document.body.appendChild(tempInput);
                        tempInput.select();
                        document.execCommand('copy');
                        document.body.removeChild(tempInput);
                        this.textContent = '✅ 已复制';
                        setTimeout(() => {
                            this.textContent = '🔗 复制链接';
                        }, 1500);
                    });
                } else if (action === 'favorite') {
                    // 桌面端显示收藏快捷键
                    const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
                    const shortcut = isMac ? 'CMD + D' : 'Ctrl + D';
                    alert(`您可以通过 ${shortcut} 快捷键收藏本页面`);
                } else if (action === 'mobile-share') {
                    // 移动端分享功能
                    if (navigator.share) {
                        navigator.share({
                            title: document.title,
                            url: window.location.href
                        }).catch(err => {
                            console.log('分享取消:', err);
                        });
                    } else {
                        // 降级方案：复制链接
                        navigator.clipboard.writeText(window.location.href).then(() => {
                            this.textContent = '✅ 已复制链接';
                            setTimeout(() => {
                                this.textContent = '🔗 分享';
                            }, 1500);
                        });
                    }
                }
                
                setTimeout(() => {
                    shareDropdown.classList.remove('show');
                }, 1500);
            });
        }
    });
    
    // 捐款选项点击事件
    document.querySelectorAll('.utility-option').forEach(option => {
        if (option.closest('#donateDropdown')) {
            option.addEventListener('click', function() {
                const method = this.getAttribute('data-donate');
                
                if (method === 'wechat' || method === 'alipay') {
                    // 显示二维码模态框
                    const qrModal = document.getElementById('qrModal');
                    const qrImage = document.getElementById('qrImage');
                    const qrTitle = document.getElementById('qrTitle');
                    
                    if (method === 'wechat') {
                        qrImage.src = './img/qr-wechat.png';
                        qrTitle.textContent = 'WeChat';
                    } else if (method === 'alipay') {
                        qrImage.src = './img/qr-alipay.jpg';
                        qrTitle.textContent = 'Alipay';
                    }
                    
                    qrModal.classList.add('show');
                } else if (method === 'paypal') {
                    // PayPal 保持外部链接
                    window.open('https://www.paypal.me/xiaoffengxie', '_blank');
                } else {
                    this.textContent = '⏳ 即将上线';
                    setTimeout(() => {
                        this.textContent = method === 'paypal' ? '💳 PayPal' : 
                                         method === 'wechat' ? '📱 微信' : '💰 支付宝';
                    }, 1500);
                }
                
                donateDropdown.classList.remove('show');
            });
        }
    });
    
    // 二维码模态框关闭事件
    const qrModal = document.getElementById('qrModal');
    const qrClose = document.querySelector('.qr-close');
    
    if (qrClose) {
        qrClose.addEventListener('click', function() {
            qrModal.classList.remove('show');
        });
    }
    
    // 点击模态框外部关闭
    if (qrModal) {
        qrModal.addEventListener('click', function(e) {
            if (e.target === qrModal) {
                qrModal.classList.remove('show');
            }
        });
    }
    
    // ESC键关闭模态框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && qrModal && qrModal.classList.contains('show')) {
            qrModal.classList.remove('show');
        }
    });
    
    // 添加tooltip自动隐藏功能到所有按钮
    const tooltipButtons = document.querySelectorAll('.utility-btn[data-tooltip]');
    tooltipButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            showTooltip(this);
        });
        
        button.addEventListener('mouseleave', function() {
            // 鼠标离开时，如果定时器还在运行，不清除它
            // 让tooltip在3秒后自动隐藏
        });
        
        // 点击按钮时立即隐藏所有tooltips
        button.addEventListener('click', function() {
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            if (!isMobile) {
                hideTooltips();
                if (tooltipTimeout) {
                    clearTimeout(tooltipTimeout);
                }
            }
        });
    });
    
    // 点击页面其他区域关闭下拉菜单
    document.addEventListener('click', function() {
        shareDropdown.classList.remove('show');
        donateDropdown.classList.remove('show');
    });
    
    // 窗口大小变化时调整 canvas 大小
    window.addEventListener('resize', () => {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        if (raindropFx) {
            raindropFx.resize(rect.width, rect.height);
        }
    });
});