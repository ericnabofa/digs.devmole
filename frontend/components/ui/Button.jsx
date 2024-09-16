export function Button ({ type, variant = 'primary', children, onClick }) {
    const buttonStyles = {
        primary: 'bg-primary text-white',
        secondary: 'bg-secondary text-primary',
    };

    return (
        <button 
        type={type}
        className={`px-4 py-2 rounded-md ${buttonStyles[variant]} hover:opacity-90`}
        onClick={onClick}
        >
            {children}
        </button>
    );
}