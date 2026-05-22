import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/wp-json/",
          "/wp-login.php",
          "/xmlrpc.php",
          "/wp-content/plugins/",
          "/wp-content/themes/",
          "/api/",
        ],
      },
    ],
    sitemap: "https://terrasdegaia.pt/sitemap.xml",
  };
}
