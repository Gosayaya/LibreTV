// 黄色站点过滤器 - 用于屏蔽成人内容网站
class AdultSitesFilter {
    constructor() {
        this.loadBlacklist();
        this.initEventListeners();
    }

    // 默认黄色站点黑名单
    getDefaultBlacklist() {
        return [
            // 常见成人网站域名
            'avgle.com',
            'pornhub.com',
            'xvideos.com',
            'xhamster.com',
            'xnxx.com',
            'youporn.com',
            'redtube.com',
            'tube8.com',
            'spankbang.com',
            'tnaflix.com',
            'drtuber.com',
            'porn.com',
            'porntube.com',
            'xtube.com',
            'beeg.com',
            'txxx.com',
            'hclips.com',
            'nuvid.com',
            'sunporno.com',
            'alphaporno.com',
            'upornia.com',
            'ok.xxx',
            'hdzog.com',
            'analdin.com',
            'vjav.com',
            'javhd.com',
            'jav777.com',
            'javbus.com',
            'javmost.com',
            'javfree.me',
            'javbangers.com',
            'javdoe.com',
            'javhihi.com',
            'javgg.net',
            'javporn.tv',
            'javhub.net',
            'javmix.tv',
            'javmost.com',
            'javhd.com',
            'javfinder.la',
            'javhdporn.net',
            'javhdporn.net',
            'javporn.tv',
            // 中文成人网站
            '91porn.com',
            '99bb.com',
            'caoporn.com'
        ];
    }

    // 敏感关键词列表
    getSensitiveKeywords() {
        return [
            // 中文敏感词（扩展版）
            '伦理片', '福利', '里番动漫', '门事件', '萝莉少女', '制服诱惑', 
            '国产传媒', 'cosplay', '黑丝诱惑', '无码', '日本无码', '有码', 
            '日本有码', 'SWAG', '网红主播', '色情片', '同性片', '福利视频', 
            '福利片', '三级片', '情色', '成人', '限制级', '18禁', '成人动漫',
            '激情', '诱惑', '艳情', '情趣', '性感', '床戏', '露点', '脱衣',
            '比基尼', '丝袜', '内衣', '透视', '挑逗', '调教', '束缚', '变态',
            '猎奇', '重口味', '血腥', '暴力', '恐怖', '惊悚', '悬疑',
            '写真', '美女', '车模', '嫩模', '外围', '援交', '包养', '一夜情',
            '约炮', '性爱', '做爱', '自慰', '口交', '肛交', '群交', '乱伦',
            '强奸', '轮奸', '性虐', '偷拍', '走光', '凸点', '春光', '激凸',
            '人体艺术', '人体摄影', '裸体', '全裸', '半裸', '艳照', '私房照',
            
            // 英文敏感词（扩展版）
            'porn', 'sex', 'adult', 'xxx', 'nude', 'naked', 'erotic', 
            'seductive', 'sexy', 'intimate', 'sensual', 'explicit', 
            'mature', 'uncensored', 'av', 'hentai', 'ecchi', 'yaoi', 
            'yuri', 'fetish', 'bdsm', 'amateur', 'milf', 'teen', 
            'barely legal', 'hardcore', 'softcore', 'lingerie', 'bikini',
            'strip', 'cam', 'webcam', 'live', 'chat', 'dating', 'hookup',
            'threesome', 'gangbang', 'orgy', 'anal', 'oral', 'blowjob',
            'masturbation', 'orgasm', 'climax', 'cumshot', 'facial',
            'creampie', 'lesbian', 'gay', 'bisexual', 'transgender',
            'kinky', 'nasty', 'dirty', 'naughty', 'slutty', 'horny',
            'voyeur', 'exhibitionist', 'swingers', 'escort', 'prostitute',
            'brothel', 'redlight', 'playboy', 'penthouse', 'hustler',
            'playmate', 'centerfold', 'topless', 'bottomless', 'upskirt',
            'panties', 'bra', 'underwear', 'thong', 'stockings', 'pantyhose',
            
            // 常见变体和隐晦表达
            'p0rn', 's3x', 'pr0n', 'fck', 'f*ck', 'sh*t', 'b*tch',
            '色情', '黄色', '成人片', '限制片', '伦理', '情色片', '艳片',
            'AV片', 'H片', 'R级', 'NC-17', 'X级', '18+', '21+',
            
            // 平台相关
            'onlyfans', 'chaturbate', 'myfreecams', 'livejasmin', 'stripchat',
            'camsoda', 'cam4', 'bongacams', 'flirt4free', 'streamate'
        ];
    }

