$(document).ready(function() {
    // Patch ECL to be able to use multiple contextual navs.
    var r = function(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : document;
        return [].slice.call(t.querySelectorAll(e))
    }
    ECL.contextualNavs = function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
            t = e.selector,
            n = void 0 === t ? ".ecl-context-nav" : t,
            i = e.buttonSelector,
            o = void 0 === i ? ".ecl-context-nav__more" : i,
            c = e.hiddenElementsSelector,
            l = void 0 === c ? ".ecl-context-nav__item--over-limit" : c,
            a = e.classToRemove,
            s = void 0 === a ? "ecl-context-nav__item--over-limit" : a,
            u = e.context,
            d = void 0 === u ? document : u;
        r(n, d).forEach(function(e) {
            var that = e;
            var t = that.querySelector(o);
            t && t.addEventListener("click", function() {
                return function(e, t) {
                    var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
                        i = n.classToRemove,
                        o = void 0 === i ? "ecl-context-nav__item--over-limit" : i,
                        c = n.hiddenElementsSelector,
                        l = void 0 === c ? ".ecl-context-nav__item--over-limit" : c,
                        a = n.context,
                        s = void 0 === a ? document : a;
                    e && (r(l, that).forEach(function(e) {
                        e.classList.remove(o)
                    }), t.parentNode.removeChild(t))
                }(e, t, {
                    classToRemove: s,
                    hiddenElementsSelector: l
                })
            })
        })
    }
    // END OF Patch ECL to be able to use multiple contextual navs.
    
    // Init main menu and other collapsible lists 
    ECL.initExpandables();
    // Init language navigation
    ECL.dialogs({
        dialogOverlayId: 'ecl-overlay-language-list',
        triggerElementsSelector: '#ecl-lang-select-sites__overlay'
    });
    ECL.contextualNavs();
//    console.log(ECL)
});