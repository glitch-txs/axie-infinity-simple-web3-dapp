import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { ethers } from 'ethers'
import { useState } from 'react'
import Image from 'next/image'
import bg from '../public/bg-axie.png'
import slp from '../slp.json'
import Donate from '../components/Donate'

  //type of Ronin Provider
  declare global {
    interface Window { 
      ronin: {
        provider: ethers.providers.ExternalProvider
        roninEvent: EventListener
      } 
    }
  }

const Home: NextPage = () => {


  //IMPORTANT SLP HAS NO DECIMALS!
  
  //removed 'ronin:' in enxchange of '0x'
  const SLPAddress = '0xa8754b9fa15fc18bb59458815510e40a12cd2014'
  
  //got from https://docs.roninchain.com/docs/platform/ronin-network/mainnet
  const RoninRPC = 'https://api.roninchain.com/rpc'
  
  //you can use variable Abi's like this one or the json abi file, both will work well
  const abi = [
    // Some details about the token
    "function name() view returns (string)",
    "function symbol() view returns (string)",
  
    // Get the account balance
    "function balanceOf(address) view returns (uint)",
  
    // Send some of your tokens to someone else
    "function transfer(address to, uint amount)",
  
    // An event triggered whenever anyone transfers to someone else
    "event Transfer(address indexed from, address indexed to, uint amount)"
  ];
  
  const [answer, setAnswer] = useState<string>('')
  
  const handleProvider = async () =>{
  
    if(window.ronin){
  
      const provider = new ethers.providers.Web3Provider(window.ronin.provider);
  
      console.log('1: provider:', provider)
      
      const signer = provider.getSigner()
  
      const UserAddress = signer.getAddress().catch(()=>{
        setAnswer('connect your wallet')
        return
      })
      
      console.log('2: signer:', signer, '2.5 address: ', UserAddress)
      
      const SLPContract = new ethers.Contract(SLPAddress, abi, signer);
      
      console.log('3 SLPContract: ', SLPContract)
      
      await SLPContract.name().then((res:string)=>{
        
      console.log('3 Name SLP: ', res)

      setAnswer(res)

      }).catch((er:any)=>console.log(er))
  
  
    }else{
      console.log('install Ronin wallet and connect')
      setAnswer("Install Ronin Extention on your Browser")
    }
  
  }
  
  const handleRPC = async () =>{
  
      const provider = new ethers.providers.JsonRpcProvider(RoninRPC);
  
      console.log('1: provider:', provider)
      
      const SLPContract = new ethers.Contract(SLPAddress, slp.abi, provider);
      
      console.log('2 SLPContract: ', SLPContract)
      
      const name = await SLPContract.name()
  
      console.log('3 Name SLP: ', name)

      setAnswer(name)
  
    }

  return (
    <>
    <div className={styles.backImage}>
      <Image
          src={bg}
          layout="fill"
          objectFit="cover"
          quality={100}
          alt="Axie Infinity"
      />
    </div>
    <div className={styles.container}>

      <p className={styles.title}>This Dapp Calls the SLP Smart Contract&#39;s Name Function</p>

      <div>
                <div className={styles.utils}>
                    <button className="button" type='button' onClick={handleProvider} >Get with Ronin Provider</button>
                    <button className="button" type='button' onClick={handleRPC} >Get with RPC</button>
                </div>
                 <p className={styles.answer} >{ answer }</p>
                  <div className={styles.clearButton} >
                      <button className="button" type='button' onClick={()=>setAnswer('')}>Clear</button>
                  </div>
      </div>
      <Donate setAnswer={setAnswer} />
    </div>
    </>
  )
}

export default Home
