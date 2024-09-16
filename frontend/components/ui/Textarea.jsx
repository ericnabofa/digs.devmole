export function Textarea ({ id, value, onChange, rows = 4, placeholder }) {
    return (
        <textarea 
        id={id}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
    );
}

