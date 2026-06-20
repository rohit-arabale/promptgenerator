import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: "https://promptgenerator.pro/",
      lastModified: new Date(),
    },
  ];
}
