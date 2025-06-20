import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import blograte from '../assets/blograte.svg'; // Star rating image
import blogimg from '../assets/blog-null.png'; // Default blog image

function BlogsMaster() {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch blogs from the backend
    const fetchBlogs = async () => {
        try {
            const response = await axios.get('/api/blogs'); // Fetch blogs from your backend route
            setBlogs(response.data); // Assuming the response contains an array of blog posts
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch blogs');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs(); // Fetch blogs when the component mounts
    }, []);

    // Handle navigation to blog post detail
    function HandleBlogPost(internalName) {
        navigate('/blogs/' + internalName);
    }

    // Show loading message while fetching blogs
    if (loading) {
        return <div>Loading...</div>;
    }

    // Show error message if there was an error
    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2 className="mt-4 mb-3 justify-center text-2xl bg-clip-text text-center inline-block bg-gradient-to-r from-darkPrimary to-lightPrimary font-bold text-transparent">
                Blogs - Know about more
            </h2>
            {blogs.map((blog) => {
                const { internalName, pageTitle, shareImages } = blog.fields;
                const blogImage = shareImages.length > 0 ? shareImages[0].fields.file.url : blogimg; // Fallback to default image if no image is available

                return (
                    <div
                        key={blog.sys.id} // Using sys.id as a unique key
                        onClick={() => HandleBlogPost(internalName)}
                        className="mx-auto w-[90%] px-4 py-4 mt-2 mb-8 rounded-xl bg-[#F7F7F7] shadow-blogshadow cursor-pointer hover:bg-[#EAEAEA]"
                    >
                        <div className='flex flex-wrap gap-x-5'>
                            <div className="mb-4 ">
                                <img
                                    className="rounded-lg h-16 w-14"
                                    src={blogImage}
                                    alt={pageTitle}
                                />
                            </div>
                            <div className="flex-grow">
                                <h1 className="text-xl font-bold -mb-2">{pageTitle}</h1>
                                <p className="text-gray-600 -mb-1">
                                    {internalName} - Author's Profession (placeholder)
                                </p>
                                <p className="text-gray-600 -mb-1 inline-block">
                                    {/* Assuming a fixed rating for example */}
                                    {Array.from({ length: 4 }).map((_, index) => (
                                        <img key={index} className="inline-block mr-0.5" src={blograte} alt="Rating" />
                                    ))}
                                </p>
                            </div>
                        </div>
                        <div className="prose text-gray-700">
                            {/* You can add more content here if needed */}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default BlogsMaster;
