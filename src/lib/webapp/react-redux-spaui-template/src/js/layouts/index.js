import React from 'react';
import Header from '../components/header/index.jsx';
import SideNavMenu from '../components/side-nav-menu/index.jsx';

const IndexLayout = (props) => {
    return (
        <div>
            <Header />
            <div className='page-content' style={{ height: 'calc(100vh - 52px)' }}>
                <div className="page-content__side-bar"><SideNavMenu /></div>
                <div className="page-content__main">
                {
                    props.children
                }
                </div>
            </div>
        </div>
    );
};

export default IndexLayout;