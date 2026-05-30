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
    sitemap: `${(process.env.NEXT_PUBLIC_SITE_URL || "https://terrasdegaia.pt").replace(/\/$/, "")}/sitemap.xml`,
  };
}
