// 全局变量
let selectedAPIs = JSON.parse(localStorage.getItem('selectedAPIs') || '["tyyszy","dyttzy", "bfzy", "ruyi"]'); // 默认选中天涯资源、暴风资源和如意资源
let customAPIs = JSON.parse(localStorage.getItem('customAPIs') || '[]'); // 存储自定义API列表

// 添加当前播放的集数索引
let currentEpisodeIndex = 0;
// 添加当前视频的所有集数
let currentEpisodes = [];
// 添加当前视频的标题
let currentVideoTitle = '';
// 全局变量用于倒序状态
let episodesReversed = false;

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化API复选框
    initAPICheckboxes();
    
    // 初始化自定义API列表
    renderCustomAPIsList();
    
    // 初始化显示选中的API数量
    updateSelectedApiCount();
    
    // 渲染搜索历史
    renderSearchHistory();
    
    // 设置默认API选择（如果是第一次加载）
    if (!localStorage.getItem('hasInitializedDefaults')) {
        // 仅选择天涯资源、暴风资源和如意资源
        selectedAPIs = ["tyyszy", "bfzy","dyttzy", "ruyi"];
        localStorage.setItem('selectedAPIs', JSON.stringify(selectedAPIs));
        
        // 默认选中过滤开关
        localStorage.setItem('yellowFilterEnabled', 'true');
        localStorage.setItem(PLAYER_CONFIG.adFilteringStorage, 'true');
        
        // 默认启用豆瓣功能
        localStorage.setItem('doubanEnabled', 'true');
        
        // 默认启用IMDB功能
        localStorage.setItem('imdbEnabled', 'true');

        // 标记已初始化默认值
        localStorage.setItem('hasInitializedDefaults', 'true');
    }
    
    // 设置黄色内容过滤开关初始状态
    const yellowFilterToggle = document.getElementById('yellowFilterToggle');
    if (yellowFilterToggle) {
        yellowFilterToggle.checked = localStorage.getItem('yellowFilterEnabled') === 'true';
    }
    
    // 设置广告过滤开关初始状态
    const adFilterToggle = document.getElementById('adFilterToggle');
    if (adFilterToggle) {
        adFilterToggle.checked = localStorage.getItem(PLAYER_CONFIG.adFilteringStorage) !== 'false'; // 默认为true
    }
    
    // 设置事件监听器
    setupEventListeners();
    
    // 初始检查成人API选中状态
    setTimeout(checkAdultAPIsSelected, 100);
});

// 初始化API复选框
function initAPICheckboxes() {
    const container = document.getElementById('apiCheckboxes');
    container.innerHTML = '';

    // 添加普通API组标题
    const normaldiv = document.createElement('div');
    normaldiv.id = 'normaldiv';
    normaldiv.className = 'grid grid-cols-2 gap-2';
    const normalTitle = document.createElement('div');
    normalTitle.className = 'api-group-title';
    normalTitle.textContent = '普通资源';
    normaldiv.appendChild(normalTitle);
    
    // 创建普通API源的复选框
    Object.keys(API_SITES).forEach(apiKey => {
        const api = API_SITES[apiKey];
        if (api.adult) return; // 跳过成人内容API，稍后添加
        
        const checked = selectedAPIs.includes(apiKey);
        
        const checkbox = document.createElement('div');
        checkbox.className = 'flex items-center';
        checkbox.innerHTML = `
            <input type="checkbox" id="api_${apiKey}" 
                   class="form-checkbox h-3 w-3 text-blue-600 bg-[#222] border border-[#333]" 
                   ${checked ? 'checked' : ''} 
                   data-api="${apiKey}">
            <label for="api_${apiKey}" class="ml-1 text-xs text-gray-400 truncate">${api.name}</label>
        `;
        normaldiv.appendChild(checkbox);
        
        // 添加事件监听器
        checkbox.querySelector('input').addEventListener('change', function() {
            updateSelectedAPIs();
            checkAdultAPIsSelected();
        });
    });
    container.appendChild(normaldiv);

    // 添加成人API列表
    addAdultAPI();

    // 初始检查成人内容状态
    checkAdultAPIsSelected();
}

// 添加成人API列表
function addAdultAPI() {
    // 仅在隐藏设置为false时添加成人API组
    if (!HIDE_BUILTIN_ADULT_APIS && (localStorage.getItem('yellowFilterEnabled') === 'false')) {
        const container = document.getElementById('apiCheckboxes');

        // 添加成人API组标题
        const adultdiv = document.createElement('div');
        adultdiv.id = 'adultdiv';
        adultdiv.className = 'grid grid-cols-2 gap-2';
        const adultTitle = document.createElement('div');
        adultTitle.className = 'api-group-title adult';
        adultTitle.innerHTML = `黄色资源采集站 <span class="adult-warning">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        </span>`;
        adultdiv.appendChild(adultTitle);
        
        // 创建成人API源的复选框
        Object.keys(API_SITES).forEach(apiKey => {
            const api = API_SITES[apiKey];
            if (!api.adult) return; // 仅添加成人内容API
            
            const checked = selectedAPIs.includes(apiKey);
            
            const checkbox = document.createElement('div');
            checkbox.className = 'flex items-center';
            checkbox.innerHTML = `
                <input type="checkbox" id="api_${apiKey}" 
                       class="form-checkbox h-3 w-3 text-blue-600 bg-[#222] border border-[#333] api-adult" 
                       ${checked ? 'checked' : ''} 
                       data-api="${apiKey}">
                <label for="api_${apiKey}" class="ml-1 text-xs text-pink-400 truncate">${api.name}</label>
            `;
            adultdiv.appendChild(checkbox);
            
            // 添加事件监听器
            checkbox.querySelector('input').addEventListener('change', function() {
                updateSelectedAPIs();
                checkAdultAPIsSelected();
            });
        });
        container.appendChild(adultdiv);
    }
}

