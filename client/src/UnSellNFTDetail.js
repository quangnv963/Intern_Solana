import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom';
import {NFT_MP_BUY_API, NFT_MP_LIST_API, NFT_MP_UNLIST_API} from './Constant';
import NetworkProvider from './context/NetworkProvider';
import { signAndConfirmTransactionFe } from './utilityfunc';
// Trang hiện thị chi tiết 1 NFT (theo địa chỉ của NFT, hiện thị nút mua, bán và ngừng bán)

const UnSellNFTDetail = () => {
    const { network,wallID} = useContext(NetworkProvider);
    const [input, setInput] = useState(0.0001)
    
    const [dusername, setDUserName] = useState("");
    const [dpass, setDPass] = useState("");
    const [decyptAccept, setDecyptAccept] = useState(false);
    const [data, setData] = useState({});
    const {id} = useParams()
    useEffect(() => {
        const fetchData = async () => {  
        try {
            var jsonInput = JSON.stringify({
                "network": network,
                "token_address": id,
            });

            console.log("jsonInput", jsonInput)

            await axios({
            // Endpoint to send files
            url: "http://localhost:8080/sol/v1/nft/read",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "*/*",
                "Access-Control-Allow-Origin": "*",
            },
            // Attaching the form data
            data: jsonInput,
            })
            // Handle the response from backend here
            .then(async (response) => {
                // console.log(response);
                if(response.data.success === true) {   
                    // console.log("sol/v1/nft/read success. Please Wait.");
                    const result = response.data.result;
                    // console.log(result);
                    // const description = result.description
                    try {
                        const descriptionJson = JSON.parse(result.description)
                        result.username = descriptionJson.username
                        result.password = descriptionJson.password
                    } catch (error) {
                        console.error(error);
                    }
                    response.data.result = result;
                    
                    // setData(result)
                }
                // console.log("success: false", response);
                return response.data;
            })
            .then((responseData) => {
                if (responseData.success) {
                    console.log("success: true");
                    console.log("owner ", responseData.result.owner);
                    console.log("wallID ", wallID);
                    if (wallID && wallID == responseData.result.owner) {
                        console.log("set isOwner ");
                    }
                    setData(responseData.result)
                } else {
                    console.log("success: false");
                }
            })
            // Catch errors if any
            .catch((err) => {
            console.warn(err);
            // setStatus("success: false");
            });
        } catch (error) {
            console.error(error);
        }
        }
        fetchData();
    }, [wallID]);
    const buyClick = async () => {
        try {
            var jsonInput = JSON.stringify({
                "network": network,
                "nft_address": id,
                "price": 1,
                "seller_address": "",
                "buyer_wallet": "",
            });
            const callback = (signature,result) => {
                console.log("Signature ",signature);
                console.log("result ",result);
                if(signature.err === null)
                {
                    // setMinted(saveMinted);
                    // setStatus("success: Successfully Signed and Minted.");
                }
                }
            await axios({
                // Endpoint to send files
                url: NFT_MP_BUY_API,
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                Accept: "*/*",
                "Access-Control-Allow-Origin": "*",
                },
                // Attaching the form data
                data: jsonInput,
            })
                // Handle the response from backend here
            .then(async (res) => {
                console.log(res);
                if(res.data.success === true)
                {
                    const transaction = res.data.result.encoded_transaction;
                    const ret_result = await signAndConfirmTransactionFe(network,transaction,callback);
                    console.log(ret_result);
                }
            })

        
            // Catch errors if any
            .catch((err) => {
            console.warn(err);
            // setStatus("success: false");
            });
        } catch (error) {
            console.error(error);
        }
    };


    const sellClick = async () => {
        try {
            var jsonInput = JSON.stringify({
                "network": network,
                "nft_address": id,
                "price": input,
                "seller_wallet": wallID,
            });
            console.log("sellClick input", jsonInput)
            const callback = (signature,result) => {
                console.log("Signature ",signature);
                console.log("result ",result);
                if(signature.err === null)
                {
                    // setMinted(saveMinted);
                    // setStatus("success: Successfully Signed and Minted.");
                }
            }
            await axios({
                // Endpoint to send files
                url: "http://localhost:8080/sol/v1/marketplace/list",
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                Accept: "*/*",
                "Access-Control-Allow-Origin": "*",
                },
                // Attaching the form data
                data: jsonInput,
            })
                // Handle the response from backend here
            .then(async (res) => {
                console.log(res);
                if(res.data.success === true)
                {
                    const transaction = res.data.result.encoded_transaction;
                    const ret_result = await signAndConfirmTransactionFe(network, transaction, callback);
                    console.log(ret_result);
                }
            })
            // Catch errors if any
            .catch((err) => {
                console.warn(err);
            // setStatus("success: false");
            });
        } catch (error) {
            console.error(error);
        }
    };

    
    const decode = async (wallID, mint, username, password) =>{
        try{        
            var jsonInput = JSON.stringify({
                "network": network,
                "nft_address": mint,
                "address": wallID,
                "username": username,
                "password": password,
            });

            console.log("jsonInput", jsonInput)

            return await axios({
                // Endpoint to send files
                url: "http://localhost:8080/sol/v1/nft/view_sensitive",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                    "Access-Control-Allow-Origin": "*",
                },
                // Attaching the form data
                data: jsonInput,
            })
            .then(async (response) => {
                if (response.data.success) {
                    console.log("success: true");
                    
                    console.log(response.data.data.username)
                    console.log(response.data.data.password)
                    return response.data.data;
                } else {
                    console.log("success: false");
                }
            })
            // Catch errors if any
            .catch((err) => {
            console.warn(err);
            // setStatus("success: false");
            });
        }
        catch{

        }
        // return {"username": username, "password": password}
    }

    const handleSellClick = async () => {
        await sellClick();
    };

    const handleClick = async () => {
        // setDecyptAccept(false);
        var newDecyptAccept = false;
        var newDUserName = data.username;
        var newDPass = data.password;
        console.log("result1 ")
        console.log("newDUserName ", newDUserName)
        console.log("newDPass ", newDPass)
        // setDUserName
        // setDPass
        const result = await decode(wallID, data.mint, data.username, data.password);
        console.log("result ", result)
        if (result.username != data.username && result.password != data.password) {
            // setDecyptAccept(true);
            newDecyptAccept = true;
            newDUserName = result.username;
            newDPass = result.password;
        }

        setDUserName(newDUserName);
        setDPass(newDPass);
        setDecyptAccept(newDecyptAccept);

        console.log("new ", newDUserName)
        console.log("new ", newDPass)
        console.log("new ", newDecyptAccept)
      }
      const change = (e) => {
        console.log(e.target.value)
        setInput(e.target.value)
      }
   console.log(data)
  return (
    <div className='text-center mx-[200px]'>
        <div className='p-5'> 
            <p>Chi tiết sản phẩm </p>
        </div>
        <div className='grid grid-cols-2 gap-6'>
            <div>
                <img className='w-[600px] h-[330px]' src={data.image_uri}/>
            </div>
            <div>
                {/* <p>Giá sản phẩm : {data.price} Sol</p> */}
                <p>Loại sản phẩm : {data.name}</p>
                <p>Chủ sản phẩm : {data.owner}</p>
                <div className='px-3 py-2 bg-green-300' onClick={handleClick}>
                    {decyptAccept ? (
                        <><p>Tài khoản : {dusername}</p>
                        <p>Mật khẩu : {dpass} </p></>
                    ): (
                        <><p>Tài khoản : {data?.username}</p>
                        <p>Mật khẩu : {data?.password} </p></>
                    )}
                    
                </div>
                {/* {!(wallID == data.seller_address) && <button className='bg-green-500 p-3 rounded-lg m-3' onClick={buyClick}>Mua</button>} */}
                <input type="text" className="border-[10px] h-18 border-solid" placeholder="Enter Your Symbol" value={input} onChange={(e) => setInput(e.target.value)} required />

                {/* <input className='' type='number' value="0.00001"/> */}
                {(wallID == data.owner) && <button className='bg-red-500 p-3 rounded-lg m-3' onClick={handleSellClick}>Bán</button>}
                
                {/* {(wallID == data.seller_address) && <button className='bg-violet-500 p-3 rounded-lg m-3' onClick={stopSellClick}>Ngừng bán</button>} */}
            </div>
        </div>
    </div>
    
  )
}

export default UnSellNFTDetail