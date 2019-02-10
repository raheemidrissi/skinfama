/**
 * Galleria Twelve Theme - v1.5.0 2017-06-03
 * https://galleria.io
 *
 * Copyright (c) 2010 - 2017 worse is better UG
 * LICENSE: 24c0b7a651c66617b6707859fd0d4f1f
 * https://galleria.io/license/
 *
 */

(function($) {

/*global jQuery, Galleria */

Galleria.addTheme({
    name: 'twelve',
    version: 1.50,
    author: 'Galleria',
    css: 'galleria.twelve.min.css?v=1.5.0',
    // begin site script
    defaults: {
        transition: 'pulse',
        transitionSpeed: 500,
        imageCrop: true,
        thumbCrop: true,
        carousel: false,

        // theme specific defaults:
        _locale: {
            show_thumbnails: 'Show thumbnails',
            hide_thumbnails: 'Hide thumbnails',
            play: 'Play slideshow',
            pause: 'Pause slideshow',
            enter_fullscreen: 'Enter fullscreen',
            exit_fullscreen: 'Exit fullscreen',
            popout_image: 'Popout image',
            showing_image: 'Showing image %s of %s'
        },
        _showFullscreen: true,
        _showPopout: true,
        _showProgress: true,
        _showTooltip: true
    },
    init: function(options) {

        Galleria.requires( 1.5, 'This version of Twelve theme requires Galleria version 1.5 or later');

        // add some elements
        this.addElement('bar','fullscreen','play','popout','thumblink','s1','s2','s3','s4','progress');
        this.append({
            'stage' : 'progress',
            'container': ['bar','tooltip'],
            'bar'   : ['fullscreen','play','popout','thumblink','info','s1','s2','s3','s4']
        });
        this.prependChild('info','counter');

            // copy the scope
        var gallery = this,

            // cache some stuff
            thumbs = this.$('thumbnails-container'),
            thumb_link = this.$('thumblink'),
            fs_link = this.$('fullscreen'),
            play_link = this.$('play'),
            pop_link = this.$('popout'),
            bar = this.$('bar'),
            progress = this.$('progress'),
            transition = options.transition,
            lang = options._locale,

            // statics
            OPEN = false,
            FULLSCREEN = false,
            PLAYING = !!options.autoplay,
            CONTINUE = false,

            // helper functions
            scaleThumbs = function() {
                thumbs.height( gallery.getStageHeight() ).width( gallery.getStageWidth() ).css('top', OPEN ? 0 : gallery.getStageHeight()+30 );
            },

            toggleThumbs = function(e) {
                if (OPEN && CONTINUE) {
                    gallery.play();
                } else {
                    CONTINUE = PLAYING;
                    gallery.pause();
                }
                Galleria.utils.animate(thumbs, { top: OPEN ? gallery.getStageHeight()+30 : 0 } , {
                    easing:'galleria',
                    duration:400,
                    complete: function() {
                        gallery.defineTooltip('thumblink', OPEN ? lang.show_thumbnails : lang.hide_thumbnails);
                        thumb_link[OPEN ? 'removeClass' : 'addClass']('open');
                        OPEN = !OPEN;
                    }
                });
            };

        // scale the thumbnail container
        scaleThumbs();

        // bind the tooltips
        if (options._showTooltip) {

            gallery.bindTooltip({

                'thumblink': lang.show_thumbnails,

                'fullscreen': lang.enter_fullscreen,

                'play': function() {
                    return PLAYING ? lang.pause : lang.play;
                },

                'popout': lang.popout_image,

                'caption': function() {
                    var data = gallery.getData();
                    var str = '';
                    if (data) {
                        if (data.title && data.title.length) {
                            str+='<strong>'+data.title+'</strong>';
                        }
                        if (data.description && data.description.length) {
                            str+='<br>'+data.description;
                        }
                    }
                    return str;
                },

                'counter': function() {
                    return lang.showing_image.replace( /\%s/, gallery.getIndex() + 1 ).replace( /\%s/, gallery.getDataLength() );
                }
            });
        }

        if ( !options.showInfo ) {
            this.$( 'info' ).hide();
        }

        // bind galleria events
        this.bind( 'play', function() {
            PLAYING = true;
            play_link.addClass('playing');
        });

        this.bind( 'pause', function() {
            PLAYING = false;
            play_link.removeClass('playing');
            progress.width(0);
        });

        if (options._showProgress) {
            this.bind( 'progress', function(e) {
                progress.width( e.percent/100 * this.getStageWidth() );
            });
        }

        this.bind( 'loadstart', function(e) {
            if (!e.cached) {
                this.$('loader').show();
            }
        });

        this.bind( 'loadfinish', function(e) {
            progress.width(0);
            this.$('loader').hide();
            this.refreshTooltip('counter','caption');
        });

        this.bind( 'thumbnail', function(e) {
            $(e.thumbTarget).hover(function() {
                gallery.setInfo(e.thumbOrder);
                gallery.setCounter(e.thumbOrder);
            }, function() {
                gallery.setInfo();
                gallery.setCounter();
            }).on('click:fast', function() {
                toggleThumbs();
            });
        });

        this.bind( 'fullscreen_enter', function(e) {
            FULLSCREEN = true;
            gallery.setOptions('transition', false);
            fs_link.addClass('open');
            bar.css('bottom',0);
            this.defineTooltip('fullscreen', lang.exit_fullscreen);
            if ( !Galleria.TOUCH ) {
                this.addIdleState(bar, { bottom: -31 });
            }
        });

        this.bind( 'fullscreen_exit', function(e) {
            FULLSCREEN = false;
            Galleria.utils.clearTimer('bar');
            gallery.setOptions('transition',transition);

            fs_link.removeClass('open');
            bar.css('bottom',0);

            this.defineTooltip('fullscreen', lang.enter_fullscreen);

            if ( !Galleria.TOUCH ) {
                this.removeIdleState(bar, { bottom:-31 });
            }
        });

        this.bind( 'rescale', scaleThumbs);

        if ( !Galleria.TOUCH ) {

            this.addIdleState(this.get('image-nav-left'), {left:-36});
            this.addIdleState(this.get('image-nav-right'), {right:-36});

        }

        // bind thumblink
        thumb_link.on('click:fast', toggleThumbs );

        if ( !options.thumbnails ) {
            thumb_link.hide();
            play_link.css('left', 0);
            this.$('s2').hide();
            this.$('info').css('left', 41);
        }

        // bind popup
        if (options._showPopout) {
            pop_link.on('click:fast', function(e) {
                gallery.openLightbox();
                e.preventDefault();
            });
        } else {
            pop_link.remove();
            if (options._showFullscreen) {
                this.$('s4').remove();
                this.$('info').css('right',40);
                fs_link.css('right',0);
            }
        }

        // bind play button
        play_link.on('click:fast', function() {
            //gallery.defineTooltip('play', PLAYING ? lang.play : lang.pause);
            if (PLAYING) {
                gallery.pause();
            } else {
                if (OPEN) {
                    thumb_link.trigger('click:fast');
                }
                gallery.play();
            }
        });

        // bind fullscreen
        if (options._showFullscreen) {
            fs_link.on('click:fast', function() {
                if (FULLSCREEN) {
                    gallery.exitFullscreen();
                } else {
                    gallery.enterFullscreen();
                }
            });
        } else {
            fs_link.remove();
            if (options._show_popout) {
                this.$('s4').remove();
                this.$('info').css('right',40);
                pop_link.css('right',0);
            }
        }

        if (!options._showFullscreen && !options._showPopout) {
            this.$('s3,s4').remove();
            this.$('info').css('right',10);
        }

        if (options.autoplay) {
            this.trigger( 'play' );
        }
    }
    // end site script
});

}( jQuery ));
