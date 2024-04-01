import { useCallback, useEffect, useState, useContext } from "react";
import {  clusterApiUrl, Connection,PublicKey } from "@solana/web3.js";
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { Link } from "react-router-dom";

import NetworkProvider from '../context/NetworkProvider';
const Header = () => {
    
     const { network, setNetwork, wallID, setWallID } = useContext(NetworkProvider);

     const [phantom, setPhantom] = useState(null)
     const [connStatus, setConnStatus] = useState(false);
  
     const solanaConnect = async () => {
          console.log('clicked solana connect');
          const { solana } = window;
               if(!solana)
               {
                    alert("Please Install Solana");
               }

               try {  
                    //const network = "devnet";
                    const pt = new PhantomWalletAdapter()
                    await pt.connect();
                    // phantom.disconnect()
                    const rpcUrl = clusterApiUrl(network);
                    const connection = new Connection(rpcUrl,"confirmed");
                    const wallet = {
                         address: pt.publicKey.toString(),
                    };

                    if(wallet.address)
                    {
                         console.log(wallet.address);
                         setWallID(wallet.address);
                         const accountInfo = await connection.getAccountInfo(new PublicKey(wallet.address),"confirmed");
                         console.log(accountInfo);
                         setConnStatus(true);

                         setPhantom(pt)
                    }
               } catch(err) {
                    console.log(err);
               }
     }

     const solanaDisconect = async () => {
          const { solana } = window;
          // if(!solana)
          // {
          //      alert("Please Install Solana");
          // }
          console.log('clicked disconnect phantom');

          try {  
               //const ntwork = "devnet";
               if (phantom) {
                    console.log('start disconnect phantom');
                    await phantom.disconnect();
                    // console.log(phantom.publicKey.toString())
                    if (!phantom.publicKey) {
                         setWallID(null)
                         setConnStatus(false);
                    }
                    console.log('done disconnect phantom');
                    console.log(wallID)
               }
                    
          } catch(err) {
               console.log("Error in disconnect phantom", err);
          }
          
     }

     const wallID_Render = (string) =>{
          if(string.length > 6){
              return string.substring(0, 6) + '...';
          } 
          else {
              return string;
          }
          }



     return (
    <div>
        <div className="grid grid-cols-6  items-center bg-blue-500 w-full py-9 px-[75px]">
            <div className="w-[180px] mx-10"><img src="https://leagueofstore.com/cdn/shop/files/LEGEND_PNG_cropped_1200x1200.png?v=1614331610" alt="" /></div>
            {wallID && <button className="bg-yellow-300  py-3 rounded-lg w-50"><Link to='/collection'>My Collection</Link></button>}
            <div className="text-[24px] mx-10">
                <Link className="text-black bg-yellow-300 p-3 rounded-lg hover:text-black opacity-60 hover:opacity-90" to="/create">Tạo sản phẩm</Link>
            </div>
            <div>
                <select
                    name="network"
                    className="form-control form-select w-[150px]"
                    id=""
                    onChange={(e) => setNetwork(e.target.value)}
                >
                    <option value="devnet">Devnet</option>
                    <option value="testnet">Testnet</option>
                    <option value="mainnet-beta">Mainnet Beta</option>
                </select>
            </div>
            <div className="font-semibold mx-10 text-[18px]">
                
                {connStatus ? ( <div>
                    <p>ID Ví : {wallID_Render(wallID)}</p>
                    <button className="bg-red-600 py-2 px-3 rounded-xl"onClick={solanaDisconect}>Disconnect</button>
                </div>) : <></>}
                
                {connStatus ? (
                     <></>
                    ) : (
                    // Call connectWallet function when click Button
                    <button className="bg-violet-800 py-2 px-3 rounded-xl" onClick={solanaConnect}>
                        Connect Wallet
                    </button>
                    )}
            </div>
        </div>
    </div>
  )
}

export default Header