// 检查是否有成人API被选中
function checkAdultAPIsSelected() {
    // 查找所有内置成人API复选框
    const adultBuiltinCheckboxes = document.querySelectorAll('#apiCheckboxes .api-adult:checked');
    
    // 查找所有自定义成人API复选框
    const customApiCheckboxes = document.querySelectorAll('#customApisList .api-adult:checked');
    
    const hasAdultSelected = adultBuiltinCheckboxes.length > 0 || customApiCheckboxes.length > 0;
    
    const yellowFilterToggle = document.getElementById('yellowFilterToggle');
    const yellowFilterContainer = yellowFilterToggle.closest('div').parentNode;
    const filterDescription = yellowFilterContainer.querySelector('p.filter-description');
    
    // 如果选择了成人API，禁用黄色内容过滤器
    if (hasAdultSelected) {
        yellowFilterToggle.checked = false;
        yellowFilterToggle.disabled = true;
        localStorage.setItem('yellowFilterEnabled', 'false');
        
        // 添加禁用样式
        yellowFilterContainer.classList.add('filter-disabled');
        
        // 修改描述文字
        if (filterDescription) {
            filterDescription.innerHTML = '<strong class="text-pink-300">选中黄色资源站时无法启用此过滤</strong>';
        }
        
        // 移除提示信息（如果存在）
        const existingTooltip = yellowFilterContainer.querySelector('.filter-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
    } else {
        // 启用黄色内容过滤器
        yellowFilterToggle.disabled = false;
        yellowFilterContainer.classList.remove('filter-disabled');
        
        // 恢复原来的描述文字
        if (filterDescription) {
            filterDescription.innerHTML = '过滤"伦理片"等黄色内容';
        }
        
        // 移除提示信息
        const existingTooltip = yellowFilterContainer.querySelector('.filter-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
    }
}

// 渲染自定义API列表
function renderCustomAPIsList() {
    const container = document.getElementById('customApisList');
    if (!container) return;
    
    if (customAPIs.length === 0) {
        container.innerHTML = '<p class="text-xs text-gray-500 text-center my-2">未添加自定义API</p>';
        return;
    }
    
    container.innerHTML = '';
    customAPIs.forEach((api, index) => {
        const apiItem = document.createElement('div');
        apiItem.className = 'flex items-center justify-between p-1 mb-1 bg-[#222] rounded';
        const textColorClass = api.isAdult ? 'text-pink-400' : 'text-white';
        const adultTag = api.isAdult ? '<span class="text-xs text-pink-400 mr-1">(18+)</span>' : '';
        // 新增 detail 地址显示
        const detailLine = api.detail ? `<div class="text-xs text-gray-400 truncate">detail: ${api.detail}</div>` : '';
        apiItem.innerHTML = `
            <div class="flex items-center flex-1 min-w-0">
                <input type="checkbox" id="custom_api_${index}" 
                       class="form-checkbox h-3 w-3 text-blue-600 mr-1 ${api.isAdult ? 'api-adult' : ''}" 
                       ${selectedAPIs.includes('custom_' + index) ? 'checked' : ''} 
                       data-custom-index="${index}">
                <div class="flex-1 min-w-0">
                    <div class="text-xs font-medium ${textColorClass} truncate">
                        ${adultTag}${api.name}
                    </div>
                    <div class="text-xs text-gray-500 truncate">${api.url}</div>
                    ${detailLine}
                </div>
            </div>
            <div class="flex items-center">
                <button class="text-blue-500 hover:text-blue-700 text-xs px-1" onclick="editCustomApi(${index})">✎</button>
                <button class="text-red-500 hover:text-red-700 text-xs px-1" onclick="removeCustomApi(${index})">✕</button>
            </div>
        `;
        container.appendChild(apiItem);
        apiItem.querySelector('input').addEventListener('change', function() {
            updateSelectedAPIs();
            checkAdultAPIsSelected();
        });
    });
}

// 编辑自定义API
function editCustomApi(index) {
    if (index < 0 || index >= customAPIs.length) return;
    const api = customAPIs[index];
    document.getElementById('customApiName').value = api.name;
    document.getElementById('customApiUrl').value = api.url;
    document.getElementById('customApiDetail').value = api.detail || '';
    const isAdultInput = document.getElementById('customApiIsAdult');
    if (isAdultInput) isAdultInput.checked = api.isAdult || false;
    const form = document.getElementById('addCustomApiForm');
    if (form) {
        form.classList.remove('hidden');
        const buttonContainer = form.querySelector('div:last-child');
        buttonContainer.innerHTML = `
            <button onclick="updateCustomApi(${index})" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs">更新</button>
            <button onclick="cancelEditCustomApi()" class="bg-[#444] hover:bg-[#555] text-white px-3 py-1 rounded text-xs">取消</button>
        `;
    }
}

// 更新自定义API
function updateCustomApi(index) {
    if (index < 0 || index >= customAPIs.length) return;
    const nameInput = document.getElementById('customApiName');
    const urlInput = document.getElementById('customApiUrl');
    const detailInput = document.getElementById('customApiDetail');
    const isAdultInput = document.getElementById('customApiIsAdult');
    const name = nameInput.value.trim();
    let url = urlInput.value.trim();
    const detail = detailInput ? detailInput.value.trim() : '';
    const isAdult = isAdultInput ? isAdultInput.checked : false;
    if (!name || !url) {
        showToast('请输入API名称和链接', 'warning');
        return;
    }
    if (!/^https?:\/\/.+/.test(url)) {
        showToast('API链接格式不正确，需以http://或https://开头', 'warning');
        return;
    }
    if (url.endsWith('/')) url = url.slice(0, -1);
    // 保存 detail 字段
    customAPIs[index] = { name, url, detail, isAdult };
    localStorage.setItem('customAPIs', JSON.stringify(customAPIs));
    renderCustomAPIsList();
    checkAdultAPIsSelected();
    restoreAddCustomApiButtons();
    nameInput.value = '';
    urlInput.value = '';
    if (detailInput) detailInput.value = '';
    if (isAdultInput) isAdultInput.checked = false;
    document.getElementById('addCustomApiForm').classList.add('hidden');
    showToast('已更新自定义API: ' + name, 'success');
}

// 取消编辑自定义API
function cancelEditCustomApi() {
    // 清空表单
    document.getElementById('customApiName').value = '';
    document.getElementById('customApiUrl').value = '';
    document.getElementById('customApiDetail').value = '';
    const isAdultInput = document.getElementById('customApiIsAdult');
    if (isAdultInput) isAdultInput.checked = false;
    
    // 隐藏表单
    document.getElementById('addCustomApiForm').classList.add('hidden');
    
    // 恢复添加按钮
    restoreAddCustomApiButtons();
}

// 恢复自定义API添加按钮
function restoreAddCustomApiButtons() {
    const form = document.getElementById('addCustomApiForm');
    const buttonContainer = form.querySelector('div:last-child');
    buttonContainer.innerHTML = `
        <button onclick="addCustomApi()" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs">添加</button>
        <button onclick="cancelAddCustomApi()" class="bg-[#444] hover:bg-[#555] text-white px-3 py-1 rounded text-xs">取消</button>
    `;
}

// 更新选中的API列表
function updateSelectedAPIs() {
    // 获取所有内置API复选框
    const builtInApiCheckboxes = document.querySelectorAll('#apiCheckboxes input:checked');
    
    // 获取选中的内置API
    const builtInApis = Array.from(builtInApiCheckboxes).map(input => input.dataset.api);
    
    // 获取选中的自定义API
    const customApiCheckboxes = document.querySelectorAll('#customApisList input:checked');
    const customApiIndices = Array.from(customApiCheckboxes).map(input => 'custom_' + input.dataset.customIndex);
    
    // 合并内置和自定义API
    selectedAPIs = [...builtInApis, ...customApiIndices];
    
    // 保存到localStorage
    localStorage.setItem('selectedAPIs', JSON.stringify(selectedAPIs));
    
    // 更新显示选中的API数量
    updateSelectedApiCount();
}

// 更新选中的API数量显示
function updateSelectedApiCount() {
    const countEl = document.getElementById('selectedApiCount');
    if (countEl) {
        countEl.textContent = selectedAPIs.length;
    }
}

// 全选或取消全选API
function selectAllAPIs(selectAll = true, excludeAdult = false) {
    const checkboxes = document.querySelectorAll('#apiCheckboxes input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        if (excludeAdult && checkbox.classList.contains('api-adult')) {
            checkbox.checked = false;
        } else {
            checkbox.checked = selectAll;
        }
    });
    
    updateSelectedAPIs();
    checkAdultAPIsSelected();
}