    // 加载黑名单
    loadBlacklist() {
        try {
            const stored = localStorage.getItem('adultSitesBlacklist');
            if (stored) {
                this.blacklist = JSON.parse(stored);
            } else {
                this.blacklist = this.getDefaultBlacklist();
                this.saveBlacklist();
            }
        } catch (error) {
            console.error('加载黑名单失败:', error);
            this.blacklist = this.getDefaultBlacklist();
        }
    }

    // 保存黑名单
    saveBlacklist() {
        try {
            localStorage.setItem('adultSitesBlacklist', JSON.stringify(this.blacklist));
        } catch (error) {
            console.error('保存黑名单失败:', error);
        }
    }

    // 检查URL是否在黑名单中
    isBlacklisted(url) {
        if (!url || typeof url !== 'string') return false;
        
        const yellowFilterEnabled = localStorage.getItem('yellowFilterEnabled') === 'true';
        if (!yellowFilterEnabled) return false;

        try {
            const domain = this.extractDomain(url);
            return this.blacklist.some(blacklistedDomain => {
                return domain.includes(blacklistedDomain) || blacklistedDomain.includes(domain);
            });
        } catch (error) {
            console.error('检查黑名单失败:', error);
            return false;
        }
    }

    // 检查内容是否包含敏感词
    containsSensitiveContent(content) {
        if (!content || typeof content !== 'string') return false;
        
        const yellowFilterEnabled = localStorage.getItem('yellowFilterEnabled') === 'true';
        if (!yellowFilterEnabled) return false;

        const sensitiveWords = this.getSensitiveKeywords();
        const lowerContent = content.toLowerCase();
        
        return sensitiveWords.some(keyword => {
            return lowerContent.includes(keyword.toLowerCase());
        });
    }

    // 提取域名
    extractDomain(url) {
        try {
            if (url.startsWith('http://') || url.startsWith('https://')) {
                return new URL(url).hostname;
            } else {
                // 假设是域名
                return url.split('/')[0];
            }
        } catch (error) {
            console.error('提取域名失败:', error);
            return url;
        }
    }

    // 过滤API列表
    filterAPIs(apis) {
        if (!Array.isArray(apis)) return apis;
        
        return apis.filter(api => {
            // 检查API URL
            if (api.url && this.isBlacklisted(api.url)) {
                return false;
            }
            
            // 检查API名称
            if (api.name && this.containsSensitiveContent(api.name)) {
                return false;
            }
            
            return true;
        });
    }

    // 过滤搜索结果
    filterSearchResults(results) {
        if (!Array.isArray(results)) return results;
        
        return results.filter(item => {
            // 检查标题
            if (item.vod_name && this.containsSensitiveContent(item.vod_name)) {
                return false;
            }
            
            // 检查分类
            if (item.type_name && this.containsSensitiveContent(item.type_name)) {
                return false;
            }
            
            // 检查描述
            if (item.vod_content && this.containsSensitiveContent(item.vod_content)) {
                return false;
            }
            
            return true;
        });
    }

    // 添加到黑名单
    addToBlacklist(domain) {
        if (domain && !this.blacklist.includes(domain)) {
            this.blacklist.push(domain);
            this.saveBlacklist();
            return true;
        }
        return false;
    }

    // 从黑名单移除
    removeFromBlacklist(domain) {
        const index = this.blacklist.indexOf(domain);
        if (index > -1) {
            this.blacklist.splice(index, 1);
            this.saveBlacklist();
            return true;
        }
        return false;
    }

    // 重置为默认黑名单
    resetToDefault() {
        this.blacklist = this.getDefaultBlacklist();
        this.saveBlacklist();
    }

    // 获取当前黑名单
    getBlacklist() {
        return [...this.blacklist];
    }

    // 初始化事件监听器
    initEventListeners() {
        // 监听黄色过滤开关变化
        document.addEventListener('DOMContentLoaded', () => {
            const yellowFilterToggle = document.getElementById('yellowFilterToggle');
            if (yellowFilterToggle) {
                yellowFilterToggle.addEventListener('change', (e) => {
                    // 可以在这里添加额外的逻辑
                    console.log('黄色内容过滤已', e.target.checked ? '启用' : '禁用');
                });
            }
        });
    }
}

// 创建全局实例
window.adultSitesFilter = new AdultSitesFilter();

// 导出给其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdultSitesFilter;
} 