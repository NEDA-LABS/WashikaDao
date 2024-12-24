import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";

interface Blog {
  slug: string;
  title: string;
  category: string;
  date: string;
  className?: string;
  image: string; 
  content?: string;
}
/**
 * 
 * @auth Policy: Accessible to all, no need to check if user is authenticated to access this route 
 */
const BlogPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        if (!slug) return;

        // Fetch the blog metadata from blogs.json
        const metadataResponse = await fetch("/data/blogs.json");
        const metadata = await metadataResponse.json();

        // Find the specific blog metadata by slug
        const blogMetadata = metadata.find((blog: Blog) => blog.slug === slug);

        if (!blogMetadata) return;

        // Fetch the markdown content based on the slug
        const contentResponse = await fetch(`/data/${slug}.md`);
        const content = await contentResponse.text();

        // Combine metadata and content into a single blog object
        setBlog({ ...blogMetadata, content });
      } catch (error) {
        console.error("Failed to fetch blog data", error);
      }
    };

    fetchBlogData();
  }, [slug]);

  if (!blog) {
    return <p>Blog not found</p>;
  }

  return (
    <>
      <NavBar className={""} />
      <div className="blog-page">
        <Helmet>
          <title>{blog.title}</title>
          <meta name="description" content={blog.content?.substring(0, 150)} />
        </Helmet>

        <h1>{blog.title}</h1>
        <ReactMarkdown>{blog.content}</ReactMarkdown>
        <div className="blog-metadata">
          <p><strong>Category:</strong> {blog.category}</p>
          <p><strong>Published on:</strong> {blog.date}</p>
        </div>
      </div>
      <Footer className={""} />
    </>
  );
};

export default BlogPage;