// 显示添加自定义API表单
function showAddCustomApiForm() {
    const form = document.getElementById('addCustomApiForm');
    if (form) {
        form.classList.remove('hidden');
    }
}

// 取消添加自定义API - 修改函数来重用恢复按钮逻辑
function cancelAddCustomApi() {
    const form = document.getElementById('addCustomApiForm');
    if (form) {
        form.classList.add('hidden');
        document.getElementById('customApiName').value = '';
        document.getElementById('customApiUrl').value = '';
        document.getElementById('customApiDetail').value = '';
        const isAdultInput = document.getElementById('customApiIsAdult');
        if (isAdultInput) isAdultInput.checked = false;
        
        // 确保按钮是添加按钮
        restoreAddCustomApiButtons();
    }
}

// 添加自定义API
function addCustomApi() {
    const nameInput = document.getElementById('customApiName');
    const urlInput = document.getElementById('customApiUrl');
    const detailInput = document.getElementById('customApiDetail');
    const isAdultInput = document.getElementById('customApiIsAdult');
    const name = nameInput.value.trim();
    let url = urlInput.value.trim();
    const detail = detailInput ? detailInput.value.trim() : '';
    const isAdult = isAdultInput ? isAdultInput.checked : false;
    if (!name || !url) {
        showToast('请输入API名称和链接', 'warning');
        return;
    }
    if (!/^https?:\/\/.+/.test(url)) {
        showToast('API链接格式不正确，需以http://或https://开头', 'warning');
        return;
    }
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    // 保存 detail 字段
    customAPIs.push({ name, url, detail, isAdult });
    localStorage.setItem('customAPIs', JSON.stringify(customAPIs));
    const newApiIndex = customAPIs.length - 1;
    selectedAPIs.push('custom_' + newApiIndex);
    localStorage.setItem('selectedAPIs', JSON.stringify(selectedAPIs));
    
    // 重新渲染自定义API列表
    renderCustomAPIsList();
    updateSelectedApiCount();
    checkAdultAPIsSelected();
    nameInput.value = '';
    urlInput.value = '';
    if (detailInput) detailInput.value = '';
    if (isAdultInput) isAdultInput.checked = false;
    document.getElementById('addCustomApiForm').classList.add('hidden');
    showToast('已添加自定义API: ' + name, 'success');
}

