import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import NavBar from "../components/Navbar/Navbar.js";
import Footer from "../components/Footer.js";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";

/**
 * Interface representing a blog post.
 *
 * @property {string} slug - Unique identifier used in the URL for the blog.
 * @property {string} title - Title of the blog post.
 * @property {string} category - Category under which the blog falls.
 * @property {string} date - Publication date of the blog post.
 * @property {string} [className] - Optional CSS class for additional styling.
 * @property {string} image - URL to the blog post's featured image.
 * @property {string} [content] - Markdown content of the blog post.
 */
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
 * BlogPage component fetches and displays a blog post based on the URL slug.
 *
 * The component uses:
 * - useParams to extract the "slug" parameter from the URL.
 * - useState to store the blog data once fetched.
 * - useEffect to perform asynchronous fetching of blog metadata and content.
 *
 * Workflow:
 * 1. Fetch blog metadata from "blogs.json".
 * 2. Find the specific blog entry that matches the URL slug.
 * 3. Fetch the markdown content from a file named using the slug.
 * 4. Combine metadata and markdown content into a single blog object for rendering.
 *
 * The component renders:
 * - A navigation bar at the top.
 * - The blog post title, rendered markdown content, and metadata (category and date).
 * - A footer at the bottom.
 *
 * If the blog is not found, a "Blog not found" message is displayed.
 *
 * @returns {JSX.Element} The rendered blog page.
 */
const BlogPage: React.FC = () => {
  // Extract the slug parameter from the URL.
  const { slug } = useParams<{ slug: string }>();
  // Local state to hold the fetched blog data.
  const [blog, setBlog] = useState<Blog | null>(null);

  // useEffect hook to fetch blog metadata and content when the slug changes.
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        // If no slug is provided, do nothing.
        if (!slug) return;

        // Fetch blog metadata from the JSON file.
        const metadataResponse = await fetch("/data/blogs.json");
        const metadata = await metadataResponse.json();

        // Find the metadata entry that matches the current slug.
        const blogMetadata = metadata.find((blog: Blog) => blog.slug === slug);
        // If no matching blog is found, exit early.
        if (!blogMetadata) return;

        // Fetch the markdown content from a file named after the slug.
        const contentResponse = await fetch(`/data/${slug}.md`);
        const content = await contentResponse.text();

        // Merge the metadata and content into a single blog object.
        setBlog({ ...blogMetadata, content });
      } catch (error) {
        // Log any errors that occur during the fetch process.
        console.error("Failed to fetch blog data", error);
      }
    };

    // Call the async function to initiate data fetching.
    fetchBlogData();
  }, [slug]);

  // If the blog data is not available, display a "Blog not found" message.
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
          <p>
            <strong>Category:</strong> {blog.category}
          </p>
          <p>
            <strong>Published on:</strong> {blog.date}
          </p>
        </div>
      </div>
      <Footer className={""} />
    </>
  );
};

// Export the BlogPage component to be used in routing.
export default BlogPage;
