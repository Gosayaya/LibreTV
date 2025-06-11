// 推荐内容管理器 - 统一管理豆瓣和IMDB推荐
class RecommendationManager {
    constructor() {
        this.currentTab = 'douban'; // 默认显示豆瓣
        this.initEventListeners();
        this.loadSettings();
    }

    initEventListeners() {
        // 选项卡切换事件
        const doubanTab = document.getElementById('rec-douban-tab');
        const imdbTab = document.getElementById('rec-imdb-tab');

        if (doubanTab) {
            doubanTab.addEventListener('click', () => {
                this.switchTab('douban');
            });
        }

        if (imdbTab) {
            imdbTab.addEventListener('click', () => {
                this.switchTab('imdb');
            });
        }
    }

    switchTab(tab) {
        if (this.currentTab === tab) return;

        this.currentTab = tab;
        this.saveSettings();

        // 更新选项卡样式
        this.updateTabStyles();

        // 切换内容显示
        this.updateContentVisibility();

        // 加载对应内容
        this.loadCurrentTabContent();
    }

    updateTabStyles() {
        const doubanTab = document.getElementById('rec-douban-tab');
        const imdbTab = document.getElementById('rec-imdb-tab');

        if (this.currentTab === 'douban') {
            doubanTab.classList.add('bg-pink-600', 'text-white');
            doubanTab.classList.remove('text-gray-400');
            imdbTab.classList.remove('bg-yellow-600', 'text-white');
            imdbTab.classList.add('text-gray-400');
        } else {
            imdbTab.classList.add('bg-yellow-600', 'text-white');
            imdbTab.classList.remove('text-gray-400');
            doubanTab.classList.remove('bg-pink-600', 'text-white');
            doubanTab.classList.add('text-gray-400');
        }
    }

    updateContentVisibility() {
        const doubanContent = document.getElementById('douban-content');
        const imdbContent = document.getElementById('imdb-content');

        if (this.currentTab === 'douban') {
            doubanContent.classList.remove('hidden');
            imdbContent.classList.add('hidden');
        } else {
            imdbContent.classList.remove('hidden');
            doubanContent.classList.add('hidden');
        }
    }

    loadCurrentTabContent() {
        if (this.currentTab === 'douban') {
            // 触发豆瓣内容加载
            if (typeof renderRecommend === 'function') {
                renderRecommend(window.doubanCurrentTag || '热门', window.doubanPageSize || 24, window.doubanPageStart || 0);
            }
        } else if (this.currentTab === 'imdb') {
            // 触发IMDB内容加载
            if (window.imdbRecommendation && typeof window.imdbRecommendation.loadRecommendations === 'function') {
                window.imdbRecommendation.loadRecommendations();
            }
        }
    }

    // 初始化时加载默认内容
    initializeDefaultContent() {
        const doubanEnabled = localStorage.getItem('doubanEnabled') === 'true';
        const imdbEnabled = localStorage.getItem('imdbEnabled') === 'true';
        
        // 优先显示豆瓣推荐
        if (doubanEnabled) {
            this.switchTab('douban');
            // 延迟加载豆瓣内容，确保DOM已准备就绪
            setTimeout(() => {
                if (typeof renderRecommend === 'function') {
                    renderRecommend('热门', 24, 0);
                }
            }, 200);
        } else if (imdbEnabled) {
            this.switchTab('imdb');
            setTimeout(() => {
                if (window.imdbRecommendation && typeof window.imdbRecommendation.loadRecommendations === 'function') {
                    window.imdbRecommendation.loadRecommendations();
                }
            }, 200);
        }
    }

    // 根据设置更新推荐区域的显示状态
    updateVisibility() {
        const recommendationArea = document.getElementById('recommendationArea');
        if (!recommendationArea) return;

        const doubanEnabled = localStorage.getItem('doubanEnabled') === 'true';
        const imdbEnabled = localStorage.getItem('imdbEnabled') === 'true';
        const isSearching = document.getElementById('resultsArea') && 
            !document.getElementById('resultsArea').classList.contains('hidden');

        // 只有在至少一个推荐源启用且没有搜索结果显示时才显示推荐区域
        if ((doubanEnabled || imdbEnabled) && !isSearching) {
            recommendationArea.classList.remove('hidden');
            
            // 根据启用状态确定默认选项卡，优先豆瓣
            if (doubanEnabled) {
                this.switchTab('douban');
            } else if (imdbEnabled) {
                this.switchTab('imdb');
            }
            
            // 更新选项卡可见性
            this.updateTabVisibility();
            
            // 初始化默认内容
            this.initializeDefaultContent();
        } else {
            recommendationArea.classList.add('hidden');
        }
    }

    updateTabVisibility() {
        const doubanTab = document.getElementById('rec-douban-tab');
        const imdbTab = document.getElementById('rec-imdb-tab');
        const doubanEnabled = localStorage.getItem('doubanEnabled') === 'true';
        const imdbEnabled = localStorage.getItem('imdbEnabled') === 'true';

        // 显示/隐藏选项卡
        if (doubanTab) {
            doubanTab.style.display = doubanEnabled ? 'block' : 'none';
        }
        
        if (imdbTab) {
            imdbTab.style.display = imdbEnabled ? 'block' : 'none';
        }

        // 如果只有一个选项卡，隐藏整个选项卡容器
        const tabContainer = document.querySelector('#recommendationArea .mb-6');
        if (tabContainer) {
            const visibleTabs = (doubanEnabled ? 1 : 0) + (imdbEnabled ? 1 : 0);
            tabContainer.style.display = visibleTabs > 1 ? 'block' : 'none';
        }
    }

    loadSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem('recommendation-settings') || '{}');
            this.currentTab = settings.currentTab || 'douban';
        } catch (error) {
            console.error('加载推荐设置失败:', error);
            this.currentTab = 'douban';
        }
    }

    saveSettings() {
        try {
            const settings = {
                currentTab: this.currentTab
            };
            localStorage.setItem('recommendation-settings', JSON.stringify(settings));
        } catch (error) {
            console.error('保存推荐设置失败:', error);
        }
    }
}

// 全局推荐管理器实例
let recommendationManager;

// 初始化推荐管理器
function initRecommendationManager() {
    recommendationManager = new RecommendationManager();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initRecommendationManager();
        
        // 确保默认显示豆瓣推荐（如果启用）
        if (recommendationManager) {
            recommendationManager.updateVisibility();
        }
    }, 100);
}); 