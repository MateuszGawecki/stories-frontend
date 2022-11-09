import { useEffect, useState } from "react";

const Rating = ({initRating, setNewRating}) => {
    
    const [rating, setRating] = useState(initRating);
    const [hover, setHover] = useState(0);

    const handleSetRating = (ind) => {
        setRating(ind);
        setNewRating(ind);
    };

    return (
        <div className="star-rating">
                    {[...Array(5)].map((star, index) => {
                     index += 1;
                    return (
                        <button
                            type="button"
                            key={index}
                            className={index <= (hover || rating) ? "on" : "off"}
                            onClick={() => handleSetRating(index)}
                            onMouseEnter={() => setHover(index)}
                            onMouseLeave={() => setHover(rating)}
                            onDoubleClick={() => {
                                setRating(0);
                                setHover(0);
                                }}
                        >
                            <span className="star">&#9733;</span>
                        </button>
                    );
                    })}
        </div>
    );
}

export default Rating;