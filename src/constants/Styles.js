// For login and signup components
import Background from '../assets/collection-newspapers.jpg';
let width = window.screen.availWidth;
let cardSize= '';
let marginRight= '';
let marginLeft = '';
let paddingLeft = 'auto';
if (width > 720) {
cardSize ='60%';
marginRight= null
marginLeft=null
} else if (width < 720 && width > 550) {
cardSize = '85%';
marginRight = 'auto';
marginLeft = '0';
paddingLeft = '10rem';
} else if (width < 550 ) {
    cardSize= '18rem';
    marginRight = 'auto';
    marginLeft = '0';
    paddingLeft = '75px';
}
export const divStyle = { 
            flex: 1,
            minHeight: '100%', 
            minWidth: '1024px', 
            width: '100%', 
            height: 'auto', 
            position: 'fixed', 
            backgroundSize: 'cover',
            backgroundImage: `url(${Background})`,  
            display:'flex',
            justifyContent:'center',
            alignItems:'center', 
            padding: '170px',
            paddingLeft: paddingLeft    
        }
export const cardStyle= {
            width: cardSize,
            maxWidth: 400,
            maxHeight: 400,
            marginRight: marginRight,
            marginLeft: marginLeft,
            shadowColor: 'black',
            shadowOpacity: 0.26,
            shadowOffset: {width: 0, height: 2},
            elevation: 5,
            shadowRadius: 10,
            borderRadius: 10,
        }