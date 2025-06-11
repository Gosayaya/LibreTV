// TMDB (The Movie Database) 数据源模块
class TMDBRecommendation {
    constructor() {
        this.currentPage = 1;
        this.pageSize = 20;
        this.currentType = 'movie'; // movie 或 tv
        this.currentCategory = 'popular';
        this.totalResults = 0;
        this.isLoading = false;
        
        // TMDB API配置 - 使用免费API密钥
        this.apiKeys = [
            'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YzM4MjU4ZDQzNzY0NjlkY2U5NzBhZDVmNzk4ZDM1MiIsInN1YiI6IjY0ZjVhNzFkZTg5NGE2MDEzOTkxNjQ5YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6-OOWMvuunLr7L7Y5NtpVjh3VUW0xO3iNUY8GaVnY5s',
            '8c38258d4376469dce970ad5f798d352'
        ];
        this.baseURL = 'https://api.themoviedb.org/3';
        this.imageBaseURL = 'https://image.tmdb.org/t/p/w500';
        
        // 分类配置
        this.categories = {
            'popular': '热门',
            'top_rated': '高评分',
            'upcoming': '即将上映',
            'now_playing': '正在热映',
            'trending': '趋势',
            'discover': '发现'
        };
        
        // 类型配置
        this.genres = {
            28: '动作', 12: '冒险', 16: '动画', 35: '喜剧', 80: '犯罪',
            99: '纪录片', 18: '剧情', 10751: '家庭', 14: '奇幻', 36: '历史',
            27: '恐怖', 10402: '音乐', 9648: '悬疑', 10749: '爱情', 878: '科幻',
            10770: '电视电影', 53: '惊悚', 10752: '战争', 37: '西部'
        };
        
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
        
        // 每页显示数量
        const pageSizeSelect = document.getElementById('tmdb-page-size');
        if (pageSizeSelect) {
            pageSizeSelect.addEventListener('change', (e) => {
                this.pageSize = parseInt(e.target.value);
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
        
        // 分页按钮
        this.initPaginationEvents();
    }
    
    initPaginationEvents() {
        const firstPageBtn = document.getElementById('tmdb-first-page');
        const prevPageBtn = document.getElementById('tmdb-prev-page');
        const nextPageBtn = document.getElementById('tmdb-next-page');
        const lastPageBtn = document.getElementById('tmdb-last-page');
        
        if (firstPageBtn) {
            firstPageBtn.addEventListener('click', () => this.goToPage(1));
        }
        
        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', () => this.goToPage(this.currentPage - 1));
        }
        
        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', () => this.goToPage(this.currentPage + 1));
        }
        
        if (lastPageBtn) {
            lastPageBtn.addEventListener('click', () => {
                const totalPages = Math.ceil(this.totalResults / this.pageSize);
                this.goToPage(totalPages);
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
    
    async loadRecommendations() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoading();
        
        try {
            let endpoint;
            let params = {
                page: this.currentPage,
                language: 'zh-CN'
            };
            
            // 根据分类和类型构建API端点
            switch (this.currentCategory) {
                case 'trending':
                    endpoint = `/trending/${this.currentType}/week`;
                    break;
                case 'discover':
                    endpoint = `/discover/${this.currentType}`;
                    params.sort_by = 'popularity.desc';
                    break;
                default:
                    endpoint = `/${this.currentType}/${this.currentCategory}`;
            }
            
            const data = await this.fetchFromTMDB(endpoint, params);
            
            if (data && data.results) {
                this.totalResults = Math.min(data.total_results || 0, 10000); // TMDB限制最多500页
                this.renderMovies(data.results);
                this.updatePagination();
                this.updatePageInfo();
            } else {
                throw new Error('无效的API响应');
            }
            
        } catch (error) {
            console.error('TMDB推荐加载失败:', error);
            this.showError('加载失败，请稍后重试');
        } finally {
            this.isLoading = false;
        }
    }
    
    async fetchFromTMDB(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        
        for (const apiKey of this.apiKeys) {
            try {
                let url;
                if (apiKey.length > 50) {
                    // Bearer token
                    url = `${this.baseURL}${endpoint}?${queryString}`;
                    const response = await fetch(url, {
                        headers: {
                            'Authorization': `Bearer ${apiKey}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (response.ok) {
                        return await response.json();
                    }
                } else {
                    // API key
                    url = `${this.baseURL}${endpoint}?api_key=${apiKey}&${queryString}`;
                    const response = await fetch(url);
                    
                    if (response.ok) {
                        return await response.json();
                    }
                }
            } catch (error) {
                console.log(`TMDB API密钥 ${apiKey.substring(0, 10)}... 失败:`, error.message);
                continue;
            }
        }
        
        throw new Error('所有TMDB API密钥都失败了');
    }
    
    async fetchMovieDetails(id) {
        try {
            const endpoint = `/${this.currentType}/${id}`;
            const params = {
                language: 'zh-CN',
                append_to_response: 'credits,videos,reviews'
            };
            
            return await this.fetchFromTMDB(endpoint, params);
        } catch (error) {
            console.error('获取详情失败:', error);
            return null;
        }
    }
    
    renderMovies(movies) {
        const container = document.getElementById('tmdb-results');
        if (!container) return;
        
        if (movies.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <p class="text-gray-400 text-lg">暂无数据，请尝试其他分类</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = movies.map((movie, index) => {
            const title = movie.title || movie.name;
            const releaseDate = movie.release_date || movie.first_air_date;
            const year = releaseDate ? new Date(releaseDate).getFullYear() : '未知';
            const poster = movie.poster_path 
                ? `${this.imageBaseURL}${movie.poster_path}`
                : this.generatePlaceholderPoster(title);
            const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
            const overview = movie.overview || '暂无简介';
            
            return `
                <div class="movie-card bg-[#111] rounded-lg overflow-hidden hover:bg-[#222] transition-colors cursor-pointer" 
                     onclick="showTMDBDetails(${movie.id}, '${title.replace(/'/g, "\\'")}', '${this.currentType}')">
                    <div class="aspect-[2/3] relative overflow-hidden bg-gray-800">
                        <img id="tmdb-img-${index}" 
                             src="${poster}" 
                             alt="${title}" 
                             class="w-full h-full object-cover transition-opacity"
                             onerror="handleTMDBImageError(this, '${title}', ${index})"
                             onload="this.style.opacity='1'; hideTMDBPlaceholder(${index})"
                             style="opacity:0"
                             loading="lazy">
                        <div class="absolute top-2 left-2 bg-black bg-opacity-75 text-blue-400 text-xs px-2 py-1 rounded">
                            ⭐ ${rating}
                        </div>
                        <div class="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                            ${year}
                        </div>
                        <!-- 加载占位符 -->
                        <div class="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-400" id="tmdb-placeholder-${index}">
                            <div class="text-center">
                                <div class="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                <div class="text-xs">${title.length > 15 ? title.substring(0, 15) + '...' : title}</div>
                            </div>
                        </div>
                    </div>
                    <div class="p-3">
                        <h3 class="text-white font-medium text-sm mb-1 line-clamp-2" title="${title}">
                            ${title}
                        </h3>
                        <p class="text-gray-400 text-xs mb-1">${year}</p>
                        <p class="text-gray-500 text-xs line-clamp-2" title="${overview}">
                            ${overview}
                        </p>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    generatePlaceholderPoster(title) {
        const services = [
            `https://via.placeholder.com/300x450/1a1a1a/ffffff?text=${encodeURIComponent(title)}`,
            `https://dummyimage.com/300x450/1a1a1a/ffffff&text=${encodeURIComponent(title.substring(0, 20))}`,
            `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450"><rect width="100%" height="100%" fill="%23333"/><text x="50%" y="50%" text-anchor="middle" fill="white" font-size="14">${encodeURIComponent(title.substring(0, 15))}</text></svg>`
        ];
        return services[Math.floor(Math.random() * services.length)];
    }
    
    showLoading() {
        const container = document.getElementById('tmdb-results');
        if (!container) return;
        
        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p class="text-gray-400 mt-4">正在加载TMDB推荐...</p>
            </div>
        `;
    }
    
    showError(message) {
        const container = document.getElementById('tmdb-results');
        if (!container) return;
        
        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-red-400 text-lg">❌ ${message}</p>
            </div>
        `;
    }
    
    updatePagination() {
        const totalPages = Math.ceil(this.totalResults / this.pageSize);
        
        if (totalPages <= 1) {
            const pagination = document.getElementById('tmdb-pagination');
            if (pagination) pagination.classList.add('hidden');
            return;
        }
        
        const pagination = document.getElementById('tmdb-pagination');
        if (pagination) pagination.classList.remove('hidden');
        
        // 更新按钮状态
        const firstBtn = document.getElementById('tmdb-first-page');
        const prevBtn = document.getElementById('tmdb-prev-page');
        const nextBtn = document.getElementById('tmdb-next-page');
        const lastBtn = document.getElementById('tmdb-last-page');
        
        if (firstBtn) firstBtn.disabled = this.currentPage === 1;
        if (prevBtn) prevBtn.disabled = this.currentPage === 1;
        if (nextBtn) nextBtn.disabled = this.currentPage === totalPages;
        if (lastBtn) lastBtn.disabled = this.currentPage === totalPages;
        
        // 生成页码按钮
        this.generatePageNumbers(totalPages);
    }
    
    generatePageNumbers(totalPages) {
        const container = document.getElementById('tmdb-page-numbers');
        if (!container) return;
        
        const current = this.currentPage;
        const maxVisible = 5;
        
        let start = Math.max(1, current - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);
        
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }
        
        let html = '';
        
        // 显示省略号
        if (start > 1) {
            html += `<button class="px-3 py-2 bg-[#111] border border-[#333] text-gray-400 rounded hover:bg-[#222] hover:text-white transition-colors" onclick="tmdbRecommendation.goToPage(1)">1</button>`;
            if (start > 2) {
                html += `<span class="px-2 text-gray-500">...</span>`;
            }
        }
        
        // 显示页码
        for (let i = start; i <= end; i++) {
            const isActive = i === current;
            html += `
                <button class="px-3 py-2 border rounded transition-colors ${isActive 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-[#111] border-[#333] text-gray-400 hover:bg-[#222] hover:text-white'
                }" onclick="tmdbRecommendation.goToPage(${i})">${i}</button>
            `;
        }
        
        // 显示省略号
        if (end < totalPages) {
            if (end < totalPages - 1) {
                html += `<span class="px-2 text-gray-500">...</span>`;
            }
            html += `<button class="px-3 py-2 bg-[#111] border border-[#333] text-gray-400 rounded hover:bg-[#222] hover:text-white transition-colors" onclick="tmdbRecommendation.goToPage(${totalPages})">${totalPages}</button>`;
        }
        
        container.innerHTML = html;
    }
    
    goToPage(page) {
        const totalPages = Math.ceil(this.totalResults / this.pageSize);
        if (page !== this.currentPage && page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.loadRecommendations();
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
    
    refreshRecommendations() {
        // 随机切换页面或分类
        const totalPages = Math.ceil(this.totalResults / this.pageSize);
        if (totalPages > 1) {
            const randomPage = Math.floor(Math.random() * Math.min(totalPages, 20)) + 1;
            this.goToPage(randomPage);
        } else {
            this.loadRecommendations();
        }
    }
    
    loadSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem('tmdb-settings') || '{}');
            
            this.currentType = settings.type || 'movie';
            this.currentCategory = settings.category || 'popular';
            this.pageSize = settings.pageSize || 20;
            
            // 更新UI
            const categorySelect = document.getElementById('tmdb-category');
            if (categorySelect) categorySelect.value = this.currentCategory;
            
            const pageSizeSelect = document.getElementById('tmdb-page-size');
            if (pageSizeSelect) pageSizeSelect.value = this.pageSize.toString();
            
            // 更新类型按钮状态
            this.switchType(this.currentType);
            
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

// 全局变量
let tmdbRecommendation;

// 图片加载错误处理
function handleTMDBImageError(img, title, index) {
    console.log(`TMDB图片加载失败: ${title}`);
    
    const placeholder = document.getElementById(`tmdb-placeholder-${index}`);
    if (placeholder) {
        placeholder.style.display = 'none';
    }
    
    const fallbackImages = [
        `https://via.placeholder.com/300x450/1a1a1a/ffffff?text=${encodeURIComponent(title)}`,
        `https://dummyimage.com/300x450/1a1a1a/ffffff&text=${encodeURIComponent(title.substring(0, 20))}`,
        `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450"><rect width="100%" height="100%" fill="%23333"/><text x="50%" y="50%" text-anchor="middle" fill="white" font-size="14">${encodeURIComponent(title.substring(0, 15))}</text></svg>`
    ];
    
    let currentIndex = 0;
    const tryNextImage = () => {
        if (currentIndex < fallbackImages.length) {
            img.onerror = () => {
                currentIndex++;
                tryNextImage();
            };
            img.onload = () => {
                img.style.opacity = '1';
            };
            img.src = fallbackImages[currentIndex];
        }
    };
    
    tryNextImage();
}

// 隐藏占位符
function hideTMDBPlaceholder(index) {
    const placeholder = document.getElementById(`tmdb-placeholder-${index}`);
    if (placeholder) {
        placeholder.style.display = 'none';
    }
}

// 显示TMDB详情
async function showTMDBDetails(id, title, type) {
    try {
        if (typeof showLoading === 'function') {
            showLoading();
        }
        
        if (tmdbRecommendation) {
            const movieData = await tmdbRecommendation.fetchMovieDetails(id);
            if (movieData) {
                showTMDBModal(movieData, type);
            } else {
                throw new Error('获取详情失败');
            }
        }
        
    } catch (error) {
        console.error('获取TMDB详情失败:', error);
        if (typeof showToast === 'function') {
            showToast('获取详情失败: ' + error.message, 'error');
        }
    } finally {
        if (typeof hideLoading === 'function') {
            hideLoading();
        }
    }
}

// 显示TMDB详情模态框
function showTMDBModal(movieData, type) {
    const title = movieData.title || movieData.name;
    const releaseDate = movieData.release_date || movieData.first_air_date;
    const poster = movieData.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
        : `https://via.placeholder.com/400x600/1a1a1a/ffffff?text=${encodeURIComponent(title)}`;
    
    const modalHTML = `
        <div id="tmdbModal" class="fixed inset-0 bg-black/95 flex items-center justify-center transition-opacity duration-300 z-50">
            <div class="bg-[#111] rounded-lg w-11/12 max-w-4xl border border-[#333] max-h-[90vh] flex flex-col">
                <!-- 模态框头部 -->
                <div class="flex justify-between items-center p-6 border-b border-[#333] flex-none">
                    <h2 class="text-2xl font-bold text-white break-words pr-4 max-w-[80%]">${title}</h2>
                    <button onclick="closeTMDBModal()" class="text-gray-400 hover:text-white text-2xl transition-colors flex-shrink-0">&times;</button>
                </div>
                
                <!-- 模态框内容 -->
                <div class="overflow-auto flex-1 min-h-0 p-6">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <!-- 左侧：海报 -->
                        <div class="md:col-span-1">
                            <div class="relative">
                                <img src="${poster}" 
                                     alt="${title}" 
                                     class="w-full rounded-lg shadow-lg transition-opacity"
                                     onerror="handleModalImageError(this, '${title.replace(/'/g, "\\'")}')">
                            </div>
                            
                            <!-- 评分信息 -->
                            <div class="mt-4 space-y-2">
                                <div class="bg-[#222] rounded-lg p-3">
                                    <div class="flex items-center justify-between mb-2">
                                        <span class="text-blue-400 font-bold text-lg">TMDB评分</span>
                                        <span class="text-white text-xl font-bold">${movieData.vote_average ? movieData.vote_average.toFixed(1) : 'N/A'}/10</span>
                                    </div>
                                    ${movieData.vote_count ? `<p class="text-gray-400 text-sm">${movieData.vote_count} 票</p>` : ''}
                                </div>
                            </div>
                        </div>
                        
                        <!-- 右侧：详细信息 -->
                        <div class="md:col-span-2 space-y-4">
                            <!-- 基本信息 -->
                            <div class="bg-[#222] rounded-lg p-4">
                                <h3 class="text-white font-bold text-lg mb-3">基本信息</h3>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                    ${releaseDate ? `<div><span class="text-gray-400">${type === 'tv' ? '首播日期' : '上映日期'}：</span><span class="text-white">${releaseDate}</span></div>` : ''}
                                    ${movieData.genres && movieData.genres.length > 0 ? `<div><span class="text-gray-400">类型：</span><span class="text-white">${movieData.genres.map(g => g.name).join(', ')}</span></div>` : ''}
                                    ${movieData.runtime ? `<div><span class="text-gray-400">时长：</span><span class="text-white">${movieData.runtime} 分钟</span></div>` : ''}
                                    ${movieData.number_of_seasons ? `<div><span class="text-gray-400">季数：</span><span class="text-white">${movieData.number_of_seasons}</span></div>` : ''}
                                    ${movieData.number_of_episodes ? `<div><span class="text-gray-400">集数：</span><span class="text-white">${movieData.number_of_episodes}</span></div>` : ''}
                                    ${movieData.original_language ? `<div><span class="text-gray-400">语言：</span><span class="text-white">${movieData.original_language}</span></div>` : ''}
                                    ${movieData.production_countries && movieData.production_countries.length > 0 ? `<div><span class="text-gray-400">国家：</span><span class="text-white">${movieData.production_countries.map(c => c.name).join(', ')}</span></div>` : ''}
                                    ${movieData.budget ? `<div><span class="text-gray-400">预算：</span><span class="text-white">$${movieData.budget.toLocaleString()}</span></div>` : ''}
                                    ${movieData.revenue ? `<div><span class="text-gray-400">票房：</span><span class="text-white">$${movieData.revenue.toLocaleString()}</span></div>` : ''}
                                </div>
                            </div>
                            
                            <!-- 剧情简介 -->
                            <div class="bg-[#222] rounded-lg p-4">
                                <h3 class="text-white font-bold text-lg mb-3">剧情简介</h3>
                                <p class="text-gray-300 leading-relaxed">${movieData.overview || '暂无简介'}</p>
                            </div>
                            
                            <!-- 演职员表 -->
                            ${movieData.credits && (movieData.credits.cast.length > 0 || movieData.credits.crew.length > 0) ? `
                                <div class="bg-[#222] rounded-lg p-4">
                                    <h3 class="text-white font-bold text-lg mb-3">演职员表</h3>
                                    <div class="space-y-2 text-sm">
                                        ${movieData.credits.crew.filter(person => person.job === 'Director').slice(0, 3).map(director => 
                                            `<div><span class="text-gray-400">导演：</span><span class="text-white">${director.name}</span></div>`
                                        ).join('')}
                                        ${movieData.credits.cast.length > 0 ? 
                                            `<div><span class="text-gray-400">主演：</span><span class="text-white">${movieData.credits.cast.slice(0, 5).map(actor => actor.name).join(', ')}</span></div>` : ''
                                        }
                                    </div>
                                </div>
                            ` : ''}
                            
                            <!-- 操作按钮 -->
                            <div class="flex flex-wrap gap-2 pt-4">
                                <button onclick="fillAndSearchFromTMDB('${title.replace(/'/g, "\\'")}', '${releaseDate ? new Date(releaseDate).getFullYear() : ''}')" 
                                        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
                                    搜索播放源
                                </button>
                                <button onclick="copyToClipboard('${title} (${releaseDate ? new Date(releaseDate).getFullYear() : ''})')" 
                                        class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors">
                                    复制标题
                                </button>
                                <button onclick="window.open('https://www.themoviedb.org/${type}/${movieData.id}', '_blank')" 
                                        class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm transition-colors">
                                    查看TMDB
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.addEventListener('keydown', handleTMDBModalKeydown);
}

// 关闭TMDB模态框
function closeTMDBModal() {
    const modal = document.getElementById('tmdbModal');
    if (modal) {
        modal.remove();
    }
    document.removeEventListener('keydown', handleTMDBModalKeydown);
}

// 处理模态框键盘事件
function handleTMDBModalKeydown(e) {
    if (e.key === 'Escape') {
        closeTMDBModal();
    }
}

// 搜索电影（带年份）
function fillAndSearchFromTMDB(title, year) {
    const searchQuery = year && year !== 'N/A' ? `${title} ${year}` : title;
    const input = document.getElementById('searchInput');
    if (input) {
        input.value = searchQuery;
        closeTMDBModal();
        if (typeof search === 'function') {
            search();
        }
    }
}

// 模态框图片错误处理
function handleModalImageError(img, title) {
    const fallbackImages = [
        `https://via.placeholder.com/400x600/1a1a1a/ffffff?text=${encodeURIComponent(title)}`,
        `https://dummyimage.com/400x600/1a1a1a/ffffff&text=${encodeURIComponent(title.substring(0, 20))}`,
        `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600"><rect width="100%" height="100%" fill="%23333"/><text x="50%" y="50%" text-anchor="middle" fill="white" font-size="16">${encodeURIComponent(title.substring(0, 20))}</text></svg>`
    ];
    
    let currentIndex = 0;
    const tryNextImage = () => {
        if (currentIndex < fallbackImages.length) {
            img.onerror = () => {
                currentIndex++;
                if (currentIndex < fallbackImages.length) {
                    tryNextImage();
                }
            };
            img.src = fallbackImages[currentIndex];
        }
    };
    
    tryNextImage();
}

// 初始化TMDB推荐
function initTMDB() {
    tmdbRecommendation = new TMDBRecommendation();
    
    // 初始加载推荐内容
    if (localStorage.getItem('tmdbEnabled') === 'true') {
        setTimeout(() => {
            tmdbRecommendation.loadRecommendations();
        }, 100);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initTMDB();
    }, 100);
}); 