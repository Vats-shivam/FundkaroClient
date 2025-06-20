import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import blograte from '../assets/blograte.svg'; // Star rating image
import blogimg from '../assets/blog-null.png'; // Default blog image

function BlogPage() {
    const { internalName } = useParams(); // Get the internalName from the URL
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch specific blog post based on internalName
    const fetchBlog = async () => {
        try {
            const response = await axios.get(`/api/blogs/${internalName}`); // Adjust the URL to fetch blog by internalName
            setBlog(response.data); // Set the blog data
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch blog post');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlog(); // Fetch blog when the component mounts
    }, [internalName]); // Depend on internalName to refetch if URL changes

    // Loading or error handling
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    // Destructure blog fields
    const { pageTitle, shareImages, internalName: name, content } = blog.fields;
    const blogImage = shareImages.length > 0 ? shareImages[0].fields.file.url : blogimg; // Fallback to default image if no image is available

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg mx-auto max-w-4xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{pageTitle}</h1>
            </div>
            <div className="mb-4">
                <img
                    className="w-full h-[400px] object-cover rounded-lg"
                    src={blogImage}
                    alt={pageTitle}
                />
            </div>
            <div className="prose text-gray-700">
                <h2 className="text-2xl font-semibold">Content</h2>
                <p>{content}</p>
            </div>

            {/* Blog Author & Rating (Optional) */}
            <div className="flex items-center mt-4">
                <span className="font-medium text-gray-600">Written by: {name}</span>
                <div className="ml-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <img key={index} className="inline-block mr-0.5" src={blograte} alt="Rating" />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default BlogPage;
