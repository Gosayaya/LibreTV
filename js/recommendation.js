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
        const tmdbTab = document.getElementById('rec-tmdb-tab');
        const tvmazeTab = document.getElementById('rec-tvmaze-tab');

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

        if (tmdbTab) {
            tmdbTab.addEventListener('click', () => {
                this.switchTab('tmdb');
            });
        }

        if (tvmazeTab) {
            tvmazeTab.addEventListener('click', () => {
                this.switchTab('tvmaze');
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
        const tabs = {
            douban: { element: document.getElementById('rec-douban-tab'), activeClass: 'bg-pink-600' },
            imdb: { element: document.getElementById('rec-imdb-tab'), activeClass: 'bg-yellow-600' },
            tmdb: { element: document.getElementById('rec-tmdb-tab'), activeClass: 'bg-blue-600' },
            tvmaze: { element: document.getElementById('rec-tvmaze-tab'), activeClass: 'bg-orange-600' }
        };

        // 重置所有选项卡样式
        Object.values(tabs).forEach(tab => {
            if (tab.element) {
                tab.element.classList.remove('bg-pink-600', 'bg-yellow-600', 'bg-blue-600', 'bg-orange-600', 'text-white');
                tab.element.classList.add('text-gray-400');
            }
        });

        // 激活当前选项卡
        const currentTab = tabs[this.currentTab];
        if (currentTab && currentTab.element) {
            currentTab.element.classList.add(currentTab.activeClass, 'text-white');
            currentTab.element.classList.remove('text-gray-400');
        }
    }

    updateContentVisibility() {
        const contents = {
            douban: document.getElementById('douban-content'),
            imdb: document.getElementById('imdb-content'),
            tmdb: document.getElementById('tmdb-content'),
            tvmaze: document.getElementById('tvmaze-content')
        };

        // 隐藏所有内容面板
        Object.values(contents).forEach(content => {
            if (content) content.classList.add('hidden');
        });

        // 显示当前选中的内容面板
        const currentContent = contents[this.currentTab];
        if (currentContent) {
            currentContent.classList.remove('hidden');
        }
    }

    loadCurrentTabContent() {
        switch (this.currentTab) {
            case 'douban':
                // 触发豆瓣内容加载
                if (typeof renderRecommend === 'function') {
                    renderRecommend(window.doubanCurrentTag || '热门', window.doubanPageSize || 24, window.doubanPageStart || 0);
                }
                break;
            case 'imdb':
                // 触发IMDB内容加载
                if (window.imdbRecommendation && typeof window.imdbRecommendation.loadRecommendations === 'function') {
                    window.imdbRecommendation.loadRecommendations();
                }
                break;
            case 'tmdb':
                // 触发TMDB内容加载
                if (window.tmdbRecommendation && typeof window.tmdbRecommendation.loadRecommendations === 'function') {
                    window.tmdbRecommendation.loadRecommendations();
                }
                break;
            case 'tvmaze':
                // 触发TVMaze内容加载
                if (window.tvmazeRecommendation && typeof window.tvmazeRecommendation.loadRecommendations === 'function') {
                    window.tvmazeRecommendation.loadRecommendations();
                }
                break;
        }
    }

    // 初始化时加载默认内容
    initializeDefaultContent() {
        const enabledSources = [
            { name: 'douban', enabled: localStorage.getItem('doubanEnabled') === 'true' },
            { name: 'imdb', enabled: localStorage.getItem('imdbEnabled') === 'true' },
            { name: 'tmdb', enabled: localStorage.getItem('tmdbEnabled') === 'true' },
            { name: 'tvmaze', enabled: localStorage.getItem('tvmazeEnabled') === 'true' }
        ];
        
        // 查找第一个启用的数据源，优先级：豆瓣 > IMDB > TMDB > TVMaze
        const firstEnabled = enabledSources.find(source => source.enabled);
        
        if (firstEnabled) {
            this.switchTab(firstEnabled.name);
            
            // 延迟加载内容，确保DOM已准备就绪
            setTimeout(() => {
                this.loadCurrentTabContent();
            }, 200);
        }
    }

    // 根据设置更新推荐区域的显示状态
    updateVisibility() {
        const recommendationArea = document.getElementById('recommendationArea');
        if (!recommendationArea) return;

        const enabledSources = [
            localStorage.getItem('doubanEnabled') === 'true',
            localStorage.getItem('imdbEnabled') === 'true', 
            localStorage.getItem('tmdbEnabled') === 'true',
            localStorage.getItem('tvmazeEnabled') === 'true'
        ];
        
        const anyEnabled = enabledSources.some(enabled => enabled);
        const isSearching = document.getElementById('resultsArea') && 
            !document.getElementById('resultsArea').classList.contains('hidden');

        // 只有在至少一个推荐源启用且没有搜索结果显示时才显示推荐区域
        if (anyEnabled && !isSearching) {
            recommendationArea.classList.remove('hidden');
            
            // 更新选项卡可见性
            this.updateTabVisibility();
            
            // 初始化默认内容
            this.initializeDefaultContent();
        } else {
            recommendationArea.classList.add('hidden');
        }
    }

    updateTabVisibility() {
        const tabs = {
            'rec-douban-tab': localStorage.getItem('doubanEnabled') === 'true',
            'rec-imdb-tab': localStorage.getItem('imdbEnabled') === 'true',
            'rec-tmdb-tab': localStorage.getItem('tmdbEnabled') === 'true',
            'rec-tvmaze-tab': localStorage.getItem('tvmazeEnabled') === 'true'
        };

        let visibleTabs = 0;

        // 显示/隐藏选项卡
        Object.entries(tabs).forEach(([tabId, enabled]) => {
            const tab = document.getElementById(tabId);
            if (tab) {
                tab.style.display = enabled ? 'block' : 'none';
                if (enabled) visibleTabs++;
            }
        });

        // 如果只有一个选项卡，隐藏整个选项卡容器
        const tabContainer = document.querySelector('#recommendationArea .mb-6');
        if (tabContainer) {
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