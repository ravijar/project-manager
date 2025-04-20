import React, { useState } from 'react';
import './ChipSection.css';

const ChipSection = ({ chips = [], onChange }) => {
    const [activeValue, setActiveValue] = useState(null);

    const handleClick = (chip) => {
        setActiveValue(chip.value);
        onChange?.(chip);
    };

    return (
        <div className="chip-section">
            {chips.map((chip) => (
                <div
                    key={chip.value}
                    className={`chip ${chip.value === activeValue ? 'active' : ''}`}
                    onClick={() => handleClick(chip)}
                >
                    {chip.label}
                </div>
            ))}
        </div>
    );
};

export default ChipSection;
