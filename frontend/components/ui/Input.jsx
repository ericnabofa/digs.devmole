export function Input({ id, type = 'text', value, onChange, placeholder }) {
    return (
        <input 
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
    );
}