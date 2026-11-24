
import '../componentStyles/Rating.css'
import { useState } from 'react'

function Rating({value, onRatingChange, disabled}){
    const [hoveredRating, setHoveredRating] = useState(0);
    const [selectedRating, setSelectRating] = useState(value || 0)

    const handleMouseEnter = (rating) => {
        if(!disabled){
            setHoveredRating(rating)
        }
    }

    const handleMouseLeave = ()=>{
        setHoveredRating(0)
    }

    const handleClick = (rating)=>{
        if(!disabled){
            setSelectRating(rating)
            if(onRatingChange){
                onRatingChange(rating)
            }
        }
    }

    const generateStar = ()=>{
        const stars = [];
        for(let i=1;i<=5;i++){
            const isFilled = i <=(hoveredRating || selectedRating);
            stars.push(
                <span key={i}
                className={`star ${isFilled?'filled':'empty'}`}
                onMouseEnter={()=>!disabled && setHoveredRating(i)}
                onMouseLeave={handleMouseLeave}
                onClick={()=>handleClick(i)}
                style={{pointerEvents:disabled?'none':'auto'}}>★</span>

            )
        }
        return stars
    }

    return(
        <div>
            <div className="rating">{generateStar()}</div>
        </div>
    )
}

export default Rating