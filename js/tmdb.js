// TMDB数据源模块
class TMDBRecommendation {
    constructor() {
        this.currentPage = 1;
        this.pageSize = 20;
        this.currentType = 'movie';
        this.currentCategory = 'popular';
        this.totalResults = 0;
        this.isLoading = false;
        
        this.initEventListeners();
        this.loadSettings();
    }

    initEventListeners() {
        // 类型切换按钮
        const movieToggle = document.getElementById('tmdb-movie-toggle');
        const tvToggle = document.getElementById('tmdb-tv-toggle');
        
        if (movieToggle) {
            movieToggle.addEventListener('click', () => {
                this.switchType('movie');
            });
        }
        
        if (tvToggle) {
            tvToggle.addEventListener('click', () => {
                this.switchType('tv');
            });
        }
        
        // 分类选择
        const categorySelect = document.getElementById('tmdb-category');
        if (categorySelect) {
            categorySelect.addEventListener('change', (e) => {
                this.currentCategory = e.target.value;
                this.currentPage = 1;
                this.saveSettings();
                this.loadRecommendations();
            });
        }
        
        // 换一批按钮
        const refreshBtn = document.getElementById('tmdb-refresh');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshRecommendations();
            });
        }
    }

    switchType(type) {
        if (this.currentType === type) return;
        
        this.currentType = type;
        this.currentPage = 1;
        
        // 更新UI
        const movieBtn = document.getElementById('tmdb-movie-toggle');
        const tvBtn = document.getElementById('tmdb-tv-toggle');
        
        if (type === 'movie') {
            movieBtn?.classList.add('bg-blue-600', 'text-white');
            movieBtn?.classList.remove('text-gray-300');
            tvBtn?.classList.remove('bg-blue-600', 'text-white');
            tvBtn?.classList.add('text-gray-300');
        } else {
            tvBtn?.classList.add('bg-blue-600', 'text-white');
            tvBtn?.classList.remove('text-gray-300');
            movieBtn?.classList.remove('bg-blue-600', 'text-white');
            movieBtn?.classList.add('text-gray-300');
        }
        
        this.saveSettings();
        this.loadRecommendations();
    }

    refreshRecommendations() {
        // 随机切换页面或重新加载
        this.currentPage = Math.floor(Math.random() * 5) + 1;
        this.loadRecommendations();
    }
    
    async loadRecommendations() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        console.log('TMDB推荐加载中...');
        
        const container = document.getElementById('tmdb-results');
        if (container) {
            container.innerHTML = '<div class="col-span-full text-center py-12"><div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div><p class="text-gray-400 mt-4">正在加载TMDB推荐...</p></div>';
        }

        try {
            // 获取API密钥 - 优先使用localStorage中的自定义密钥
            let apiKey = localStorage.getItem('tmdbApiKey');
            if (!apiKey) {
                // 使用默认密钥，如果失效请在设置中更换
                // 获取免费API密钥：https://www.themoviedb.org/settings/api
                apiKey = '3fd2be6f0c70a2a598f084ddfb75487c'; // 临时密钥，请申请自己的
            }
            
            let url;
            
            if (this.currentType === 'movie') {
                url = `https://api.themoviedb.org/3/movie/${this.currentCategory}?api_key=${apiKey}&language=zh-CN&page=${this.currentPage}`;
            } else {
                url = `https://api.themoviedb.org/3/tv/${this.currentCategory}?api_key=${apiKey}&language=zh-CN&page=${this.currentPage}`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('API密钥无效或已过期，请在设置中更新TMDB API密钥');
                } else if (response.status === 429) {
                    throw new Error('请求过于频繁，请稍后重试');
                } else {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
            }

            const data = await response.json();
            
            if (data && data.results) {
                this.totalResults = Math.min(data.total_results || 0, 10000);
                this.renderMovies(data.results);
                this.updatePageInfo();
            } else {
                throw new Error('无效的API响应');
            }

        } catch (error) {
            console.error('TMDB推荐加载失败:', error);
            this.showError('加载失败: ' + error.message);
        } finally {
            this.isLoading = false;
        }
    }

    renderMovies(movies) {
        const container = document.getElementById('tmdb-results');
        if (!container) return;

        if (movies.length === 0) {
            container.innerHTML = '<div class="col-span-full text-center py-12"><p class="text-gray-400 text-lg">暂无数据</p></div>';
            return;
        }

        container.innerHTML = movies.map((movie, index) => {
            const title = movie.title || movie.name;
            const releaseDate = movie.release_date || movie.first_air_date;
            const year = releaseDate ? new Date(releaseDate).getFullYear() : '未知';
            const poster = movie.poster_path 
                ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                : `https://via.placeholder.com/300x450/1a1a1a/ffffff?text=${encodeURIComponent(title)}`;
            const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
            const overview = movie.overview || '暂无简介';

            return `
                <div class="movie-card bg-[#111] rounded-lg overflow-hidden hover:bg-[#222] transition-colors cursor-pointer">
                    <div class="aspect-[2/3] relative overflow-hidden bg-gray-800">
                        <img src="${poster}" 
                             alt="${title}" 
                             class="w-full h-full object-cover"
                             onerror="this.src='https://via.placeholder.com/300x450/1a1a1a/ffffff?text=${encodeURIComponent(title.substring(0, 10))}'"
                             loading="lazy">
                        <div class="absolute top-2 left-2 bg-black bg-opacity-75 text-blue-400 text-xs px-2 py-1 rounded">
                            ⭐ ${rating}
                        </div>
                        <div class="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                            ${year}
                        </div>
                    </div>
                    <div class="p-3">
                        <h3 class="text-white font-medium text-sm mb-1 line-clamp-2" title="${title}">
                            ${title}
                        </h3>
                        <p class="text-gray-400 text-xs mb-1">${year}</p>
                        <p class="text-gray-500 text-xs line-clamp-2" title="${overview}">
                            ${overview.substring(0, 100)}${overview.length > 100 ? '...' : ''}
                        </p>
                    </div>
                </div>
            `;
        }).join('');
    }

    showError(message) {
        const container = document.getElementById('tmdb-results');
        if (container) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <p class="text-red-400 text-lg">❌ ${message}</p>
                    <button onclick="window.tmdbRecommendation.loadRecommendations()" class="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
                        重试
                    </button>
                </div>
            `;
        }
    }

    updatePageInfo() {
        const pageInfo = document.getElementById('tmdb-page-info');
        const currentPageSpan = document.getElementById('tmdb-current-page');
        const totalItemsSpan = document.getElementById('tmdb-total-items');

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
            const settings = JSON.parse(localStorage.getItem('tmdb-settings') || '{}');
            this.currentType = settings.type || 'movie';
            this.currentCategory = settings.category || 'popular';
            this.pageSize = settings.pageSize || 20;
        } catch (error) {
            console.error('加载TMDB设置失败:', error);
        }
    }
    
    saveSettings() {
        try {
            const settings = {
                type: this.currentType,
                category: this.currentCategory,
                pageSize: this.pageSize
            };
            localStorage.setItem('tmdb-settings', JSON.stringify(settings));
        } catch (error) {
            console.error('保存TMDB设置失败:', error);
        }
    }
}

// 全局变量立即初始化
window.tmdbRecommendation = null;

function initTMDBSettings() {
    const isEnabled = localStorage.getItem('tmdbEnabled') === 'true';
    const tmdbToggle = document.getElementById('tmdbToggle');
    if (tmdbToggle) {
        tmdbToggle.checked = isEnabled;
        const toggleBg = tmdbToggle.nextElementSibling;
        const toggleDot = toggleBg.nextElementSibling;
        
        if (isEnabled) {
            toggleBg.classList.remove('bg-[#333]');
            toggleBg.classList.add('bg-blue-600');
            toggleDot.style.transform = 'translateX(1.5rem)';
        }
        
        tmdbToggle.addEventListener('change', function(e) {
            const enabled = e.target.checked;
            localStorage.setItem('tmdbEnabled', enabled);
            
            const toggleBg = e.target.nextElementSibling;
            const toggleDot = toggleBg.nextElementSibling;
            
            if (enabled) {
                toggleBg.classList.remove('bg-[#333]');
                toggleBg.classList.add('bg-blue-600');
                toggleDot.style.transform = 'translateX(1.5rem)';
            } else {
                toggleBg.classList.add('bg-[#333]');
                toggleBg.classList.remove('bg-blue-600');
                toggleDot.style.transform = 'translateX(0)';
            }
            
            if (typeof recommendationManager !== 'undefined' && recommendationManager) {
                recommendationManager.updateVisibility();
            }
        });
    }
}

function initTMDB() {
    console.log('TMDB模块正在初始化...');
    window.tmdbRecommendation = new TMDBRecommendation();
    console.log('TMDB模块初始化完成:', window.tmdbRecommendation);
}

// 立即执行检查，如果DOM已经加载完成则直接初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            initTMDB();
            initTMDBSettings();
        }, 50);
    });
} else {
    // DOM已经加载完成，立即初始化
    setTimeout(() => {
        initTMDB();
        initTMDBSettings();
    }, 50);
}