// 移除自定义API
function removeCustomApi(index) {
    if (index < 0 || index >= customAPIs.length) return;
    
    const apiName = customAPIs[index].name;
    
    // 从列表中移除API
    customAPIs.splice(index, 1);
    localStorage.setItem('customAPIs', JSON.stringify(customAPIs));
    
    // 从选中列表中移除此API
    const customApiId = 'custom_' + index;
    selectedAPIs = selectedAPIs.filter(id => id !== customApiId);
    
    // 更新大于此索引的自定义API索引
    selectedAPIs = selectedAPIs.map(id => {
        if (id.startsWith('custom_')) {
            const currentIndex = parseInt(id.replace('custom_', ''));
            if (currentIndex > index) {
                return 'custom_' + (currentIndex - 1);
            }
        }
        return id;
    });
    
    localStorage.setItem('selectedAPIs', JSON.stringify(selectedAPIs));
    
    // 重新渲染自定义API列表
    renderCustomAPIsList();
    
    // 更新选中的API数量
    updateSelectedApiCount();
    
    // 重新检查成人API选中状态
    checkAdultAPIsSelected();
    
    showToast('已移除自定义API: ' + apiName, 'info');
}

// 设置事件监听器
function setupEventListeners() {
    // 回车搜索
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            search();
        }
    });

    // 点击外部关闭设置面板
    document.addEventListener('click', function(e) {
        const panel = document.getElementById('settingsPanel');
        const settingsButton = document.querySelector('button[onclick="toggleSettings(event)"]');
        
        if (!panel.contains(e.target) && !settingsButton.contains(e.target) && panel.classList.contains('show')) {
            panel.classList.remove('show');
        }
    });
    
    // 黄色内容过滤开关事件绑定
    const yellowFilterToggle = document.getElementById('yellowFilterToggle');
    if (yellowFilterToggle) {
        yellowFilterToggle.addEventListener('change', function(e) {
            localStorage.setItem('yellowFilterEnabled', e.target.checked);

            // 控制黄色内容接口的显示状态
            const adultdiv = document.getElementById('adultdiv');
            if (adultdiv) {
                if (e.target.checked === true) {
                    adultdiv.style.display = 'none';
                } else if (e.target.checked === false) {
                    adultdiv.style.display = ''
                }
            } else {
                // 添加成人API列表
                addAdultAPI();
            }
        });
    }
    
    // 广告过滤开关事件绑定
    const adFilterToggle = document.getElementById('adFilterToggle');
    if (adFilterToggle) {
        adFilterToggle.addEventListener('change', function(e) {
            localStorage.setItem(PLAYER_CONFIG.adFilteringStorage, e.target.checked);
        });
    }
}

// 重置搜索区域
function resetSearchArea() {
    // 清理搜索结果
    document.getElementById('results').innerHTML = '';
    document.getElementById('searchInput').value = '';
    
    // 恢复搜索区域的样式
    document.getElementById('searchArea').classList.add('flex-1');
    document.getElementById('searchArea').classList.remove('mb-8');
    document.getElementById('resultsArea').classList.add('hidden');
    
    // 隐藏分页控件
    if (typeof paginationManager !== 'undefined') {
        paginationManager.hide();
    }
    
    // 确保页脚正确显示，移除相对定位
    const footer = document.querySelector('.footer');
    if (footer) {
        footer.style.position = '';
    }
    
    // 如果有推荐管理器，更新推荐区域显示状态
    if (typeof recommendationManager !== 'undefined' && recommendationManager) {
        recommendationManager.updateVisibility();
    }
}

// 获取自定义API信息
function getCustomApiInfo(customApiIndex) {
    const index = parseInt(customApiIndex);
    if (isNaN(index) || index < 0 || index >= customAPIs.length) {
        return null;
    }
    return customAPIs[index];
}

