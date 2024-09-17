import './loading.css';
const ProgressBar: React.FC = () => {
    return (
        <div className="w-full bg-gray-200 h-1">
            <div className="bg-indigo-600 h-1 animate-progress" style={{ width: '50%' }}></div>
        </div>
    );
};

export default ProgressBar;
