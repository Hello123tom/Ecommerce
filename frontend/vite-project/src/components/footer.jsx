import React from "react";
import '../componentStyles/Footer.css'
import {Phone,Mail, GitHub,LinkedIn,YouTube,Instagram} from '@mui/icons-material'


function Footer(){
    return(
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section contact">
                    <h3>Contact Us</h3>
                    <p><Phone/> Phone:020 56854054</p>
                    <p><Mail/> Email: tom.sayyavong2000@gmail.com</p>

                </div>

                <div className="footer-section social">
                    <h3>Scial Link</h3>
                        <div className="social-links">
                            <a href="" target="_blank">
                                <GitHub className='social-icon'/>
                            </a>
                            <a href="" target="_blank">
                                <LinkedIn className='social-icon'/>
                            </a>
                            <a href="" target="_blank">
                                <YouTube className='social-icon'/>
                            </a>
                            <a href="" target="_blank">
                                <Instagram className='social-icon'/>
                            </a>
                        </div>  
                </div>

                <div className="footer-section about">
                    <h3>About Us</h3>
                    <p>This for learing bulding website.</p>
                </div>


            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().toLocaleDateString('la-LA')}</p>
            </div>
        </footer>
    )
}

export default Footer