// 搜索功能 - 修改为支持多选API
async function search() {
    // 密码保护校验
    if (window.isPasswordProtected && window.isPasswordVerified) {
        if (window.isPasswordProtected() && !window.isPasswordVerified()) {
            showPasswordModal && showPasswordModal();
            return;
        }
    }
    const query = document.getElementById('searchInput').value.trim();
    
    if (!query) {
        showToast('请输入搜索内容', 'info');
        return;
    }
    
    if (selectedAPIs.length === 0) {
        showToast('请至少选择一个API源', 'warning');
        return;
    }
    
    showLoading();
    
    try {
        // 保存搜索历史
        saveSearchHistory(query);
        
        // 从所有选中的API源搜索
        let allResults = [];
        const searchPromises = selectedAPIs.map(async (apiId) => {
            try {
                let apiUrl, apiName;
                
                // 处理自定义API
                if (apiId.startsWith('custom_')) {
                    const customIndex = apiId.replace('custom_', '');
                    const customApi = getCustomApiInfo(customIndex);
                    if (!customApi) return [];
                    
                    apiUrl = customApi.url + API_CONFIG.search.path + encodeURIComponent(query);
                    apiName = customApi.name;
                } else {
                    // 内置API
                    if (!API_SITES[apiId]) return [];
                    apiUrl = API_SITES[apiId].api + API_CONFIG.search.path + encodeURIComponent(query);
                    apiName = API_SITES[apiId].name;
                }
                
                // 添加超时处理
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000);
                
                const response = await fetch(PROXY_URL + encodeURIComponent(apiUrl), {
                    headers: API_CONFIG.search.headers,
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    return [];
                }
                
                const data = await response.json();
                
                if (!data || !data.list || !Array.isArray(data.list) || data.list.length === 0) {
                    return [];
                }
                
                // 添加源信息到每个结果
                const results = data.list.map(item => ({
                    ...item,
                    source_name: apiName,
                    source_code: apiId,
                    api_url: apiId.startsWith('custom_') ? getCustomApiInfo(apiId.replace('custom_', ''))?.url : undefined
                }));
                
                return results;
            } catch (error) {
                console.warn(`API ${apiId} 搜索失败:`, error);
                return [];
            }
        });
        
        // 等待所有搜索请求完成
        const resultsArray = await Promise.all(searchPromises);
        
        // 合并所有结果
        resultsArray.forEach(results => {
            if (Array.isArray(results) && results.length > 0) {
                allResults = allResults.concat(results);
            }
        });
        
        // 显示结果区域，调整搜索区域
        document.getElementById('searchArea').classList.remove('flex-1');
        document.getElementById('searchArea').classList.add('mb-8');
        document.getElementById('resultsArea').classList.remove('hidden');
        
        // 隐藏推荐区域（如果存在）
        const recommendationArea = document.getElementById('recommendationArea');
        if (recommendationArea) {
            recommendationArea.classList.add('hidden');
        }

        // 处理搜索结果过滤：如果启用了黄色内容过滤，则过滤掉分类含有敏感内容的项目
        const yellowFilterEnabled = localStorage.getItem('yellowFilterEnabled') === 'true';
        if (yellowFilterEnabled && window.adultSitesFilter) {
            // 使用新的过滤器
            allResults = window.adultSitesFilter.filterSearchResults(allResults);
        } else if (yellowFilterEnabled) {
            // 后备方案：使用原始的过滤逻辑
            const banned = ['伦理片','福利','里番动漫','门事件','萝莉少女','制服诱惑','国产传媒','cosplay','黑丝诱惑','无码','日本无码','有码','日本有码','SWAG','网红主播', '色情片','同性片','福利视频','福利片'];
            allResults = allResults.filter(item => {
                const typeName = item.type_name || '';
                return !banned.some(keyword => typeName.includes(keyword));
            });
        }

        // 使用分页管理器处理搜索结果
        if (typeof paginationManager !== 'undefined') {
            paginationManager.setData(allResults);
        } else {
            // 如果分页管理器不可用，回退到原始方式
            const searchResultsCount = document.getElementById('searchResultsCount');
            if (searchResultsCount) {
                searchResultsCount.textContent = allResults.length;
            }
            
            const resultsDiv = document.getElementById('results');
            if (!allResults || allResults.length === 0) {
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
            }
        }
    } catch (error) {
        console.error('搜索错误:', error);
        if (error.name === 'AbortError') {
            showToast('搜索请求超时，请检查网络连接', 'error');
        } else {
            showToast('搜索请求失败，请稍后重试', 'error');
        }
    } finally {
        hideLoading();
    }
}

