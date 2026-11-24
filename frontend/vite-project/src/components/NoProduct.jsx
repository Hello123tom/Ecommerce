import React from 'react'
import '../componentStyles/NoProducts.css'

function NoProduct({ keyword }) {
  return (
        <div className="no-products-container">
            <div className="no-products-content">
                <div className="no-products-icon">⚡</div>
                <h3 className="no-products-title">No Product found</h3>
                <p className="no-products-message">({`Sorry, no ${keyword} matched your search criteria`})</p>
            </div>
        </div>
   
)
}

export default NoProduct