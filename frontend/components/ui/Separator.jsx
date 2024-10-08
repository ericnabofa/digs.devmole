export function Separator ({ orientation = 'horizontal', className = '' }){
    return <div className={`border-${orientation === 'horizontal' ? 'b' : 'l'} border-gray-300 ${className}`} />;
}

