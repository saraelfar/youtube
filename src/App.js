import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Add your custom CSS here

// YouTube API Configuration
const API_KEY = 'AIzaSyDdC_6PmVdj0-wBpfdbY1WLNNDKsJ6MU68'; // Replace with your YouTube API key
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Function to Fetch Videos from YouTube API
const fetchVideos = async (query) => {
    try {
        const response = await axios.get(`${BASE_URL}/search`, {
            params: {
                part: 'snippet',
                q: query,
                key: API_KEY,
                type: 'video',
                maxResults: 12,
            },
        });
        return response.data.items;
    } catch (error) {
        console.error('Error fetching videos:', error);
        return [];
    }
};

// Video List Component
const VideoList = ({ videos }) => (
    <div className="video-grid">
        {videos.map((video) => (
            <div className="video-card" key={video.id.videoId}>
                <a
                    href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        src={video.snippet.thumbnails.medium.url}
                        alt={video.snippet.title}
                        className="video-thumbnail"
                    />
                </a>
                <div className="video-info">
                    <h5 className="video-title">{video.snippet.title}</h5>
                    <p className="video-channel">{video.snippet.channelTitle}</p>
                </div>
            </div>
        ))}
    </div>
);

// Main App Component
const App = () => {
    const [videos, setVideos] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = ['All', 'Music', 'Mix', 'Film', 'Education', 'Gaming', 'Podcasts', 'Technology'];

    useEffect(() => {
        const loadVideos = async () => {
            const query = activeCategory === 'All' ? searchQuery || 'Trending' : `${activeCategory}`;
            const fetchedVideos = await fetchVideos(query);
            setVideos(fetchedVideos);
        };
        loadVideos();
    }, [searchQuery, activeCategory]);

    const handleSearch = (event) => {
        event.preventDefault();
        const query = event.target.elements.search.value;
        setSearchQuery(query);
    };

    return (
        <div className="app-container">
            {/* Navbar */}
            <nav className="navbar">
                <div className="navbar-logo">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg"
                        alt="YouTube Logo"
                    />
                </div>
                <form className="search-bar" onSubmit={handleSearch}>
                    <input type="text" className="form-control" placeholder="Search" name="search" />
                    <button type="submit" className="btn btn-danger">
                        Search
                    </button>
                </form>
            </nav>

            <div className="main-content">
                {/* Main Content */}
                <div className="content-area">
                    {/* Category Filters */}
                    <div className="category-filters">
                        {categories.map((category) => (
                            <button
                                key={category}
                                className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                                onClick={() => setActiveCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Video Grid */}
                    <VideoList videos={videos} />
                </div>
            </div>
        </div>
    );
};

export default App;
