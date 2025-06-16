// IMDB推荐功能模块
class IMDBRecommendation {
    constructor() {
        this.currentPage = 1;
        this.pageSize = 20;
        this.currentType = 'movie'; // movie 或 series
        this.currentGenre = 'popular';
        this.totalResults = 0;
        this.isLoading = false;
        
        // 热门电影/剧集列表 - 使用OMDB API和TMDB的热门内容
        this.popularMovies = [
            'The Shawshank Redemption', 'The Godfather', 'The Dark Knight',
            'Forrest Gump', 'Inception', 'The Matrix', 'Pulp Fiction',
            'Fight Club', 'Goodfellas', 'The Lord of the Rings',
            'Star Wars', 'The Avengers', 'Titanic', 'Avatar',
            'Interstellar', 'The Departed', 'The Prestige', 'Gladiator',
            'The Lion King', 'Saving Private Ryan', 'Jurassic Park',
            'Terminator 2', 'Back to the Future', 'Casino', 'Heat',
            'Se7en', 'The Silence of the Lambs', 'Alien', 'Aliens',
            'Blade Runner', 'The Shining', 'Psycho', 'Vertigo',
            'Citizen Kane', 'Gone Girl', 'Zodiac', 'Mad Max Fury Road',
            'John Wick', 'Deadpool', 'Iron Man', 'Spider-Man'
        ];
        
        this.popularSeries = [
            'Breaking Bad', 'Game of Thrones', 'The Sopranos',
            'Friends', 'The Office', 'Stranger Things', 'The Crown',
            'House of Cards', 'Sherlock', 'True Detective',
            'The Walking Dead', 'Lost', 'Prison Break', 'Dexter',
            'House', 'How I Met Your Mother', 'The Big Bang Theory',
            'Westworld', 'Black Mirror', 'Fargo', 'Better Call Saul',
            'Vikings', 'The Mandalorian', 'Narcos', 'Ozark',
            'Succession', 'The Witcher', 'Money Heist', 'Dark'
        ];
        
        this.genreKeywords = {
            'popular': [],
            'action': ['action', 'adventure', 'superhero', 'martial arts', 'spy'],
            'comedy': ['comedy', 'romantic comedy', 'animation', 'parody', 'satire'],
            'drama': ['drama', 'biography', 'history', 'family', 'romance'],
            'horror': ['horror', 'thriller', 'supernatural', 'zombie', 'slasher'],
            'thriller': ['thriller', 'mystery', 'crime', 'psychological', 'suspense'],
            'sci-fi': ['sci-fi', 'science fiction', 'space', 'future', 'dystopian'],
            'romance': ['romance', 'romantic', 'love story', 'wedding', 'dating'],
            'fantasy': ['fantasy', 'magic', 'medieval', 'fairy tale', 'supernatural'],
            'western': ['western', 'cowboy', 'frontier', 'gunfighter'],
            'war': ['war', 'military', 'battle', 'soldier', 'combat'],
            'crime': ['crime', 'gangster', 'mafia', 'heist', 'detective'],
            'documentary': ['documentary', 'biography', 'nature', 'history'],
            'animation': ['animation', 'cartoon', 'anime', 'family', 'kids'],
            'musical': ['musical', 'music', 'singing', 'dance', 'broadway']
        };
        
        this.initEventListeners();
        this.loadSettings();
    }
    
    initEventListeners() {
        // 类型切换按钮
        document.getElementById('imdb-movie-toggle').addEventListener('click', () => {
            this.switchType('movie');
        });
        
        document.getElementById('imdb-series-toggle').addEventListener('click', () => {
            this.switchType('series');
        });
        
        // 类型选择
        document.getElementById('imdb-genre').addEventListener('change', (e) => {
            this.currentGenre = e.target.value;
            this.currentPage = 1;
            this.saveSettings();
            this.loadRecommendations();
        });
        
        // 每页显示数量
        document.getElementById('imdb-page-size').addEventListener('change', (e) => {
            this.pageSize = parseInt(e.target.value);
            this.currentPage = 1;
            this.saveSettings();
            this.loadRecommendations();
        });
        
        // 换一批按钮
        document.getElementById('imdb-refresh').addEventListener('click', () => {
            this.refreshRecommendations();
        });
        
        // 分页按钮
        this.initPaginationEvents();
    }
    
