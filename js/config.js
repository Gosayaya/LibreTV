// 全局常量配置
const PROXY_URL = '/proxy/';    // 适用于 Cloudflare, Netlify (带重写), Vercel (带重写)
// const HOPLAYER_URL = 'https://hoplayer.com/index.html';
const SEARCH_HISTORY_KEY = 'videoSearchHistory';
const MAX_HISTORY_ITEMS = 5;

// 密码保护配置
const PASSWORD_CONFIG = {
    localStorageKey: 'passwordVerified',  // 存储验证状态的键名
    verificationTTL: 90 * 24 * 60 * 60 * 1000,  // 验证有效期（90天，约3个月）
};

// 网站信息配置
const SITE_CONFIG = {
    name: 'LannuodoTV',
    url: 'https://libretv.is-an.org',
    description: '免费在线视频搜索与观看平台',
    logo: 'https://images.icon-icons.com/38/PNG/512/retrotv_5520.png',
    version: '1.0.3'
};

// API站点配置
const API_SITES = {
    dyttzy: {
        api: 'http://caiji.dyttzyapi.com',
        name: '电影天堂资源',
        detail: 'http://caiji.dyttzyapi.com',
    },
    ruyi: {
        api: 'https://cj.rycjapi.com',
        name: '如意资源',
    },
    bfzy: {
        api: 'https://bfzyapi.com',
        name: '暴风资源',
    },
    tyyszy: {
        api: 'https://tyyszy.com',
        name: '天涯资源',
    },
    ffzy: {
        api: 'http://ffzy5.tv',
        name: '非凡影视',
        detail: 'http://ffzy5.tv',
    },
    heimuer: {
        api: 'https://json.heimuer.xyz',
        name: '黑木耳',
        detail: 'https://heimuer.tv',
    },
    zy360: {
        api: 'https://360zy.com',
        name: '360资源',
    },
    wolong: {
        api: 'https://wolongzyw.com',
        name: '卧龙资源',
    },
    hwba: {
        api: 'https://cjhwba.com',
        name: '华为吧资源',
    },
    jisu: {
        api: 'https://jszyapi.com',
        name: '极速资源',
        detail: 'https://jszyapi.com'
    },
    dbzy: {
        api: 'https://dbzy.com',
        name: '豆瓣资源',
    },
    huya: {
        api: 'https://www.huyaapi.com',
        name: '虎牙资源',
        detail: 'https://www.huyaapi.com',
    },
    mozhua: {
        api: 'https://mozhuazy.com',
        name: '魔爪资源',
    },
    mdzy: {
        api: 'https://www.mdzyapi.com',
        name: '魔都资源',
    },
    zuid: {
        api: 'https://api.zuidapi.com',
        name: '最大资源'
    },
    yinghua: {
        api: 'https://m3u8.apiyhzy.com',
        name: '樱花资源'
    },
    baidu: {
        api: 'https://api.apibdzy.com',
        name: '百度云资源'
    },
    wujin: {
        api: 'https://api.wujinapi.me',
        name: '无尽资源'
    },
    wwzy: {
        api: 'https://wwzy.tv',
        name: '旺旺短剧'
    },
    ikun: {
        api: 'https://ikunzyapi.com',
        name: 'iKun资源'
    },
    // 已验证有效的视频源
    hongniu: {
        api: 'https://www.hongniuzy2.com',
        name: '红牛资源'
    },
    jinyingzy: {
        api: 'https://jinyingzy.com',
        name: '金鹰资源'
    },
    feifei: {
        api: 'https://cj.ffzyapi.com',
        name: '飞飞资源'
    },
    // 新增经过验证的有效API源
    mahua: {
        api: 'https://www.mahuaapi.com',
        name: '麻花资源'
    },
    subocaiji: {
        api: 'https://www.subocaiji.com',
        name: '速播资源'
    },
    kubo: {
        api: 'https://www.kubo-api.com',
        name: '酷播资源'
    },
    ukuapi: {
        api: 'https://api.ukuapi.com',
        name: 'U酷资源'
    },
    zxzjhd: {
        api: 'https://api.zxzjhd.com',
        name: '在线之家'
    },
    shijiapi: {
        api: 'https://api.shijiapi.com',
        name: '世纪资源'
    },
    yhzy: {
        api: 'https://api.yhzy.cc',
        name: '影狐资源'
    },
    tiankongapi: {
        api: 'https://api.tiankongapi.com',
        name: '天空资源'
    },
    apibdzy: {
        api: 'https://api.apibdzy.com',
        name: '百度云资源'
    },
    dbjfyy: {
        api: 'https://www.dbjfyy.com',
        name: '豆瓣电影'
    },
    parwix: {
        api: 'https://api.parwix.com',
        name: 'parwix资源'
    },
    // 其他稳定资源站
    lezhutv: {
        api: 'https://www.lezhutv.com',
        name: '乐猪TV'
    },
    miaoparty: {
        api: 'https://caiji.miaoparty3.com',
        name: '喵派对'
    },
    kyzy123: {
        api: 'https://caiji.kyzy123.com',
        name: '快云资源'
    },
    kuyun98: {
        api: 'https://caiji.kuyun98.com',
        name: '酷云资源'
    },
    bjm3u8: {
        api: 'https://cj.bjm3u8.com',
        name: '八戒M3U8'
    },
    okzy: {
        api: 'https://cj.okzy.tv',
        name: 'OK资源'
    },
    xlmlsp: {
        api: 'https://cj.xlmlsp.com',
        name: '新浪资源'
    },
    snzy: {
        api: 'https://www.snzy.tv',
        name: '苏宁资源'
    },
    
    // 欧美影视专用源（经验证的真实API）
    oumeizy: {
        api: 'https://www.oumeizy.net',
        name: '欧美资源网',
        region: 'europe_america'
    },
    meijutt: {
        api: 'https://www.meijutt.tv',
        name: '美剧天堂',
        region: 'europe_america'
    },
    yingshidaquan: {
        api: 'https://www.ysdq123.com',
        name: '影视大全',
        region: 'europe_america'
    },
    
    // 日本影视专用源（基于真实采集站）
    ribenzy: {
        api: 'https://www.rbjp.net',
        name: '日本资源',
        region: 'japan'
    },
    dongmanzy: {
        api: 'https://www.dm233.me',
        name: '动漫资源',
        region: 'japan'
    },
    
    // 韩国影视专用源（基于真实采集站）
    hanguotv: {
        api: 'https://www.hgtv520.com',
        name: '韩国TV',
        region: 'korea'
    },
    hanjutv: {
        api: 'https://www.hanjutv.com',
        name: '韩剧TV',
        region: 'korea'
    },
    
    // 泰国及东南亚源
    taijutv: {
        api: 'https://www.taijutv.com',
        name: '泰剧TV',
        region: 'thailand'
    },
    
    // 成人内容的API源，默认隐藏，使用本项目浏览黄色内容违背项目初衷
    ckzy: {
        api: 'https://www.ckzy1.com',
        name: 'CK资源',
        adult: true
    },
    jkun: {
        api: 'https://jkunzyapi.com',
        name: 'jkun资源',
        adult: true
    },
    bwzy: {
        api: 'https://api.bwzym3u8.com',
        name: '百万资源',
        adult: true
    },
    souav: {
        api: 'https://api.souavzy.vip',
        name: 'souav资源',
        adult: true
    },
    r155: {
        api: 'https://155api.com',
        name: '155资源',
        adult: true
    },
    lsb: {
        api: 'https://apilsbzy1.com',
        name: 'lsb资源',
        adult: true
    },
    huangcang: {
        api: 'https://hsckzy.vip',
        name: '黄色仓库',
        adult: true,
        detail: 'https://hsckzy.vip'
    },
    yutu: {
        api: 'https://yutuzy10.com',
        name: '玉兔资源',
        adult: true
    },
    // 成人内容API源（已验证有效的保留）
    caoliu: {
        api: 'https://caoliuzy.com',
        name: '草榴资源',
        adult: true
    },
    bbzy: {
        api: 'https://bbzy.tv',
        name: 'BB资源',
        adult: true
    }
};

