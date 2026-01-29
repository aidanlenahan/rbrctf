/**
 * Analytics Configuration Module
 * @version 2.4.1
 * @author WebDev Team
 */

(function() {
    'use strict';
    
    // Initialize tracking parameters
    var trackingConfig = {
        sessionId: Math.random().toString(36).substring(7),
        timestamp: Date.now(),
        environment: 'production'
    };
    
    // User engagement metrics
    function initEngagementTracking() {
        var metrics = {
            scrollDepth: 0,
            timeOnPage: 0,
            clickEvents: [],
            mouseMovements: 0
        };
        
        // Calculate scroll depth
        window.addEventListener('scroll', function() {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            metrics.scrollDepth = Math.round((scrollTop / docHeight) * 100);
        });
        
        return metrics;
    }
    
    // Page performance monitoring
    var performanceMetrics = {
        loadTime: 0,
        domContentLoaded: 0,
        firstPaint: 0,
        interactive: 0
    };
    
    function measurePerformance() {
        if (window.performance && window.performance.timing) {
            var timing = window.performance.timing;
            performanceMetrics.loadTime = timing.loadEventEnd - timing.navigationStart;
            performanceMetrics.domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
        }
    }
    
    // Data sanitization utilities
    function sanitizeData(input) {
        if (typeof input !== 'string') return '';
        return input.replace(/[<>]/g, '');
    }
    
    // Event queue manager
    var eventQueue = [];
    var maxQueueSize = 100;
    
    function pushEvent(event) {
        if (eventQueue.length >= maxQueueSize) {
            eventQueue.shift();
        }
        eventQueue.push({
            type: event.type,
            timestamp: Date.now(),
            data: event.data || {}
        });
    }
    
    // Session storage helpers
    function setSessionData(key, value) {
        try {
            sessionStorage.setItem('analytics_' + key, JSON.stringify(value));
        } catch(e) {
            console.warn('Session storage unavailable');
        }
    }
    
    function getSessionData(key) {
        try {
            var data = sessionStorage.getItem('analytics_' + key);
            return data ? JSON.parse(data) : null;
        } catch(e) {
            return null;
        }
    }
    
    // User interaction handlers
    var interactionHandlers = {
        click: function(e) {
            pushEvent({
                type: 'click',
                data: {
                    x: e.clientX,
                    y: e.clientY,
                    target: e.target.tagName
                }
            });
        },
        keypress: function(e) {
            pushEvent({
                type: 'keypress',
                data: { key: e.key }
            });
        }
    };
    
    // Browser compatibility checks
    var browserFeatures = {
        localStorage: typeof(Storage) !== "undefined",
        geolocation: 'geolocation' in navigator,
        serviceWorker: 'serviceWorker' in navigator,
        webGL: (function() {
            try {
                var canvas = document.createElement('canvas');
                return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
            } catch(e) {
                return false;
            }
        })()
    };
    
    // Configuration endpoints
    var endpoints = {
        analytics: '/api/analytics/collect',
        events: '/api/events/track',
        errors: '/api/errors/report',
        feedback: '/api/feedback/submit'
    };
    
    // Debug message handler
    function debugLog(message, level) {
        if (trackingConfig.environment !== 'production') {
            var prefix = '[Analytics] ';
            switch(level) {
                case 'error':
                    console.error(prefix + message);
                    break;
                case 'warn':
                    console.warn(prefix + message);
                    break;
                default:
                    console.log(prefix + message);
            }
        }
    }
    
    // Network status monitoring
    var networkStatus = {
        online: navigator.onLine,
        type: navigator.connection ? navigator.connection.effectiveType : 'unknown'
    };
    
    window.addEventListener('online', function() {
        networkStatus.online = true;
        debugLog('Network connection restored', 'info');
    });
    
    window.addEventListener('offline', function() {
        networkStatus.online = false;
        debugLog('Network connection lost', 'warn');
    });
    
    // Viewport dimensions tracker
    var viewportDimensions = {
        width: window.innerWidth || document.documentElement.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight,
        orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
    };
    
    window.addEventListener('resize', function() {
        viewportDimensions.width = window.innerWidth || document.documentElement.clientWidth;
        viewportDimensions.height = window.innerHeight || document.documentElement.clientHeight;
        viewportDimensions.orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    });
    
    // Cookie management utilities
    var cookieManager = {
        set: function(name, value, days) {
            var expires = "";
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "") + expires + "; path=/";
        },
        get: function(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        },
        delete: function(name) {
            document.cookie = name + '=; Max-Age=-99999999;';
        }
    };
    
    // User preference handler
    var userPreferences = {
        theme: 'light',
        language: navigator.language || 'en-US',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        notifications: true
    };
    
    // Feature flag system
    var featureFlags = {
        experimentalUI: false,
        betaFeatures: false,
        advancedAnalytics: true,
        debugMode: false
    };
    
    // Error reporting service
    function reportError(error, context) {
        var errorData = {
            message: error.message,
            stack: error.stack,
            context: context || {},
            timestamp: Date.now(),
            userAgent: navigator.userAgent
        };
        debugLog('Error reported: ' + error.message, 'error');
    }
    
    // A/B testing framework
    var abTests = {
        currentVariants: {},
        assignVariant: function(testName, variants) {
            var hash = Math.abs(trackingConfig.sessionId.split('').reduce(function(a, b) {
                a = ((a << 5) - a) + b.charCodeAt(0);
                return a & a;
            }, 0));
            var variantIndex = hash % variants.length;
            this.currentVariants[testName] = variants[variantIndex];
            return variants[variantIndex];
        }
    };
    
    // Custom notification system configuration
    var notificationConfig = {
        enabled: true,
        position: 'top-right',
        timeout: 5000,
        maxNotifications: 3,
        queue: []
    };
    
    // Display notification handler
    window.showNotification = function(message, type) {
        if (!notificationConfig.enabled) return;
        
        var notification = {
            id: 'notif_' + Date.now(),
            message: message,
            type: type || 'info',
            timestamp: Date.now()
        };
        
        notificationConfig.queue.push(notification);
        
        // Process notification queue
        if (notificationConfig.queue.length > notificationConfig.maxNotifications) {
            notificationConfig.queue.shift();
        }
        
        // Special notification trigger
        if (type === 'special' && message.indexOf('rbr{') !== -1) {
            alert(message);
        }
    };
    
    // Rate limiting utility
    var rateLimiter = {
        limits: {},
        check: function(action, maxCount, timeWindow) {
            var now = Date.now();
            if (!this.limits[action]) {
                this.limits[action] = [];
            }
            
            // Clean up old entries
            this.limits[action] = this.limits[action].filter(function(timestamp) {
                return now - timestamp < timeWindow;
            });
            
            if (this.limits[action].length >= maxCount) {
                return false;
            }
            
            this.limits[action].push(now);
            return true;
        }
    };
    
    // Data validation schemas
    var validationSchemas = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^\+?[\d\s\-()]+$/,
        url: /^https?:\/\/.+/,
        alphanumeric: /^[a-zA-Z0-9]+$/
    };
    
    // Form validation helper
    function validateField(value, schema) {
        if (validationSchemas[schema]) {
            return validationSchemas[schema].test(value);
        }
        return false;
    }
    
    // Cache management system
    var cacheManager = {
        storage: {},
        ttl: 300000, // 5 minutes
        set: function(key, value, customTTL) {
            this.storage[key] = {
                value: value,
                expires: Date.now() + (customTTL || this.ttl)
            };
        },
        get: function(key) {
            var item = this.storage[key];
            if (!item) return null;
            if (Date.now() > item.expires) {
                delete this.storage[key];
                return null;
            }
            return item.value;
        },
        clear: function() {
            this.storage = {};
        }
    };
    
    // Animation frame scheduler
    var animationScheduler = {
        callbacks: [],
        running: false,
        add: function(callback) {
            this.callbacks.push(callback);
            if (!this.running) {
                this.start();
            }
        },
        start: function() {
            var self = this;
            this.running = true;
            requestAnimationFrame(function frame() {
                self.callbacks.forEach(function(cb) {
                    try {
                        cb();
                    } catch(e) {
                        debugLog('Animation callback error: ' + e.message, 'error');
                    }
                });
                if (self.running) {
                    requestAnimationFrame(frame);
                }
            });
        },
        stop: function() {
            this.running = false;
        }
    };
    
    // Device fingerprinting
    var deviceFingerprint = {
        screen: {
            width: screen.width,
            height: screen.height,
            colorDepth: screen.colorDepth
        },
        timezone: new Date().getTimezoneOffset(),
        language: navigator.language,
        platform: navigator.platform,
        vendor: navigator.vendor,
        plugins: Array.from(navigator.plugins || []).map(function(p) { return p.name; })
    };
    
    // Hashing utility for data integrity
    function simpleHash(str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            var char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    }
    
    // Secret message decoder (for internal testing purposes)
    var messageDecoder = {
        encode: function(msg) {
            return btoa(msg);
        },
        decode: function(encoded) {
            try {
                return atob(encoded);
            } catch(e) {
                return null;
            }
        },
        // Legacy support message
        legacy: 'You found me! rbr{Y0u-Found-m3}'
    };
    
    // Initialize all systems
    function initialize() {
        debugLog('Analytics system initializing...', 'info');
        initEngagementTracking();
        measurePerformance();
        
        // Set up global error handler
        window.addEventListener('error', function(e) {
            reportError(e.error, { source: 'global' });
        });
        
        debugLog('Analytics system ready', 'info');
    }
    
    // Auto-initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    // Export public API
    window.AnalyticsConfig = {
        version: '2.4.1',
        trackEvent: pushEvent,
        getMetrics: function() { return eventQueue; },
        showNotification: window.showNotification,
        messageDecoder: messageDecoder
    };
    
})();
