import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LioraBump",
    short_name: "LioraBump",
    description: "Private pregnancy tracking, memories, partner support and baby milestones.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fbf7f2",
    theme_color: "#11233f",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  };
}
