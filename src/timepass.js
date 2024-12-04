import React, { useState } from "react";
import "./HomePage.css";

const HomePage = () => {
    const [activeSection, setActiveSection] = useState("Home");
    const [imagePreview, setImagePreview] = useState(null);
    const [slideIndex, setSlideIndex] = useState(0);
    const [activeFAQ, setActiveFAQ] = useState(null);

    const slides = [
        { src: "/assets/images/11.png", alt: "Jewelry Design 2" },
        { src: "/assets/images/12.png", alt: "Jewelry Design 3" },
        { src: "/assets/images/13.png", alt: "Jewelry Design 4" },
        { src: "/assets/images/14.png", alt: "Jewelry Design 5" },
        { src: "/assets/images/15.png", alt: "Jewelry Design 6" },
        { src: "/assets/images/22.png", alt: "Jewelry Design 7" },
        { src: "/assets/images/20.png", alt: "Jewelry Design 8" },
    ];

    const nextSlide = () => {
        setSlideIndex((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const toggleFAQ = (index) => {
        setActiveFAQ(activeFAQ === index ? null : index);
    };

    const sections = {
        Home: (
            <div className="home-section">
                <div className="slideshow-container">
                    <div className="mySlides">
                        <img src={slides[slideIndex].src} alt={slides[slideIndex].alt} />
                    </div>
                    <a className="prev" onClick={prevSlide}>
                        &#10094;
                    </a>
                    <a className="next" onClick={nextSlide}>
                        &#10095;
                    </a>
                </div>

                <div className="content-boxes">
                    <div className="box">
                        <h3>Step 1</h3>
                        <p>Choose your design inspiration.</p>
                    </div>
                    <div className="box">
                        <h3>Step 2</h3>
                        <p>Upload your favorite patterns.</p>
                    </div>
                    <div className="box">
                        <h3>Step 3</h3>
                        <p>Discover our unique jewelry collections.</p>
                    </div>
                </div>
            </div>
        ),
        upload: (
            <div className="upload-container">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        console.log("Image uploaded!");
                    }}
                >
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = () => setImagePreview(reader.result);
                                reader.readAsDataURL(file);
                            }
                        }}
                    />
                    <button type="submit">Submit</button>
                </form>
                {imagePreview && (
                    <div className="preview-container">
                        <h3>Image Preview:</h3>
                        <img src={imagePreview} alt="Preview" className="preview-image" />
                    </div>
                )}
            </div>
        ),
        about: (
            <div className="about-section">
                <div className="zigzag-container">
                    <div className="zigzag-box">
                        <img src="/assets/images/17.png" alt="About Image 1" />
                        <h2>Learn about our design process.</h2>
                    </div>
                    <div className="zigzag-box">
                        <img src="/assets/images/19.png" alt="About Image 2" />
                        <h2>Explore the craftsmanship behind our jewelry.</h2>
                    </div>
                    <div className="zigzag-box">
                        <img src="/assets/images/20.png" alt="About Image 2" />
                        <h2>Discover our commitment to sustainability.</h2>
                    </div>
                    <div className="zigzag-box">
                        <img src="/assets/images/21.png" alt="About Image 2" />
                        <h2>Join us on our creative journey.</h2>
                    </div>
                    <div className="zigzag-box">
                        <img src="/assets/images/16.png" alt="About Image 2" />
                        <h2>Thank You.</h2>
                    </div>
                </div>

                <div className="faq-with-image">
                    <div className="faq-container">
                        <h2>Frequently Asked Questions</h2>
                        <div className="faq">
                            <div className="faq-question" onClick={() => toggleFAQ(0)}>
                                <h3>What is Jewelry Design Pattern Generation?</h3>
                                <span className="toggle-icon">{activeFAQ === 0 ? "-" : "+"}</span>
                                {activeFAQ === 0 && <p>It is a process of creating unique jewelry designs using advanced AI tools.</p>}
                            </div>
                            <div className="faq-question" onClick={() => toggleFAQ(1)}>
                                <h3>Can I upload my own designs?</h3>
                                <span className="toggle-icon">{activeFAQ === 1 ? "-" : "+"}</span>
                                {activeFAQ === 1 && <p>Yes, you can upload your favorite patterns and inspirations.</p>}
                            </div>
                            <div className="faq-question" onClick={() => toggleFAQ(2)}>
                                <h3>Is this platform free to use?</h3>
                                <span className="toggle-icon">{activeFAQ === 2 ? "-" : "+"}</span>
                                {activeFAQ === 2 && <p>Yes, our platform is free for all users to explore and create designs.</p>}
                            </div>
                        </div>
                    </div>
                    <div className="faq-image-container">
                        <img src="/assets/images/22.png" alt="Creative Journey" className="faq-image" />
                    </div>
                </div>
            </div>
        ),
        contact: (
            <div className="contact-image-container">
                <img src="3.png" alt="Contact Us" className="contact-image" />
            </div>
        ),
    };

    return (
        <div>
            <header>
                <h1>JEWELRY DESIGN PATTERN GENERATION</h1>
            </header>
            <nav>
                {Object.keys(sections).map((key) => (
                    <a
                        key={key}
                        href="#!"
                        className={activeSection === key ? "active" : ""}
                        onClick={() => setActiveSection(key)}
                    >
                        {key.toUpperCase()}
                    </a>
                ))}
            </nav>
            <div>{sections[activeSection]}</div>
        </div>
    );
};

export default HomePage;