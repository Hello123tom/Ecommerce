import React from 'react'
import '../pageStyles/Products.css'
import Footer from '../components/footer'
import Navbar from '../components/navbar.jsx'
import { toast } from 'react-toastify'
import Loader from '../components/loader.jsx'

import PageTittle from '../components/pageTitle.jsx'
import { useSelector, useDispatch } from 'react-redux'
import { getProducts, removeErrors } from '../features/products/productSlice.js'
import Product from '../components/product.jsx'

import NoProduct from '../components/NoProduct.jsx'
import { ProductionQuantityLimitsOutlined } from '@mui/icons-material'
import Pagination from '../components/pagination.jsx'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'



function Products() {
    const { loading, error, products,totalPages,resultsPerPage } = useSelector((state) => state.product)
    const dispatch = useDispatch()
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const keyword = searchParams.get('keyword')
    const category = searchParams.get('category')
    // console.log('Keyword:', keyword)
    const pageFromURL = parseInt(searchParams.get('page')) || 1 // Debugging line to check the value of keyword
    const [currentPage,setCurrentPage] = useState(pageFromURL)
    const navigate = useNavigate()
    const categories = ['laptop','mobile','tv','fruits','glass','Electronics']

    useEffect(() => {
        dispatch(getProducts({keyword,page:currentPage,category}))
    }, [dispatch, keyword, currentPage,category])

    useEffect(() => {
            if (error) {
                toast.error(error.message, { position: 'top-center', autoClose: 3000 })
                dispatch(removeErrors())
            }
        }, [dispatch, error])

        const handlePageChange = (page) => {
            if(page !== currentPage){
                setCurrentPage(page)
                const newSearchParams = new URLSearchParams(location.search)
                if(page ===1){
                    newSearchParams.delete('page')
                } else {
                    newSearchParams.set('page', page)
                }
                navigate(`?${newSearchParams.toString()}`)
            }
        }
        const handleCategoryClick = (category) => {
            // console.log('Category clicked:', category)
            const newSearchParams = new URLSearchParams(location.search)
            // console.log('Current search params:', newSearchParams.toString())
            // console.log('Current category:', newSearchParams.get('category'), 'Clicked category:', category)
            // console.log(!!newSearchParams.get('category'))
            // if(!!newSearchParams.get('category')){
            //         newSearchParams.delete('category')
            //     }
            // console.log('New category after click:', newSearchParams.get('category'))   
            newSearchParams.set('category', category)
            // console.log('New search params after click:', newSearchParams.toString())
            newSearchParams.delete('page')
            // console.log('New search params after deleting page:', newSearchParams.toString())
            navigate(`?${newSearchParams.toString()}`)
        }


    return (
        <>
            {loading ? (<Loader />) :
                (<>
                    <PageTittle title='product' />
                    <Navbar />
                    <div className="products-layout">
                        <div className="filter-section">
                            <h3 className="filter-heading">Category </h3>
                            <ul>
                                { 
                                    categories.map((cate) =>{
                                        return(<li key={cate} onClick={()=>handleCategoryClick(cate)}>{cate}</li>)
                                    })
                                }
                            </ul>
                        </div>
                        <div className="products-section">
                            {products.length > 0 ? (<div className="products-product-container">
                                {products.map((product) => (
                                    <Product key={product._id} product={product} />
                                ))}  
                            </div>) : (
                                <NoProduct keyword={keyword} />
                            )}
                            <Pagination
                                currentPage={currentPage}
                                // totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                        {/* <div className="filter-section">
                            <Pagination totalPages={totalPages} resultsPerPage={resultsPerPage} />
                        </div> */}
                    </div>
                    <Footer />
                </>)}
        </>
    )
}

export default Products