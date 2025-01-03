import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet-async";

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
 * @Auth Policy: Does not require authentication for access
 * @returns 
 */
const JifunzeElimu: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 3;

  // Fetch blogs from blogs.json
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/data/blogs.json");
        const metadata = await response.json();

        const blogsWithContent = await Promise.all(
          metadata.map(async (blog: Blog) => {
            const contentResponse = await fetch(`/data/${blog.slug}.md`);
            const content = await contentResponse.text();
            return {
              ...blog,
              content: content.split(" ").slice(0, 16).join(" ") + "..." 
            };
          })
        );
        setBlogs(blogsWithContent);
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      }
    };

    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory = category === "All" || blog.category === category;
    const matchesSearch = blog.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <>
      <NavBar className={""} />
      <Helmet>
        <title>Jifunze Elimu</title>
        <meta
          name="description"
          content="Explore educational content and blogs on various blockchain topics"
        />
      </Helmet>

      <main className="jifunze">
        <div className="onee">
          <div className="left">
            <h2>Karibu kwa WashikaDAO</h2>
            <p>
              Tunawezesha vikundi kufanikisha malengo yao kwa usawa na usalama
              wa mali zao
            </p>
          </div>
          <div className="image">
            <img src="images/LOGO SYMBLO(1).png" alt="logo"  />
          </div>
        </div>
        <div className="search-filter">
          <input
            className="search"
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="search"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="DAO">DAO</option>
            <option value="Education">Education</option>
            <option value="Toolkit">Toolkit</option>
          </select>
        </div>
        <div className="article-container">
          {currentBlogs.map((blog) => (
            <Link to={`/blog/${blog.slug}`} key={blog.slug}>
              <article
                className={blog.className}
                style={{ backgroundImage: `url(${blog.image})` }}
              >
                <div>
                  <h2>{blog.title}</h2>
                  <p>{blog.content}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="pagination">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
        <div className="imagge">
          <img src="images/Frame 9.png" alt="" />
        </div>
      </main>

      <Footer className={""} />
    </>
  );
};

export default JifunzeElimu;
