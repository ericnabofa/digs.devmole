export function Separator ({ orientation = 'horizontal', className = '' }){
    return <div className={`border-${orientation === 'horizontal' ? 'b' : '1'} border-gray-300${className}`} />;
}