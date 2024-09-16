export function Select ({ id, value, onChange, options }) {
    return (
        <select 
        id={id}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 borer rounded-md focus:outline-none focus:rinig-2 focus:ring-primary"
        >
            <option value="" disabled>Select a category</option>
            {options.map(option=> (
                <option key={option.value} value={option.value}>
                    {option.label}
                    </option>
            ))}
        </select>
    );
}