// 豆瓣热门电影电视剧推荐功能

// 豆瓣标签列表 - 扩展版默认标签
let defaultMovieTags = [
    // 热门分类
    '热门', '最新', '经典', '豆瓣高分', '冷门佳片', 'TOP250',
    
    // 地区分类
    '华语', '欧美', '韩国', '日本', '法国', '英国', '意大利', '西班牙', '德国', '俄国', '印度', '泰国',
    
    // 类型分类
    '动作', '喜剧', '爱情', '科幻', '悬疑', '恐怖', '治愈', '剧情', '惊悚', '犯罪', '战争', '历史', 
    '传记', '音乐', '运动', '家庭', '儿童', '动画', '纪录片', '短片',
    
    // 年代分类
    '2020年代', '2010年代', '2000年代', '90年代', '80年代', '经典老片',
    
    // 特殊分类
    '女性', '同性', '黑色幽默', '超级英雄', '灾难', '青春', '校园', '职场'
];

let defaultTvTags = [
    // 热门分类
    '热门', '最新', '经典', '高分剧集',
    
    // 地区分类
    '美剧', '英剧', '韩剧', '日剧', '国产剧', '港剧', '台剧', '泰剧', '土耳其剧', '西班牙剧',
    
    // 类型分类
    '都市', '古装', '偶像剧', '悬疑剧', '犯罪剧', '医疗剧', '律政剧', '职场剧', '家庭剧', '青春剧',
    '科幻剧', '奇幻剧', '历史剧', '战争剧', '喜剧剧', '情景喜剧',
    
    // 特殊分类
    '日本动画', '欧美动画', '国产动画', '综艺', '纪录片', '真人秀', '脱口秀', '音乐节目',
    
    // 题材分类
    '穿越', '重生', '宫斗', '江湖', '军旅', '农村', '都市情感', '家族saga'
];

// 用户标签列表 - 存储用户实际使用的标签（包含保留的系统标签和用户添加的自定义标签）
let movieTags = [...defaultMovieTags];
let tvTags = [...defaultTvTags];

// 加载用户标签
function loadUserTags() {
    try {
        // 尝试从本地存储加载用户保存的标签
        const savedMovieTags = localStorage.getItem('userMovieTags');
        const savedTvTags = localStorage.getItem('userTvTags');
        
        // 不当内容过滤列表
        const inappropriateContent = [
            '伦理片', '福利', '里番动漫', '门事件', '萝莉少女', '制服诱惑', 
            '国产传媒', 'cosplay', '黑丝诱惑', '无码', '日本无码', '有码', 
            '日本有码', 'SWAG', '网红主播', '色情片', '同性片', '福利视频', '福利片'
        ];
        
        // 过滤函数
        const filterTags = (tags) => {
            return tags.filter(tag => !inappropriateContent.includes(tag));
        };
        
        // 如果本地存储中有标签数据，则使用它（但要过滤不当内容）
        if (savedMovieTags) {
            const parsedMovieTags = JSON.parse(savedMovieTags);
            const filteredMovieTags = filterTags(parsedMovieTags);
            
            // 如果过滤后标签太少，使用默认标签
            if (filteredMovieTags.length < 5) {
                movieTags = [...defaultMovieTags];
                console.log('电影标签被重置为默认标签（过滤不当内容后标签不足）');
            } else {
                movieTags = filteredMovieTags;
            }
        } else {
            // 否则使用默认标签
            movieTags = [...defaultMovieTags];
        }
        
        if (savedTvTags) {
            const parsedTvTags = JSON.parse(savedTvTags);
            const filteredTvTags = filterTags(parsedTvTags);
            
            // 如果过滤后标签太少，使用默认标签
            if (filteredTvTags.length < 3) {
                tvTags = [...defaultTvTags];
                console.log('电视剧标签被重置为默认标签（过滤不当内容后标签不足）');
            } else {
                tvTags = filteredTvTags;
            }
        } else {
            // 否则使用默认标签
            tvTags = [...defaultTvTags];
        }
        
        // 确保热门标签始终存在
        if (!movieTags.includes('热门')) {
            movieTags.unshift('热门');
        }
        if (!tvTags.includes('热门')) {
            tvTags.unshift('热门');
        }
        
        // 保存清理后的标签
        saveUserTags();
        
    } catch (e) {
        console.error('加载标签失败：', e);
        // 初始化为默认值，防止错误
        movieTags = [...defaultMovieTags];
        tvTags = [...defaultTvTags];
    }
}

