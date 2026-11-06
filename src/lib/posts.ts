import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "src/content/posts");

export interface PostData {
  slug: string;
  title: string;
  date: string;
  summary: string;
  category: string;
  tags: string[];
  content: string;
}

function formatDate(rawDate: unknown): string {
  if (rawDate instanceof Date) {
    return rawDate.toISOString().split("T")[0];
  }
  if (typeof rawDate === "string") {
    return rawDate;
  }
  return "";
}

export function getAllPosts(): PostData[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".md"));

  const allPosts = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title ?? "",
      date: formatDate(data.date),
      summary: data.summary ?? "",
      category: data.category ?? "일반",
      tags: Array.isArray(data.tags) ? data.tags : [],
      content,
    };
  });

  // 최신 날짜순 정렬
  return allPosts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): PostData | null {
  if (!fs.existsSync(postsDirectory)) {
    return null;
  }

  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title ?? "",
    date: formatDate(data.date),
    summary: data.summary ?? "",
    category: data.category ?? "일반",
    tags: Array.isArray(data.tags) ? data.tags : [],
    content,
  };
}

