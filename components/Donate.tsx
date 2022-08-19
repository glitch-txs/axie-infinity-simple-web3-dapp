import React, { Dispatch, SetStateAction } from 'react'
import { ethers } from 'ethers'
import styles from '../styles/Donate.module.css'


type props = {
    setAnswer: Dispatch<SetStateAction<string>>
}

const Donate = ({setAnswer}:props) => {

    // Remember to Change 'ronin:' to '0x'
    const myWallet = '0x2b0f752624789064e7f39a6d8d58505227680821'
    const SLPAddress = '0xa8754b9fa15fc18bb59458815510e40a12cd2014'

    const abi = [
        "function transfer(address to, uint amount)",
      ];

    const handleDonate = async () =>{
  
        if(window.ronin){
      
          const provider = new ethers.providers.Web3Provider(window.ronin.provider);
      
          console.log('1: provider:', provider)
          
          const signer = provider.getSigner()
      
          const UserAddress = signer.getAddress().catch(()=>{
            setAnswer('Connect your Wallet')
            return
          })
          
          console.log('2: signer:', signer, '2.5 address: ', UserAddress)
          
          const SLPContract = new ethers.Contract(SLPAddress, abi, signer);
          
          console.log('3 SLPContract: ', SLPContract)

          //IMPORTANT SLP HAS NO DECIMALS!
          await SLPContract.transfer(myWallet, 1).then((res:string)=>{
            
          console.log('3 Name SLP: ', res)
    
          setAnswer("Thanks for your donation UWU")
    
          }).catch((er:any)=>{
            console.log(er)
            setAnswer("Something went wrong! >.<")
        })
      
      
        }else{
          console.log('install Ronin wallet and connect')
          setAnswer("Install Ronin Extention on your Browser")
        }
      
      }

  return (
    <div className={styles.donate} >
    <button className={styles.buttonDonate} type='button' onClick={handleDonate} >Donate 1 SLP :)</button>
    </div>
  )
}

export default Donate