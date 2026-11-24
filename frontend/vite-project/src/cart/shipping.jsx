import React, { useEffect, useState } from 'react'
import '../CartStyles/Shipping.css'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import PageTitle from '../components/pageTitle'
import CheckoutPath from './checkoutPath'
import { useDispatch, useSelector } from 'react-redux'
import { Country, State, City }  from 'country-state-city';
import { Navigate, useNavigate } from 'react-router-dom'
import { saveShippingInfo } from '../features/cart/cartSlice'
function Shipping() {
    const {shippingInfo} = useSelector((state)=>state.cart)
    const dispatch = useDispatch()
    const [address, setAddress] = useState(shippingInfo.address || '');
    const [pinCode, setPinCode] = useState(shippingInfo.pinCode || '');
    const [phoneNumber, setPhoneNumber] = useState(shippingInfo.phoneNumber || '');
    const [country, setCountry] = useState(shippingInfo.country || '');
    const [state, setState] = useState(shippingInfo.state|| '');
    const [city, setCity] = useState(shippingInfo.city|| '');
    const navigate = useNavigate()
    console.log(Country.getAllCountries())
    console.log(State.getAllStates())
    // let statee = State.getAllStates()
    // console.log('statee',statee)
    // statee = statee.filter((s)=>s.countryCode==='IN')
    // console.log('statee33331',statee)
    console.log(City.getAllCities())
    // Country.getAllCountries().filter((c)=>c.name==='India').map((c)=>console.log(c.isoCode))
    // useEffect(() => {
    //     if(phoneNumber){
    //     phoneNumber = `+856 20 ${phoneNumber}`
    // }
    // })
    
    const shippingInfoSubmit = (e) => {
        e.preventDefault();
        // console.log(address,pinCode,phoneNumber,country,state,city)
        dispatch(saveShippingInfo({address, pinCode, phoneNumber, country, state, city}))
        navigate('/order/confirm')
    }
    const prefix = '+856 20 '

    const handlePhoneChange = (e) => {
        const value = e.target.value
        setPhoneNumber(value.startsWith(prefix) ? value.slice(prefix.length) : value)
    }
    
    return (
        <>
            <Navbar />
            <PageTitle title='Shipping' />
            <CheckoutPath activePath={0}/>
            <div className="shipping-form-container">
                <h1 className="shipping-form-header">Shipping Details</h1>
                <form className="shipping-form" onSubmit={shippingInfoSubmit}>
                    <div className="shipping-section">
                        <div className="shipping-form-group">
                            <label htmlFor="address">Address</label>
                            <input type="text" id="address" name="address" placeholder="enter your address"  value={address} onChange={(e)=>setAddress(e.target.value)}/>
                        </div>

                        <div className="shipping-form-group">
                            <label htmlFor="pinCode">PinCode</label>
                            <input type="number" id="pinCode" name="pinCode" placeholder="Enter your pinCode" value={pinCode} onChange={(e)=>setPinCode(e.target.value)}/>
                        </div>

                        <div className="shipping-form-group">
                            <label htmlFor="pinCode">Phone Number</label>
                            <input type="tel" id="phoneNumber" name="phoneNumber" placeholder="Enter your phoneNumber" value={phoneNumber ? `${prefix}${phoneNumber}` : ''}onChange={handlePhoneChange} />
                        </div>

                        
                    </div>

                    <div className="shipping-section">
                        <div className="shipping-form-group">
                            <label htmlFor="country">Country</label>
                            <select name="country" id="country" value={country} onChange={(e)=>{setCountry(e.target.value);setState('');setCity('');}}>
                                <option value="">Select a Country</option>
                                {/* <option value="US">United States</option>
                                <option value="IN">India</option> */}
                                {Country.getAllCountries().map((item,index)=>(<option key={index} value={item.isoCode}>{item.name}</option>))}
                                
                            </select>
                        </div>


                        {country && (<div className="shipping-form-group">
                            <label htmlFor="state">State</label>
                            <select name="state" id="state" value={state} onChange={(e)=>{setState(e.target.value);setCity('');}}>
                                <option value="">Select a State</option>
                                {/* {State.getAllStates().map((item,index)=>(<option key={index} value={item.name}>{item.name}</option>))} */}
                                {State.getStatesOfCountry(country).map((item,index)=><option key={index} value={item.isoCode}>{item.name}</option>)}
                            </select>
                        </div>)}

                        {state&&(<div className="shipping-form-group">
                            <label htmlFor="city">City</label>
                            <select name="city" id="city" value={city} onChange={(e)=>setCity(e.target.value)}>
                                <option value="">Select a City</option>
                                {City.getCitiesOfState(country,state).map((item,index)=><option key={index} value={item.name}>{item.name}</option>)}
                            </select>
                        </div>)}
                    </div>

                    <button className="shipping-submit-btn" >continue</button>

                </form>
            </div>    <Footer />
        </>
    )
}

export default Shipping