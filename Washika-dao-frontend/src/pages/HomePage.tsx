import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/Navbar/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import GroupInfo from "../components/GroupInfo";

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
 * @Auth Policy: Not necessarily authenticated for access but different components require access
 */

/**
 * Represents the home page component of the application.
 *
 * This component displays various sections including a navigation bar,
 * informational content about digital financial groups, and a blog section
 * with pagination and search functionality. It allows users to navigate
 * to DAO registration and educational pages. Blogs are fetched from a
 * JSON file and filtered based on category and search terms.
 *
 * @component
 * @returns {JSX.Element} The rendered home page component.
 *
 * @remarks
 * - Utilizes `useState` and `useEffect` hooks for state management and
 *   data fetching.
 * - Implements pagination for blog posts with a default of 3 posts per page.
 * - Provides search and category filter options for blog posts.
 * - Includes navigation to DAO registration and educational pages.
 *
 * @interface Blog
 * @property {string} slug - Unique identifier for the blog.
 * @property {string} title - Title of the blog.
 * @property {string} category - Category of the blog.
 * @property {string} date - Publication date of the blog.
 * @property {string} [className] - Optional CSS class for styling.
 * @property {string} [image] - Optional image URL for the blog.
 * @property {string} [content] - Optional content preview of the blog.
 */
const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleDaoRegistration = () => {
    navigate("/DaoRegistration");
  };
  const handleJifunzeElimu = () => {
    navigate("/Blogs");
  };
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
              content: content.split(" ").slice(0, 16).join(" ") + "...",
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
      <main>
        <section className="image-container">
          <div className="inner-container">
            <img
              src="images/LOGO FULL.png"
              alt="logo"
            />
            <p className="main">
              Govern and Manage <br />
              your community <br />
              Saving Group
            </p>
            <p>
              Welcome to WashikaDAO, a one stop solution <br />
              for all your community group needs
            </p>
          </div>
        </section>

        <div className="buttons">
          <button className="button-1" onClick={handleDaoRegistration}>
            Create a DAO
          </button>
          <button className="button-2" onClick={handleJifunzeElimu}>
            What is a DAO?
          </button>
        </div>

        <p className="parag-container">
          We enable Saving Groups to manage and  transparency
          <br /> grow their savings with Ease and
          <br />transparency
        </p>

        <section className="main-container">
          <div className="boxes">
            <div className="box one">
              <div className="box-left">
                <div>
                  <h1>Safe and Modern</h1>
                  <p>
                    Securely manage your DAO's activities. With real time
                    <span> Account balance, Share balance</span> and easy apply for <span>loans</span>.
                  </p>
                </div>
              </div>
              <div className="box-right">
                <div>
                  <img src="images/LOGO SYMBLO.png" alt="logo" width="63" />
                  <a href="Homepage.html">
                    <img src="images/wordlogo.png" alt="logo" width="253" />
                  </a>
                </div>
              </div>
            </div>

            <div className="box two">
              <div className="box-left two">
                <div>
                  <h1>Education HUB</h1>
                  <p>
                    With a dedicated portal for education,
                    <span> Learn about the digital economy</span>. Learn how you can grow your income with technology
                  </p>
                </div>
              </div>
              <div className="box-right"></div>
            </div>

            <div className="half-box box-left">
              <div>
                <h1>Apply for Loans with Ease</h1>
                <p>
                  Grow your income with ease.
                  <span> Get access to loans with trust collateral and low interest</span>.
                  Building a trust economy that is community first
                </p>
              </div>
            </div>
          </div>

          <GroupInfo />
        </section>
        <div className="parag-container-two">
          <h2>This is us, WashikaDAO!</h2>
          <p className="sub-parag-container">
            We enable community saving groups to reach <br />their goals and actualize wealth with transparency <br />
            and ease!
          </p>
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
                 {/* <p>{blog.content}</p> */}
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
      </main>
      <Footer className={""} />
    </>
  );
};

export default HomePage;
