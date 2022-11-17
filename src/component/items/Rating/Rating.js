import { useState } from "react";

const Rating = ({initRating, setNewRating, isReactive}) => {
    
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
                            onClick={() => { isReactive && handleSetRating(index)}}
                            onMouseEnter={() => { isReactive && setHover(index)}}
                            onMouseLeave={() => { isReactive && setHover(rating)}}
                            onDoubleClick={() => { isReactive && handleSetRating(0)}}
                        >
                            <span className="star">&#9733;</span>
                        </button>
                    );
                    })}
        </div>
    );
}

export default Rating;