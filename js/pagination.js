// 分页功能模块
class Pagination {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = PAGINATION_CONFIG.defaultItemsPerPage;
        this.totalItems = 0;
        this.totalPages = 0;
        this.allResults = [];
        this.currentResults = [];
        
        // 绑定事件
        this.bindEvents();
        
        // 从localStorage加载设置
        this.loadSettings();
    }
    
    // 绑定分页控件事件
    bindEvents() {
        // 每页显示数量选择
        const itemsPerPageSelect = document.getElementById('itemsPerPage');
        if (itemsPerPageSelect) {
            itemsPerPageSelect.addEventListener('change', (e) => {
                this.setItemsPerPage(parseInt(e.target.value));
            });
        }
        
        // 首页按钮
        const firstPageBtn = document.getElementById('firstPageBtn');
        if (firstPageBtn) {
            firstPageBtn.addEventListener('click', () => this.goToPage(1));
        }
        
        // 上一页按钮
        const prevPageBtn = document.getElementById('prevPageBtn');
        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', () => this.goToPage(this.currentPage - 1));
        }
        
        // 下一页按钮
        const nextPageBtn = document.getElementById('nextPageBtn');
        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', () => this.goToPage(this.currentPage + 1));
        }
        
        // 尾页按钮
        const lastPageBtn = document.getElementById('lastPageBtn');
        if (lastPageBtn) {
            lastPageBtn.addEventListener('click', () => this.goToPage(this.totalPages));
        }
    }
    
    // 从localStorage加载设置
    loadSettings() {
        try {
            const savedSettings = localStorage.getItem(PAGINATION_CONFIG.storageKey);
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                this.itemsPerPage = settings.itemsPerPage || PAGINATION_CONFIG.defaultItemsPerPage;
                
                // 更新选择框
                const itemsPerPageSelect = document.getElementById('itemsPerPage');
                if (itemsPerPageSelect) {
                    itemsPerPageSelect.value = this.itemsPerPage;
                }
            }
        } catch (e) {
            console.warn('加载分页设置失败:', e);
        }
    }
    
    // 保存设置到localStorage
    saveSettings() {
        try {
            const settings = {
                itemsPerPage: this.itemsPerPage
            };
            localStorage.setItem(PAGINATION_CONFIG.storageKey, JSON.stringify(settings));
        } catch (e) {
            console.warn('保存分页设置失败:', e);
        }
    }
    
    // 设置搜索结果数据
    setData(results) {
        this.allResults = results || [];
        this.totalItems = this.allResults.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.currentPage = 1; // 重置到第一页
        
        this.updateDisplay();
        this.updatePagination();
    }
    
    // 设置每页显示数量
    setItemsPerPage(count) {
        this.itemsPerPage = count;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.currentPage = 1; // 重置到第一页
        
        this.saveSettings();
        this.updateDisplay();
        this.updatePagination();
    }
    
    // 跳转到指定页面
    goToPage(page) {
        if (page < 1 || page > this.totalPages || page === this.currentPage) {
            return;
        }
        
        this.currentPage = page;
        this.updateDisplay();
        this.updatePagination();
        
        // 滚动到顶部
        if (PAGINATION_CONFIG.scrollToTop) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }
    
    // 获取当前页的数据
    getCurrentPageData() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.allResults.slice(startIndex, endIndex);
    }
    
    // 更新结果显示
    updateDisplay() {
        this.currentResults = this.getCurrentPageData();
        
        // 更新结果计数
        this.updateResultsCount();
        
        // 渲染当前页的结果
        this.renderResults();
    }
    
    // 更新结果计数显示
    updateResultsCount() {
        const searchResultsCount = document.getElementById('searchResultsCount');
        const pageInfo = document.getElementById('pageInfo');
        const currentPageSpan = document.getElementById('currentPage');
        const totalPagesSpan = document.getElementById('totalPages');
        
        if (searchResultsCount) {
            searchResultsCount.textContent = this.totalItems;
        }
        
        if (PAGINATION_CONFIG.showPageInfo && this.totalPages > 1) {
            if (pageInfo) {
                pageInfo.classList.remove('hidden');
            }
            if (currentPageSpan) {
                currentPageSpan.textContent = this.currentPage;
            }
            if (totalPagesSpan) {
                totalPagesSpan.textContent = this.totalPages;
            }
        } else {
            if (pageInfo) {
                pageInfo.classList.add('hidden');
            }
        }
    }
    
    // 渲染搜索结果
    renderResults() {
        const resultsDiv = document.getElementById('results');
        if (!resultsDiv) return;
        
        if (this.currentResults.length === 0) {
            resultsDiv.innerHTML = `
                <div class="col-span-full text-center py-16">
                    <svg class="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 class="mt-2 text-lg font-medium text-gray-400">没有找到匹配的结果</h3>
                    <p class="mt-1 text-sm text-gray-500">请尝试其他关键词或更换数据源</p>
                </div>
            `;
            return;
        }
        
        // 渲染当前页的结果
        resultsDiv.innerHTML = this.currentResults.map(item => {
            const safeId = item.vod_id ? item.vod_id.toString().replace(/[^\w-]/g, '') : '';
            const safeName = (item.vod_name || '').toString()
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');
            const sourceInfo = item.source_name ? 
                `<span class="bg-[#222] text-xs px-1.5 py-0.5 rounded-full">${item.source_name}</span>` : '';
            const sourceCode = item.source_code || '';
            
            // 添加API URL属性，用于详情获取
            const apiUrlAttr = item.api_url ? 
                `data-api-url="${item.api_url.replace(/"/g, '&quot;')}"` : '';
            
            // 修改为水平卡片布局，图片在左侧，文本在右侧，并优化样式
            const hasCover = item.vod_pic && item.vod_pic.startsWith('http');
            
            return `
                <div class="card-hover bg-[#111] rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-[1.02] h-full shadow-sm hover:shadow-md" 
                     onclick="showDetails('${safeId}','${safeName}','${sourceCode}')" ${apiUrlAttr}>
                    <div class="flex h-full">
                        ${hasCover ? `
                        <div class="relative flex-shrink-0 search-card-img-container">
                            <img src="${item.vod_pic}" alt="${safeName}" 
                                 class="h-full w-full object-cover transition-transform hover:scale-110" 
                                 onerror="this.onerror=null; this.src='https://via.placeholder.com/300x450?text=无封面'; this.classList.add('object-contain');" 
                                 loading="lazy">
                            <div class="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
                        </div>` : ''}
                        
                        <div class="p-2 flex flex-col flex-grow">
                            <div class="flex-grow">
                                <h3 class="font-semibold mb-2 break-words line-clamp-2 ${hasCover ? '' : 'text-center'}" title="${safeName}">${safeName}</h3>
                                
                                <div class="flex flex-wrap ${hasCover ? '' : 'justify-center'} gap-1 mb-2">
                                    ${(item.type_name || '').toString().replace(/</g, '&lt;') ? 
                                      `<span class="text-xs py-0.5 px-1.5 rounded bg-opacity-20 bg-blue-500 text-blue-300">
                                          ${(item.type_name || '').toString().replace(/</g, '&lt;')}
                                      </span>` : ''}
                                    
                                    ${item.vod_year ? 
                                      `<span class="text-xs py-0.5 px-1.5 rounded bg-opacity-20 bg-purple-500 text-purple-300">
                                          ${item.vod_year}
                                      </span>` : ''}
                                </div>
                                <p class="text-gray-400 line-clamp-2 overflow-hidden ${hasCover ? '' : 'text-center'} mb-2">
                                    ${(item.vod_remarks || '暂无介绍').toString().replace(/</g, '&lt;')}
                                </p>
                            </div>
                            
                            <div class="flex justify-between items-center mt-1 pt-1 border-t border-gray-800">
                                ${sourceInfo ? `<div>${sourceInfo}</div>` : '<div></div>'}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // 更新分页控件
    updatePagination() {
        const pagination = document.getElementById('pagination');
        if (!pagination || this.totalPages <= 1) {
            if (pagination) {
                pagination.classList.add('hidden');
            }
            return;
        }
        
        pagination.classList.remove('hidden');
        
        // 更新按钮状态
        this.updateNavigationButtons();
        
        // 更新页码按钮
        this.updatePageNumbers();
    }
    
    // 更新导航按钮状态
    updateNavigationButtons() {
        const firstPageBtn = document.getElementById('firstPageBtn');
        const prevPageBtn = document.getElementById('prevPageBtn');
        const nextPageBtn = document.getElementById('nextPageBtn');
        const lastPageBtn = document.getElementById('lastPageBtn');
        
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
    }
    
    // 更新页码按钮
    updatePageNumbers() {
        const pageNumbers = document.getElementById('pageNumbers');
        if (!pageNumbers) return;
        
        pageNumbers.innerHTML = '';
        
        // 计算显示的页码范围
        const range = this.getPageNumberRange();
        
        range.forEach(pageNum => {
            if (pageNum === '...') {
                // 省略号
                const ellipsis = document.createElement('span');
                ellipsis.className = 'px-3 py-2 text-gray-500';
                ellipsis.textContent = '...';
                pageNumbers.appendChild(ellipsis);
            } else {
                // 页码按钮
                const pageBtn = document.createElement('button');
                pageBtn.className = `page-number-btn ${pageNum === this.currentPage ? 'active' : ''}`;
                pageBtn.textContent = pageNum;
                pageBtn.addEventListener('click', () => this.goToPage(pageNum));
                pageNumbers.appendChild(pageBtn);
            }
        });
    }
    
    // 计算页码显示范围
    getPageNumberRange() {
        const maxButtons = PAGINATION_CONFIG.maxPageButtons;
        const current = this.currentPage;
        const total = this.totalPages;
        
        if (total <= maxButtons) {
            // 总页数不超过最大按钮数，显示所有页码
            return Array.from({ length: total }, (_, i) => i + 1);
        }
        
        const halfButtons = Math.floor(maxButtons / 2);
        let start = Math.max(1, current - halfButtons);
        let end = Math.min(total, current + halfButtons);
        
        // 调整范围确保显示足够的按钮
        if (end - start + 1 < maxButtons) {
            if (start === 1) {
                end = Math.min(total, start + maxButtons - 1);
            } else {
                start = Math.max(1, end - maxButtons + 1);
            }
        }
        
        const range = [];
        
        // 添加首页和省略号
        if (start > 1) {
            range.push(1);
            if (start > 2) {
                range.push('...');
            }
        }
        
        // 添加中间页码
        for (let i = start; i <= end; i++) {
            range.push(i);
        }
        
        // 添加尾页和省略号
        if (end < total) {
            if (end < total - 1) {
                range.push('...');
            }
            range.push(total);
        }
        
        return range;
    }
    
    // 隐藏分页
    hide() {
        const pagination = document.getElementById('pagination');
        const pageInfo = document.getElementById('pageInfo');
        
        if (pagination) {
            pagination.classList.add('hidden');
        }
        if (pageInfo) {
            pageInfo.classList.add('hidden');
        }
    }
}

// 创建全局分页实例
const paginationManager = new Pagination();