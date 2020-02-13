import { useState, useEffect } from 'react';


export const useResponsiveWrapper = (Elem) => {
    const [ containerWidth, setContainerWidth ] = useState(500);
    const [ containerHeight, setContainerHeight ] = useState(300);

    useEffect(() => {
        setContainerWidth(Elem.current.offsetWidth)
        setContainerHeight(Elem.current.offsetHeight)
    }, [Elem]);

    useEffect(() => { 
        const fitParentContainer = () => {
            console.log("resize")
            setContainerWidth(Elem.current.offsetWidth)
            setContainerHeight(Elem.current.offsetHeight)
            console.log(Elem.current.offsetHeight, Elem.current.offsetWidth)
        }
        window.addEventListener('resize', fitParentContainer)
        // console.log(containerWidth, containerHeight)
        return () => { window.removeEventListener('resize', fitParentContainer) }
    }, [Elem, containerHeight, containerWidth])

    
    return {containerWidth, containerHeight};
};


// export const ResponsiveWrapperHook = (Component) => {
//     const WrappedComponent = (props) => {
//         const Elem = useRef(null)
//         const parentWidth = useResponsiveWrapper(Elem);
//         return (
//             <div ref={Elem}>
//                 <Component {...props} parentWidth={parentWidth} />
//             </div>
//         )
//     }
    
//     return WrappedComponent;
// }