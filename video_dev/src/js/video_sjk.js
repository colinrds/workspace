import css from '../css/v_style.css';
var Hls = require('./s_hls.js');
var panel = require('./panel.js');
var fullscreen = require('./fullscreen.js');

$('#level').click(function () {
    hls.currentLevel = 1;
})

function sVideo(options) {
    var defaults = {
        width: 640,
        height: 360,
        heightSize: '',
        autoStartLoad: true,
        maxBufferSize: 10, //最大缓冲区大小
        playOrStop: true,
        volume: 0
    };
    this.config = $.extend(defaults, options);
    this.id = document.querySelector(this.config.id);
    this._hls = new Hls(this.config);
    this.panel = panel;
    this.init();
}
sVideo.prototype = {
    panelEvent: function () {
        var that = this;
        var timeOut;
        $(this.id).hover(
            function () {
                clearTimeout(timeOut)
                that.showOrHide('show');
            },
            function () {
                timeOut = setTimeout(function () {
                    that.showOrHide('hide')
                }, 3000)
            }
        )
        this.parentDom.find('.operate_bar').hover(
            function () {
                clearTimeout(timeOut)
                that.showOrHide('show');
            },
            function () {
                timeOut = setTimeout(function () {
                    that.showOrHide('hide')
                }, 3000)
            }
        )
        this.parentDom.find('.ob_switch').click(this.playOrStop.bind(this));
        this.parentDom.find('.ob_process').on('click', this.percentage.bind(this));
        this.parentDom.find('.ob_voice').on('click', this.soundPlayOrStop.bind(this));
        this.parentDom.find('.ob_voice_bar').on('click', this.onvolumechange.bind(this));
        this.parentDom.find('.ob_full_screen').on('click', fullscreen.enterFullScreen.bind(this));
        this.parentDom.find('.ob_regain').on('click', fullscreen.exitFullScreen.bind(this));
        this.id.onwaiting = function () {
            panel.loadCode(that.parentDom);
        }
        //缓冲完毕继续播放事件
        this.id.onplaying = function () {
            panel.removeLoadCode(that.parentDom);
        }
        $(this.id).click(this.playOrStop.bind(this));
        this.id.addEventListener("ended", function () {
            console.log("结束");
        })
    },
    //显示隐藏bar
    showOrHide: function (state) {
        if (state == 'show') {
            this.parentDom.find('.operate_bar').css('bottom', '0');
        }
        if (state == 'hide') {
            this.parentDom.find('.operate_bar').css('bottom', '-50px');
        }
    },
    //播放和暂停事件
    playOrStop: function () {
        if (this.playOrStop) {
            this.id.play();
            this.parentDom.find('.ob_switch').removeClass('ob_play_icon').addClass('ob_pause_icon');
            this.playOrStop = false;
        } else {
            this.id.pause();
            this.parentDom.find('.ob_switch').removeClass('ob_pause_icon').addClass('ob_play_icon');
            this.playOrStop = true;
        }
    },
    //音量按钮
    soundPlayOrStop: function () {
        if (this.id.volume != 0) {
            this.volume = this.id.volume;
            console.log('记录');
        }
        console.log(this.id.muted);
        if (this.id.muted) {
            this.id.muted = false;
            this.id.volume = this.volume;
            this.parentDom.find('.ob_voice').removeClass('ob_voice_mute').addClass('ob_voice_big');
        } else {
            this.id.muted = true;
            this.id.volume = 0;
            this.parentDom.find('.ob_voice').removeClass('ob_voice_big').addClass('ob_voice_mute');
        }
    },
    _is: {
        object: function (input) {
            return input !== null && typeof (input) === 'object';
        },
        array: function (input) {
            return input !== null && (typeof (input) === 'object' && input.constructor === Array);
        },
        number: function (input) {
            return input !== null && (typeof (input) === 'number' && !isNaN(input - 0) || (typeof input === 'object' && input.constructor === Number));
        },
        string: function (input) {
            return input !== null && (typeof input === 'string' || (typeof input === 'object' && input.constructor === String));
        },
        boolean: function (input) {
            return input !== null && typeof input === 'boolean';
        },
        nodeList: function (input) {
            return input !== null && input instanceof NodeList;
        },
        htmlElement: function (input) {
            return input !== null && input instanceof HTMLElement;
        },
        function: function (input) {
            return input !== null && typeof input === 'function';
        },
        undefined: function (input) {
            return input !== null && typeof input === 'undefined';
        }
    },
    //音量改变事件
    onvolumechange: function (event) {
        var soundBarWidth = this.getDomWidth('ob_voice_bar');
        var clickWidth = this.mouseCurrentX('ob_voice_bar', event);
        this.parentDom.find('.ob_voice_process').css('width', clickWidth / soundBarWidth.toFixed(2) * 100 + '%');
        this.id.volume = clickWidth / soundBarWidth.toFixed(2);
    },
    //播放控制器初始化 
    playInit: function () {
        this.id.ontimeupdate = this.update.bind(this);
        fullscreen.fullscreenchange(this);

    },
    //进度条点击事件
    percentage: function (event) {
        var widthCurr = this.mouseCurrentX('ob_process', event) / this.parentDom.find('.ob_process').width()
        this.id.currentTime = widthCurr * this.allTime();
    },
    //计算鼠标相对元素X坐标
    mouseCurrentX: function (dmNm, event) {
        var e = event || window.event;
        var dom = this.parentDom.find('.' + dmNm);
        return e.clientX - parseInt(dom.offset().left);
    },
    //获取元素的宽度
    getDomWidth: function (dmNm) {
        var dom = this.parentDom.find('.' + dmNm);
        return parseInt(dom.width());
    },
    // 时时监听播放进度
    update: function () {
        var duration = this.timeConversion(parseInt(this.allTime()));
        var currentTime = Math.floor(this.id.currentTime);
        this.parentDom.find('.ob_time-all').text(duration);
        this.parentDom.find('.ob_process_load').css('width', this.bufferedTime() + '%')
        this.parentDom.find('.ob_time-recent').text(this.timeConversion(currentTime));
        this.parentDom.find('.ob_process_play').css('width', this.currentTime() + '%')
        this.parentDom.find('.ob_process_btn').css('left', this.currentTime() + '%');
        this.parentDom.find('.ob_voice_process').css('width', this.id.volume * 100 + '%');
    },
    //当前播放进度
    currentTime: function () {
        return (this.id.currentTime / this.allTime()).toFixed(3) * 100;
    },
    //当前缓存加载进度
    bufferedTime: function () {
        return (this.id.buffered.end(0) / this.allTime()).toFixed(2) * 100;
    },
    //视频总长度
    allTime: function () {
        return this.id.duration;
    },
    //初始化hls错误事件绑定
    create: function () {
        var that = this;
        this._hls.on(Hls.Events.MEDIA_ATTACHED, this.onMediaAttached.bind(this));
        this._hls.on(Hls.Events.MANIFEST_PARSED, this.onManifestParsed.bind(this));
        this._hls.on(Hls.Events.FRAG_BUFFERED, this.onBuffered.bind(this))
        this._hls.on(Hls.Events.LEVEL_LOADED, this.onLevelLoaded.bind(this));
        this._hls.on(Hls.Events.ERROR, this.onError.bind(this));
    },
    onBuffered: function () {

    },
    // 转换秒为分钟
    timeConversion: function (tim) {
        var second = tim % 60; // 秒
        var min = parseInt(tim / 60); // 分 
        return (Array(2).join(0) + min).slice(-2) + ':' + (Array(2).join(0) + second).slice(-2);
    },
    // 连接到媒体元素时触发
    onMediaAttached: function () {
        var panelCode = this.panel.panelCode();
        this._hls.loadSource(this.config.url);
        $(this.config.id).wrap('<div class="s_video"></div>');
        $(this.id).after(panelCode);
        this.parentDom = $(this.id).parents('.s_video');
        this.parentDom.css({
            'width': this.config.width+'px',
            'height': this.config.height+'px'
        })
        this.playInit();
        this.panelEvent();
    },
    // 显示播放列表信息
    onManifestParsed: function (event, data) {
        console.log(data.levels);
    },
    // 主播放列表加载完成时触发
    onLevelLoaded: function (event, data) {

    },
    // HLS错误反馈
    onError: function (event, data) {
        if (data.fatal) {
            switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                    // try to recover network error
                    console.log('fatal network error encountered, try to recover');
                    this.hls_.startLoad();
                    break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                    console.log('fatal media error encountered, try to recover');
                    this.hls_.recoverMediaError();
                    break;
                default:
                    // cannot recover
                    this.error(data);
                    this.hls_.destroy();
                    break;
            }
        }
    },
    // 错误处理
    error: function (data) {
        console.log(data);
    },
    init: function () {
        var that = this;
        console.log(this);
        this._hls.attachMedia(this.id);
        this._hls.currentLevel = 0;
        this.create();
    }
}


//反射调用
var invokeFieldOrMethod = function (element, method) {
    var usablePrefixMethod;
    ["webkit", "moz", "ms", "o", ""].forEach(function (prefix) {
        if (usablePrefixMethod) return;
        if (prefix === "") {
            // 无前缀，方法首字母小写
            method = method.slice(0, 1).toLowerCase() + method.slice(1);
        }
        var typePrefixMethod = typeof element[prefix + method];
        if (typePrefixMethod + "" !== "undefined") {
            if (typePrefixMethod === "function") {
                usablePrefixMethod = element[prefix + method]();
            } else {
                usablePrefixMethod = element[prefix + method];
            }
        }
    });

    return usablePrefixMethod;
};


new sVideo({
    id: '#video_one',
    url: 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8',
    width: '640',
    height: '360'
    // url: 'http://cdn.sanjieke.cn/hahahaha/ori.m3u8'
    // url: 'https://www.ifreesec.com/test/3001090.m3u8'
})