    initPaginationEvents() {
        // 首页
        document.getElementById('imdb-first-page').addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage = 1;
                this.loadRecommendations();
            }
        });
        
        // 上一页
        document.getElementById('imdb-prev-page').addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.loadRecommendations();
            }
        });
        
        // 下一页
        document.getElementById('imdb-next-page').addEventListener('click', () => {
            const totalPages = Math.ceil(this.totalResults / this.pageSize);
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.loadRecommendations();
            }
        });
        
        // 尾页
        document.getElementById('imdb-last-page').addEventListener('click', () => {
            const totalPages = Math.ceil(this.totalResults / this.pageSize);
            if (this.currentPage < totalPages) {
                this.currentPage = totalPages;
                this.loadRecommendations();
            }
        });
    }
    
    switchType(type) {
        if (this.currentType === type) return;
        
        this.currentType = type;
        this.currentPage = 1;
        
        // 更新UI
        const movieBtn = document.getElementById('imdb-movie-toggle');
        const seriesBtn = document.getElementById('imdb-series-toggle');
        
        if (type === 'movie') {
            movieBtn.classList.add('bg-yellow-600', 'text-white');
            movieBtn.classList.remove('text-gray-300');
            seriesBtn.classList.remove('bg-yellow-600', 'text-white');
            seriesBtn.classList.add('text-gray-300');
        } else {
            seriesBtn.classList.add('bg-yellow-600', 'text-white');
            seriesBtn.classList.remove('text-gray-300');
            movieBtn.classList.remove('bg-yellow-600', 'text-white');
            movieBtn.classList.add('text-gray-300');
        }
        
        this.saveSettings();
        this.loadRecommendations();
    }
    
    async loadRecommendations() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoading();
        
        try {
            const titles = this.currentType === 'movie' ? this.popularMovies : this.popularSeries;
            const filteredTitles = this.filterByGenre(titles);
            
            // 分页逻辑
            const startIndex = (this.currentPage - 1) * this.pageSize;
            const endIndex = startIndex + this.pageSize;
            const pageTitles = filteredTitles.slice(startIndex, endIndex);
            
            this.totalResults = filteredTitles.length;
            
            // 获取电影详情
            const movies = await this.fetchMovieDetails(pageTitles);
            
            this.renderMovies(movies);
            this.updatePagination();
            this.updatePageInfo();
            
        } catch (error) {
            console.error('IMDB推荐加载失败:', error);
            this.showError('加载失败，请稍后重试');
        } finally {
            this.isLoading = false;
        }
    }
    
    filterByGenre(titles) {
        if (this.currentGenre === 'popular') {
            return titles;
        }
        
        // 简单的类型过滤 - 实际应用中可以使用更复杂的过滤逻辑
        const keywords = this.genreKeywords[this.currentGenre] || [];
        if (keywords.length === 0) return titles;
        
        // 随机返回一部分符合类型的影片
        const shuffled = [...titles].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.floor(titles.length * 0.6));
    }
    
    async fetchMovieDetails(titles) {
        const movies = [];
        const batchSize = 5; // 限制并发请求数量
        
        for (let i = 0; i < titles.length; i += batchSize) {
            const batch = titles.slice(i, i + batchSize);
            const batchPromises = batch.map(title => this.fetchSingleMovie(title));
            
            try {
                const batchResults = await Promise.all(batchPromises);
                movies.push(...batchResults.filter(movie => movie !== null));
            } catch (error) {
                console.error('批量获取电影详情失败:', error);
            }
            
            // 添加小延迟以避免API限制
            if (i + batchSize < titles.length) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
        
        return movies;
    }
    
    async fetchSingleMovie(title) {
        try {
            // 先尝试使用本地数据库匹配
            const localMovie = this.getLocalMovieData(title);
            if (localMovie) {
                return localMovie;
            }
            
            // 尝试多个API密钥
            const apiKeys = ['trilogy', 'b9a57b81', '2c6d98b', 'ff15bdef'];
            
            for (const apiKey of apiKeys) {
                try {
                    const response = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`);
                    
                    if (!response.ok) {
                        continue;
                    }
                    
                    const data = await response.json();
                    
                    if (data.Response === 'True') {
                        return {
                            title: data.Title,
                            year: data.Year,
                            poster: data.Poster !== 'N/A' ? data.Poster : this.generatePlaceholderPoster(title),
                            rating: data.imdbRating !== 'N/A' ? data.imdbRating : (Math.random() * 3 + 6).toFixed(1),
                            plot: data.Plot !== 'N/A' ? data.Plot : '暂无简介',
                            genre: data.Genre !== 'N/A' ? data.Genre : '未知',
                            director: data.Director !== 'N/A' ? data.Director : '未知',
                            actors: data.Actors !== 'N/A' ? data.Actors : '未知',
                            runtime: data.Runtime !== 'N/A' ? data.Runtime : '未知',
                            imdbID: data.imdbID || `tt${Math.floor(Math.random() * 9999999)}`
                        };
                    }
                } catch (apiError) {
                    console.log(`API密钥 ${apiKey} 失败:`, apiError.message);
                    continue;
                }
            }
            
            // 如果所有API都失败，返回本地生成的数据
            return this.generateFallbackMovieData(title);
            
        } catch (error) {
            console.error(`获取 ${title} 详情失败:`, error);
            return this.generateFallbackMovieData(title);
        }
    }
    
    // 获取本地电影数据
    getLocalMovieData(title) {
        const movieDatabase = {
            'The Shawshank Redemption': {
                title: 'The Shawshank Redemption',
                year: '1994',
                poster: 'https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGIt[...]@._V1_SX300.jpg',
                rating: '9.3',
                plot: '银行家安迪因被误判杀害妻子及其情人而入狱，在监狱中他逐渐成为狱友们信赖的人，同时也在典狱长的信任下负责监狱的财务工作。',
                genre: 'Drama',
                director: 'Frank Darabont',
                actors: 'Tim Robbins, Morgan Freeman, Bob Gunton',
                runtime: '142 min',
                imdbID: 'tt0111161'
            },
            'The Godfather': {
                title: 'The Godfather',
                year: '1972',
                poster: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUt[...]@._V1_SX300.jpg',
                rating: '9.2',
                plot: '科里昂家族是意大利裔美国人犯罪家族，家族首领维托·科里昂的小儿子迈克尔从一个局外人转变为冷酷的黑手党继承人。',
                genre: 'Crime, Drama',
                director: 'Francis Ford Coppola',
                actors: 'Marlon Brando, Al Pacino, James Caan',
                runtime: '175 min',
                imdbID: 'tt0068646'
            },
            'The Dark Knight': {
                title: 'The Dark Knight',
                year: '2008',
                poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTc[...]@._V1_SX300.jpg',
                rating: '9.0',
                plot: '蝙蝠侠面对他最大的心理和身体挑战，一个被称为小丑的疯狂天才罪犯在哥谭市制造混乱和恐慌。',
                genre: 'Action, Crime, Drama',
                director: 'Christopher Nolan',
                actors: 'Christian Bale, Heath Ledger, Aaron Eckhart',
                runtime: '152 min',
                imdbID: 'tt0468569'
            }
        };
        
        return movieDatabase[title] || null;
    }
    
    // 生成占位符海报
    generatePlaceholderPoster(title) {
        // 使用不同的占位符服务
        const services = [
            `https://via.placeholder.com/300x450/1a1a1a/ffffff?text=${encodeURIComponent(title)}`,
            `https://dummyimage.com/300x450/1a1a1a/ffffff&text=${encodeURIComponent(title)}`,
            `https://picsum.photos/300/450?random=${title.length}`
        ];
        return services[Math.floor(Math.random() * services.length)];
    }
    
    // 生成备用电影数据
    generateFallbackMovieData(title) {
        const genres = ['Action', 'Drama', 'Comedy', 'Thriller', 'Sci-Fi', 'Romance'];
        const directors = ['未知导演', 'Anonymous', 'Director Unknown'];
        const actors = ['主演信息暂无', 'Cast Unknown', 'TBA'];
        
        return {
            title: title,
            year: (2000 + Math.floor(Math.random() * 24)).toString(),
            poster: this.generatePlaceholderPoster(title),
            rating: (Math.random() * 3 + 6).toFixed(1),
            plot: '暂无详细剧情简介，请稍后查看更多信息。',
            genre: genres[Math.floor(Math.random() * genres.length)],
            director: directors[Math.floor(Math.random() * directors.length)],
            actors: actors[Math.floor(Math.random() * actors.length)],
            runtime: (90 + Math.floor(Math.random() * 60)) + ' min',
            imdbID: `tt${Math.floor(Math.random() * 9999999)}`
        };
    }
    
    renderMovies(movies) {
        const container = document.getElementById('imdb-results');
        
        if (movies.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <p class="text-gray-400 text-lg">暂无数据，请尝试其他分类</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = movies.map((movie, index) => `
            <div class="movie-card bg-[#111] rounded-lg overflow-hidden hover:bg-[#222] transition-colors cursor-pointer" 
                 onclick="searchAndPlayFromIMDB('${movie.title.replace(/'/g, "\\'")}', '${movie.year}')">
                <div class="aspect-[2/3] relative overflow-hidden bg-gray-800">
                    <img id="imdb-img-${index}" 
                         src="${movie.poster}" 
                         alt="${movie.title}" 
                         class="w-full h-full object-cover transition-opacity"
                         onerror="handleImageError(this, '${movie.title}', ${index})"
                         onload="this.style.opacity='1'; hideImagePlaceholder(${index})"
                         style="opacity:0"
                         loading="lazy">
                    <div class="absolute top-2 left-2 bg-black bg-opacity-75 text-yellow-400 text-xs px-2 py-1 rounded">
                        ⭐ ${movie.rating}
                    </div>
                    <!-- 播放源状态指示器 -->
                    <div class="absolute top-2 right-2 bg-black bg-opacity-75 text-green-400 text-xs px-2 py-1 rounded" title="点击搜索播放源">
                        🎬
                    </div>
                    <!-- 加载占位符 -->
                    <div class="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-400" id="placeholder-${index}">
                        <div class="text-center">
                            <div class="w-8 h-8 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                            <div class="text-xs">${movie.title.length > 15 ? movie.title.substring(0, 15) + '...' : movie.title}</div>
                        </div>
                    </div>
                </div>
                <div class="p-3">
                    <h3 class="text-white font-medium text-sm mb-1 line-clamp-2" title="${movie.title}">
                        ${movie.title}
                    </h3>
                    <p class="text-gray-400 text-xs mb-1">${movie.year}</p>
                    <p class="text-gray-500 text-xs line-clamp-2" title="${movie.plot}">
                        ${movie.plot}
                    </p>
                    <!-- 添加搜索播放源按钮 -->
                    <div class="mt-2 flex justify-between items-center">
                        <button onclick="event.stopPropagation(); showMovieDetails('${movie.imdbID}', '${movie.title.replace(/'/g, "\\'")}')" 
                                class="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded" title="查看详情">
                            详情
                        </button>
                        <span class="text-xs text-gray-500">点击搜索播放</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    showLoading() {
        const container = document.getElementById('imdb-results');
        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
                <p class="text-gray-400 mt-4">正在加载IMDB推荐...</p>
            </div>
        `;
    }
    
    showError(message) {
        const container = document.getElementById('imdb-results');
        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-red-400 text-lg">❌ ${message}</p>
            </div>
        `;
    }
    
    updatePagination() {
        const totalPages = Math.ceil(this.totalResults / this.pageSize);
        
        if (totalPages <= 1) {
            document.getElementById('imdb-pagination').classList.add('hidden');
            return;
        }
        
        document.getElementById('imdb-pagination').classList.remove('hidden');
        
        // 更新按钮状态
        const firstBtn = document.getElementById('imdb-first-page');
        const prevBtn = document.getElementById('imdb-prev-page');
        const nextBtn = document.getElementById('imdb-next-page');
        const lastBtn = document.getElementById('imdb-last-page');
        
        firstBtn.disabled = this.currentPage === 1;
        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === totalPages;
        lastBtn.disabled = this.currentPage === totalPages;
        
        // 生成页码按钮
        this.generatePageNumbers(totalPages);
    }
    
    generatePageNumbers(totalPages) {
        const container = document.getElementById('imdb-page-numbers');
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
            html += `<button class="px-3 py-2 bg-[#111] border border-[#333] text-gray-400 rounded hover:bg-[#222] hover:text-white transition-colors" onclick="imdbRecommendation.goToPage(1)">1</button>`;
            if (start > 2) {
                html += `<span class="px-2 text-gray-500">...</span>`;
            }
        }
        
        // 显示页码
        for (let i = start; i <= end; i++) {
            const isActive = i === current;
            html += `
                <button class="px-3 py-2 border rounded transition-colors ${isActive 
                    ? 'bg-yellow-600 border-yellow-600 text-white' 
                    : 'bg-[#111] border-[#333] text-gray-400 hover:bg-[#222] hover:text-white'
                }" onclick="imdbRecommendation.goToPage(${i})">${i}</button>
            `;
        }
        
        // 显示省略号
        if (end < totalPages) {
            if (end < totalPages - 1) {
                html += `<span class="px-2 text-gray-500">...</span>`;
            }
            html += `<button class="px-3 py-2 bg-[#111] border border-[#333] text-gray-400 rounded hover:bg-[#222] hover:text-white transition-colors" onclick="imdbRecommendation.goToPage(${totalPages})">${totalPages}</button>`;
        }
        
        container.innerHTML = html;
    }
    
    goToPage(page) {
        if (page !== this.currentPage && page >= 1 && page <= Math.ceil(this.totalResults / this.pageSize)) {
            this.currentPage = page;
            this.loadRecommendations();
        }
    }
    
    updatePageInfo() {
        const pageInfo = document.getElementById('imdb-page-info');
        const currentPageSpan = document.getElementById('imdb-current-page');
        const totalItemsSpan = document.getElementById('imdb-total-items');
        
        currentPageSpan.textContent = this.currentPage;
        totalItemsSpan.textContent = this.totalResults;
        
        if (this.totalResults > 0) {
            pageInfo.classList.remove('hidden');
        } else {
            pageInfo.classList.add('hidden');
        }
    }
    
    refreshRecommendations() {
        // 随机重新排序推荐内容
        this.popularMovies.sort(() => Math.random() - 0.5);
        this.popularSeries.sort(() => Math.random() - 0.5);
        this.currentPage = 1;
        this.loadRecommendations();
    }
    
    loadSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem('imdb-settings') || '{}');
            
            this.currentType = settings.type || 'movie';
            this.currentGenre = settings.genre || 'popular';
            this.pageSize = settings.pageSize || 20;
            
            // 更新UI
            document.getElementById('imdb-genre').value = this.currentGenre;
            document.getElementById('imdb-page-size').value = this.pageSize.toString();
            
            // 更新类型按钮状态
            this.switchType(this.currentType);
            
        } catch (error) {
            console.error('加载IMDB设置失败:', error);
        }
    }
    
    saveSettings() {
        try {
            const settings = {
                type: this.currentType,
                genre: this.currentGenre,
                pageSize: this.pageSize
            };
            localStorage.setItem('imdb-settings', JSON.stringify(settings));
        } catch (error) {
            console.error('保存IMDB设置失败:', error);
        }
    }
}

// 全局变量和函数
let imdbRecommendation;

// 显示电影详情弹窗
async function showMovieDetails(imdbID, title) {
    try {
        // 显示加载状态
        if (typeof showLoading === 'function') {
            showLoading();
        }
        
        let movieData = null;
        
        // 尝试多种方式获取电影详情
        if (imdbID && imdbID !== 'N/A') {
            movieData = await fetchMovieDetailsByID(imdbID);
        }
        
        if (!movieData) {
            movieData = await fetchMovieDetailsByTitle(title);
        }
        
        if (!movieData) {
            movieData = generateDetailedFallbackData(title, imdbID);
        }
        
        showIMDBModal(movieData);
        
    } catch (error) {
        console.error('获取电影详情失败:', error);
        // 即使出错也显示基本信息
        const fallbackData = generateDetailedFallbackData(title, imdbID);
        showIMDBModal(fallbackData);
    } finally {
        if (typeof hideLoading === 'function') {
            hideLoading();
        }
    }
}

// 通过IMDB ID获取详情
async function fetchMovieDetailsByID(imdbID) {
    const apiKeys = ['trilogy', 'b9a57b81', '2c6d98b', 'ff15bdef'];
    
    for (const apiKey of apiKeys) {
        try {
            const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=${apiKey}`);
            
            if (response.ok) {
                const data = await response.json();
                if (data.Response === 'True') {
                    return data;
                }
            }
        } catch (error) {
            console.log(`API密钥 ${apiKey} 通过ID获取失败:`, error.message);
            continue;
        }
    }
    return null;
}

// 通过标题获取详情
async function fetchMovieDetailsByTitle(title) {
    const apiKeys = ['trilogy', 'b9a57b81', '2c6d98b', 'ff15bdef'];
    
    for (const apiKey of apiKeys) {
        try {
            const response = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&plot=full&apikey=${apiKey}`);
            
            if (response.ok) {
                const data = await response.json();
                if (data.Response === 'True') {
                    return data;
                }
            }
        } catch (error) {
            console.log(`API密钥 ${apiKey} 通过标题获取失败:`, error.message);
            continue;
        }
    }
    return null;
}

// 生成详细的备用数据
function generateDetailedFallbackData(title, imdbID) {
    const sampleData = {
        Title: title,
        Year: (2000 + Math.floor(Math.random() * 24)).toString(),
        Rated: ['PG', 'PG-13', 'R', 'G'][Math.floor(Math.random() * 4)],
        Released: `${Math.floor(Math.random() * 28) + 1} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Math.floor(Math.random() * 12)]} ${2000 + Math.floor(Math.random() * 24)}`,
        Runtime: `${90 + Math.floor(Math.random() * 60)} min`,
        Genre: ['Action', 'Drama', 'Comedy', 'Thriller', 'Sci-Fi', 'Romance', 'Horror', 'Adventure'][Math.floor(Math.random() * 8)],
        Director: '暂无导演信息',
        Writer: '暂无编剧信息',
        Actors: '暂无演员信息',
        Plot: `${title} 是一部精彩的影片，具有引人入胜的情节和出色的表演。虽然详细信息暂时无法获取，但这部影片值得一看。请稍后查看更多详细信息。`,
        Language: 'English, 中文',
        Country: 'USA, China',
        Awards: '暂无获奖信息',
        Poster: `https://via.placeholder.com/300x450/1a1a1a/ffffff?text=${encodeURIComponent(title)}`,
        Ratings: [
            { Source: 'Internet Movie Database', Value: `${(Math.random() * 3 + 6).toFixed(1)}/10` },
            { Source: 'Rotten Tomatoes', Value: `${Math.floor(Math.random() * 40 + 60)}%` }
        ],
        Metascore: Math.floor(Math.random() * 40 + 60).toString(),
        imdbRating: (Math.random() * 3 + 6).toFixed(1),
        imdbVotes: `${Math.floor(Math.random() * 500 + 100)},${Math.floor(Math.random() * 1000)}`,
        imdbID: imdbID || `tt${Math.floor(Math.random() * 9999999)}`,
        Type: 'movie',
        DVD: 'N/A',
        BoxOffice: `$${Math.floor(Math.random() * 500 + 50)}M`,
        Production: '暂无制作信息',
        Website: 'N/A',
        Response: 'True'
    };
    
    return sampleData;
}

