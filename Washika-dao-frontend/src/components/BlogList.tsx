// BlogList.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/**
 * Interface representing the structure of a blog object.
 *
 * @property {string} slug - Unique identifier used in URLs to reference a blog post.
 * @property {string} title - The title of the blog post.
 * @property {string} category - The category under which the blog falls.
 * @property {string} date - The publication date of the blog post.
 * @property {string} [className] - Optional CSS class for custom styling of the blog article.
 * @property {string} [image] - Optional URL for the blog's background image or thumbnail.
 * @property {string} [content] - Optional preview content of the blog post.
 */
interface Blog {
  slug: string;
  title: string;
  category: string;
  date: string;
  className?: string;
  image?: string;
  content?: string;
}

/**
 * BlogList is a reusable React functional component that fetches blog metadata and content,
 * implements search and category filtering, and paginates the results.
 *
 * @returns {JSX.Element} The rendered list of blog previews along with search, filter, and pagination controls.
 */
const BlogList: React.FC = () => {
  // State to hold the list of blogs.
  const [blogs, setBlogs] = useState<Blog[]>([]);
  // State to manage the user's search term.
  const [searchTerm, setSearchTerm] = useState("");
  // State to track the currently selected blog category.
  const [category, setCategory] = useState("All");
  // State to manage pagination.
  const [currentPage, setCurrentPage] = useState(1);
  // Constant defining the number of blogs to show per page.
  const blogsPerPage = 3;

  // useEffect to fetch blog metadata and partial markdown content on component mount.
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Fetch blog metadata from "blogs.json".
        const response = await fetch("/data/blogs.json");
        const metadata = await response.json();

        // For each blog, fetch its markdown content and generate a preview snippet.
        const blogsWithContent = await Promise.all(
          metadata.map(async (blog: Blog) => {
            const contentResponse = await fetch(`/data/${blog.slug}.md`);
            const content = await contentResponse.text();
            // Use the first 16 words as a preview.
            return {
              ...blog,
              content: content.split(" ").slice(0, 16).join(" ") + "...",
            };
          })
        );
        // Update state with the enriched blog data.
        setBlogs(blogsWithContent);
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      }
    };

    fetchBlogs();
  }, []);

  // Filter blogs based on the current search term and selected category.
  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory = category === "All" || blog.category === category;
    const matchesSearch = blog.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate indices for pagination.
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  // Handler to navigate to the next page.
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Handler to navigate to the previous page.
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div>
      {/* Search and filter controls */}
      <div className="search-filter">
        <input
          className="search"
          type="text"
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search change.
          }}
        />
        <div className="category-buttons">
          {["All", "DAO", "Education", "Toolkit"].map((cat) => (
            <button
              key={cat}
              className={`category-button ${category === cat ? "active" : ""}`}
              onClick={() => {
                setCategory(cat);
                setCurrentPage(1);
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Render blog previews */}
      <div className="article-container">
        {currentBlogs.map((blog) => (
          <Link to={`/blog/${blog.slug}`} key={blog.slug}>
            <article
              className={blog.className}
              style={{ backgroundImage: `url(${blog.image})` }}
            >
              <div>
                <h2>{blog.title}</h2>
                {/* Optionally render a preview snippet:
                <p>{blog.content}</p> */}
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* Pagination controls */}
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          ← Prev
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next →
        </button>
      </div>
    </div>
  );
};

export default BlogList;
