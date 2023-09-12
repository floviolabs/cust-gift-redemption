import Image from 'next/image'

const Logo = ({ width , height}: {width:number, height:number}) => {

    return(
        <>
         <Image className='mx-auto'
            width={width} height={height}
            src={'/aeon.png'}
            alt='Aeon Logo'
            priority={true}
            />
        </>
    )
}

export default Logo