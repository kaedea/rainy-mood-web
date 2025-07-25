document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const playButton = document.getElementById('playButton');
    const playIcon = playButton.querySelector('.play-icon');
    const volumeSlider = document.getElementById('volumeSlider');
    const raindropContainer = document.getElementById('raindrops');
    const glassBackground = document.querySelector('.glass-background');
    const playlistItems = document.querySelectorAll('.playlist-item');
    const timerButton = document.getElementById('timerButton');
    const timerPicker = document.getElementById('timerPicker');
    const hoursInput = document.getElementById('hoursInput');
    const minutesInput = document.getElementById('minutesInput');
    const setTimerBtn = document.getElementById('setTimer');
    const cancelTimerBtn = document.getElementById('cancelTimer');
    
    // 当前播放状态
    let isPlaying = false;
    
    // 计时器相关变量
    let countdownInterval = null;
    let endTime = null;
    
    // 当前选中的音频和背景
    let currentAudio = './audio/rain-sound.mp3';
    let currentBackground = './img/rainy-background.svg';
    
    // 创建音频对象
    const audioPlayer = new Audio(currentAudio);
    audioPlayer.loop = true; // 设置循环播放
    
    // 设置初始音量
    audioPlayer.volume = volumeSlider.value / 100;
    
    // 播放/暂停按钮点击事件
    playButton.addEventListener('click', function() {
        if (audioPlayer.paused) {
            audioPlayer.play();
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
                    audioPlayer.play();
                    playButton.classList.add('playing');
                }
            }
            
            // 更新背景图片
            if (newBackground !== currentBackground) {
                // 使用CSS过渡效果平滑切换背景
                glassBackground.style.opacity = '0';
                
                setTimeout(() => {
                    glassBackground.style.backgroundImage = `url('${newBackground}')`;
                    glassBackground.style.opacity = '1';
                    currentBackground = newBackground;
                }, 300);
            }
        });
    });
    
    // 计时器按钮点击事件 - 显示/隐藏计时器选择器
    timerButton.addEventListener('click', function() {
        // 如果正在倒计时，点击则取消倒计时
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
            endTime = null;
            timerButton.innerHTML = '<span class="infinity-icon">∞</span>';
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
                
                // 恢复无限循环图标
                timerButton.innerHTML = '<span class="infinity-icon">∞</span>';
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
        
        // 更新按钮文本
        timerButton.innerHTML = `<span class="countdown-text">${displayText}</span>`;
        
        return true;
    }
    
    // 创建雨滴效果
    function createRaindrops() {
        // 清除现有雨滴
        raindropContainer.innerHTML = '';
        
        // 根据屏幕大小确定雨滴数量
        const width = window.innerWidth;
        const height = window.innerHeight;
        const raindropsCount = Math.floor((width * height) / 10000); // 根据屏幕面积计算雨滴数量
        
        // 创建雨滴元素
        for (let i = 0; i < raindropsCount; i++) {
            createRaindrop();
        }
        
        // 定时创建新雨滴
        setInterval(createRaindrop, 300);
    }
    
    function createRaindrop() {
        const raindrop = document.createElement('div');
        raindrop.classList.add('raindrop');
        
        // 随机设置雨滴的位置、大小和动画时间
        const size = Math.random() * 5 + 2; // 2-7px
        const posX = Math.random() * 100; // 0-100%
        const delay = Math.random() * 2; // 0-2s
        const duration = Math.random() * 5 + 3; // 3-8s
        
        raindrop.style.width = `${size}px`;
        raindrop.style.height = `${size}px`;
        raindrop.style.left = `${posX}%`;
        raindrop.style.top = '-10px';
        raindrop.style.animationDelay = `${delay}s`;
        raindrop.style.animationDuration = `${duration}s`;
        
        raindropContainer.appendChild(raindrop);
        
        // 动画结束后移除雨滴
        setTimeout(() => {
            raindrop.remove();
        }, (delay + duration) * 1000);
    }
    
    // 创建雨滴轨迹效果
    function createRainStreaks() {
        const streaksCount = 15; // 轨迹数量
        
        for (let i = 0; i < streaksCount; i++) {
            setTimeout(() => {
                createRainStreak();
            }, i * 200); // 错开创建时间
        }
        
        // 定时创建新轨迹
        setInterval(createRainStreak, 5000);
    }
    
    function createRainStreak() {
        const streak = document.createElement('div');
        streak.classList.add('raindrop');
        
        // 设置轨迹样式
        const width = Math.random() * 2 + 1; // 1-3px
        const height = Math.random() * 100 + 100; // 100-200px
        const posX = Math.random() * 100; // 0-100%
        const posY = Math.random() * 50; // 0-50%
        const duration = Math.random() * 3 + 2; // 2-5s
        
        streak.style.width = `${width}px`;
        streak.style.height = `${height}px`;
        streak.style.left = `${posX}%`;
        streak.style.top = `${posY}%`;
        streak.style.opacity = '0.7';
        streak.style.borderRadius = '0';
        streak.style.animationDuration = `${duration}s`;
        
        raindropContainer.appendChild(streak);
        
        // 动画结束后移除轨迹
        setTimeout(() => {
            streak.remove();
        }, duration * 1000);
    }
    
    // 窗口大小变化时重新创建雨滴
    window.addEventListener('resize', createRaindrops);
    
    // 初始化
    createRaindrops();
    createRainStreaks();
});