// 保存用户标签
function saveUserTags() {
    try {
        localStorage.setItem('userMovieTags', JSON.stringify(movieTags));
        localStorage.setItem('userTvTags', JSON.stringify(tvTags));
    } catch (e) {
        console.error('保存标签失败：', e);
        showToast('保存标签失败', 'error');
    }
}

let doubanMovieTvCurrentSwitch = 'movie';
let doubanCurrentTag = '热门';
let doubanPageStart = 0;
let doubanPageSize = 24; // 一次显示的项目数量
let doubanCurrentSort = 'recommend'; // 当前排序方式

// 豆瓣分页管理器
class DoubanPagination {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 24;
        this.totalPages = 1;
        this.allResults = [];
        this.currentSort = 'recommend';
        
        this.bindEvents();
        this.loadSettings();
    }
    
    bindEvents() {
        // 排序选择
        const sortSelect = document.getElementById('douban-sort');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                doubanCurrentSort = e.target.value;
                this.saveSettings();
                this.refreshData();
            });
        }
        
        // 每页显示数量
        const pageSizeSelect = document.getElementById('douban-page-size');
        if (pageSizeSelect) {
            pageSizeSelect.addEventListener('change', (e) => {
                this.itemsPerPage = parseInt(e.target.value);
                doubanPageSize = parseInt(e.target.value);
                this.currentPage = 1;
                this.saveSettings();
                this.refreshData();
            });
        }
        
        // 分页按钮
        const firstPageBtn = document.getElementById('douban-first-page');
        if (firstPageBtn) {
            firstPageBtn.addEventListener('click', () => this.goToPage(1));
        }
        
        const prevPageBtn = document.getElementById('douban-prev-page');
        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', () => this.goToPage(this.currentPage - 1));
        }
        
        const nextPageBtn = document.getElementById('douban-next-page');
        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', () => this.goToPage(this.currentPage + 1));
        }
        
        const lastPageBtn = document.getElementById('douban-last-page');
        if (lastPageBtn) {
            lastPageBtn.addEventListener('click', () => this.goToPage(this.totalPages));
        }
    }
    
    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('douban_pagination_settings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                this.itemsPerPage = settings.itemsPerPage || 24;
                this.currentSort = settings.sort || 'recommend';
                
                // 兼容旧版本：如果保存的是 'rank'，转换为 'rating'
                if (this.currentSort === 'rank') {
                    this.currentSort = 'rating';
                }
                
                // 更新UI
                const pageSizeSelect = document.getElementById('douban-page-size');
                if (pageSizeSelect) {
                    pageSizeSelect.value = this.itemsPerPage;
                }
                
                const sortSelect = document.getElementById('douban-sort');
                if (sortSelect) {
                    sortSelect.value = this.currentSort;
                }
                
                // 更新全局变量
                doubanPageSize = this.itemsPerPage;
                doubanCurrentSort = this.currentSort;
            }
        } catch (e) {
            console.warn('加载豆瓣分页设置失败:', e);
        }
    }
    
    saveSettings() {
        try {
            const settings = {
                itemsPerPage: this.itemsPerPage,
                sort: this.currentSort
            };
            localStorage.setItem('douban_pagination_settings', JSON.stringify(settings));
        } catch (e) {
            console.warn('保存豆瓣分页设置失败:', e);
        }
    }
    
    refreshData() {
        renderRecommend(doubanCurrentTag, this.itemsPerPage, (this.currentPage - 1) * this.itemsPerPage);
    }
    
    goToPage(page) {
        if (page < 1 || page > this.totalPages || page === this.currentPage) {
            return;
        }
        
        this.currentPage = page;
        this.updatePageInfo();
        this.updatePaginationButtons();
        this.refreshData();
        
        // 滚动到豆瓣区域顶部
        const doubanArea = document.getElementById('doubanArea');
        if (doubanArea) {
            doubanArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    updatePageInfo() {
        const pageInfo = document.getElementById('douban-page-info');
        const currentPageSpan = document.getElementById('douban-current-page');
        const totalItemsSpan = document.getElementById('douban-total-items');
        
        if (currentPageSpan) {
            currentPageSpan.textContent = this.currentPage;
        }
        if (totalItemsSpan) {
            totalItemsSpan.textContent = this.totalPages * this.itemsPerPage;
        }
        
        if (pageInfo && this.totalPages > 1) {
            pageInfo.classList.remove('hidden');
        } else if (pageInfo) {
            pageInfo.classList.add('hidden');
        }
    }
    
    updatePaginationButtons() {
        const pagination = document.getElementById('douban-pagination');
        if (!pagination) return;
        
        if (this.totalPages <= 1) {
            pagination.classList.add('hidden');
            return;
        }
        
        pagination.classList.remove('hidden');
        
        // 更新按钮状态
        const firstPageBtn = document.getElementById('douban-first-page');
        const prevPageBtn = document.getElementById('douban-prev-page');
        const nextPageBtn = document.getElementById('douban-next-page');
        const lastPageBtn = document.getElementById('douban-last-page');
        
        if (firstPageBtn) {
            firstPageBtn.disabled = this.currentPage === 1;
        }
        if (prevPageBtn) {
            prevPageBtn.disabled = this.currentPage === 1;
        }
        if (nextPageBtn) {
            nextPageBtn.disabled = this.currentPage === this.totalPages;
        }
        if (lastPageBtn) {
            lastPageBtn.disabled = this.currentPage === this.totalPages;
        }
        
        // 更新页码按钮
        this.updatePageNumbers();
    }
    
    updatePageNumbers() {
        const pageNumbers = document.getElementById('douban-page-numbers');
        if (!pageNumbers) return;
        
        pageNumbers.innerHTML = '';
        
        const maxButtons = 5; // 最多显示5个页码按钮
        const range = this.getPageNumberRange(maxButtons);
        
        range.forEach(pageNum => {
            if (pageNum === '...') {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'px-3 py-2 text-gray-500';
                ellipsis.textContent = '...';
                pageNumbers.appendChild(ellipsis);
            } else {
                const pageBtn = document.createElement('button');
                pageBtn.className = `page-number-btn ${pageNum === this.currentPage ? 'active' : ''}`;
                pageBtn.textContent = pageNum;
                pageBtn.addEventListener('click', () => this.goToPage(pageNum));
                pageNumbers.appendChild(pageBtn);
            }
        });
    }
    
    getPageNumberRange(maxButtons) {
        const current = this.currentPage;
        const total = this.totalPages;
        
        if (total <= maxButtons) {
            return Array.from({ length: total }, (_, i) => i + 1);
        }
        
        const halfButtons = Math.floor(maxButtons / 2);
        let start = Math.max(1, current - halfButtons);
        let end = Math.min(total, current + halfButtons);
        
        if (end - start + 1 < maxButtons) {
            if (start === 1) {
                end = Math.min(total, start + maxButtons - 1);
            } else {
                start = Math.max(1, end - maxButtons + 1);
            }
        }
        
        const range = [];
        
        if (start > 1) {
            range.push(1);
            if (start > 2) {
                range.push('...');
            }
        }
        
        for (let i = start; i <= end; i++) {
            range.push(i);
        }
        
        if (end < total) {
            if (end < total - 1) {
                range.push('...');
            }
            range.push(total);
        }
        
        return range;
    }
    
    // 估算总页数（豆瓣API不提供总数，我们估算一个合理的值）
    estimateTotalPages() {
        // 豆瓣通常每个分类有几百个结果，我们估算最多10页
        this.totalPages = Math.min(10, Math.max(3, this.currentPage + 2));
        this.updatePageInfo();
        this.updatePaginationButtons();
    }
    
    hide() {
        const pagination = document.getElementById('douban-pagination');
        const pageInfo = document.getElementById('douban-page-info');
        
        if (pagination) {
            pagination.classList.add('hidden');
        }
        if (pageInfo) {
            pageInfo.classList.add('hidden');
        }
    }
}

// 创建豆瓣分页管理器实例
const doubanPaginationManager = new DoubanPagination();

// 初始化豆瓣功能
function initDouban() {
    // 设置豆瓣开关的初始状态
    const doubanToggle = document.getElementById('doubanToggle');
    if (doubanToggle) {
        const isEnabled = localStorage.getItem('doubanEnabled') === 'true';
        doubanToggle.checked = isEnabled;
        
        // 设置开关外观
        const toggleBg = doubanToggle.nextElementSibling;
        const toggleDot = toggleBg.nextElementSibling;
        if (isEnabled) {
            toggleBg.classList.add('bg-pink-600');
            toggleDot.classList.add('translate-x-6');
        }
        
        // 添加事件监听
        doubanToggle.addEventListener('change', function(e) {
            const isChecked = e.target.checked;
            localStorage.setItem('doubanEnabled', isChecked);
            
            // 更新开关外观
            if (isChecked) {
                toggleBg.classList.add('bg-pink-600');
                toggleDot.classList.add('translate-x-6');
            } else {
                toggleBg.classList.remove('bg-pink-600');
                toggleDot.classList.remove('translate-x-6');
            }
            
            // 更新显示状态
            updateDoubanVisibility();
        });
        
        // 初始更新显示状态
        updateDoubanVisibility();

        // 滚动到页面顶部
        window.scrollTo(0, 0);
    }

    // 加载用户标签
    loadUserTags();

    // 渲染电影/电视剧切换
    renderDoubanMovieTvSwitch();
    
    // 渲染豆瓣标签
    renderDoubanTags();
    
    // 换一批按钮事件监听
    setupDoubanRefreshBtn();
    
    // 初始加载热门内容
    if (localStorage.getItem('doubanEnabled') === 'true') {
        renderRecommend(doubanCurrentTag, doubanPageSize, doubanPageStart);
    }
    
    // 初始化分页管理器事件（延迟执行确保DOM已加载）
    setTimeout(() => {
        if (doubanPaginationManager) {
            doubanPaginationManager.bindEvents();
        }
    }, 100);
}

// 根据设置更新豆瓣区域的显示状态
function updateDoubanVisibility() {
    // 使用新的推荐管理器
    if (typeof recommendationManager !== 'undefined' && recommendationManager) {
        recommendationManager.updateVisibility();
    }
}

// 只填充搜索框，不执行搜索，让用户自主决定搜索时机
function fillSearchInput(title) {
    if (!title) return;
    
    // 安全处理标题，防止XSS
    const safeTitle = title
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    
    const input = document.getElementById('searchInput');
    if (input) {
        input.value = safeTitle;
        
        // 聚焦搜索框，便于用户立即使用键盘操作
        input.focus();
        
        // 显示一个提示，告知用户点击搜索按钮进行搜索
        showToast('已填充搜索内容，点击搜索按钮开始搜索', 'info');
    }
}

// 填充搜索框并执行搜索
function fillAndSearch(title) {
    if (!title) return;
    
    // 安全处理标题，防止XSS
    const safeTitle = title
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    
    const input = document.getElementById('searchInput');
    if (input) {
        input.value = safeTitle;
        search(); // 使用已有的search函数执行搜索
    }
}

// 填充搜索框，确保豆瓣资源API被选中，然后执行搜索
async function fillAndSearchWithDouban(title) {
    if (!title) return;
    
    // 安全处理标题，防止XSS
    const safeTitle = title
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    
    // 确保豆瓣资源API被选中
    if (typeof selectedAPIs !== 'undefined' && !selectedAPIs.includes('dbzy')) {
        // 在设置中勾选豆瓣资源API复选框
        const doubanCheckbox = document.querySelector('input[id="api_dbzy"]');
        if (doubanCheckbox) {
            doubanCheckbox.checked = true;
            
            // 触发updateSelectedAPIs函数以更新状态
            if (typeof updateSelectedAPIs === 'function') {
                updateSelectedAPIs();
            } else {
                // 如果函数不可用，则手动添加到selectedAPIs
                selectedAPIs.push('dbzy');
                localStorage.setItem('selectedAPIs', JSON.stringify(selectedAPIs));
                
                // 更新选中API计数（如果有这个元素）
                const countEl = document.getElementById('selectedAPICount');
                if (countEl) {
                    countEl.textContent = selectedAPIs.length;
                }
            }
            
            showToast('已自动选择豆瓣资源API', 'info');
        }
    }
    
    // 填充搜索框并执行搜索
    const input = document.getElementById('searchInput');
    if (input) {
        input.value = safeTitle;
        await search(); // 使用已有的search函数执行搜索

        if (window.innerWidth <= 768) {
          window.scrollTo({
              top: 0,
              behavior: 'smooth'
          });
        }
    }
}

// 渲染电影/电视剧切换器
function renderDoubanMovieTvSwitch() {
    // 获取切换按钮元素
    const movieToggle = document.getElementById('douban-movie-toggle');
    const tvToggle = document.getElementById('douban-tv-toggle');

    if (!movieToggle ||!tvToggle) return;

    movieToggle.addEventListener('click', function() {
        if (doubanMovieTvCurrentSwitch !== 'movie') {
            // 更新按钮样式
            movieToggle.classList.add('bg-pink-600', 'text-white');
            movieToggle.classList.remove('text-gray-300');
            
            tvToggle.classList.remove('bg-pink-600', 'text-white');
            tvToggle.classList.add('text-gray-300');
            
            doubanMovieTvCurrentSwitch = 'movie';
            doubanCurrentTag = '热门';

            // 重新加载豆瓣内容
            renderDoubanTags(movieTags);

            // 换一批按钮事件监听
            setupDoubanRefreshBtn();
            
            // 初始加载热门内容
            if (localStorage.getItem('doubanEnabled') === 'true') {
                renderRecommend(doubanCurrentTag, doubanPageSize, doubanPageStart);
            }
        }
    });
    
    // 电视剧按钮点击事件
    tvToggle.addEventListener('click', function() {
        if (doubanMovieTvCurrentSwitch !== 'tv') {
            // 更新按钮样式
            tvToggle.classList.add('bg-pink-600', 'text-white');
            tvToggle.classList.remove('text-gray-300');
            
            movieToggle.classList.remove('bg-pink-600', 'text-white');
            movieToggle.classList.add('text-gray-300');
            
            doubanMovieTvCurrentSwitch = 'tv';
            doubanCurrentTag = '热门';

            // 重新加载豆瓣内容
            renderDoubanTags(tvTags);

            // 换一批按钮事件监听
            setupDoubanRefreshBtn();
            
            // 初始加载热门内容
            if (localStorage.getItem('doubanEnabled') === 'true') {
                renderRecommend(doubanCurrentTag, doubanPageSize, doubanPageStart);
            }
        }
    });
}

// 渲染豆瓣标签选择器
function renderDoubanTags(tags) {
    const tagContainer = document.getElementById('douban-tags');
    if (!tagContainer) return;
    
    // 确定当前应该使用的标签列表
    const currentTags = doubanMovieTvCurrentSwitch === 'movie' ? movieTags : tvTags;
    
    // 清空标签容器
    tagContainer.innerHTML = '';

    // 先添加标签管理按钮
    const manageBtn = document.createElement('button');
    manageBtn.className = 'py-1.5 px-3.5 rounded text-sm font-medium transition-all duration-300 bg-[#1a1a1a] text-gray-300 hover:bg-pink-700 hover:text-white border border-[#333] hover:border-white';
    manageBtn.innerHTML = '<span class="flex items-center"><svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>管理标签</span>';
    manageBtn.onclick = function() {
        showTagManageModal();
    };
    tagContainer.appendChild(manageBtn);

    // 添加所有标签
    currentTags.forEach(tag => {
        const btn = document.createElement('button');
        
        // 设置样式
        let btnClass = 'py-1.5 px-3.5 rounded text-sm font-medium transition-all duration-300 border ';
        
        // 当前选中的标签使用高亮样式
        if (tag === doubanCurrentTag) {
            btnClass += 'bg-pink-600 text-white shadow-md border-white';
        } else {
            btnClass += 'bg-[#1a1a1a] text-gray-300 hover:bg-pink-700 hover:text-white border-[#333] hover:border-white';
        }
        
        btn.className = btnClass;
        btn.textContent = tag;
        
        btn.onclick = function() {
            if (doubanCurrentTag !== tag) {
                doubanCurrentTag = tag;
                doubanPageStart = 0;
                
                // 重置分页到第一页
                if (doubanPaginationManager) {
                    doubanPaginationManager.currentPage = 1;
                }
                
                renderRecommend(doubanCurrentTag, doubanPageSize, doubanPageStart);
                renderDoubanTags();
            }
        };
        
        tagContainer.appendChild(btn);
    });
}

// 设置换一批按钮事件
function setupDoubanRefreshBtn() {
    // 修复ID，使用正确的ID douban-refresh 而不是 douban-refresh-btn
    const btn = document.getElementById('douban-refresh');
    if (!btn) return;
    
    btn.onclick = function() {
        doubanPageStart += doubanPageSize;
        if (doubanPageStart > 9 * doubanPageSize) {
            doubanPageStart = 0;
        }
        
        renderRecommend(doubanCurrentTag, doubanPageSize, doubanPageStart);
    };
}

function fetchDoubanTags() {
    const movieTagsTarget = `https://movie.douban.com/j/search_tags?type=movie`
    fetchDoubanData(movieTagsTarget)
        .then(data => {
            movieTags = data.tags;
            if (doubanMovieTvCurrentSwitch === 'movie') {
                renderDoubanTags(movieTags);
            }
        })
        .catch(error => {
            console.error("获取豆瓣热门电影标签失败：", error);
        });
    const tvTagsTarget = `https://movie.douban.com/j/search_tags?type=tv`
    fetchDoubanData(tvTagsTarget)
       .then(data => {
            tvTags = data.tags;
            if (doubanMovieTvCurrentSwitch === 'tv') {
                renderDoubanTags(tvTags);
            }
        })
       .catch(error => {
            console.error("获取豆瓣热门电视剧标签失败：", error);
        });
}

// 渲染热门推荐内容
function renderRecommend(tag, pageLimit, pageStart) {
    const container = document.getElementById("douban-results");
    if (!container) return;

    const loadingOverlayHTML = `
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div class="flex items-center justify-center">
                <div class="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin inline-block"></div>
                <span class="text-pink-500 ml-4">加载中...</span>
            </div>
        </div>
    `;

    container.classList.add("relative");
    container.insertAdjacentHTML('beforeend', loadingOverlayHTML);
    
    // 使用当前选择的排序方式
    let sortParam = doubanCurrentSort || 'recommend';
    
    // 豆瓣API可能不支持某些排序参数，统一使用recommend获取数据，然后在客户端排序
    let apiSortParam = 'recommend';
    if (sortParam === 'time') {
        apiSortParam = 'time'; // 时间排序豆瓣API支持
    }
    
    const target = `https://movie.douban.com/j/search_subjects?type=${doubanMovieTvCurrentSwitch}&tag=${tag}&sort=${apiSortParam}&page_limit=${pageLimit}&page_start=${pageStart}`;
    
    console.log('豆瓣API请求URL:', target);
    console.log('当前排序参数:', sortParam, '实际API参数:', apiSortParam);
    
    // 使用通用请求函数
    fetchDoubanData(target)
        .then(data => {
            console.log('豆瓣API返回数据:', data);
            
            // 如果需要按评分排序且有数据，在客户端进行排序
            if (data.subjects && data.subjects.length > 0 && sortParam === 'rating') {
                console.log('执行客户端评分排序');
                data.subjects.sort((a, b) => {
                    const rateA = parseFloat(a.rate) || 0;
                    const rateB = parseFloat(b.rate) || 0;
                    return rateB - rateA; // 按评分从高到低排序
                });
            }
            
            return data;
        })
        .then(data => {
            renderDoubanCards(data, container);
            
            // 更新分页信息（如果需要）
            if (doubanPaginationManager) {
                doubanPaginationManager.estimateTotalPages();
            }
        })
        .catch(error => {
            console.error("获取豆瓣数据失败：", error);
            container.innerHTML = `
                <div class="col-span-full text-center py-8">
                    <div class="text-red-400">❌ 获取豆瓣数据失败，请稍后重试</div>
                    <div class="text-gray-500 text-sm mt-2">提示：使用VPN可能有助于解决此问题</div>
                </div>
            `;
            
            // 隐藏分页控件
            if (doubanPaginationManager) {
                doubanPaginationManager.hide();
            }
        });
}

async function fetchDoubanData(url) {
    // 添加超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时
    
    // 设置请求选项，包括信号和头部
    const fetchOptions = {
        signal: controller.signal,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            'Referer': 'https://movie.douban.com/',
            'Accept': 'application/json, text/plain, */*',
        }
    };

    try {
        // 尝试直接访问（豆瓣API可能允许部分CORS请求）
        const response = await fetch(PROXY_URL + encodeURIComponent(url), fetchOptions);
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (err) {
        console.error("豆瓣 API 请求失败（直接代理）：", err);
        
        // 失败后尝试备用方法：作为备选
        const fallbackUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        
        try {
            const fallbackResponse = await fetch(fallbackUrl);
            
            if (!fallbackResponse.ok) {
                throw new Error(`备用API请求失败! 状态: ${fallbackResponse.status}`);
            }
            
            const data = await fallbackResponse.json();
            
            // 解析原始内容
            if (data && data.contents) {
                return JSON.parse(data.contents);
            } else {
                throw new Error("无法获取有效数据");
            }
        } catch (fallbackErr) {
            console.error("豆瓣 API 备用请求也失败：", fallbackErr);
            throw fallbackErr; // 向上抛出错误，让调用者处理
        }
    }
}

// 抽取渲染豆瓣卡片的逻辑到单独函数
function renderDoubanCards(data, container) {
    // 创建文档片段以提高性能
    const fragment = document.createDocumentFragment();
    
    // 如果没有数据
    if (!data.subjects || data.subjects.length === 0) {
        const emptyEl = document.createElement("div");
        emptyEl.className = "col-span-full text-center py-8";
        emptyEl.innerHTML = `
            <div class="text-pink-500">❌ 暂无数据，请尝试其他分类或刷新</div>
        `;
        fragment.appendChild(emptyEl);
    } else {
        // 循环创建每个影视卡片
        data.subjects.forEach(item => {
            const card = document.createElement("div");
            card.className = "bg-[#111] hover:bg-[#222] transition-all duration-300 rounded-lg overflow-hidden flex flex-col transform hover:scale-105 shadow-md hover:shadow-lg";
            
            // 生成卡片内容，确保安全显示（防止XSS）
            const safeTitle = item.title
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');
            
            const safeRate = (item.rate || "暂无")
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
            
            // 处理图片URL
            // 1. 直接使用豆瓣图片URL (添加no-referrer属性)
            const originalCoverUrl = item.cover;
            
            // 2. 也准备代理URL作为备选
            const proxiedCoverUrl = PROXY_URL + encodeURIComponent(originalCoverUrl);
            
            // 为不同设备优化卡片布局
            card.innerHTML = `
                <div class="relative w-full aspect-[2/3] overflow-hidden cursor-pointer" onclick="fillAndSearchWithDouban('${safeTitle}')">
                    <img src="${originalCoverUrl}" alt="${safeTitle}" 
                        class="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        onerror="this.onerror=null; this.src='${proxiedCoverUrl}'; this.classList.add('object-contain');"
                        loading="lazy" referrerpolicy="no-referrer">
                    <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                    <div class="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-sm">
                        <span class="text-yellow-400">★</span> ${safeRate}
                    </div>
                    <div class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-sm hover:bg-[#333] transition-colors">
                        <a href="${item.url}" target="_blank" rel="noopener noreferrer" title="在豆瓣查看" onclick="event.stopPropagation();">
                            🔗
                        </a>
                    </div>
                </div>
                <div class="p-2 text-center bg-[#111]">
                    <button onclick="fillAndSearchWithDouban('${safeTitle}')" 
                            class="text-sm font-medium text-white truncate w-full hover:text-pink-400 transition"
                            title="${safeTitle}">
                        ${safeTitle}
                    </button>
                </div>
            `;
            
            fragment.appendChild(card);
        });
    }
    
    // 清空并添加所有新元素
    container.innerHTML = "";
    container.appendChild(fragment);
}

// 重置到首页
function resetToHome() {
    resetSearchArea();
    updateDoubanVisibility();
}

// 加载豆瓣首页内容
document.addEventListener('DOMContentLoaded', initDouban);

// 显示标签管理模态框
function showTagManageModal() {
    // 确保模态框在页面上只有一个实例
    let modal = document.getElementById('tagManageModal');
    if (modal) {
        document.body.removeChild(modal);
    }
    
    // 创建模态框元素
    modal = document.createElement('div');
    modal.id = 'tagManageModal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40';
    
    // 当前使用的标签类型和默认标签
    const isMovie = doubanMovieTvCurrentSwitch === 'movie';
    const currentTags = isMovie ? movieTags : tvTags;
    const defaultTags = isMovie ? defaultMovieTags : defaultTvTags;
    
    // 模态框内容
    modal.innerHTML = `
        <div class="bg-[#191919] rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto relative">
            <button id="closeTagModal" class="absolute top-4 right-4 text-gray-400 hover:text-white text-xl">&times;</button>
            
            <h3 class="text-xl font-bold text-white mb-4">标签管理 (${isMovie ? '电影' : '电视剧'})</h3>
            
            <div class="mb-4">
                <div class="flex justify-between items-center mb-2">
                    <h4 class="text-lg font-medium text-gray-300">标签列表</h4>
                    <button id="resetTagsBtn" class="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded">
                        恢复默认标签
                    </button>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4" id="tagsGrid">
                    ${currentTags.length ? currentTags.map(tag => {
                        // "热门"标签不能删除
                        const canDelete = tag !== '热门';
                        return `
                            <div class="bg-[#1a1a1a] text-gray-300 py-1.5 px-3 rounded text-sm font-medium flex justify-between items-center group">
                                <span>${tag}</span>
                                ${canDelete ? 
                                    `<button class="delete-tag-btn text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" 
                                        data-tag="${tag}">✕</button>` : 
                                    `<span class="text-gray-500 text-xs italic opacity-0 group-hover:opacity-100">必需</span>`
                                }
                            </div>
                        `;
                    }).join('') : 
                    `<div class="col-span-full text-center py-4 text-gray-500">无标签，请添加或恢复默认</div>`}
                </div>
            </div>
            
            <div class="border-t border-gray-700 pt-4">
                <h4 class="text-lg font-medium text-gray-300 mb-3">添加新标签</h4>
                <form id="addTagForm" class="flex items-center">
                    <input type="text" id="newTagInput" placeholder="输入标签名称..." 
                           class="flex-1 bg-[#222] text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-pink-500">
                    <button type="submit" class="ml-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded">添加</button>
                </form>
                <p class="text-xs text-gray-500 mt-2">提示：标签名称不能为空，不能重复，不能包含特殊字符</p>
            </div>
        </div>
    `;
    
    // 添加模态框到页面
    document.body.appendChild(modal);
    
    // 焦点放在输入框上
    setTimeout(() => {
        document.getElementById('newTagInput').focus();
    }, 100);
    
    // 添加事件监听器 - 关闭按钮
    document.getElementById('closeTagModal').addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // 添加事件监听器 - 点击模态框外部关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // 添加事件监听器 - 恢复默认标签按钮
    document.getElementById('resetTagsBtn').addEventListener('click', function() {
        resetTagsToDefault();
        showTagManageModal(); // 重新加载模态框
    });
    
    // 添加事件监听器 - 删除标签按钮
    const deleteButtons = document.querySelectorAll('.delete-tag-btn');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const tagToDelete = this.getAttribute('data-tag');
            deleteTag(tagToDelete);
            showTagManageModal(); // 重新加载模态框
        });
    });
    
    // 添加事件监听器 - 表单提交
    document.getElementById('addTagForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const input = document.getElementById('newTagInput');
        const newTag = input.value.trim();
        
        if (newTag) {
            addTag(newTag);
            input.value = '';
            showTagManageModal(); // 重新加载模态框
        }
    });
}

