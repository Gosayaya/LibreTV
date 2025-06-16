// TVMaze电视剧数据源模块
class TVMazeRecommendation {
    constructor() {
        this.currentPage = 1;
        this.pageSize = 20;
        this.currentCategory = 'popular';
        this.totalResults = 0;
        this.isLoading = false;
        
        this.baseURL = 'https://api.tvmaze.com';
        
        this.initEventListeners();
        this.loadSettings();
    }

    initEventListeners() {
        // 分类选择
        const categorySelect = document.getElementById('tvmaze-category');
        if (categorySelect) {
            categorySelect.addEventListener('change', (e) => {
                this.currentCategory = e.target.value;
                this.currentPage = 1;
                this.saveSettings();
                this.loadRecommendations();
            });
        }
        
        // 换一批按钮
        const refreshBtn = document.getElementById('tvmaze-refresh');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshRecommendations();
            });
        }
    }

    refreshRecommendations() {
        // 随机切换页面或重新加载
        this.currentPage = Math.floor(Math.random() * 3) + 1;
        this.loadRecommendations();
    }
    
    async loadRecommendations() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        console.log('TVMaze推荐加载中...');
        
        const container = document.getElementById('tvmaze-results');
        if (container) {
            container.innerHTML = '<div class="col-span-full text-center py-12"><div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div><p class="text-gray-400 mt-4">正在加载TVMaze推荐...</p></div>';
        }

        try {
            let data;
            
            switch (this.currentCategory) {
                case 'popular':
                    data = await this.fetchPopularShows();
                    break;
                case 'today':
                    data = await this.fetchTodayShows();
                    break;
                case 'schedule':
                    data = await this.fetchSchedule();
                    break;
                case 'premieres':
                    data = await this.fetchPremieres();
                    break;
                default:
                    throw new Error('未知分类');
            }
            
            if (data && data.length > 0) {
                // 计算分页
                const startIndex = (this.currentPage - 1) * this.pageSize;
                const endIndex = startIndex + this.pageSize;
                const pageData = data.slice(startIndex, endIndex);
                
                this.totalResults = data.length;
                this.renderShows(pageData);
                this.updatePageInfo();
            } else {
                this.showNoData();
            }
            
        } catch (error) {
            console.error('TVMaze推荐加载失败:', error);
            this.showError('加载失败: ' + error.message);
        } finally {
            this.isLoading = false;
        }
    }

    async fetchFromTVMaze(endpoint) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('TVMaze API请求失败:', error);
            throw error;
        }
    }

    async fetchPopularShows() {
        try {
            // 获取今日播出的节目作为热门
            const today = new Date().toISOString().split('T')[0];
            const schedule = await this.fetchFromTVMaze(`/schedule?date=${today}`);
            
            const uniqueShows = [];
            const showIds = new Set();
            
            for (const episode of schedule) {
                if (episode.show && !showIds.has(episode.show.id)) {
                    showIds.add(episode.show.id);
                    uniqueShows.push(episode.show);
                }
            }
            
            // 如果今日播出节目较少，补充一些固定的热门节目
            if (uniqueShows.length < 10) {
                const popularIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
                for (const id of popularIds) {
                    if (uniqueShows.length >= 20) break;
                    try {
                        const show = await this.fetchFromTVMaze(`/shows/${id}`);
                        if (show && !showIds.has(show.id)) {
                            showIds.add(show.id);
                            uniqueShows.push(show);
                        }
                    } catch (error) {
                        // 忽略单个节目获取失败
                    }
                }
            }
            
            return uniqueShows;
        } catch (error) {
            // 如果获取失败，返回一些预设节目
            return this.getFallbackShows();
        }
    }

    async fetchTodayShows() {
        const today = new Date().toISOString().split('T')[0];
        const schedule = await this.fetchFromTVMaze(`/schedule?date=${today}`);
        
        const uniqueShows = [];
        const showIds = new Set();
        
        for (const episode of schedule) {
            if (episode.show && !showIds.has(episode.show.id)) {
                showIds.add(episode.show.id);
                uniqueShows.push(episode.show);
            }
        }
        
        return uniqueShows;
    }

    async fetchSchedule() {
        const today = new Date().toISOString().split('T')[0];
        const schedule = await this.fetchFromTVMaze(`/schedule?date=${today}`);
        
        return schedule.map(item => ({
            ...item.show,
            _episode: item,
            _airtime: item.airtime,
            _airdate: item.airdate
        }));
    }

    async fetchPremieres() {
        const today = new Date().toISOString().split('T')[0];
        const schedule = await this.fetchFromTVMaze(`/schedule?date=${today}`);
        
        const premieres = schedule.filter(item => 
            item.show && (item.season === 1 && item.number === 1)
        );
        
        return premieres.map(item => item.show);
    }

    getFallbackShows() {
        // 预设的热门剧集信息
        return [
            {
                id: 1,
                name: "Friends",
                summary: "<p>经典美剧《老友记》</p>",
                image: { medium: "https://via.placeholder.com/300x450/2d1b69/ffffff?text=Friends" },
                rating: { average: 8.9 },
                premiered: "1994-09-22",
                status: "Ended",
                network: { name: "NBC" }
            },
            {
                id: 2,
                name: "Breaking Bad",
                summary: "<p>犯罪剧《绝命毒师》</p>",
                image: { medium: "https://via.placeholder.com/300x450/2d1b69/ffffff?text=Breaking+Bad" },
                rating: { average: 9.5 },
                premiered: "2008-01-20",
                status: "Ended",
                network: { name: "AMC" }
            }
        ];
    }

    renderShows(shows) {
        const container = document.getElementById('tvmaze-results');
        if (!container) return;

        if (shows.length === 0) {
            this.showNoData();
            return;
        }

        container.innerHTML = shows.map((show, index) => {
            const title = show.name;
            const year = show.premiered ? new Date(show.premiered).getFullYear() : '未知';
            const poster = show.image && show.image.medium 
                ? show.image.medium
                : `https://via.placeholder.com/300x450/2d1b69/ffffff?text=${encodeURIComponent(title)}`;
            const rating = show.rating && show.rating.average ? show.rating.average.toFixed(1) : 'N/A';
            const summary = show.summary ? this.stripHtml(show.summary) : '暂无简介';
            const status = show.status || '未知';
            const network = show.network ? show.network.name : (show.webChannel ? show.webChannel.name : '未知');

            const airtimeInfo = show._airtime && show._airdate ? 
                `<div class="absolute bottom-2 left-2 bg-black bg-opacity-75 text-green-400 text-xs px-2 py-1 rounded">
                    ${show._airdate} ${show._airtime}
                </div>` : '';

            return `
                <div class="movie-card bg-[#111] rounded-lg overflow-hidden hover:bg-[#222] transition-colors cursor-pointer"
                     onclick="searchAndPlayFromTVMaze('${title.replace(/'/g, "\\'")}', '${year}')">
                    <div class="aspect-[2/3] relative overflow-hidden bg-gray-800">
                        <img src="${poster}" 
                             alt="${title}" 
                             class="w-full h-full object-cover"
                             onerror="this.src='https://via.placeholder.com/300x450/2d1b69/ffffff?text=${encodeURIComponent(title.substring(0, 10))}'"
                             loading="lazy">
                        <div class="absolute top-2 left-2 bg-black bg-opacity-75 text-orange-400 text-xs px-2 py-1 rounded">
                            ⭐ ${rating}
                        </div>
                        <div class="absolute top-2 right-2 bg-black bg-opacity-75 text-green-400 text-xs px-2 py-1 rounded" title="点击搜索播放源">
                            🎬
                        </div>
                        ${airtimeInfo}
                    </div>
                    <div class="p-3">
                        <h3 class="text-white font-medium text-sm mb-1 line-clamp-2" title="${title}">
                            ${title}
                        </h3>
                        <p class="text-gray-400 text-xs mb-1">${year} • ${network}</p>
                        <p class="text-gray-500 text-xs line-clamp-2" title="${summary}">
                            ${summary.substring(0, 100)}${summary.length > 100 ? '...' : ''}
                        </p>
                        <div class="mt-2">
                            <span class="inline-block px-2 py-1 bg-orange-600 text-white text-xs rounded">
                                ${status}
                            </span>
                            <span class="text-xs text-gray-500 ml-2">点击搜索播放源</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    showNoData() {
        const container = document.getElementById('tvmaze-results');
        if (container) {
            container.innerHTML = '<div class="col-span-full text-center py-12"><p class="text-gray-400 text-lg">暂无数据，请尝试其他分类</p></div>';
        }
    }

    showError(message) {
        const container = document.getElementById('tvmaze-results');
        if (container) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <p class="text-red-400 text-lg">❌ ${message}</p>
                    <button onclick="window.tvmazeRecommendation.loadRecommendations()" class="mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm">
                        重试
                    </button>
                </div>
            `;
        }
    }

    updatePageInfo() {
        const pageInfo = document.getElementById('tvmaze-page-info');
        const currentPageSpan = document.getElementById('tvmaze-current-page');
        const totalItemsSpan = document.getElementById('tvmaze-total-items');

        if (currentPageSpan) {
            currentPageSpan.textContent = this.currentPage;
        }
        if (totalItemsSpan) {
            totalItemsSpan.textContent = this.totalResults;
        }

        if (pageInfo && this.totalResults > 0) {
            pageInfo.classList.remove('hidden');
        } else if (pageInfo) {
            pageInfo.classList.add('hidden');
        }
    }
    
    loadSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem('tvmaze-settings') || '{}');
            this.currentCategory = settings.category || 'popular';
            this.pageSize = settings.pageSize || 20;
        } catch (error) {
            console.error('加载TVMaze设置失败:', error);
        }
    }
    
    saveSettings() {
        try {
            const settings = {
                category: this.currentCategory,
                pageSize: this.pageSize
            };
            localStorage.setItem('tvmaze-settings', JSON.stringify(settings));
        } catch (error) {
            console.error('保存TVMaze设置失败:', error);
        }
    }
}