// 显示详情 - 修改为支持自定义API
async function showDetails(id, vod_name, sourceCode) {
    // 密码保护校验
    if (window.isPasswordProtected && window.isPasswordVerified) {
        if (window.isPasswordProtected() && !window.isPasswordVerified()) {
            showPasswordModal && showPasswordModal();
            return;
        }
    }
    if (!id) {
        showToast('视频ID无效', 'error');
        return;
    }
    
    showLoading();
    try {
        // 构建API参数
        let apiParams = '';
        
        // 处理自定义API源
        if (sourceCode.startsWith('custom_')) {
            const customIndex = sourceCode.replace('custom_', '');
            const customApi = getCustomApiInfo(customIndex);
            if (!customApi) {
                showToast('自定义API配置无效', 'error');
                hideLoading();
                return;
            }
            // 传递 detail 字段
            if (customApi.detail) {
                apiParams = '&customApi=' + encodeURIComponent(customApi.url) + '&customDetail=' + encodeURIComponent(customApi.detail) + '&source=custom';
            } else {
                apiParams = '&customApi=' + encodeURIComponent(customApi.url) + '&source=custom';
            }
        } else {
            // 内置API
            apiParams = '&source=' + sourceCode;
        }
        
        const response = await fetch('/api/detail?id=' + encodeURIComponent(id) + apiParams);
        
        const data = await response.json();
        
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modalTitle');
        const modalContent = document.getElementById('modalContent');
        
        // 显示来源信息
        const sourceName = data.videoInfo && data.videoInfo.source_name ? 
            ` <span class="text-sm font-normal text-gray-400">(${data.videoInfo.source_name})</span>` : '';
        
        // 不对标题进行截断处理，允许完整显示
        modalTitle.innerHTML = `<span class="break-words">${vod_name || '未知视频'}</span>${sourceName}`;
        currentVideoTitle = vod_name || '未知视频';
        
        if (data.episodes && data.episodes.length > 0) {
            // 安全处理集数URL
            const safeEpisodes = data.episodes.map(url => {
                try {
                    // 确保URL是有效的并且是http或https开头
                    return url && (url.startsWith('http://') || url.startsWith('https://'))
                        ? url.replace(/"/g, '&quot;')
                        : '';
                } catch (e) {
                    return '';
                }
            }).filter(url => url); // 过滤掉空URL
            
            // 保存当前视频的所有集数
            currentEpisodes = safeEpisodes;
            episodesReversed = false; // 默认正序
            modalContent.innerHTML = `
                <div class="flex justify-end mb-2">
                    <button onclick="toggleEpisodeOrder('${sourceCode}')" class="px-4 py-1 bg-[#222] hover:bg-[#333] border border-[#333] rounded-lg transition-colors flex items-center space-x-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clip-rule="evenodd" />
                        </svg>
                        <span>倒序排列</span>
                    </button>
                    <button title="批量复制播放链接" onclick="copyLinks()" class="ml-2 px-2 py-1 bg-[#222] hover:bg-[#333] border border-[#333] text-white rounded-lg transition">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                    </button>
                </div>
                <div id="episodesGrid" class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                    ${renderEpisodes(vod_name, sourceCode)}
                </div>
            `;
        } else {
            modalContent.innerHTML = '<p class="text-center text-gray-400 py-8">没有找到可播放的视频</p>';
        }
        
        modal.classList.remove('hidden');
    } catch (error) {
        console.error('获取详情错误:', error);
        showToast('获取详情失败，请稍后重试', 'error');
    } finally {
        hideLoading();
    }
}

// 更新播放视频函数，修改为在新标签页中打开播放页面，并保存到历史记录
function playVideo(url, vod_name, sourceCode, episodeIndex = 0) {
    // 密码保护校验
    if (window.isPasswordProtected && window.isPasswordVerified) {
        if (window.isPasswordProtected() && !window.isPasswordVerified()) {
            showPasswordModal && showPasswordModal();
            return;
        }
    }
    if (!url) {
        showToast('无效的视频链接', 'error');
        return;
    }
    
    // 获取当前视频来源名称（从模态框标题中提取）
    let sourceName = '';
    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) {
        const sourceSpan = modalTitle.querySelector('span.text-gray-400');
        if (sourceSpan) {
            // 提取括号内的来源名称, 例如从 "(黑木耳)" 提取 "黑木耳"
            const sourceText = sourceSpan.textContent;
            const match = sourceText.match(/\(([^)]+)\)/);
            if (match && match[1]) {
                sourceName = match[1].trim();
            }
        }
    }
    
    // 保存当前状态到localStorage，让播放页面可以获取
    const currentVideoTitle = vod_name;
    localStorage.setItem('currentVideoTitle', currentVideoTitle);
    localStorage.setItem('currentEpisodeIndex', episodeIndex);
    localStorage.setItem('currentEpisodes', JSON.stringify(currentEpisodes));
    localStorage.setItem('episodesReversed', episodesReversed);
    
    // 构建视频信息对象，使用标题作为唯一标识
    const videoTitle = vod_name || currentVideoTitle;
    const videoInfo = {
        title: videoTitle,
        url: url,
        episodeIndex: episodeIndex,
        sourceName: sourceName,
        timestamp: Date.now(),
        // 重要：将完整的剧集信息也添加到历史记录中
        episodes: currentEpisodes && currentEpisodes.length > 0 ? [...currentEpisodes] : []
    };
    
    // 保存到观看历史，添加sourceName
    if (typeof addToViewingHistory === 'function') {
        addToViewingHistory(videoInfo);
    }
    
    // 构建播放页面URL，传递必要参数
    const playerUrl = `player.html?url=${encodeURIComponent(url)}&title=${encodeURIComponent(videoTitle)}&index=${episodeIndex}&source=${encodeURIComponent(sourceName)}&source_code=${encodeURIComponent(sourceCode)}`;
    
    // 在当前标签页中打开播放页面
    window.location.href = playerUrl;
}

// 播放上一集
function playPreviousEpisode(sourceCode) {
    if (currentEpisodeIndex > 0) {
        const prevIndex = currentEpisodeIndex - 1;
        const prevUrl = currentEpisodes[prevIndex];
        playVideo(prevUrl, currentVideoTitle, sourceCode, prevIndex);
    }
}

// 播放下一集
function playNextEpisode(sourceCode) {
    if (currentEpisodeIndex < currentEpisodes.length - 1) {
        const nextIndex = currentEpisodeIndex + 1;
        const nextUrl = currentEpisodes[nextIndex];
        playVideo(nextUrl, currentVideoTitle, sourceCode, nextIndex);
    }
}

// 处理播放器加载错误
function handlePlayerError() {
    hideLoading();
    showToast('视频播放加载失败，请尝试其他视频源', 'error');
}

// 辅助函数用于渲染剧集按钮（使用当前的排序状态）
function renderEpisodes(vodName, sourceCode) {
    const episodes = episodesReversed ? [...currentEpisodes].reverse() : currentEpisodes;
    return episodes.map((episode, index) => {
        // 根据倒序状态计算真实的剧集索引
        const realIndex = episodesReversed ? currentEpisodes.length - 1 - index : index;
        return `
            <button id="episode-${realIndex}" onclick="playVideo('${episode}','${vodName.replace(/"/g, '&quot;')}', '${sourceCode}', ${realIndex})" 
                    class="px-4 py-2 bg-[#222] hover:bg-[#333] border border-[#333] rounded-lg transition-colors text-center episode-btn">
                第${realIndex + 1}集
            </button>
        `;
    }).join('');
}

// 复制视频链接到剪贴板
function copyLinks() {
    const episodes = episodesReversed ? [...currentEpisodes].reverse() : currentEpisodes;
    const linkList = episodes.join('\r\n');
    navigator.clipboard.writeText(linkList).then(() => {
        showToast('播放链接已复制', 'success');
    }).catch(err => {
        showToast('复制失败，请检查浏览器权限', 'error');
    });
}