// 添加标签
function addTag(tag) {
    // 安全处理标签名，防止XSS
    const safeTag = tag
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    
    // 确定当前使用的是电影还是电视剧标签
    const isMovie = doubanMovieTvCurrentSwitch === 'movie';
    const currentTags = isMovie ? movieTags : tvTags;
    
    // 检查是否已存在（忽略大小写）
    const exists = currentTags.some(
        existingTag => existingTag.toLowerCase() === safeTag.toLowerCase()
    );
    
    if (exists) {
        showToast('标签已存在', 'warning');
        return;
    }
    
    // 添加到对应的标签数组
    if (isMovie) {
        movieTags.push(safeTag);
    } else {
        tvTags.push(safeTag);
    }
    
    // 保存到本地存储
    saveUserTags();
    
    // 重新渲染标签
    renderDoubanTags();
    
    showToast('标签添加成功', 'success');
}

// 删除标签
function deleteTag(tag) {
    // 热门标签不能删除
    if (tag === '热门') {
        showToast('热门标签不能删除', 'warning');
        return;
    }
    
    // 确定当前使用的是电影还是电视剧标签
    const isMovie = doubanMovieTvCurrentSwitch === 'movie';
    const currentTags = isMovie ? movieTags : tvTags;
    
    // 寻找标签索引
    const index = currentTags.indexOf(tag);
    
    // 如果找到标签，则删除
    if (index !== -1) {
        currentTags.splice(index, 1);
        
        // 保存到本地存储
        saveUserTags();
        
        // 如果当前选中的是被删除的标签，则重置为"热门"
        if (doubanCurrentTag === tag) {
            doubanCurrentTag = '热门';
            doubanPageStart = 0;
            renderRecommend(doubanCurrentTag, doubanPageSize, doubanPageStart);
        }
        
        // 重新渲染标签
        renderDoubanTags();
        
        showToast('标签删除成功', 'success');
    }
}

// 重置为默认标签
function resetTagsToDefault() {
    // 确定当前使用的是电影还是电视剧
    const isMovie = doubanMovieTvCurrentSwitch === 'movie';
    
    // 重置为默认标签
    if (isMovie) {
        movieTags = [...defaultMovieTags];
    } else {
        tvTags = [...defaultTvTags];
    }
    
    // 设置当前标签为热门
    doubanCurrentTag = '热门';
    doubanPageStart = 0;
    
    // 保存到本地存储
    saveUserTags();
    
    // 重新渲染标签和内容
    renderDoubanTags();
    renderRecommend(doubanCurrentTag, doubanPageSize, doubanPageStart);
    
    showToast('已恢复默认标签', 'success');
}
