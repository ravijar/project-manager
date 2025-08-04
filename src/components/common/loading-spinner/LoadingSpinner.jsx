import './LoadingSpinner.css';

const LoadingSpinner = ({size = 50, color = '#3498db'}) => {
    return (
        <div
            className="loading-spinner"
            style={{
                width: size,
                height: size,
                borderTopColor: color,
            }}
        ></div>
    );
};

export default LoadingSpinner;
