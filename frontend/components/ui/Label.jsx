export function Label({ htnmlFor, children }) {
    return (
        <label htmlFor={htnmlFor} className="block text-sm font-medium rext-gray-700">
            {children}
        </label>
    );
}