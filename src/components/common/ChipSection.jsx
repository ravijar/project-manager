import './ChipSection.css';
import {useEffect} from "react";

const ChipSection = ({chips = [], activeValue, setActiveValue}) => {

    useEffect(() => {
        if (!activeValue && chips.length > 0) {
            setActiveValue(chips[0].value);
        }
    }, [chips, activeValue, setActiveValue]);

    const handleClick = (chip) => {
        setActiveValue(chip.value);
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
