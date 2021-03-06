var panelstatus = true;
var slider = $(".bxslider").bxSlider({
    controls: false,
    auto: true,
    onSlideAfter: function () {
        autostartslider()
    }
});
$(".bxslider2").bxSlider({
    controls: false,
    auto: true,
    mode: "fade"
});
$(".bxslider3").bxSlider({
    controls: false,
    auto: true,
    mode: "fade"
});
$(".bxslider4").bxSlider({
    controls: false,
    auto: true,
    mode: "fade"
});

function autostartslider() {
    slider.startAuto()
}
var timer = setInterval("change()", 5000);
$("body").on("load", change());

function change() {
    var a = new Date();
    count = a.getSeconds() % 3;
    images = $(".bxslider5 a");
    for (i = 0; i < images.length; i++) {
        images.eq(i).hide();
        if (Math.round(i % 3) == count) {
            images.eq(i).show("slow")
        }
    }
}
$(".btnclose").click(function () {
    if (panelstatus == true) {
        $(".prizeinfo").animate({
            height: "41px"
        }, 700, function () {
            $(".btnclose").css("background-position", "0 104px")
        });
        panelstatus = false
    } else {
        $(".prizeinfo").animate({
            height: "360px"
        }, 700, function () {
            $(".btnclose").css("background-position", "0 0")
        });
        panelstatus = true
    }
});
$(".promobanner").click(function () {
    var b = $(this).parent().find(".contentbody");
    var a = $(b).css("display");
    if (a == "block") {
        $(b).fadeOut(500)
    } else {
        $(b).fadeIn(500)
    }
});
$(".contentbody").each(function (a, b) {
    if (a == 0) {
        $(this).css("display", "block")
    } else {
        $(this).css("display", "none")
    }
});

function clearallbox() {
    $(".itms").css("border", "1px solid #999");
    $(".itms").css("z-index", "1");
    $(".sprite").removeClass("icon1");
    $(".sprite").removeClass("icon2");
    $(".sprite").removeClass("icon3");
    $(".sprite").removeClass("icon4");
    $(".sprite").removeClass("icon5");
    $(".sprite").removeClass("icon6");
    $(".sprite").removeClass("icon7");
    $(".itms").css("color", "#666");
    $(".col2").css("display", "none")
}
$(".itms").click(function () {
    clearallbox();
    $(this).css("border", "1px solid #1f5fb2");
    $(this).css("border-right", "1px solid #fff");
    $(this).css("z-index", "9");
    $(this).css("color", "#1f5fb2");
    var a = $(this).index();
    var b = a + 1;
    $("#content" + b).css("display", "block");
    $(this).find(".sprite").addClass("icon" + b)
});
$(".wechat").hover(function () {
    $(".wechatqr").stop(true, true).fadeIn(500)
}, function () {
    $(".wechatqr").stop(true, true).fadeOut(200)
});
$(".download").hover(function () {
    $(".downloadqr").stop(true, true).fadeIn(500)
}, function () {
    $(".downloadqr").stop(true, true).fadeOut(200)
});
$(".phoneback").hover(function () {
    $(".phonebackqr").stop(true, true).fadeIn(500)
}, function () {
    $(".phonebackqr").stop(true, true).fadeOut(200)
});

function scrolltop() {
    $(window).scrollTop(0)
}

function socialpanel() {
    var a = $(window).scrollTop();
    if (a == 0) {
        $(".scrolltop").css("display", "none")
    } else {
        $(".scrolltop").css("display", "block")
    }
}
socialpanel();

function tick() {
    $("#ticker1 li:first").slideUp(function () {
        $(this).appendTo($("#ticker1")).slideDown()
    });
    $("#ticker2 li:first").slideUp(function () {
        $(this).appendTo($("#ticker2")).slideDown()
    })
}
setInterval(function () {
    tick()
}, 4000);
var stat1 = 25;
var statprogress1 = 25;
var stat2 = 120;
var statprogress2 = 65;
var stat3 = 34;
var animationtime = 1700;
var animationspd = 50;
var timerend = animationtime / 50;
var timer1 = 0;
var timer2 = 0;
var timer3 = 0;
var barwidth = 200;

function countUp1() {
    var a = stat1 * animationspd / animationtime * timer1;
    a = Math.floor(a);
    $("#count1").text(a);
    if (timer1 == timerend) {
        clearInterval(stat1_ani)
    } else {
        timer1 += 1
    }
}

function converTime(c) {
    var b = ~~(c / 60);
    var a = c % 60;
    ret = "";
    ret += "" + b + "&lsquo;" + (a < 10 ? "0" : "");
    ret += "" + a;
    return ret
}

function countUp2() {
    var b = stat2 * animationspd / animationtime * timer2;
    b = Math.floor(b);
    var a = converTime(b);
    $("#count2").html(a);
    if (timer2 == timerend) {
        clearInterval(stat2_ani)
    } else {
        timer2 += 1
    }
}

function countUp3() {
    var a = stat3 * animationspd / animationtime * timer3;
    a = Math.floor(a);
    $("#count3").text(a);
    if (timer3 == timerend) {
        clearInterval(stat3_ani)
    } else {
        timer3 += 1
    }
}

function progressbar1() {
    var a = statprogress1 / 100 * barwidth;
    $("#bar1").animate({
        right: "-=" + a
    }, animationtime)
}

function progressbar2() {
    var a = statprogress2 / 100 * barwidth;
    $("#bar2").animate({
        right: "-=" + a
    }, animationtime)
}
var stat1_ani;
var stat2_ani;
var stat3_ani;
var bodyheight = $("body").height();
var scrollY = $(window).height();
$(window).resize(function () {
    scrollY = $(window).height()
});
var runonce1 = true;
var runonce2 = true;
var runonce3 = true;
$(window).scroll(function (e) {
    socialpanel();
    var d = 1450;
    var c = 1550;
    var b = 1650;
    var a = $(window).scrollTop() + scrollY;
    if (a > d && runonce1 == true) {
        stat1_ani = setInterval(function () {
            countUp1()
        }, animationspd);
        progressbar1();
        runonce1 = false
    }
    if (a > c && runonce2 == true) {
        stat2_ani = setInterval(function () {
            countUp2()
        }, animationspd);
        progressbar2();
        runonce2 = false
    }
    if (a > b && runonce3 == true) {
        stat3_ani = setInterval(function () {
            countUp3()
        }, animationspd);
        runonce3 = false
    }
});