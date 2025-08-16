import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function ProductImageSlider({ images, name, id }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (images?.length > 1) {
            intervalRef.current = setInterval(() => {
                setCurrentImageIndex(prev => (prev + 1) % images.length);
            }, 5000); // Change image every 3 seconds
        }

        return () => clearInterval(intervalRef.current);
    }, [images]);

    return (
        <div className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300">
            <Link to={`/product/${id}`}>
                {images?.map((image, index) => (
                    <img
                        key={index}
                        src={image || `https://placehold.co/300x400?text=${encodeURIComponent(name)}`}
                        alt={name}
                        className={`absolute w-full h-full object-contain transition-opacity duration-500 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                        onError={(e) => {
                            e.currentTarget.src = `https://placehold.co/300x400?text=${encodeURIComponent(name)}`;
                        }}
                    />
                ))}
            </Link>
        </div>
    );
};
export default ProductImageSlider;
