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
    
    // 新增欧美影视资源源
    meijuzy: {
        api: 'https://www.meijuzy.com',
        name: '美剧资源',
        region: 'europe_america'
    },
    oumeitv: {
        api: 'https://api.oumeitv.com',
        name: '欧美TV',
        region: 'europe_america'
    },
    usafilm: {
        api: 'https://www.usafilm.net',
        name: '美国电影网',
        region: 'europe_america'
    },
    ukdrama: {
        api: 'https://api.ukdrama.com',
        name: '英剧资源',
        region: 'europe_america'
    },
    europezy: {
        api: 'https://www.europezy.com',
        name: '欧洲资源',
        region: 'europe_america'
    },
    westfilm: {
        api: 'https://api.westfilm.tv',
        name: '西方影视',
        region: 'europe_america'
    },
    americatv: {
        api: 'https://www.americatv.net',
        name: '美国电视',
        region: 'europe_america'
    },
    hollywoodzy: {
        api: 'https://api.hollywoodzy.com',
        name: '好莱坞资源',
        region: 'europe_america'
    },
    netflixzy: {
        api: 'https://www.netflixzy.com',
        name: 'Netflix资源',
        region: 'europe_america'
    },
    hbomax: {
        api: 'https://api.hbomax.tv',
        name: 'HBO Max资源',
        region: 'europe_america'
    },
    disneyplus: {
        api: 'https://www.disneyplus.tv',
        name: 'Disney+资源',
        region: 'europe_america'
    },
    primevideozy: {
        api: 'https://api.primevideozy.com',
        name: 'Prime Video资源',
        region: 'europe_america'
    },
    huluzy: {
        api: 'https://www.huluzy.net',
        name: 'Hulu资源',
        region: 'europe_america'
    },
    appletv: {
        api: 'https://api.appletv.com',
        name: 'Apple TV+资源',
        region: 'europe_america'
    },
    paramountzy: {
        api: 'https://www.paramountzy.com',
        name: 'Paramount+资源',
        region: 'europe_america'
    },
    peacockzy: {
        api: 'https://api.peacockzy.tv',
        name: 'Peacock资源',
        region: 'europe_america'
    },
    showtime: {
        api: 'https://www.showtime.tv',
        name: 'Showtime资源',
        region: 'europe_america'
    },
    starzzy: {
        api: 'https://api.starzzy.com',
        name: 'Starz资源',
        region: 'europe_america'
    },
    cinemax: {
        api: 'https://www.cinemax.tv',
        name: 'Cinemax资源',
        region: 'europe_america'
    },
    epixzy: {
        api: 'https://api.epixzy.com',
        name: 'Epix资源',
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

// IMDB推荐配置
const IMDB_CONFIG = {
    enabled: true,
    apiKeys: ['trilogy', 'b9a57b81', '2c6d98b', 'ff15bdef'], // OMDB API密钥
    baseUrl: 'https://www.omdbapi.com/',
    timeout: 8000,
    maxRetries: 3,
    cacheExpiry: 3600000, // 1小时缓存
    fallbackEnabled: true,
    
    // 播放源映射 - 将IMDB内容映射到本地API源
    sourceMapping: {
        // 优先使用的播放源（按优先级排序）
        priority: ['ruyi', 'bfzy', 'jisu', 'hongniu', 'jinyingzy', 'feifei'],
        // 地区特定映射
        regionMapping: {
            'US': ['meijutt', 'oumeizy', 'yingshidaquan', 'meijuzy', 'usafilm', 'americatv', 'hollywoodzy', 'netflixzy', 'hbomax'],
            'UK': ['meijutt', 'oumeizy', 'ukdrama', 'europezy', 'westfilm'],
            'CA': ['meijutt', 'oumeizy', 'americatv', 'westfilm'],
            'AU': ['meijutt', 'oumeizy', 'westfilm', 'europezy']
        }
    },
    
    // 搜索优化
    searchOptimization: {
        enableYearFilter: true,        // 启用年份过滤
        enableGenreMapping: true,      // 启用类型映射
        titleNormalization: true,      // 标题标准化
        removeSpecialChars: true,      // 移除特殊字符
        maxSearchAttempts: 3           // 最大搜索尝试次数
    },
    
    storageKey: 'imdb_settings'
};

// TMDB推荐配置
const TMDB_CONFIG = {
    enabled: true,
    apiKey: '3fd2be6f0c70a2a598f084ddfb75487c', // 默认API密钥
    baseUrl: 'https://api.themoviedb.org/3/',
    imageBaseUrl: 'https://image.tmdb.org/t/p/',
    timeout: 10000,
    language: 'zh-CN',
    region: 'CN',
    
    // 播放源映射
    sourceMapping: {
        // 优先使用的播放源
        priority: ['ruyi', 'bfzy', 'jisu', 'hongniu', 'jinyingzy', 'mahua'],
        // 内容类型映射
        contentTypeMapping: {
            'movie': ['ruyi', 'bfzy', 'jisu', 'hongniu'],
            'tv': ['ruyi', 'bfzy', 'jinyingzy', 'mahua']
        },
        // 地区映射
        regionMapping: {
            'US': ['meijutt', 'oumeizy', 'yingshidaquan', 'meijuzy', 'usafilm', 'americatv', 'hollywoodzy', 'netflixzy', 'hbomax', 'disneyplus', 'primevideozy', 'huluzy'],
            'GB': ['meijutt', 'oumeizy', 'ukdrama', 'europezy', 'westfilm'],
            'JP': ['ribenzy', 'dongmanzy'],
            'KR': ['hanjutv', 'hanguotv'],
            'TH': ['taijutv']
        }
    },
    
    // 搜索优化
    searchOptimization: {
        enableOriginalTitle: true,     // 使用原始标题搜索
        enableTranslatedTitle: true,   // 使用翻译标题搜索
        enableReleaseYear: true,       // 包含发行年份
        titleVariations: true,         // 尝试标题变体
        maxSearchAttempts: 4
    },
    
    // 图片配置
    imageConfig: {
        posterSizes: ['w300', 'w500', 'w780', 'original'],
        backdropSizes: ['w300', 'w780', 'w1280', 'original'],
        defaultPosterSize: 'w300',
        defaultBackdropSize: 'w780'
    },
    
    storageKey: 'tmdb_settings'
};

// TVMaze推荐配置
const TVMAZE_CONFIG = {
    enabled: true,
    baseUrl: 'https://api.tvmaze.com/',
    timeout: 8000,
    maxRetries: 2,
    
    // 播放源映射
    sourceMapping: {
        // 优先使用的播放源（电视剧专用）
        priority: ['ruyi', 'bfzy', 'jinyingzy', 'mahua', 'jisu'],
        // 网络映射
        networkMapping: {
            'Netflix': ['ruyi', 'bfzy', 'jinyingzy'],
            'HBO': ['ruyi', 'bfzy', 'mahua'],
            'Amazon Prime Video': ['ruyi', 'jinyingzy'],
            'Hulu': ['bfzy', 'jinyingzy'],
            'Disney+': ['ruyi', 'mahua'],
            'Apple TV+': ['ruyi', 'bfzy']
        },
        // 地区映射
        regionMapping: {
            'US': ['meijutt', 'oumeizy', 'yingshidaquan', 'meijuzy', 'usafilm', 'americatv', 'hollywoodzy', 'netflixzy', 'hbomax', 'disneyplus', 'primevideozy', 'huluzy'],
            'UK': ['meijutt', 'oumeizy', 'ukdrama', 'europezy', 'westfilm'],
            'JP': ['ribenzy', 'dongmanzy'],
            'KR': ['hanjutv', 'hanguotv']
        }
    },
    
    // 搜索优化
    searchOptimization: {
        enableNetworkInfo: true,       // 包含网络信息
        enableGenreMapping: true,      // 类型映射
        enableSeasonEpisode: true,     // 季集信息
        titleNormalization: true,      // 标题标准化
        maxSearchAttempts: 3
    },
    
    // 分类配置
    categories: {
        'popular': '热门剧集',
        'today': '今日播出',
        'schedule': '播出时间表',
        'premieres': '首播剧集'
    },
    
    storageKey: 'tvmaze_settings'
};

// 推荐服务统一配置
const RECOMMENDATION_CONFIG = {
    // 全局设置
    globalSettings: {
        enableRecommendations: true,
        autoSearchPlaySources: true,    // 自动搜索播放源
        showSourceIndicators: true,     // 显示播放源指示器
        enableCaching: true,           // 启用缓存
        cacheExpiry: 1800000,         // 30分钟缓存
        maxConcurrentSearches: 5,     // 最大并发搜索数
        searchTimeout: 15000          // 搜索超时时间
    },
    
    // 播放源优先级（全局）
    globalSourcePriority: [
        'ruyi', 'bfzy', 'jisu', 'hongniu', 'jinyingzy', 'feifei', 'mahua',
        'subocaiji', 'kubo', 'ukuapi', 'zxzjhd', 'shijiapi', 'yhzy'
    ],
    
    // 搜索策略
    searchStrategy: {
        // 标题处理策略
        titleProcessing: {
            removeYear: true,           // 移除年份
            removeSpecialChars: true,   // 移除特殊字符
            normalizeSpaces: true,      // 标准化空格
            tryOriginalTitle: true,     // 尝试原始标题
            tryTranslatedTitle: true,   // 尝试翻译标题
            tryShortTitle: true         // 尝试简短标题
        },
        
        // 搜索顺序
        searchOrder: [
            'exact_match',              // 精确匹配
            'fuzzy_match',             // 模糊匹配
            'partial_match',           // 部分匹配
            'alternative_title'        // 备选标题
        ],
        
        // 结果过滤
        resultFiltering: {
            minQualityScore: 0.6,      // 最小质量分数
            preferHigherResolution: true, // 优先高分辨率
            filterDuplicates: true,    // 过滤重复结果
            maxResultsPerSource: 10    // 每个源最大结果数
        }
    },
    
    // 用户界面配置
    uiConfig: {
        showLoadingIndicators: true,   // 显示加载指示器
        showSearchProgress: true,      // 显示搜索进度
        enableQuickPlay: true,         // 启用快速播放
        showSourceBadges: true,        // 显示来源标识
        enablePreview: false,          // 启用预览功能
        animationDuration: 300         // 动画持续时间
    },
    
    storageKey: 'recommendation_global_settings'
};

// 播放源质量评估配置
const SOURCE_QUALITY_CONFIG = {
    // 质量指标权重
    qualityWeights: {
        responseTime: 0.3,     // 响应时间权重
        successRate: 0.4,      // 成功率权重
        videoQuality: 0.2,     // 视频质量权重
        stability: 0.1         // 稳定性权重
    },
    
    // 质量阈值
    qualityThresholds: {
        excellent: 0.9,        // 优秀
        good: 0.7,            // 良好
        fair: 0.5,            // 一般
        poor: 0.3             // 较差
    },
    
    // 自动优化
    autoOptimization: {
        enabled: true,
        reorderSources: true,  // 重新排序播放源
        disablePoorSources: false, // 禁用质量差的源
        updateInterval: 86400000   // 24小时更新间隔
    },
    
    storageKey: 'source_quality_data'
};

// 标题匹配和播放源查找配置
const TITLE_MATCHING_CONFIG = {
    // 标题转换规则
    titleTransformation: {
        // 英文标题到中文标题的映射规则
        englishToChinese: {
            // 常见电影标题映射
            'The Shawshank Redemption': '肖申克的救赎',
            'The Godfather': '教父',
            'The Dark Knight': '蝙蝠侠：黑暗骑士',
            'Forrest Gump': '阿甘正传',
            'Inception': '盗梦空间',
            'The Matrix': '黑客帝国',
            'Pulp Fiction': '低俗小说',
            'Fight Club': '搏击俱乐部',
            'Goodfellas': '好家伙',
            'The Lord of the Rings': '指环王',
            'Star Wars': '星球大战',
            'The Avengers': '复仇者联盟',
            'Titanic': '泰坦尼克号',
            'Avatar': '阿凡达',
            'Interstellar': '星际穿越',
            'The Departed': '无间道风云',
            'The Prestige': '致命魔术',
            'Gladiator': '角斗士',
            'The Lion King': '狮子王',
            'Saving Private Ryan': '拯救大兵瑞恩',
            'Jurassic Park': '侏罗纪公园',
            'Terminator': '终结者',
            'Back to the Future': '回到未来',
            'Casino': '赌城风云',
            'Heat': '盗火线',
            'Se7en': '七宗罪',
            'The Silence of the Lambs': '沉默的羔羊',
            'Alien': '异形',
            'Blade Runner': '银翼杀手',
            'The Shining': '闪灵',
            'Psycho': '惊魂记',
            'Vertigo': '迷魂记',
            'Citizen Kane': '公民凯恩',
            'Gone Girl': '消失的爱人',
            'Zodiac': '十二宫',
            'Mad Max Fury Road': '疯狂的麦克斯：狂暴之路',
            'John Wick': '疾速追杀',
            'Deadpool': '死侍',
            'Iron Man': '钢铁侠',
            'Spider-Man': '蜘蛛侠',
            
            // 常见电视剧标题映射
            'Breaking Bad': '绝命毒师',
            'Game of Thrones': '权力的游戏',
            'The Sopranos': '黑道家族',
            'Friends': '老友记',
            'The Office': '办公室',
            'Stranger Things': '怪奇物语',
            'The Crown': '王冠',
            'House of Cards': '纸牌屋',
            'Sherlock': '神探夏洛克',
            'True Detective': '真探',
            'The Walking Dead': '行尸走肉',
            'Lost': '迷失',
            'Prison Break': '越狱',
            'Dexter': '嗜血法医',
            'House': '豪斯医生',
            'How I Met Your Mother': '老爸老妈浪漫史',
            'The Big Bang Theory': '生活大爆炸',
            'Westworld': '西部世界',
            'Black Mirror': '黑镜',
            'Fargo': '冰血暴',
            'Better Call Saul': '风骚律师',
            'Vikings': '维京传奇',
            'The Mandalorian': '曼达洛人',
            'Narcos': '毒枭',
            'Ozark': '奥扎克',
            'Succession': '继承之战',
            'The Witcher': '猎魔人',
            'Money Heist': '纸钞屋',
            'Dark': '暗黑'
        },
        
        // 标题清理规则
        cleaningRules: {
            // 移除的前缀
            removePrefixes: ['The ', 'A ', 'An '],
            // 移除的后缀
            removeSuffixes: [' (TV Series)', ' (Movie)', ' (Film)'],
            // 移除的特殊字符
            removeSpecialChars: [':', '?', '!', '-', '–', '—', '(', ')', '[', ']', '{', '}'],
            // 替换规则
            replacements: {
                '&': 'and',
                '@': 'at',
                '#': 'number',
                '$': 'dollar'
            }
        },
        
        // 年份处理
        yearHandling: {
            removeFromTitle: true,      // 从标题中移除年份
            useForFiltering: true,      // 使用年份过滤结果
            yearTolerance: 2            // 年份容差（±2年）
        }
    },
    
    // 搜索策略配置
    searchStrategies: [
        {
            name: 'exact_chinese_match',
            description: '精确中文匹配',
            enabled: true,
            priority: 1,
            method: 'exact',
            useTranslation: true
        },
        {
            name: 'exact_english_match',
            description: '精确英文匹配',
            enabled: true,
            priority: 2,
            method: 'exact',
            useTranslation: false
        },
        {
            name: 'fuzzy_chinese_match',
            description: '模糊中文匹配',
            enabled: true,
            priority: 3,
            method: 'fuzzy',
            useTranslation: true,
            threshold: 0.8
        },
        {
            name: 'partial_match',
            description: '部分匹配',
            enabled: true,
            priority: 4,
            method: 'partial',
            minLength: 3
        },
        {
            name: 'keyword_match',
            description: '关键词匹配',
            enabled: true,
            priority: 5,
            method: 'keywords',
            minKeywords: 2
        }
    ],
    
    // 结果评分配置
    scoringConfig: {
        // 评分权重
        weights: {
            titleSimilarity: 0.4,      // 标题相似度
            yearMatch: 0.2,            // 年份匹配
            sourceQuality: 0.2,        // 播放源质量
            completeness: 0.1,         // 信息完整度
            popularity: 0.1            // 热门程度
        },
        
        // 最小分数阈值
        minScore: 0.6,
        
        // 最大返回结果数
        maxResults: 10
    }
};

// 播放源匹配增强配置
const SOURCE_MATCHING_CONFIG = {
    // 匹配策略
    matchingStrategies: {
        // 启用多源并行搜索
        parallelSearch: true,
        
        // 搜索超时时间（毫秒）
        searchTimeout: 12000,
        
        // 最大并发搜索数
        maxConcurrentSearches: 8,
        
        // 重试配置
        retryConfig: {
            enabled: true,
            maxRetries: 2,
            retryDelay: 1000
        }
    },
    
    // 播放源优先级（针对国外内容）
    foreignContentSources: {
        // 欧美内容优先源
        western: [
            'ruyi', 'bfzy', 'jisu', 'hongniu', 'jinyingzy', 'feifei',
            'mahua', 'subocaiji', 'kubo', 'ukuapi', 'meijutt', 'oumeizy',
            'meijuzy', 'oumeitv', 'usafilm', 'ukdrama', 'europezy', 'westfilm',
            'americatv', 'hollywoodzy', 'netflixzy', 'hbomax', 'disneyplus',
            'primevideozy', 'huluzy', 'appletv', 'paramountzy', 'peacockzy',
            'showtime', 'starzzy', 'cinemax', 'epixzy'
        ],
        
        // 日韩内容优先源
        asian: [
            'ruyi', 'bfzy', 'jinyingzy', 'mahua', 'ribenzy', 'dongmanzy',
            'hanjutv', 'hanguotv', 'jisu', 'hongniu'
        ],
        
        // 通用备选源
        fallback: [
            'zxzjhd', 'shijiapi', 'yhzy', 'tiankongapi', 'apibdzy',
            'dbjfyy', 'parwix', 'lezhutv', 'miaoparty'
        ]
    },
    
    // 内容类型映射
    contentTypeMapping: {
        'movie': {
            keywords: ['电影', '影片', '片'],
            preferredSources: ['ruyi', 'bfzy', 'jisu', 'hongniu']
        },
        'tv': {
            keywords: ['电视剧', '剧集', '连续剧', '美剧', '韩剧', '日剧'],
            preferredSources: ['ruyi', 'bfzy', 'jinyingzy', 'mahua']
        },
        'anime': {
            keywords: ['动漫', '动画', '番剧'],
            preferredSources: ['ribenzy', 'dongmanzy', 'ruyi', 'bfzy']
        }
    },
    
    // 结果过滤配置
    resultFiltering: {
        // 过滤低质量结果
        filterLowQuality: true,
        
        // 最小标题相似度
        minTitleSimilarity: 0.5,
        
        // 去重配置
        deduplication: {
            enabled: true,
            similarityThreshold: 0.9
        },
        
        // 年份过滤
        yearFiltering: {
            enabled: true,
            tolerance: 3  // ±3年
        }
    }
};

// 智能搜索增强配置
const SMART_SEARCH_CONFIG = {
    // 搜索增强功能
    enhancements: {
        // 自动标题翻译
        autoTranslation: {
            enabled: true,
            services: ['builtin', 'fallback'],  // 内置翻译 + 备选方案
            cacheResults: true,
            cacheExpiry: 2592000000  // 30天缓存
        },
        
        // 智能关键词提取
        keywordExtraction: {
            enabled: true,
            minKeywordLength: 2,
            maxKeywords: 5,
            excludeCommonWords: true
        },
        
        // 相似度计算
        similarityCalculation: {
            algorithm: 'levenshtein',  // 编辑距离算法
            threshold: 0.6,
            caseSensitive: false
        }
    },
    
    // 搜索优化
    optimization: {
        // 缓存搜索结果
        cacheResults: true,
        cacheDuration: 1800000,  // 30分钟
        
        // 预加载热门内容
        preloadPopular: true,
        
        // 搜索建议
        searchSuggestions: {
            enabled: true,
            maxSuggestions: 5,
            includeAlternativeTitles: true
        }
    },
    
    // 失败处理
    failureHandling: {
        // 无结果时的备选策略
        fallbackStrategies: [
            'try_alternative_titles',
            'try_partial_match',
            'try_keyword_search',
            'try_similar_content'
        ],
        
        // 错误重试
        retryOnError: true,
        maxRetries: 2,
        
        // 用户提示
        showSuggestions: true
    }
};
