import React, { Component } from 'react';
import './FooterComponent.css';  // Import your CSS file

class FooterComponent extends Component {
    
    render() {
        return (
            <div>
                <div className='footer'>
                    <div className='text'>
                        All Rights Reserved 2023 @AntonioCabelloDelgado | 
                        <a href="http://localhost:8000" target="_blank" rel="noopener noreferrer"> View Detailed Documentation</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default FooterComponent;