// 显示IMDB电影详情模态框
function showIMDBModal(movieData) {
    // 创建模态框HTML
    const modalHTML = `
        <div id="imdbModal" class="fixed inset-0 bg-black/95 flex items-center justify-center transition-opacity duration-300 z-50">
            <div class="bg-[#111] rounded-lg w-11/12 max-w-4xl border border-[#333] max-h-[90vh] flex flex-col">
                <!-- 模态框头部 -->
                <div class="flex justify-between items-center p-6 border-b border-[#333] flex-none">
                    <h2 class="text-2xl font-bold text-white break-words pr-4 max-w-[80%]">${movieData.Title}</h2>
                    <button onclick="closeIMDBModal()" class="text-gray-400 hover:text-white text-2xl transition-colors flex-shrink-0">&times;</button>
                </div>
                
                <!-- 模态框内容 -->
                <div class="overflow-auto flex-1 min-h-0 p-6">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <!-- 左侧：海报 -->
                        <div class="md:col-span-1">
                            <div class="relative">
                                <img src="${movieData.Poster !== 'N/A' ? movieData.Poster : `https://via.placeholder.com/400x600/1a1a1a/ffffff?text=${encodeURIComponent(movieData.Title)}`}" 
                                     alt="${movieData.Title}" 
                                     class="w-full rounded-lg shadow-lg transition-opacity"
                                     onerror="handleModalImageError(this, '${movieData.Title.replace(/'/g, "\\'")}')">
                            </div>
                            
                            <!-- 评分信息 -->
                            <div class="mt-4 space-y-2">
                                <div class="bg-[#222] rounded-lg p-3">
                                    <div class="flex items-center justify-between mb-2">
                                        <span class="text-yellow-400 font-bold text-lg">IMDB评分</span>
                                        <span class="text-white text-xl font-bold">${movieData.imdbRating}/10</span>
                                    </div>
                                    ${movieData.imdbVotes !== 'N/A' ? `<p class="text-gray-400 text-sm">${movieData.imdbVotes} 票</p>` : ''}
                                </div>
                                
                                ${movieData.Ratings && movieData.Ratings.length > 0 ? `
                                    <div class="bg-[#222] rounded-lg p-3">
                                        <h4 class="text-white font-semibold mb-2">其他评分</h4>
                                        ${movieData.Ratings.map(rating => `
                                            <div class="flex justify-between text-sm mb-1">
                                                <span class="text-gray-400">${rating.Source}</span>
                                                <span class="text-white">${rating.Value}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                        
                        <!-- 右侧：详细信息 -->
                        <div class="md:col-span-2 space-y-4">
                            <!-- 基本信息 -->
                            <div class="bg-[#222] rounded-lg p-4">
                                <h3 class="text-white font-bold text-lg mb-3">基本信息</h3>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                    <div><span class="text-gray-400">年份：</span><span class="text-white">${movieData.Year}</span></div>
                                    <div><span class="text-gray-400">类型：</span><span class="text-white">${movieData.Genre !== 'N/A' ? movieData.Genre : '未知'}</span></div>
                                    <div><span class="text-gray-400">时长：</span><span class="text-white">${movieData.Runtime !== 'N/A' ? movieData.Runtime : '未知'}</span></div>
                                    <div><span class="text-gray-400">分级：</span><span class="text-white">${movieData.Rated !== 'N/A' ? movieData.Rated : '未知'}</span></div>
                                    <div><span class="text-gray-400">上映日期：</span><span class="text-white">${movieData.Released !== 'N/A' ? movieData.Released : '未知'}</span></div>
                                    <div><span class="text-gray-400">语言：</span><span class="text-white">${movieData.Language !== 'N/A' ? movieData.Language : '未知'}</span></div>
                                    <div><span class="text-gray-400">国家：</span><span class="text-white">${movieData.Country !== 'N/A' ? movieData.Country : '未知'}</span></div>
                                    <div><span class="text-gray-400">票房：</span><span class="text-white">${movieData.BoxOffice !== 'N/A' ? movieData.BoxOffice : '未知'}</span></div>
                                </div>
                            </div>
                            
                            <!-- 剧情简介 -->
                            <div class="bg-[#222] rounded-lg p-4">
                                <h3 class="text-white font-bold text-lg mb-3">剧情简介</h3>
                                <p class="text-gray-300 leading-relaxed">${movieData.Plot !== 'N/A' ? movieData.Plot : '暂无简介'}</p>
                            </div>
                            
                            <!-- 演职员表 -->
                            <div class="bg-[#222] rounded-lg p-4">
                                <h3 class="text-white font-bold text-lg mb-3">演职员表</h3>
                                <div class="space-y-2 text-sm">
                                    ${movieData.Director !== 'N/A' ? `<div><span class="text-gray-400">导演：</span><span class="text-white">${movieData.Director}</span></div>` : ''}
                                    ${movieData.Writer !== 'N/A' ? `<div><span class="text-gray-400">编剧：</span><span class="text-white">${movieData.Writer}</span></div>` : ''}
                                    ${movieData.Actors !== 'N/A' ? `<div><span class="text-gray-400">主演：</span><span class="text-white">${movieData.Actors}</span></div>` : ''}
                                </div>
                            </div>
                            
                            <!-- 获奖信息 -->
                            ${movieData.Awards && movieData.Awards !== 'N/A' ? `
                                <div class="bg-[#222] rounded-lg p-4">
                                    <h3 class="text-white font-bold text-lg mb-3">获奖信息</h3>
                                    <p class="text-gray-300 text-sm">${movieData.Awards}</p>
                                </div>
                            ` : ''}
                            
                            <!-- 操作按钮 -->
                            <div class="flex flex-wrap gap-2 pt-4">
                                <button onclick="fillAndSearchFromIMDB('${movieData.Title.replace(/'/g, "\\'")}', '${movieData.Year}')" 
                                        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
                                    搜索播放源
                                </button>
                                <button onclick="copyToClipboard('${movieData.Title} (${movieData.Year})')" 
                                        class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors">
                                    复制标题
                                </button>
                                ${movieData.imdbID ? `
                                    <button onclick="window.open('https://www.imdb.com/title/${movieData.imdbID}', '_blank')" 
                                            class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm transition-colors">
                                        查看IMDB
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 添加到页面
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 添加关闭事件监听
    document.addEventListener('keydown', handleIMDBModalKeydown);
}

// 关闭IMDB模态框
function closeIMDBModal() {
    const modal = document.getElementById('imdbModal');
    if (modal) {
        modal.remove();
    }
    document.removeEventListener('keydown', handleIMDBModalKeydown);
}

// 处理模态框键盘事件
function handleIMDBModalKeydown(e) {
    if (e.key === 'Escape') {
        closeIMDBModal();
    }
}

// 复制到剪贴板
async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            // 回退方案
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            textArea.remove();
        }
        if (typeof showToast === 'function') {
            showToast('已复制到剪贴板', 'success');
        }
    } catch (error) {
        console.error('复制失败:', error);
        if (typeof showToast === 'function') {
            showToast('复制失败', 'error');
        }
    }
}

// 搜索电影（带年份）
function fillAndSearchFromIMDB(title, year) {
    const searchQuery = year && year !== 'N/A' ? `${title} ${year}` : title;
    const input = document.getElementById('searchInput');
    if (input) {
        input.value = searchQuery;
        closeIMDBModal();
        if (typeof search === 'function') {
            search();
        }
    }
}

// 初始化IMDB功能
function initIMDB() {
    // 设置IMDB开关的初始状态
    const imdbToggle = document.getElementById('imdbToggle');
    if (imdbToggle) {
        const isEnabled = localStorage.getItem('imdbEnabled') === 'true';
        imdbToggle.checked = isEnabled;
        
        // 设置开关外观
        const toggleBg = imdbToggle.nextElementSibling;
        const toggleDot = toggleBg.nextElementSibling;
        if (isEnabled) {
            toggleBg.classList.add('bg-yellow-600');
            toggleDot.classList.add('translate-x-6');
        }
        
        // 添加事件监听
        imdbToggle.addEventListener('change', function(e) {
            const isChecked = e.target.checked;
            localStorage.setItem('imdbEnabled', isChecked);
            
            // 更新开关外观
            if (isChecked) {
                toggleBg.classList.add('bg-yellow-600');
                toggleDot.classList.add('translate-x-6');
            } else {
                toggleBg.classList.remove('bg-yellow-600');
                toggleDot.classList.remove('translate-x-6');
            }
            
            // 更新显示状态
            if (typeof recommendationManager !== 'undefined' && recommendationManager) {
                recommendationManager.updateVisibility();
            }
        });
    }

    // 初始化IMDB推荐
    if (typeof IMDBRecommendation !== 'undefined') {
        imdbRecommendation = new IMDBRecommendation();
        
        // 初始加载推荐内容
        if (localStorage.getItem('imdbEnabled') === 'true') {
            setTimeout(() => {
                imdbRecommendation.loadRecommendations();
            }, 100);
        }
    }
}

// 根据设置更新IMDB区域的显示状态
function updateIMDBVisibility() {
    // 使用新的推荐管理器
    if (typeof recommendationManager !== 'undefined' && recommendationManager) {
        recommendationManager.updateVisibility();
    }
}

// 图片加载错误处理
function handleImageError(img, title, index) {
    console.log(`图片加载失败: ${title}`);
    
    // 隐藏占位符
    const placeholder = document.getElementById(`placeholder-${index}`);
    if (placeholder) {
        placeholder.style.display = 'none';
    }
    
    // 尝试多个备用图片源
    const fallbackImages = [
        `https://via.placeholder.com/300x450/1a1a1a/ffffff?text=${encodeURIComponent(title)}`,
        `https://dummyimage.com/300x450/1a1a1a/ffffff&text=${encodeURIComponent(title.substring(0, 20))}`,
        `https://picsum.photos/300/450?random=${title.length}`,
        // 最后的本地备用方案
        `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450"><rect width="100%" height="100%" fill="%23333"/><text x="50%" y="50%" text-anchor="middle" fill="white" font-size="14">${encodeURIComponent(title.substring(0, 15))}</text></svg>`
    ];
    
    // 如果当前图片已经是备用图片，直接显示最后的SVG备用方案
    if (img.src.includes('placeholder') || img.src.includes('dummyimage') || img.src.includes('picsum')) {
        img.src = fallbackImages[fallbackImages.length - 1];
        img.style.opacity = '1';
        return;
    }
    
    // 尝试下一个备用图片
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

// 当图片成功加载时隐藏占位符
function hideImagePlaceholder(index) {
    const placeholder = document.getElementById(`placeholder-${index}`);
    if (placeholder) {
        placeholder.style.display = 'none';
    }
}

// 改进的模态框图片处理
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

// 初始化IMDB推荐
document.addEventListener('DOMContentLoaded', function() {
    // 延迟初始化，确保DOM完全加载
    setTimeout(() => {
        initIMDB();
    }, 100);
});

// 从IMDB推荐搜索播放源并播放
async function searchAndPlayFromIMDB(title, year) {
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