// 添加聚合搜索的配置选项
const AGGREGATED_SEARCH_CONFIG = {
    enabled: true,             // 是否启用聚合搜索
    timeout: 5000,            // 单个源超时时间（毫秒）- 降低超时时间提高响应速度
    maxResults: 20000,         // 最大结果数量 - 增加以适应更多源
    parallelRequests: true,   // 是否并行请求所有源
    showSourceBadges: true,   // 是否显示来源徽章
    maxConcurrentRequests: 15, // 最大并发请求数 - 增加以适应更多源
    retryFailedRequests: false, // 是否重试失败的请求
    prioritySources: ['ruyi', 'bfzy', 'jisu', 'hongniu', 'jinyingzy'], // 优先使用的源
    regionPriority: {         // 地区优先级配置
        'europe_america': ['meijutt', 'oumeizy', 'yingshidaquan'],
        'japan': ['ribenzy', 'dongmanzy'],
        'korea': ['hanjutv', 'hanguotv'],
        'thailand': ['taijutv']
    },
    enableRegionBalancing: true // 是否启用地区均衡搜索
};

// 抽象API请求配置
const API_CONFIG = {
    search: {
    	// 修改搜索接口为返回更多详细数据（包括视频封面、简介和播放列表）
        path: '/api.php/provide/vod/?ac=videolist&wd=',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': 'application/json'
        }
    },
    detail: {
    	// 修改详情接口也使用videolist接口，但是通过ID查询，减少请求次数
        path: '/api.php/provide/vod/?ac=videolist&ids=',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': 'application/json'
        }
    }
};

