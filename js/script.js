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

    // 创建 raindrop-fx 实例
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