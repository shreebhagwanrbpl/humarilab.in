export default function robots() {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: [
                "/*?*",      // Disallow filtered, sorted, or search query parameters to conserve crawl budget
                "/api/",     // Disallow API proxy paths
            ],
        },

        sitemap: "https://humarilab.in/sitemap.xml",
    };
}