// 优化后的正则表达式模式
const M3U8_PATTERN = /\$https?:\/\/[^"'\s]+?\.m3u8/g;

// 添加自定义播放器URL
const CUSTOM_PLAYER_URL = 'player.html'; // 使用相对路径引用本地player.html

// 增加视频播放相关配置
const PLAYER_CONFIG = {
    autoplay: true,
    allowFullscreen: true,
    width: '100%',
    height: '600',
    timeout: 15000,  // 播放器加载超时时间
    filterAds: true,  // 是否启用广告过滤
    autoPlayNext: true,  // 默认启用自动连播功能
    adFilteringEnabled: true, // 默认开启分片广告过滤
    adFilteringStorage: 'adFilteringEnabled', // 存储广告过滤设置的键名
    
    // 分辨率切换配置
    qualityControl: {
        enabled: true,
        default: 'auto',  // 默认画质
        options: [
            { value: 'auto', label: '自动', bitrate: -1 },
            { value: '1080', label: '1080P', bitrate: 8000000 },
            { value: '720', label: '720P', bitrate: 4000000 },
            { value: '480', label: '480P', bitrate: 2000000 },
            { value: '360', label: '360P', bitrate: 1000000 }
        ],
        storageKey: 'preferred_quality',  // 存储用户选择的键名
        autoDowngrade: true,  // 网络不佳时自动降级
        showBitrate: true,    // 是否显示码率信息
        adaptiveBitrate: true // 是否启用自适应码率
    },
    
    // 地区内容播放优化
    regionOptimization: {
        'europe_america': {
            preferredQuality: '1080p',
            subtitleDefault: 'zh-CN',
            bufferSize: 30 // 秒
        },
        'japan': {
            preferredQuality: '720p',
            subtitleDefault: 'zh-CN',
            bufferSize: 20
        },
        'korea': {
            preferredQuality: '720p',
            subtitleDefault: 'zh-CN',
            bufferSize: 25
        },
        'thailand': {
            preferredQuality: '480p',
            subtitleDefault: 'zh-CN',
            bufferSize: 15
        }
    },
    
    // 跨域播放支持
    crossOriginPlayback: true,
    allowCORS: true,
    proxyFallback: true  // 当直连失败时使用代理
};

// 增加错误信息本地化
const ERROR_MESSAGES = {
    NETWORK_ERROR: '网络连接错误，请检查网络设置',
    TIMEOUT_ERROR: '请求超时，服务器响应时间过长',
    API_ERROR: 'API接口返回错误，请尝试更换数据源',
    PLAYER_ERROR: '播放器加载失败，请尝试其他视频源',
    UNKNOWN_ERROR: '发生未知错误，请刷新页面重试'
};

// 添加进一步安全设置
const SECURITY_CONFIG = {
    enableXSSProtection: true,  // 是否启用XSS保护
    sanitizeUrls: true,         // 是否清理URL
    maxQueryLength: 100,        // 最大搜索长度
    // allowedApiDomains 不再需要，因为所有请求都通过内部代理
};

// 添加多个自定义API源的配置
const CUSTOM_API_CONFIG = {
    separator: ',',           // 分隔符
    maxSources: 25,           // 最大允许的自定义源数量
    testTimeout: 5000,        // 测试超时时间(毫秒)
    namePrefix: 'Custom-',    // 自定义源名称前缀
    validateUrl: true,        // 验证URL格式
    cacheResults: true,       // 缓存测试结果
    cacheExpiry: 5184000000,  // 缓存过期时间(2个月)
    adultPropName: 'isAdult' // 用于标记成人内容的属性名
};

// 隐藏内置黄色采集站API的变量
const HIDE_BUILTIN_ADULT_APIS = false;

// 成人内容显示配置
const ADULT_CONTENT_CONFIG = {
    showAdultApis: true,           // 是否显示成人内容API源
    requireAgeVerification: false, // 是否需要年龄验证
    adultContentWarning: false,    // 是否显示成人内容警告
    separateAdultSources: true     // 是否单独显示成人内容源
};

// API源质量监控配置
const API_QUALITY_CONFIG = {
    enableMonitoring: true,        // 是否启用质量监控
    monitoringInterval: 300000,    // 监控间隔（5分钟）
    maxFailureRate: 0.3,          // 最大失败率（30%）
    minResponseTime: 2000,        // 最小响应时间（2秒）
    autoDisableFailingSources: false, // 是否自动禁用失败的源
    qualityScoreThreshold: 0.7,   // 质量分数阈值
    storageKey: 'api_quality_data' // 存储质量数据的键名
};

// 地区内容过滤配置
const REGION_FILTER_CONFIG = {
    enableRegionFilter: true,      // 是否启用地区过滤
    defaultRegions: ['china', 'europe_america', 'japan', 'korea'], // 默认启用的地区
    regionNames: {
        'china': '国产',
        'europe_america': '欧美',
        'japan': '日本',
        'korea': '韩国',
        'thailand': '泰国',
        'uk': '英国',
        'germany': '德国',
        'france': '法国'
    },
    showRegionBadges: true,        // 是否显示地区标识
    allowMultipleRegions: true,    // 是否允许多地区同时选择
    storageKey: 'selected_regions' // 存储用户选择的地区设置
};

// 多语言和字幕配置
const LANGUAGE_CONFIG = {
    enableMultiLanguage: true,     // 是否启用多语言支持
    defaultLanguage: 'zh-CN',      // 默认语言
    supportedLanguages: {
        'zh-CN': '简体中文',
        'zh-TW': '繁体中文',
        'en-US': 'English',
        'ja-JP': '日本語',
        'ko-KR': '한국어',
        'th-TH': 'ไทย',
        'de-DE': 'Deutsch',
        'fr-FR': 'Français'
    },
    subtitlePreferences: {
        'europe_america': ['en-US', 'zh-CN'],
        'japan': ['ja-JP', 'zh-CN'],
        'korea': ['ko-KR', 'zh-CN'],
        'thailand': ['th-TH', 'zh-CN']
    },
    enableAutoDetection: true,     // 是否启用语言自动检测
    storageKey: 'language_settings' // 存储语言设置的键名
};

// 分页配置
const PAGINATION_CONFIG = {
    defaultItemsPerPage: 24,        // 默认每页显示数量
    maxPageButtons: 7,              // 最大显示页码按钮数量
    itemsPerPageOptions: [12, 24, 48, 96], // 每页显示选项
    showPageInfo: true,             // 是否显示页面信息
    scrollToTop: true,              // 翻页时是否滚动到顶部
    storageKey: 'pagination_settings' // 存储分页设置的键名
};
