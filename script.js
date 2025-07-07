// 应用程序主类
class RAGFlowApp {
    constructor() {
        this.iframe = null;
        this.loadingOverlay = null;
        this.modal = null;
        this.modalIframe = null;
        this.isFullscreen = false;
        
        this.init();
    }

    // 初始化应用
    init() {
        this.setupElements();
        this.setupEventListeners();
        this.setupIframeLoading();
        this.setupAnimations();
    }

    // 设置DOM元素引用
    setupElements() {
        this.iframe = document.getElementById('ragflowIframe');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.modal = document.getElementById('fullscreenModal');
        this.modalIframe = document.getElementById('modalIframe');
        this.fullscreenBtn = document.getElementById('fullscreenBtn');
        this.refreshBtn = document.getElementById('refreshBtn');
        this.closeModalBtn = document.getElementById('closeModal');
    }

    // 设置事件监听器
    setupEventListeners() {
        // 全屏按钮
        this.fullscreenBtn.addEventListener('click', () => {
            this.toggleFullscreen();
        });

        // 刷新按钮
        this.refreshBtn.addEventListener('click', () => {
            this.refreshIframe();
        });

        // 关闭模态框
        this.closeModalBtn.addEventListener('click', () => {
            this.closeFullscreen();
        });

        // 点击模态框背景关闭
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeFullscreen();
            }
        });

        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isFullscreen) {
                this.closeFullscreen();
            }
            if (e.key === 'F11') {
                e.preventDefault();
                this.toggleFullscreen();
            }
        });

        // 窗口大小变化
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // 页面可见性变化
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
    }

    // 设置iframe加载状态
    setupIframeLoading() {
        // 显示加载状态
        this.showLoading();

        // iframe加载完成
        this.iframe.addEventListener('load', () => {
            this.hideLoading();
        });

        // iframe加载错误
        this.iframe.addEventListener('error', () => {
            this.handleIframeError();
        });

        // 设置超时检查
        setTimeout(() => {
            if (!this.iframe.contentDocument && this.loadingOverlay && !this.loadingOverlay.classList.contains('hidden')) {
                this.handleIframeTimeout();
            }
        }, 15000); // 15秒超时
    }

    // 设置页面动画
    setupAnimations() {
        // 页面加载动画
        this.animatePageLoad();
        
        // 设置视差效果
        this.setupParallax();
        
        // 设置按钮动画
        this.setupButtonAnimations();
    }

    // 显示加载状态
    showLoading() {
        if (this.loadingOverlay) {
            this.loadingOverlay.classList.remove('hidden');
        }
    }

    // 隐藏加载状态
    hideLoading() {
        if (this.loadingOverlay) {
            setTimeout(() => {
                this.loadingOverlay.classList.add('hidden');
            }, 500);
        }
    }

    // 处理iframe错误
    handleIframeError() {
        console.error('iframe加载失败');
        if (this.loadingOverlay) {
            this.loadingOverlay.innerHTML = `
                <div class="error-content">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    <h3>连接失败</h3>
                    <p>无法连接到AI助手，请检查网络连接或稍后重试</p>
                    <button onclick="window.ragflowApp.refreshIframe()" class="retry-btn">重试</button>
                </div>
            `;
        }
    }

    // 处理iframe超时
    handleIframeTimeout() {
        console.warn('iframe加载超时');
        this.handleIframeError();
    }

    // 刷新iframe
    refreshIframe() {
        this.showLoading();
        
        // 重新设置iframe源
        const currentSrc = this.iframe.src;
        this.iframe.src = '';
        
        setTimeout(() => {
            this.iframe.src = currentSrc;
        }, 100);

        // 添加刷新动画
        this.addRefreshAnimation();
    }

    // 添加刷新动画
    addRefreshAnimation() {
        this.refreshBtn.style.animation = 'spin 1s linear';
        setTimeout(() => {
            this.refreshBtn.style.animation = '';
        }, 1000);
    }

    // 切换全屏
    toggleFullscreen() {
        if (this.isFullscreen) {
            this.closeFullscreen();
        } else {
            this.openFullscreen();
        }
    }

    // 打开全屏
    openFullscreen() {
        this.isFullscreen = true;
        this.modal.classList.add('active');
        this.modalIframe.src = this.iframe.src;
        
        // 禁用body滚动
        document.body.style.overflow = 'hidden';
        
        // 添加打开动画
        this.modal.style.animation = 'fadeIn 0.3s ease';
    }

    // 关闭全屏
    closeFullscreen() {
        this.isFullscreen = false;
        this.modal.classList.remove('active');
        this.modalIframe.src = '';
        
        // 恢复body滚动
        document.body.style.overflow = '';
        
        // 添加关闭动画
        this.modal.style.animation = 'fadeOut 0.3s ease';
    }

    // 处理窗口大小变化
    handleResize() {
        // 响应式调整
        if (window.innerWidth < 768) {
            this.adjustMobileLayout();
        } else {
            this.adjustDesktopLayout();
        }
    }

    // 调整移动端布局
    adjustMobileLayout() {
        const iframeWrapper = document.querySelector('.iframe-wrapper');
        if (iframeWrapper) {
            iframeWrapper.style.height = `${window.innerHeight - 320}px`;
        }
    }

    // 调整桌面端布局
    adjustDesktopLayout() {
        const iframeWrapper = document.querySelector('.iframe-wrapper');
        if (iframeWrapper) {
            iframeWrapper.style.height = `${window.innerHeight - 280}px`;
        }
    }

    // 处理页面可见性变化
    handleVisibilityChange() {
        if (document.hidden) {
            // 页面隐藏时的处理
            this.pauseAnimations();
        } else {
            // 页面显示时的处理
            this.resumeAnimations();
        }
    }

    // 暂停动画
    pauseAnimations() {
        const animatedElements = document.querySelectorAll('.status-dot, .loading-spinner');
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    }

    // 恢复动画
    resumeAnimations() {
        const animatedElements = document.querySelectorAll('.status-dot, .loading-spinner');
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }

    // 页面加载动画
    animatePageLoad() {
        const elements = document.querySelectorAll('.header, .chat-container, .footer');
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    // 设置视差效果
    setupParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            document.body.style.backgroundPosition = `center ${rate}px`;
        });
    }

    // 设置按钮动画
    setupButtonAnimations() {
        const buttons = document.querySelectorAll('.control-btn, .footer-link');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
            });
        });
    }

    // 显示通知
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // 自动移除通知
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // 检查网络连接
    checkNetworkConnection() {
        if (!navigator.onLine) {
            this.showNotification('网络连接已断开，请检查您的网络设置', 'error');
            return false;
        }
        return true;
    }

    // 性能监控
    monitorPerformance() {
        // 监控页面加载时间
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`页面加载时间: ${loadTime.toFixed(2)}ms`);
            
            if (loadTime > 3000) {
                this.showNotification('页面加载较慢，建议检查网络连接', 'warning');
            }
        });
    }

    // 错误处理
    handleGlobalErrors() {
        window.addEventListener('error', (e) => {
            console.error('全局错误:', e.error);
            this.showNotification('发生了一些错误，请刷新页面重试', 'error');
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('未处理的Promise拒绝:', e.reason);
            this.showNotification('连接异常，请检查网络状态', 'error');
        });
    }

    // 自动保存用户偏好
    saveUserPreferences() {
        const preferences = {
            lastVisit: new Date().toISOString(),
            screenSize: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            userAgent: navigator.userAgent
        };

        // 这里可以发送到服务器或存储在本地
        console.log('用户偏好已保存:', preferences);
    }

    // 添加键盘快捷键
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl + R 刷新iframe
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                this.refreshIframe();
            }
            
            // Ctrl + F 全屏
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                this.toggleFullscreen();
            }
        });
    }

    // 检测设备类型
    detectDeviceType() {
        const userAgent = navigator.userAgent.toLowerCase();
        const isMobile = /mobile|android|iphone|ipad|tablet/.test(userAgent);
        const isTablet = /tablet|ipad/.test(userAgent);
        
        document.body.classList.add(isMobile ? 'mobile-device' : 'desktop-device');
        if (isTablet) {
            document.body.classList.add('tablet-device');
        }
        
        return {
            isMobile,
            isTablet,
            isDesktop: !isMobile && !isTablet
        };
    }

    // 优化iframe性能
    optimizeIframePerformance() {
        // 懒加载iframe
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const iframe = entry.target;
                    if (!iframe.src) {
                        iframe.src = iframe.dataset.src;
                    }
                    observer.unobserve(iframe);
                }
            });
        });

        observer.observe(this.iframe);
    }

    // 添加鼠标跟踪效果
    setupMouseTracker() {
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            // 创建跟踪点
            const tracker = document.createElement('div');
            tracker.className = 'mouse-tracker';
            tracker.style.left = mouseX + 'px';
            tracker.style.top = mouseY + 'px';
            
            document.body.appendChild(tracker);
            
            // 移除跟踪点
            setTimeout(() => {
                tracker.remove();
            }, 1000);
        });
    }

    // 添加平滑滚动
    setupSmoothScroll() {
        document.documentElement.style.scrollBehavior = 'smooth';
    }

    // 初始化所有功能
    initializeAllFeatures() {
        this.checkNetworkConnection();
        this.monitorPerformance();
        this.handleGlobalErrors();
        this.setupKeyboardShortcuts();
        this.detectDeviceType();
        this.optimizeIframePerformance();
        this.setupMouseTracker();
        this.setupSmoothScroll();
        this.saveUserPreferences();
    }
}

// 工具函数
const Utils = {
    // 防抖函数
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // 节流函数
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // 格式化时间
    formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    },

    // 检查是否支持某个功能
    supportsFeature(feature) {
        const features = {
            webgl: () => {
                try {
                    const canvas = document.createElement('canvas');
                    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
                } catch (e) {
                    return false;
                }
            },
            webrtc: () => {
                return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
            },
            localStorage: () => {
                try {
                    const test = 'test';
                    localStorage.setItem(test, test);
                    localStorage.removeItem(test);
                    return true;
                } catch (e) {
                    return false;
                }
            }
        };

        return features[feature] ? features[feature]() : false;
    }
};

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    // 创建应用实例
    window.ragflowApp = new RAGFlowApp();
    
    // 初始化所有功能
    window.ragflowApp.initializeAllFeatures();
    
    // 显示欢迎信息
    console.log('RAGFlow AI助手已启动');
    console.log('支持的功能:', {
        webgl: Utils.supportsFeature('webgl'),
        webrtc: Utils.supportsFeature('webrtc'),
        localStorage: Utils.supportsFeature('localStorage')
    });
});

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
    if (window.ragflowApp) {
        window.ragflowApp.saveUserPreferences();
    }
});