// 全局变量立即初始化
window.tvmazeRecommendation = null;

function initTVMazeSettings() {
    const isEnabled = localStorage.getItem('tvmazeEnabled') === 'true';
    const tvmazeToggle = document.getElementById('tvmazeToggle');
    if (tvmazeToggle) {
        tvmazeToggle.checked = isEnabled;
        const toggleBg = tvmazeToggle.nextElementSibling;
        const toggleDot = toggleBg.nextElementSibling;
        
        if (isEnabled) {
            toggleBg.classList.remove('bg-[#333]');
            toggleBg.classList.add('bg-orange-600');
            toggleDot.style.transform = 'translateX(1.5rem)';
        }
        
        tvmazeToggle.addEventListener('change', function(e) {
            const enabled = e.target.checked;
            localStorage.setItem('tvmazeEnabled', enabled);
            
            const toggleBg = e.target.nextElementSibling;
            const toggleDot = toggleBg.nextElementSibling;
            
            if (enabled) {
                toggleBg.classList.remove('bg-[#333]');
                toggleBg.classList.add('bg-orange-600');
                toggleDot.style.transform = 'translateX(1.5rem)';
            } else {
                toggleBg.classList.add('bg-[#333]');
                toggleBg.classList.remove('bg-orange-600');
                toggleDot.style.transform = 'translateX(0)';
            }
            
            if (typeof recommendationManager !== 'undefined' && recommendationManager) {
                recommendationManager.updateVisibility();
            }
        });
    }
}

