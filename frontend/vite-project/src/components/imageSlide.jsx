// import React, { useEffect } from 'react'
// import '../componentStyles/ImageSlide.css'
import '../componentStyles/ImageSlider.css'
import React, { useEffect, useState } from 'react'
const imagess = [
  '/images/ChatGPT_Image_Jul_16_2026_12_54_14_PM_06ab2c7c-25d5-44cb-b6e7-1af9027a4fc9.webp',
  '/images/DIBE07912-1.jpg',
  '/images/eclipse.gif'
]


function ImageSlider(){
    const [currentIndex,setCurrentIndex] = useState(0);
    useEffect(()=>{
        const interval = setInterval(()=>{setCurrentIndex((prevIndex) => (prevIndex+1) % imagess.length)},5000)
        return () => clearInterval(interval)
    },[])

    return(
        <div className="image-slider-container">
            <div className="slider-images" style={{transform:`translateX(-${currentIndex*100}%)`}}>
                { imagess.map((image, index) => 
                <div className="slider-item" key={index}>
                    <img src={image} alt={`Slide ${index+1}`} />
                </div>)}
            </div>

            <div className="slider-dots">
                {imagess.map((_,index) =>(
                    <span className={`dot ${index === currentIndex? 'active': ''}`}
                    onClick ={() => setCurrentIndex(index)} key={index}/>
                )) }
            </div>
        </div>
    )
}

export default ImageSlider


// import React, { useEffect, useState } from 'react'
// import '../componentStyles/ImageSlider.css'

// const imagess = [
//   '/images/images(1).jpeg',
//   '/images/images2.jpeg',
//   '/images/images3.avif'
// ]

// function ImageSlider() {
//   const [currentIndex, setCurrentIndex] = useState(0)

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % imagess.length)
//     }, 5000)

//     return () => clearInterval(interval)
//   }, [])

//   return (
//     <div className="image-slider-container">
//       <div
//         className="slider-images"
//         style={{ transform: `translateX(-${currentIndex * 100}%)` }}
//       >
//         {imagess.map((image, index) => (
//           <div className="slider-item" key={index}>
//             <img src={image} alt={`Slide ${index + 1}`} />
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default ImageSlider