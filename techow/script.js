// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initScrollAnimations();
    initParticleEffect();
    initCounterAnimation();
    initImageHoverEffects();
    initButtonEffects();
    initTimeDisplay();
    initFoodCardEffects();
});

// 滚动动画效果
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // 观察所有需要动画的元素
    document.querySelectorAll('.fade-in, .slide-in').forEach(el => {
        observer.observe(el);
    });
}

// 粒子效果
function initParticleEffect() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    canvas.style.opacity = '0.3';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.2
        };
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push(createParticle());
        }
    }

    function updateParticles() {
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        });
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity})`;
            ctx.fill();
        });

        // 连接近距离的粒子
        particles.forEach((particle1, i) => {
            particles.slice(i + 1).forEach(particle2 => {
                const distance = Math.sqrt(
                    Math.pow(particle1.x - particle2.x, 2) + 
                    Math.pow(particle1.y - particle2.y, 2)
                );

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle1.x, particle1.y);
                    ctx.lineTo(particle2.x, particle2.y);
                    ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * (1 - distance / 100)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });
        });
    }

    function animate() {
        updateParticles();
        drawParticles();
        requestAnimationFrame(animate);
    }

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });
}

// 数字计数动画
function initCounterAnimation() {
    const counters = document.querySelectorAll('.text-2xl.font-bold');
    
    const animateCounter = (element, target, suffix = '') => {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (suffix === 'm') {
                element.textContent = Math.floor(current) + 'm';
            } else if (suffix === '+') {
                element.textContent = Math.floor(current) + '+';
            } else if (suffix === ',000') {
                element.textContent = Math.floor(current).toLocaleString();
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 20);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const text = entry.target.textContent;
                if (text.includes('320m')) {
                    animateCounter(entry.target, 320, 'm');
                } else if (text.includes('85,000')) {
                    animateCounter(entry.target, 85000, ',000');
                } else if (text.includes('80+')) {
                    animateCounter(entry.target, 80, '+');
                } else if (text.includes('5,000+')) {
                    animateCounter(entry.target, 5000, '+');
                }
                observer.unobserve(entry.target);
            }
        });
    });

    counters.forEach(counter => observer.observe(counter));
}

// 图片悬停效果
function initImageHoverEffects() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// 按钮特效
function initButtonEffects() {
    const button = document.querySelector('button');
    
    if (button) {
        button.addEventListener('click', function(e) {
            // 创建波纹效果
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // 模拟直播跳转
            setTimeout(() => {
                showLiveModal();
            }, 300);
        });
    }
    
    // 添加波纹样式
    const style = document.createElement('style');
    style.textContent = `
        button {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// 显示直播模态框
function showLiveModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-md mx-4 text-center text-gray-800">
            <div class="text-6xl mb-4">🚢</div>
            <h3 class="text-2xl font-bold mb-4">直播即将开始</h3>
            <p class="mb-6">潮汕号核动力航母下水仪式将于2024年12月28日上午10:00正式开始</p>
            <div class="flex space-x-4">
                <button onclick="this.closest('.fixed').remove()" 
                        class="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors">
                    关闭
                </button>
                <button onclick="alert('直播功能开发中...')" 
                        class="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
                    预约提醒
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 点击背景关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// 实时时间显示
function initTimeDisplay() {
    const timeElements = document.querySelectorAll('[data-time]');
    
    function updateTime() {
        const now = new Date();
        const launchDate = new Date('2024-12-28T10:00:00');
        const timeDiff = launchDate - now;
        
        if (timeDiff > 0) {
            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
            
            // 如果页面有倒计时元素，更新它们
            const countdownElement = document.querySelector('#countdown');
            if (countdownElement) {
                countdownElement.textContent = `${days}天 ${hours}小时 ${minutes}分钟 ${seconds}秒`;
            }
        }
    }
    
    // 每秒更新一次
    setInterval(updateTime, 1000);
    updateTime();
}

// 添加鼠标跟随效果
document.addEventListener('mousemove', function(e) {
    const cursor = document.querySelector('.cursor-trail') || createCursorTrail();
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

function createCursorTrail() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-trail';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
    `;
    document.body.appendChild(cursor);
    return cursor;
}

// 添加键盘快捷键
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // 关闭所有模态框
        document.querySelectorAll('.fixed.inset-0').forEach(modal => modal.remove());
    }
    
    if (e.key === ' ') {
        e.preventDefault();
        // 空格键触发直播按钮
        const button = document.querySelector('button');
        if (button) button.click();
    }
});

// 添加滚动视差效果
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// 潮汕美食卡片交互效果
function initFoodCardEffects() {
    // 为美食卡片添加悬停效果
    const foodCards = document.querySelectorAll('.bg-white\\/10.backdrop-blur-sm');
    
    foodCards.forEach(card => {
        // 悬停进入效果
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) translateY(-5px)';
            this.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.3)';
            this.style.transition = 'all 0.3s ease';
            
            // 图片缩放效果
            const img = this.querySelector('img');
            if (img) {
                img.style.transform = 'scale(1.1)';
                img.style.transition = 'transform 0.3s ease';
            }
        });
        
        // 悬停离开效果
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) translateY(0)';
            this.style.boxShadow = 'none';
            
            // 图片恢复
            const img = this.querySelector('img');
            if (img) {
                img.style.transform = 'scale(1)';
            }
        });
        
        // 点击效果
        card.addEventListener('click', function() {
            // 添加点击波纹效果
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.6)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.marginLeft = '-10px';
            ripple.style.marginTop = '-10px';
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            // 移除波纹元素
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // 显示美食信息提示
            showFoodInfo(this);
        });
    });
    
    // 添加波纹动画样式
    if (!document.querySelector('#ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            .food-tooltip {
                position: fixed;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 10px 15px;
                border-radius: 8px;
                font-size: 14px;
                pointer-events: none;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .food-tooltip.show {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
}

// 显示美食信息
function showFoodInfo(card) {
    const foodName = card.querySelector('h4, h5')?.textContent;
    const foodDesc = card.querySelector('p')?.textContent;
    
    if (foodName) {
        // 创建提示框
        const tooltip = document.createElement('div');
        tooltip.className = 'food-tooltip';
        tooltip.innerHTML = `
            <strong>${foodName}</strong><br>
            ${foodDesc || '潮汕传统美食，承载着深厚的文化底蕴'}
        `;
        
        document.body.appendChild(tooltip);
        
        // 定位提示框
        const rect = card.getBoundingClientRect();
        tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
        
        // 显示提示框
        setTimeout(() => tooltip.classList.add('show'), 10);
        
        // 3秒后移除提示框
        setTimeout(() => {
            tooltip.classList.remove('show');
            setTimeout(() => tooltip.remove(), 300);
        }, 3000);
    }
}

console.log('🚢 潮汕号核动力航母宣传页面已加载完成！');