// 切换排序状态的函数
function toggleEpisodeOrder(sourceCode) {
    episodesReversed = !episodesReversed;
    // 重新渲染剧集区域，使用 currentVideoTitle 作为视频标题
    const episodesGrid = document.getElementById('episodesGrid');
    if (episodesGrid) {
        episodesGrid.innerHTML = renderEpisodes(currentVideoTitle, sourceCode);
    }
    
    // 更新按钮文本和箭头方向
    const toggleBtn = document.querySelector(`button[onclick="toggleEpisodeOrder('${sourceCode}')"]`);
    if (toggleBtn) {
        toggleBtn.querySelector('span').textContent = episodesReversed ? '正序排列' : '倒序排列';
        const arrowIcon = toggleBtn.querySelector('svg');
        if (arrowIcon) {
            arrowIcon.style.transform = episodesReversed ? 'rotate(180deg)' : 'rotate(0deg)';
        }
    }
}

// 配置文件导入功能
async function importConfig() {
    showImportBox(async (file) => {
        try {
            // 检查文件类型
            if (!(file.type === 'application/json' || file.name.endsWith('.json'))) throw '文件类型不正确';

            // 检查文件大小
            if(file.size > 1024 * 1024 * 10) throw new Error('文件大小超过 10MB');

            // 读取文件内容
            const content = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = () => reject('文件读取失败');
                reader.readAsText(file);
            });

            // 解析并验证配置
            const config = JSON.parse(content);
            if (config.name !== 'LibreTV-Settings') throw '配置文件格式不正确';

            // 验证哈希
            const dataHash = await sha256(JSON.stringify(config.data));
            if (dataHash !== config.hash) throw '配置文件哈希值不匹配';

            // 导入配置
            for (let item in config.data) {
                localStorage.setItem(item, config.data[item]);
            }
            
            showToast('配置文件导入成功，3 秒后自动刷新本页面。', 'success');
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } catch (error) {
            const message = typeof error === 'string' ? error : '配置文件格式错误';
            showToast(`配置文件读取出错 (${message})`, 'error');
        }
    });
}

// 配置文件导出功能
async function exportConfig() {
    // 存储配置数据
    const config = {};

    // 读取全部 localStorage 项
    const items = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        items[key] = localStorage.getItem(key);
    }

    const times = Date.now().toString();
    config['name'] = 'LibreTV-Settings';  // 配置文件名，用于校验
    config['time'] = times;               // 配置文件生成时间
    config['cfgVer'] = '1.0.0';           // 配置文件版本
    config['data'] = items;               // 配置文件数据
    config['hash'] = await sha256(JSON.stringify(config['data']));  // 计算数据的哈希值，用于校验

    // 将配置数据保存为 JSON 文件
    saveStringAsFile(JSON.stringify(config), 'LibreTV-Settings_' + times + '.json');
}

// 将字符串保存为文件
function saveStringAsFile(content, fileName) {
    // 创建Blob对象并指定类型
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    // 生成临时URL
    const url = window.URL.createObjectURL(blob);
    // 创建<a>标签并触发下载
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    // 清理临时对象
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// 黑名单管理功能
function updateBlacklistCount() {
    if (window.adultSitesFilter) {
        const count = window.adultSitesFilter.getBlacklist().length;
        const countElement = document.getElementById('blacklistCount');
        const modalCountElement = document.getElementById('modalBlacklistCount');
        
        if (countElement) countElement.textContent = count;
        if (modalCountElement) modalCountElement.textContent = count;
    }
}

function showBlacklistManager() {
    const modal = document.getElementById('blacklistModal');
    if (modal) {
        updateBlacklistDisplay();
        modal.style.display = 'flex';
    }
}

function closeBlacklistModal() {
    const modal = document.getElementById('blacklistModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function updateBlacklistDisplay() {
    if (!window.adultSitesFilter) return;
    
    const container = document.getElementById('blacklistContainer');
    const searchInput = document.getElementById('blacklistSearchInput');
    const blacklist = window.adultSitesFilter.getBlacklist();
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    
    // 过滤域名
    const filteredList = blacklist.filter(domain => 
        domain.toLowerCase().includes(searchTerm)
    );
    
    if (container) {
        if (filteredList.length === 0) {
            container.innerHTML = '<div class="text-center text-gray-400 py-4">没有找到匹配的域名</div>';
        } else {
            container.innerHTML = filteredList.map((domain, index) => `
                <div class="flex items-center justify-between py-2 px-3 bg-[#333] rounded mb-2">
                    <span class="text-white text-sm">${domain}</span>
                    <button onclick="removeDomainFromBlacklist('${domain}')" 
                            class="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded hover:bg-red-600/20 transition-colors"
                            title="移除此域名">
                        删除
                    </button>
                </div>
            `).join('');
        }
    }
    
    updateBlacklistCount();
}

function filterBlacklistDisplay() {
    updateBlacklistDisplay();
}

function addDomainToBlacklist() {
    const input = document.getElementById('newDomainInput');
    if (!input || !window.adultSitesFilter) return;
    
    const domain = input.value.trim();
    if (!domain) {
        showToast('请输入有效的域名', 'error');
        return;
    }
    
    // 简单的域名验证
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!domainRegex.test(domain)) {
        showToast('域名格式不正确', 'error');
        return;
    }
    
    if (window.adultSitesFilter.addToBlacklist(domain)) {
        input.value = '';
        updateBlacklistDisplay();
        showToast(`已添加 ${domain} 到黑名单`, 'success');
    } else {
        showToast('该域名已存在于黑名单中', 'warning');
    }
}

function removeDomainFromBlacklist(domain) {
    if (window.adultSitesFilter && window.adultSitesFilter.removeFromBlacklist(domain)) {
        updateBlacklistDisplay();
        showToast(`已从黑名单移除 ${domain}`, 'success');
    }
}

function resetBlacklist() {
    if (confirm('确定要重置黑名单为默认设置吗？这将删除所有自定义添加的域名。')) {
        if (window.adultSitesFilter) {
            window.adultSitesFilter.resetToDefault();
            updateBlacklistCount();
            showToast('黑名单已重置为默认设置', 'success');
        }
    }
}

function resetBlacklistToDefault() {
    if (confirm('确定要重置黑名单为默认设置吗？这将删除所有自定义添加的域名。')) {
        if (window.adultSitesFilter) {
            window.adultSitesFilter.resetToDefault();
            updateBlacklistDisplay();
            showToast('黑名单已重置为默认设置', 'success');
        }
    }
}

function exportBlacklist() {
    if (!window.adultSitesFilter) return;
    
    const blacklist = window.adultSitesFilter.getBlacklist();
    const data = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        blacklist: blacklist
    };
    
    const content = JSON.stringify(data, null, 2);
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:\-]/g, '');
    saveStringAsFile(content, `adult-sites-blacklist-${timestamp}.json`);
    showToast('黑名单已导出', 'success');
}

