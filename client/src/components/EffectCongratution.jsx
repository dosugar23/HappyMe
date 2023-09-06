import { useState, useEffect } from "react"
// effect confetti
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'

const EffectCongratution = ({ isShow, setIsShow }) => {
    
  const { width, height } = useWindowSize()
    console.log('====================================');
    console.log('componenet');
    console.log('====================================');

    useEffect(() => {
        const confettiTimeout = setTimeout(() => {
            setIsShow(false);
        }, 5000);
    
        return () => {
          clearTimeout(confettiTimeout);
        };
      }, []);
    

    return (
        <Confetti
        width={width}
          height={height}
          recycle={isShow}
      />
    )
}

export default EffectCongratution