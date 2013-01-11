function FriendlySlider(options) {
    var $ = jQuery;
    options = options || {};
    var $Elements = $("#FriendlySlider-images A");
    $Elements.each(function (index) {
        var inner = $(this).html();
        var pos = inner.indexOf(">", inner);
        if (pos >= 0) {
            $(this).data("descr", inner.substr(pos + 1));
            if (pos < inner.length - 1) {
            	 console.log($(this).html());
                $(this).html(inner.substr(0, pos + 1));
            }
        }
        $(this).css({
            'font-size': 0
        });
    });
    var elementsCount = $Elements.length;
    var $ws_container = $("#FriendlySlider-container");
    var frame = $("A#FriendlySlider-frame").get(0);
    var curIdx = 0;

    function go(index) {
        if (curIdx == index) {
            return;
        }
        var current = effect.go(index);
        if (!current) {
            return;
        }
        if (typeof current != "object") {
            current = $Elements[index];
        }
        curIdx = index;
        go2(index);
        if (options.caption) {
            setTitle(current);
        }
    }
    function go2(index) {
        if (options.bullets) {
            setBullet(index);
        }
        if (frame) {
            frame.setAttribute("href", $Elements.get(index).href);
        }
    }
    var autoPlayTimer;

    function restartPlay() {
        stopPlay();
        if (options.autoPlay) {
            autoPlayTimer = setTimeout(function () {
                go(curIdx < elementsCount - 1 ? curIdx + 1 : 0);
                restartPlay();
            }, options.delay + options.duration);
        }
    }
    function stopPlay() {
        if (autoPlayTimer) {
            clearTimeout(autoPlayTimer);
        }
        autoPlayTimer = null;
    }
    function forceGo(event, index) {
        stopPlay();
        event.preventDefault();
        go(index);
        restartPlay();
    }
    $Elements.find("IMG").css("position", "absolute");
    var effect = new window["fs_" + options.effect](options);
    effect.init($("#FriendlySlider-images"));
    $Elements.find("IMG").css("visibility", "visible");
    var ic = c = $("#FriendlySlider-images");
    var t = "";
    c = t ? $("<div></div>") : 0;
    if (c) {
        c.css({
            position: "absolute",
            right: "2px",
            bottom: "2px",
            padding: "0 0 0 0"
        });
        ic.append(c);
    }
    if (c && document.all) {
        var f = $("<iframe src=\"javascript:false\"></iframe>");
        f.css({
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            filter: "alpha(opacity=0)"
        });
        f.attr({
            scrolling: "no",
            framespacing: 0,
            border: 0,
            frameBorder: "no"
        });
        c.append(f);
    }
    var d = c ? $(document.createElement("A")) : c;
    if (d) {
        d.css({
            position: "relative",
            display: "block",
            'background-color': "#E4EFEB",
            color: "#837F80",
            'font-family': "Lucida Grande,sans-serif",
            'font-size': "11px",
            'font-weight': "normal",
            'font-style': "normal",
            '-moz-border-radius': "5px",
            'border-radius': "5px",
            padding: "1px 5px",
            width: "auto",
            height: "auto",
            margin: "0 0 0 0",
            outline: "none"
        });
        d.attr({
            href: "ht" + "tp://" + t.toLowerCase()
        });
        d.html(t);
        d.bind("contextmenu", function (eventObject) {
            return false;
        });
        c.append(d);
    }
    if (options.controls) {
        var $next_photo = $("<a href=\"#\" class=\"fs_next\">" + options.next + "</a>");
        var $prev_photo = $("<a href=\"#\" class=\"fs_prev\">" + options.prev + "</a>");
        $ws_container.append($next_photo);
        $ws_container.append($prev_photo);
        $next_photo.bind("click", function (e) {
            forceGo(e, curIdx < elementsCount - 1 ? curIdx + 1 : 0);
        });
        $prev_photo.bind("click", function (e) {
            forceGo(e, curIdx > 0 ? curIdx - 1 : elementsCount - 1);
        });
    }
    function initBullets() {
        $bullets_cont = $ws_container.find(".fs_bullets");
        $bullets = $("a", $bullets_cont);
        $bullets.click(function (e) {
            forceGo(e, $(e.target).index());
        });
        $thumbs = $bullets.find("IMG");
        if ($thumbs.length) {
            var mainFrame = $("<div class=\"fs_bulframe\"/>").appendTo($bullets_cont);
            var imgContainer = $("<div/>").css({
                width: $thumbs.length + 1 + "00%"
            }).appendTo($("<div/>").appendTo(mainFrame));
            $thumbs.appendTo(imgContainer);
            $("<span/>").appendTo(mainFrame);
            var curIndex = -1;

            function moveTooltip(index) {
                if (index < 0) {
                    index = 0;
                }
                $($bullets.get(curIndex)).removeClass("ws_overbull");
                $($bullets.get(index)).addClass("ws_overbull");
                mainFrame.show();
                var mainCSS = {
                    left: $bullets.get(index).offsetLeft - mainFrame.width() / 2
                };
                var contCSS = {
                    left: -$thumbs.get(index).offsetLeft
                };
                if (curIndex < 0) {
                    mainFrame.css(mainCSS);
                    imgContainer.css(contCSS);
                } else {
                    if (!document.all) {
                        mainCSS.opacity = 1;
                    }
                    mainFrame.stop().animate(mainCSS, "fast");
                    imgContainer.stop().animate(contCSS, "fast");
                }
                curIndex = index;
            }
            $bullets.hover(function () {
                moveTooltip($(this).index());
            });
            var hideTime;
            $bullets_cont.hover(function () {
                if (hideTime) {
                    clearTimeout(hideTime);
                    hideTime = 0;
                }
                moveTooltip(curIndex);
            }, function () {
                $bullets.removeClass("ws_overbull");
                if (document.all) {
                    if (!hideTime) {
                        hideTime = setTimeout(function () {
                            mainFrame.hide();
                            hideTime = 0;
                        }, 400);
                    }
                } else {
                    mainFrame.stop().animate({
                        opacity: 0
                    }, {
                        duration: "fast",
                        complete: function () {
                            mainFrame.hide();
                        }
                    });
                }
            });
            $bullets_cont.click(function (e) {
                forceGo(e, $(e.target).index());
            });
        }
    }
    function setBullet(new_index) {
        $(".fs_bullets A", $ws_container).each(function (index) {
            if (index == new_index) {
                $(this).addClass("fs_selbull");
            } else {
                $(this).removeClass("fs_selbull");
            }
        });
    }
    if (options.caption) {
        $caption = $("<div class='fs-title' style='display:none'></div>");
        $ws_container.append($caption);
        $caption.bind("mouseover", function (e) {
            stopPlay();
        });
        $caption.bind("mouseout", function (e) {
            restartPlay();
        });
    }
    function setTitle(A) {
        var title = $("img", A).attr("title");
        var descr = $(A).data("descr");
        var $Title = $(".fs-title", $ws_container);
        $Title.hide();
        if (title || descr) {
            $Title.html((title ? "<span>" + title + "</span>" : "") + (descr ? "<div>" + descr + "</div>" : ""));
            $Title.fadeIn(400, function () {
                if ($.browser.msie) {
                    $(this).get(0).style.removeAttribute("filter");
                }
            });
        }
    }
    if (options.bullets) {
        initBullets();
    }
    go2(0);
    if (options.caption) {
        setTitle($Elements[0]);
    }
    restartPlay();
}

/* ----------------------------------------------------------------------------------------------------------------- */