function importBlacklist() {
    const fileInput = document.getElementById('blacklistFileInput');
    if (fileInput) {
        fileInput.click();
    }
}

function handleBlacklistImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            let importedData;
            
            if (file.name.endsWith('.json')) {
                const data = JSON.parse(e.target.result);
                importedData = data.blacklist || data;
            } else {
                // 处理纯文本文件，每行一个域名
                importedData = e.target.result.split('\n')
                    .map(line => line.trim())
                    .filter(line => line.length > 0);
            }
            
            if (!Array.isArray(importedData)) {
                throw new Error('无效的文件格式');
            }
            
            // 合并到现有黑名单
            let addedCount = 0;
            importedData.forEach(domain => {
                if (window.adultSitesFilter.addToBlacklist(domain)) {
                    addedCount++;
                }
            });
            
            updateBlacklistDisplay();
            showToast(`成功导入 ${addedCount} 个新域名`, 'success');
            
        } catch (error) {
            console.error('导入黑名单失败:', error);
            showToast('导入失败，请检查文件格式', 'error');
        }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // 清空文件输入
}

// TMDB API密钥管理功能
function loadTmdbApiKey() {
    const apiKey = localStorage.getItem('tmdbApiKey');
    const input = document.getElementById('tmdbApiKeyInput');
    const status = document.getElementById('tmdbApiStatus');
    
    if (input && apiKey) {
        input.value = apiKey;
    }
    
    if (status) {
        if (apiKey) {
            status.innerHTML = '<span class="text-green-400">✓ 已配置自定义API密钥</span>';
        } else {
            status.innerHTML = '<span class="text-yellow-400">⚠ 使用默认API密钥（可能失效）</span>';
        }
    }
}

function saveTmdbApiKey() {
    const input = document.getElementById('tmdbApiKeyInput');
    const status = document.getElementById('tmdbApiStatus');
    
    if (!input) return;
    
    const apiKey = input.value.trim();
    if (!apiKey) {
        showToast('请输入API密钥', 'error');
        return;
    }
    
    // 简单的API密钥格式验证
    if (apiKey.length < 20) {
        showToast('API密钥格式不正确', 'error');
        return;
    }
    
    localStorage.setItem('tmdbApiKey', apiKey);
    
    if (status) {
        status.innerHTML = '<span class="text-green-400">✓ API密钥已保存</span>';
    }
    
    showToast('TMDB API密钥已保存', 'success');
}

async function testTmdbApiKey() {
    const input = document.getElementById('tmdbApiKeyInput');
    const status = document.getElementById('tmdbApiStatus');
    
    if (!input) return;
    
    const apiKey = input.value.trim() || localStorage.getItem('tmdbApiKey');
    if (!apiKey) {
        showToast('请先输入API密钥', 'error');
        return;
    }
    
    if (status) {
        status.innerHTML = '<span class="text-blue-400">🔄 正在测试...</span>';
    }
    
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=zh-CN&page=1`);
        
        if (response.ok) {
            if (status) {
                status.innerHTML = '<span class="text-green-400">✓ API密钥有效</span>';
            }
            showToast('API密钥测试成功！', 'success');
        } else if (response.status === 401) {
            if (status) {
                status.innerHTML = '<span class="text-red-400">✗ API密钥无效</span>';
            }
            showToast('API密钥无效，请检查并重新输入', 'error');
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        console.error('TMDB API测试失败:', error);
        if (status) {
            status.innerHTML = '<span class="text-red-400">✗ 测试失败</span>';
        }
        showToast('API测试失败，请检查网络连接', 'error');
    }
}

function clearTmdbApiKey() {
    if (confirm('确定要清除TMDB API密钥吗？这将使用默认密钥（可能失效）。')) {
        localStorage.removeItem('tmdbApiKey');
        
        const input = document.getElementById('tmdbApiKeyInput');
        const status = document.getElementById('tmdbApiStatus');
        
        if (input) input.value = '';
        if (status) {
            status.innerHTML = '<span class="text-yellow-400">⚠ 已清除，使用默认密钥</span>';
        }
        
        showToast('TMDB API密钥已清除', 'success');
    }
}

function showTmdbApiHelp() {
    const helpText = `
TMDB API密钥获取步骤：

1. 访问 https://www.themoviedb.org/
2. 注册或登录账户
3. 进入 Settings > API 页面
4. 申请 API Key (v3 auth)
5. 复制 API Key 并粘贴到输入框中

API密钥是免费的，用于获取电影和电视剧数据。
    `.trim();
    
    alert(helpText);
}

// 页面加载时初始化黑名单计数和TMDB API密钥
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        updateBlacklistCount();
        loadTmdbApiKey();
    }, 500);
});
