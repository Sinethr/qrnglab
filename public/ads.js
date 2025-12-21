/**
 * Centralized Ad Management System
 * 
 * Configure all your Google AdSense codes here.
 * The system will automatically inject ads into designated spaces across all tool pages.
 */

const AdConfig = {
    // Enable/Disable ads globally
    enabled: true,

    // Ad codes configuration
    ads: {
        // Left Sidebar Ad (300x600 or 160x600)
        leftSidebar: {
            enabled: true,
            code: `
                <!-- Google AdSense - Left Sidebar -->
                <div class="ad-placeholder">
                    <p class="text-xs text-gray-400 mb-2">Advertisement</p>
                    <div style="min-height: 600px; background: #f9fafb; border: 2px dashed #e5e7eb; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
                        <div class="text-center p-4">
                            <p class="text-sm text-gray-500 font-mono">Left Sidebar Ad</p>
                            <p class="text-xs text-gray-400 mt-2">300x600 or 160x600</p>
                            <p class="text-xs text-gray-400">Paste AdSense code in ads.js</p>
                        </div>
                    </div>
                </div>
                <!-- End Left Sidebar Ad -->
            `,
            // Replace the above placeholder with your actual AdSense code:
            // code: `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
            // <ins class="adsbygoogle"
            //      style="display:inline-block;width:300px;height:600px"
            //      data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            //      data-ad-slot="XXXXXXXXXX"></ins>
            // <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>`
        },

        // Right Sidebar Ad (300x600 or 160x600)
        rightSidebar: {
            enabled: true,
            code: `
                <!-- Google AdSense - Right Sidebar -->
                <div class="ad-placeholder">
                    <p class="text-xs text-gray-400 mb-2">Advertisement</p>
                    <div style="min-height: 600px; background: #f9fafb; border: 2px dashed #e5e7eb; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
                        <div class="text-center p-4">
                            <p class="text-sm text-gray-500 font-mono">Right Sidebar Ad</p>
                            <p class="text-xs text-gray-400 mt-2">300x600 or 160x600</p>
                            <p class="text-xs text-gray-400">Paste AdSense code in ads.js</p>
                        </div>
                    </div>
                </div>
                <!-- End Right Sidebar Ad -->
            `
        },

        // Bottom Banner Ad (728x90 or 970x90)
        bottomBanner: {
            enabled: true,
            code: `
                <!-- Google AdSense - Bottom Banner -->
                <div class="ad-placeholder">
                    <p class="text-xs text-gray-400 mb-2 text-center">Advertisement</p>
                    <div style="min-height: 90px; background: #f9fafb; border: 2px dashed #e5e7eb; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
                        <div class="text-center p-4">
                            <p class="text-sm text-gray-500 font-mono">Bottom Banner Ad</p>
                            <p class="text-xs text-gray-400 mt-1">728x90 or 970x90</p>
                            <p class="text-xs text-gray-400">Paste AdSense code in ads.js</p>
                        </div>
                    </div>
                </div>
                <!-- End Bottom Banner Ad -->
            `
        },

        // Home Middle Ad (Responsive)
        homeMiddle: {
            enabled: true,
            code: `
                <!-- Google AdSense - Home Middle -->
                <div class="ad-placeholder my-12">
                    <p class="text-xs text-gray-400 mb-2 text-center">Advertisement</p>
                    <div style="min-height: 250px; background: #f9fafb; border: 2px dashed #e5e7eb; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
                        <div class="text-center p-4">
                            <p class="text-sm text-gray-500 font-mono">Home Middle Ad</p>
                            <p class="text-xs text-gray-400 mt-1">Responsive</p>
                            <p class="text-xs text-gray-400">Paste AdSense code in ads.js</p>
                        </div>
                    </div>
                </div>
                <!-- End Home Middle Ad -->
            `
        },

        // Optional: In-Content Ad (Responsive)
        inContent: {
            enabled: false,
            code: `
                <!-- Google AdSense - In-Content Ad -->
                <div class="ad-placeholder my-6">
                    <p class="text-xs text-gray-400 mb-2 text-center">Advertisement</p>
                    <div style="min-height: 250px; background: #f9fafb; border: 2px dashed #e5e7eb; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
                        <div class="text-center p-4">
                            <p class="text-sm text-gray-500 font-mono">In-Content Ad</p>
                            <p class="text-xs text-gray-400 mt-1">Responsive</p>
                            <p class="text-xs text-gray-400">Paste AdSense code in ads.js</p>
                        </div>
                    </div>
                </div>
                <!-- End In-Content Ad -->
            `
        }
    }
};

/**
 * Initialize and inject ads into designated containers
 */
function initAds() {
    if (!AdConfig.enabled) {
        // console.log('📢 Ads are disabled');
        return;
    }

    // Inject left sidebar ad
    if (AdConfig.ads.leftSidebar.enabled) {
        const leftAdContainer = document.getElementById('ad-left-sidebar');
        if (leftAdContainer) {
            leftAdContainer.innerHTML = AdConfig.ads.leftSidebar.code;
            // console.log('✅ Left sidebar ad loaded');
        }
    }

    // Inject right sidebar ad
    if (AdConfig.ads.rightSidebar.enabled) {
        const rightAdContainer = document.getElementById('ad-right-sidebar');
        if (rightAdContainer) {
            rightAdContainer.innerHTML = AdConfig.ads.rightSidebar.code;
            // console.log('✅ Right sidebar ad loaded');
        }
    }

    // Inject bottom banner ad
    if (AdConfig.ads.bottomBanner.enabled) {
        const bottomAdContainer = document.getElementById('ad-bottom-banner');
        if (bottomAdContainer) {
            bottomAdContainer.innerHTML = AdConfig.ads.bottomBanner.code;
            // console.log('✅ Bottom banner ad loaded');
        }
    }

    // Inject home middle ad
    if (AdConfig.ads && AdConfig.ads.homeMiddle && AdConfig.ads.homeMiddle.enabled) {
        const homeMiddleAdContainer = document.getElementById('ad-home-middle');
        if (homeMiddleAdContainer) {
            homeMiddleAdContainer.innerHTML = AdConfig.ads.homeMiddle.code;
            // console.log('✅ Home middle ad loaded');
        }
    }

    // Inject in-content ad (optional)
    if (AdConfig.ads.inContent.enabled) {
        const inContentAdContainer = document.getElementById('ad-in-content');
        if (inContentAdContainer) {
            inContentAdContainer.innerHTML = AdConfig.ads.inContent.code;
            // console.log('✅ In-content ad loaded');
        }
    }

    // console.log('📢 Ad system initialized');
}

// Initialize ads when DOM is ready
document.addEventListener('DOMContentLoaded', initAds);
