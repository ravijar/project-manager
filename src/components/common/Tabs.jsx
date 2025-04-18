import React, { useState } from 'react';
import './Tabs.css';

const Tabs = ({ children }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const tabs = React.Children.toArray(children);

    return (
        <div className="tabs-container">
            <div className="tabs-header">
                {tabs.map((tab, idx) => (
                    <div
                        key={idx}
                        className={`tab ${idx === activeIndex ? 'active' : ''}`}
                        onClick={() => setActiveIndex(idx)}
                        title={tab.props.name}
                    >
                        {tab.props.name}
                    </div>
                ))}
            </div>
            <div className="tabs-content">
                {tabs[activeIndex].props.component}
            </div>
        </div>
    );
};

export default Tabs;
