import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Correctly import jwtDecode
import { useNavigate } from 'react-router-dom';
import "./Indexx.css";

const Indexx = () => {
    const [activeSection, setActiveSection] = useState("Home");
    const [imagePreview, setImagePreview] = useState(null);
    const [slideIndex, setSlideIndex] = useState(0);
    const [activeFAQ, setActiveFAQ] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [uploadedImagePreview, setUploadedImagePreview] = useState(null);
    const [generatedImagePreview, setGeneratedImagePreview] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const decodedToken = jwtDecode(token);
            fetchUserProfile(token);
        } catch (error) {
            console.error('Invalid token:', error);
            navigate('/login');
        }
    }, [navigate]);

    const fetchUserProfile = async (token) => {
        try {
            const response = await fetch('http://localhost:3001/profile', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                alert('Failed to fetch profile data.');
                navigate('/login');
                return;
            }

            const data = await response.json();
            setUserProfile(data);
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while fetching profile data.');
        }
    };

    const handleSignOut = () => {
        sessionStorage.removeItem('token');
        alert('You have signed out!');
        navigate('/login');
    };

    const slides = [
        { src1: require("./assets/sketch/sketch_001_001.png"), alt1: "Jewelry Sketch 1", src2: require("./assets/original/001_001.png"), alt2: "Jewelry Design 1" },
        { src1: require("./assets/sketch/sketch_001_002.png"), alt1: "Jewelry Sketch 2", src2: require("./assets/original/001_002.png"), alt2: "Jewelry Design 2" },
    ];

    const nextSlide = () => setSlideIndex((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setUploadedImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleImageGeneration = async (e) => {
        e.preventDefault();

        if (!uploadedImagePreview) {
            alert("Please upload an image first.");
            return;
        }

        try {
            const formData = new FormData();
            const imageFile = document.querySelector('input[type="file"]').files[0];
            formData.append('imageInput', imageFile);

            const response = await fetch('http://localhost:5000/process-image', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                alert("Error generating image. Please try again.");
                return;
            }

            const blob = await response.blob();
            const generatedImageURL = URL.createObjectURL(blob);
            setGeneratedImagePreview(generatedImageURL);
        } catch (error) {
            console.error("Error generating image:", error);
            alert("An error occurred while generating the image. Please try again later.");
        }
    };

    const sections = {
        Home: (
            <div className="home-section">
                <div className="slideshow-container">
                    <div className="mySlides">
                        <div className="slideImages">
                            <img src={slides[slideIndex].src1} alt={slides[slideIndex].alt1} />
                            <img src={slides[slideIndex].src2} alt={slides[slideIndex].alt2} />
                        </div>
                    </div>
                    <a className="prev" onClick={prevSlide}>&#10094;</a>
                    <a className="next" onClick={nextSlide}>&#10095;</a>
                </div>
            </div>
        ),
        upload: (
            <div className="upload-section">
                <div className="upload-container">
                    <form className="upload-form" onSubmit={handleImageGeneration}>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            className="file-input"
                            onChange={handleImageUpload}
                        />
                        <button type="submit" className="submit-button">Submit</button>
                    </form>
                </div>
                <div className="image-preview-container">
                    <div className="image-preview-box">
                        <h3>Uploaded Image</h3>
                        {uploadedImagePreview ? (
                            <img src={uploadedImagePreview} alt="Uploaded Preview" className="preview-image" />
                        ) : (
                            <p className="placeholder-text">No image uploaded</p>
                        )}
                    </div>
                    <div className="image-preview-box">
                        <h3>Generated Image</h3>
                        {generatedImagePreview ? (
                            <img src={generatedImagePreview} alt="Generated Preview" className="preview-image" />
                        ) : (
                            <p className="placeholder-text">No image generated</p>
                        )}
                    </div>
                </div>
            </div>
        ),
        profile: (
            <div className="profile-section">
                <h2>Profile Details</h2>
                {userProfile ? (
                    <div className="profile-details">
                        <p><strong>Full name:</strong> {userProfile.fullName}</p>
                        <p><strong>Email:</strong> {userProfile.email}</p>
                        <p><strong>Phone:</strong> {userProfile.phone}</p>
                        <p><strong>Date of Birth:</strong> {userProfile.dob}</p>
                    </div>
                ) : (
                    <p>Loading profile...</p>
                )}
            </div>
        ),
        contact: (
            <div className="contact-section">
                <h2>Contact Us</h2>
                <div className="contact-details">
                    <p>
                        <i className="fa fa-envelope"></i> 
                        Email: support@jewelrydesign.com
                    </p>
                    <p>
                        <i className="fa fa-phone"></i> 
                        Phone: +1 123-456-7890
                    </p>
                    <p>
                        <i className="fa fa-map-marker"></i> 
                        Address: 123 Jewelry Street, Design City, NY
                    </p>
                </div>
            </div>
        ),
    };

    return (
        <div className="main-container">
            <header className="main-header">
                <div className="header-content">
                    <div className="logo"><a href="#">Jewelry Design</a></div>
                    <nav className="main-nav">
                        <button onClick={() => setActiveSection("Home")}>Home</button>
                        <button onClick={() => setActiveSection("upload")}>Upload</button>
                        <button onClick={() => setActiveSection("profile")}>Profile</button>
                        <button onClick={() => setActiveSection("contact")}>Contact Us</button>
                        <button onClick={handleSignOut}>Sign Out</button>
                    </nav>
                </div>
            </header>
            <div className="content-section">{sections[activeSection]}</div>
        </div>
    );
};

export default Indexx;