function initTVMaze() {
    console.log('TVMaze模块正在初始化...');
    window.tvmazeRecommendation = new TVMazeRecommendation();
    console.log('TVMaze模块初始化完成:', window.tvmazeRecommendation);
}

// 立即执行检查，如果DOM已经加载完成则直接初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            initTVMaze();
            initTVMazeSettings();
        }, 50);
    });
} else {
    // DOM已经加载完成，立即初始化
    setTimeout(() => {
        initTVMaze();
        initTVMazeSettings();
    }, 50);
}

// 从TVMaze推荐搜索播放源并播放
async function searchAndPlayFromTVMaze(title, year) {
    if (!title) return;
    
    // 安全处理标题，防止XSS
    const safeTitle = title
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    
    // 填充搜索框
    const input = document.getElementById('searchInput');
    if (input) {
        input.value = safeTitle;
    }
    
    // 显示加载提示
    showToast(`正在搜索《${safeTitle}》的播放源...`, 'info');
    
    try {
        // 执行搜索
        await search();
        
        // 滚动到搜索结果区域
        const resultsArea = document.getElementById('resultsArea');
        if (resultsArea && !resultsArea.classList.contains('hidden')) {
            resultsArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
    } catch (error) {
        console.error('搜索播放源失败:', error);
        showToast('搜索播放源失败，请稍后重试', 'error');
    }
}
