/*
 * angular-avservices-socialshare
 * 1.0.0
 * 
 * A social media url and content share module for angularjs.
 * 
 * MIT license
 * 20180514
 */
/*global angular*/
/*eslint no-loop-func:0, func-names:0*/

(function withAngular(angular) {
  'use strict';

  var directiveName = 'socialshare'
    , serviceName = 'Socialshare'
    , socialshareProviderNames = ['facebook', 'facebook-messenger','sms', 'twitter', 'linkedin', 'google', 'googleplus', 'pinterest', 'whatsapp', 'viber', 'skype', 'email']
    , socialshareConfigurationProvider = /*@ngInject*/ function socialshareConfigurationProvider() {

      var socialshareConfigurationDefault = [{
        'provider': 'email',
        'conf': {
          'subject': '',
          'body': '',
          'to': '',
          'cc': '',
          'bcc': '',
          'trigger': 'click'
        }
      },
      {
        'provider': 'facebook',
        'conf': {
          'url':'',
          'title':'',
          'href':'',
          'quote':'',
          'hashtags':'',
          'text': '',
          'media': '',
          'mobile_iframe': '',
          'type': '',
          'via': '',
          'to': '',
          'from': '',
          'ref': '',
          'display': '',
          'source': '',
          'caption': '',
          'redirectUri': '',
          'trigger': 'click',
          'popupHeight': 600,
          'popupWidth': 500
        }
      },
      {
        'provider': 'facebook-messenger',
        'conf': {
          'url': ''
        }
      },
      {
        'provider': 'twitter',
        'conf': {
          'url': '',
          'text': '',
          'via': '',
          'hashtags': '',
          'trigger': 'click',
          'popupHeight': 600,
          'popupWidth': 500
        }
      },
      {
        'provider': 'linkedin',
        'conf': {
          'url': '',
          'text': '',
          'description': '',
          'source': '',
          'trigger': 'click',
          'popupHeight': 600,
          'popupWidth': 500
        }
      },
      {
        'provider': 'pinterest',
        'conf': {
          'url': '',
          'text': '',
          'media': '',
          'trigger': 'click',
          'popupHeight': 600,
          'popupWidth': 500
        }
      },
      {
          'provider': 'google',
          'conf': {
            'url': '',
            'text': '',
            'media': '',
            'trigger': 'click',
            'popupHeight': 600,
            'popupWidth': 500
          }
        },
        {
            'provider': 'googleplus',
            'conf': {
              'url': '',
              'text': '',
              'media': '',
              'trigger': 'click',
              'popupHeight': 600,
              'popupWidth': 500
            }
          },
      {
        'provider': 'whatsapp',
        'conf': {
          'url': '',
          'text': ''
        }
      },
      {
        'provider': 'sms',
        'conf': {
          'url': '',
          'text': '',
          'to': '',
          'trigger': 'click'
        }
      },
      {
        'provider': 'viber',
        'conf': {
          'url': '',
          'text': ''
        }
      },
      {
        'provider': 'skype',
        'conf': {
          'url': '',
          'text': '',
          'trigger': 'click',
          'popupHeight': 600,
          'popupWidth': 500
        }
      }
      ];

      return {
        'configure': function configure(configuration) {

          var configIndex = 0
            , configurationKeys
            , configurationIndex
            , aConfigurationKey
            , configElement
            , internIndex = 0
          //this is necessary becuase provider run before any service
          //so i have to take the log from another injector
          , $log = angular.injector(['ng']).get('$log');

          if (configuration && configuration.length > 0) {
            for (; configIndex < configuration.length; configIndex += 1) {
              if (configuration[configIndex].provider && socialshareProviderNames.indexOf(configuration[configIndex].provider) > -1) {

                for (; internIndex < socialshareConfigurationDefault.length; internIndex += 1) {
                  configElement = socialshareConfigurationDefault[internIndex];

                  if (configElement &&
                    configElement.provider &&
                    configuration[configIndex].provider === configElement.provider) {

                      configurationKeys = Object.keys(configElement.conf);
                      configurationIndex = 0;

                      for (; configurationIndex < configurationKeys.length; configurationIndex += 1) {

                        aConfigurationKey = configurationKeys[configurationIndex];
                        if (aConfigurationKey && configuration[configIndex].conf[aConfigurationKey]) {

                          configElement.conf[aConfigurationKey] = configuration[configIndex].conf[aConfigurationKey];
                        }
                      }

                      // once the provider has been found and configuration applied
                      // we should reset the internIndex for the next provider match to work correctly
                      // and break, to skip loops on unwanted next providers
                      internIndex = 0;
                      break;
                    }
                  }
                } else {
                  $log.warn('Invalid provider at element ' + configIndex + ' with name:' + configuration[configIndex].provider);
                }
              }
            }
        }
        , '$get': /*@ngInject*/ function instantiateProvider() {

            return socialshareConfigurationDefault;
        }
      };
    }
    , manageFacebookShare = function manageFacebookShare($window, attrs) {

      var urlString;

      if (attrs.socialshareType && attrs.socialshareType === 'feed') {
        // if user specifies that they want to use the Facebook feed dialog
        //(https://developers.facebook.com/docs/sharing/reference/feed-dialog/v2.4)
        urlString = 'https://www.facebook.com/dialog/feed?';

        if (attrs.socialshareVia) {
          urlString += '&app_id=' + encodeURIComponent(attrs.socialshareVia);
        }

        if (attrs.socialshareRedirectUri) {
          urlString += '&redirect_uri=' + encodeURIComponent(attrs.socialshareRedirectUri);
        }
        if (attrs.socialshareUrl) {
          urlString += '&link=' + encodeURIComponent(attrs.socialshareUrl);
        }

        if (attrs.socialshareTo) {
          urlString += '&to=' + encodeURIComponent(attrs.socialshareTo);
        }

        if (attrs.socialshareDisplay) {
          urlString += '&display=' + encodeURIComponent(attrs.socialshareDisplay);
        }

        if (attrs.socialshareRef) {
          urlString += '&ref=' + encodeURIComponent(attrs.socialshareRef);
        }

        if (attrs.socialshareFrom) {
          urlString += '&from=' + encodeURIComponent(attrs.socialshareFrom);
        }

        if (attrs.socialshareSource) {
          urlString += '&source=' + encodeURIComponent(attrs.socialshareSource);
        }

        $window.open(
          urlString,
          'Facebook', 'toolbar=0,status=0,resizable=yes,width=' + attrs.socialsharePopupWidth + ',height=' + attrs.socialsharePopupHeight
          + ',top=' + ($window.innerHeight - attrs.socialsharePopupHeight) / 2 + ',left=' + ($window.innerWidth - attrs.socialsharePopupWidth) / 2);

      } else if (attrs.socialshareType && attrs.socialshareType === 'share') {
       // if user specifies that they want to use the Facebook share dialog
       //(https://developers.facebook.com/docs/sharing/reference/share-dialog)
       urlString = 'https://www.facebook.com/dialog/share?';

       if (attrs.socialshareVia) {
         urlString += '&app_id=' + encodeURIComponent(attrs.socialshareVia);
       }

       if (attrs.socialshareRedirectUri) {
         urlString += '&redirect_uri=' + encodeURIComponent(attrs.socialshareRedirectUri);
       }

       if (attrs.socialshareUrl) {
         urlString += '&href=' + encodeURIComponent(attrs.socialshareUrl);
       }

       if (attrs.socialshareQuote) {
         urlString += '&quote=' + encodeURIComponent(attrs.socialshareQuote);
       }

       if (attrs.socialshareDisplay) {
         urlString += '&display=' + encodeURIComponent(attrs.socialshareDisplay);
       }

       if (attrs.socialshareMobileiframe) {
       urlString += '&mobile_iframe=' + encodeURIComponent(attrs.socialshareMobileiframe);
       }

       if (attrs.socialshareHashtags) {
         urlString += '&hashtag=' + encodeURIComponent(attrs.socialshareHashtags);
       }


       $window.open(
         urlString,
         'Facebook', 'toolbar=0,status=0,resizable=yes,width=' + attrs.socialsharePopupWidth + ',height=' + attrs.socialsharePopupHeight
         + ',top=' + ($window.innerHeight - attrs.socialsharePopupHeight) / 2 + ',left=' + ($window.innerWidth - attrs.socialsharePopupWidth) / 2);

      } else if (attrs.socialshareType && attrs.socialshareType === 'send') {
        // if user specifies that they want to use the Facebook send dialog
        //(https://developers.facebook.com/docs/sharing/reference/send-dialog)
        urlString = 'https://www.facebook.com/dialog/send?';

        if (attrs.socialshareVia) {
          urlString += '&app_id=' + encodeURIComponent(attrs.socialshareVia);
        }

        if (attrs.socialshareRedirectUri) {
          urlString += '&redirect_uri=' + encodeURIComponent(attrs.socialshareRedirectUri);
        }

        if (attrs.socialshareUrl) {
          urlString += '&link=' + encodeURIComponent(attrs.socialshareUrl);
        }

        if (attrs.socialshareTo) {
          urlString += '&to=' + encodeURIComponent(attrs.socialshareTo);
        }

        if (attrs.socialshareDisplay) {
          urlString += '&display=' + encodeURIComponent(attrs.socialshareDisplay);
        }

        $window.open(
          urlString,
          'Facebook', 'toolbar=0,status=0,resizable=yes,width=' + attrs.socialsharePopupWidth + ',height=' + attrs.socialsharePopupHeight
          + ',top=' + ($window.innerHeight - attrs.socialsharePopupHeight) / 2 + ',left=' + ($window.innerWidth - attrs.socialsharePopupWidth) / 2);

      } else {
        //otherwise default to using sharer.php
        $window.open(
          'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(attrs.socialshareUrl || $window.location.href)
          , 'Facebook', 'toolbar=0,status=0,resizable=yes,width=' + attrs.socialsharePopupWidth + ',height=' + attrs.socialsharePopupHeight
          + ',top=' + ($window.innerHeight - attrs.socialsharePopupHeight) / 2 + ',left=' + ($window.innerWidth - attrs.socialsharePopupWidth) / 2);
      }
    }
    , manageEmailShare = function manageEmailShare($window, attrs) {
      var urlString = 'mailto:';

      if (attrs.socialshareTo) {

        urlString += encodeURIComponent(attrs.socialshareTo);
      }

      urlString += '?';

      if (attrs.socialshareBody) {

        urlString += 'body=' + encodeURIComponent(attrs.socialshareBody);
      }

      if (attrs.socialshareSubject) {

        urlString += '&subject=' + encodeURIComponent(attrs.socialshareSubject);
      }
      if (attrs.socialshareCc) {

        urlString += '&cc=' + encodeURIComponent(attrs.socialshareCc);
      }
      if (attrs.socialshareBcc) {

        urlString += '&bcc=' + encodeURIComponent(attrs.socialshareBcc);
      }
      if ($window.self !== $window.top) {
        $window.open(urlString, '_blank');
      } else {
        $window.open(urlString, '_self');
      }

    }
    , facebookMessengerShare = function facebookMessengerShare($window, attrs, element) {

      var href = 'fb-messenger://share?link=' + encodeURIComponent(attrs.socialshareUrl || $window.location.href);

      element.attr('href', href);
      element.attr('target', '_top');
  }
    , manageTwitterShare = function manageTwitterShare($window, attrs) {
      var urlString = 'https://www.twitter.com/intent/tweet?';

      if (attrs.socialshareText) {
        urlString += 'text=' + encodeURIComponent(attrs.socialshareText);
      }

      if (attrs.socialshareVia) {
        urlString += '&via=' + encodeURIComponent(attrs.socialshareVia);
      }

      if (attrs.socialshareHashtags) {
        urlString += '&hashtags=' + encodeURIComponent(attrs.socialshareHashtags);
      }

      //default to the current page if a URL isn't specified
      urlString += '&url=' + encodeURIComponent(attrs.socialshareUrl || $window.location.href);

      $window.open(
        urlString,
        'Twitter', 'toolbar=0,status=0,resizable=yes,width=' + attrs.socialsharePopupWidth + ',height=' + attrs.socialsharePopupHeight
        + ',top=' + ($window.innerHeight - attrs.socialsharePopupHeight) / 2 + ',left=' + ($window.innerWidth - attrs.socialsharePopupWidth) / 2);
    }
    , manageGooglePlusShare = function manageGooglePlusShare($window, attrs) {

      $window.open(
        'https://plus.google.com/share?url=' + encodeURIComponent(attrs.socialshareUrl || $window.location.href)
        , 'Google+', 'toolbar=0,status=0,resizable=yes,width=' + attrs.socialsharePopupWidth + ',height=' + attrs.socialsharePopupHeight
        + ',top=' + ($window.innerHeight - attrs.socialsharePopupHeight) / 2 + ',left=' + ($window.innerWidth - attrs.socialsharePopupWidth) / 2);
      }
    , manageLinkedinShare = function manageLinkedinShare($window, attrs) {
      /*
      * Refer: https://developer.linkedin.com/docs/share-on-linkedin
      * Tab: Customized URL
      */
      var urlString = 'https://www.linkedin.com/shareArticle?mini=true';

      urlString += '&url=' + encodeURIComponent(attrs.socialshareUrl || $window.location.href);

      if (attrs.socialshareText) {
        urlString += '&title=' + encodeURIComponent(attrs.socialshareText);
      }

      if (attrs.socialshareDescription) {
        urlString += '&summary=' + encodeURIComponent(attrs.socialshareDescription);
      }

      if (attrs.socialshareSource) {
        urlString += '&source=' + encodeURIComponent(attrs.socialshareSource);
      }

      $window.open(
        urlString,
        'Linkedin', 'toolbar=0,status=0,resizable=yes,width=' + attrs.socialsharePopupWidth + ',height=' + attrs.socialsharePopupHeight
        + ',top=' + ($window.innerHeight - attrs.socialsharePopupHeight) / 2 + ',left=' + ($window.innerWidth - attrs.socialsharePopupWidth) / 2);
    }
    , managePinterestShare = function managePinterestShare($window, attrs) {

      $window.open(
        'https://www.pinterest.com/pin/create/button/?url=' + encodeURIComponent(attrs.socialshareUrl || $window.location.href) + '&media=' + encodeURIComponent(attrs.socialshareMedia) + '&description=' + encodeURIComponent(attrs.socialshareText)
        , 'Pinterest', 'toolbar=0,status=0,resizable=yes,width=' + attrs.socialsharePopupWidth + ',height=' + attrs.socialsharePopupHeight
        + ',top=' + ($window.innerHeight - attrs.socialsharePopupHeight) / 2 + ',left=' + ($window.innerWidth - attrs.socialsharePopupWidth) / 2);
    }
    , manageWhatsappShare = function manageWhatsappShare($window, attrs, element) {

      var href = 'whatsapp://send?text=' + encodeURIComponent(attrs.socialshareText) + '%0A' + encodeURIComponent(attrs.socialshareUrl || $window.location.href);

      element.attr('href', href);
      element.attr('target', '_top');

    }
    , manageSmsShare = function smsShare($window, attrs, element) {

      if (attrs.socialshareText.indexOf('%') >= 0) {
        $log.warn('sending sms text with "%" sign is not supported');
      }

      var body = encodeURIComponent(attrs.socialshareText.replace('%',''))
        , toPhoneNumber = attrs.socialshareTo || ''
        , urlString;

      if (attrs.socialshareUrl) {
        body += encodeURIComponent(attrs.socialshareUrl);
      }

      urlString = 'sms:' + toPhoneNumber + '?&body=' + body;

      element.attr('href', urlString);
      element.attr('target', '_blank');
    }
    , manageViberShare = function manageViberShare($window, attrs, element) {

      var href = 'viber://forward?text=' + encodeURIComponent(attrs.socialshareText) + encodeURIComponent(attrs.socialshareUrl || $window.location.href);

      element.attr('href', href);
      element.attr('target', '_top');
    }
    , skypeShare = function skypeShare($window, attrs) {
      var urlString = 'https://web.skype.com/share?source=button&url=' + encodeURIComponent(attrs.socialshareUrl || $window.location.href);

      if (attrs.socialshareText) {
        urlString += '&text=' + encodeURIComponent(attrs.socialshareText);
      }

      $window.open(
        urlString
        , 'Skype', 'toolbar=0,status=0,resizable=yes,width=' + attrs.socialsharePopupWidth + ',height=' + attrs.socialsharePopupHeight
        + ',top=' + ($window.innerHeight - attrs.socialsharePopupHeight) / 2 + ',left=' + ($window.innerWidth - attrs.socialsharePopupWidth) / 2);
    }
    , socialshareService = /*@ngInject*/  ['$window', '$log', function socialshareService($window, $log) {

      this.emailShare = manageEmailShare;
      this.facebookShare = manageFacebookShare;
      this.twitterShare = manageTwitterShare;
      //**** Fb Messenger can't open without an element clicked (href)
      //this.facebookMessengerShare = facebookMessengerShare;
      this.pinterestShare = managePinterestShare;
      this.googleShare = manageGooglePlusShare;
      this.linkedinShare = manageLinkedinShare;
      //**** viber can't share without an element clicked (href)
      //this.viberShare = manageViberShare;
      //**** whatsapp can't share without an element clicked (href)
      //this.whatsappShare = manageWhatsappShare;
      this.skypeShare = skypeShare;
      this.smsShare = manageSmsShare;

      this.share = function shareTrigger(serviceShareConf) {

        switch (serviceShareConf.provider) {
          case 'email': {
            this.emailShare($window, serviceShareConf.attrs);
            break;
          }
          case 'sms': {
            this.smsShare($window, $log, serviceShareConf.attrs);
            break;
          }
          case 'facebook': {
            this.facebookShare($window, serviceShareConf.attrs);
            break;
          }
          case 'twitter': {
            this.twitterShare($window, serviceShareConf.attrs);
            break;
          }
          case 'pinterest': {
            this.pinterestShare($window, serviceShareConf.attrs);
            break;
          }
          case 'google': {
            this.googleShare($window, serviceShareConf.attrs);
            break;
          }
          case 'skype': {
            this.skypeShare($window, serviceShareConf.attrs);
            break;
          }
          case 'linkedin': {
            this.linkedinShare($window, serviceShareConf.attrs);
            break;
          }
          default: {
            return;
          }
        }
      };
    }]
    , socialshareDirective = /*@ngInject*/ ['$window', 'socialshareConf', 'Socialshare', '$log', function socialshareDirective($window, socialshareConf, $log) {

      var linkingFunction = function linkingFunction($scope, element, attrs) {

        // observe the values in each of the properties so that if they're updated elsewhere,
        // they are updated in this directive.
        var configurationElement
        , index = 0
        , onEventTriggered = function onEventTriggered() {
          /*eslint-disable no-use-before-define*/
          if (attrs.socialshareProvider in sharingFunctions) {
            sharingFunctions[attrs.socialshareProvider]($window, attrs, element);
          } else {
            return true;
          }
        };
        /*eslint-enable no-use-before-define*/
        //looking into configuration if there is a config for the current provider
        for (; index < socialshareConf.length; index += 1) {
          if (socialshareConf[index].provider === attrs.socialshareProvider) {
            configurationElement = socialshareConf[index];
            break;
          }
        }

        if (socialshareProviderNames.indexOf(configurationElement.provider) === -1) {
          $log.warn('Invalid Provider Name : ' + attrs.socialshareProvider);
        }

        //if some attribute is not define provide a default one
        attrs.socialshareMobileiframe = attrs.socialshareMobileiframe || configurationElement.conf.mobile_iframe;
        attrs.socialshareQuote = attrs.socialshareQuote || configurationElement.conf.quote;
        attrs.socialshareTitle = attrs.socialshareTitle || configurationElement.conf.title;
        attrs.socialshareUrl = attrs.socialshareUrl || configurationElement.conf.url || configurationElement.conf.href;
        attrs.socialshareText = attrs.socialshareText || configurationElement.conf.text;
        attrs.socialshareMedia = attrs.socialshareMedia || configurationElement.conf.media;
        attrs.socialshareType =  attrs.socialshareType || configurationElement.conf.type;
        attrs.socialshareVia = attrs.socialshareVia || configurationElement.conf.via;
        attrs.socialshareTo =  attrs.socialshareTo || configurationElement.conf.to;
        attrs.socialshareFrom =  attrs.socialshareFrom || configurationElement.conf.from;
        attrs.socialshareRef = attrs.socialshareRef || configurationElement.conf.ref;
        attrs.socialshareDislay = attrs.socialshareDislay || configurationElement.conf.display;
        attrs.socialshareSource = attrs.socialshareSource || configurationElement.conf.source;
        attrs.socialshareCaption = attrs.socialshareCaption || configurationElement.conf.caption;
        attrs.socialshareRedirectUri = attrs.socialshareRedirectUri || configurationElement.conf.redirectUri;
        attrs.socialshareTrigger =  attrs.socialshareTrigger || configurationElement.conf.trigger;
        attrs.socialsharePopupHeight = attrs.socialsharePopupHeight || configurationElement.conf.popupHeight;
        attrs.socialsharePopupWidth = attrs.socialsharePopupWidth || configurationElement.conf.popupWidth;
        attrs.socialshareSubreddit = attrs.socialshareSubreddit || configurationElement.conf.subreddit;
        attrs.socialshareDescription = attrs.socialshareDescription || configurationElement.conf.description;
        attrs.socialshareFollow = attrs.socialshareFollow || configurationElement.conf.follow;
        attrs.socialshareHashtags = attrs.socialshareHashtags || configurationElement.conf.hashtags;
        attrs.socialshareBody = attrs.socialshareBody || configurationElement.conf.body;
        attrs.socialshareSubject = attrs.socialshareSubject || configurationElement.conf.subject;
        attrs.socialshareCc = attrs.socialshareCc || configurationElement.conf.cc;
        attrs.socialshareBcc = attrs.socialshareBcc || configurationElement.conf.bcc;

        if (attrs.socialshareTrigger) {

          element.bind(attrs.socialshareTrigger, onEventTriggered);
        } else {

          onEventTriggered();
        }
      };

      return {
        'restrict': 'A',
        'link': linkingFunction
      };
    }]
    , sharingFunctions = {
        'email': manageEmailShare
      , 'facebook': manageFacebookShare
      , 'facebook-messenger': facebookMessengerShare
      , 'twitter': manageTwitterShare
      , 'google': manageGooglePlusShare
      , 'googleplus': manageGooglePlusShare
      , 'linkedin': manageLinkedinShare
      , 'pinterest': managePinterestShare
      , 'whatsapp': manageWhatsappShare
      , 'sms': manageSmsShare
      , 'viber': manageViberShare
      , 'skype': skypeShare
    };


  angular.module('avservices.socialshare', [])
  .provider(directiveName + 'Conf', socialshareConfigurationProvider)
  .service(serviceName, socialshareService)
  .directive(directiveName, socialshareDirective);
}(angular));
