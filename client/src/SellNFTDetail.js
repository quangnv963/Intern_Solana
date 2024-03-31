import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom';
import {NFT_MP_BUY_API, NFT_MP_LIST_API, NFT_MP_UNLIST_API} from './Constant';
import NetworkProvider from './context/NetworkProvider';
import { signAndConfirmTransactionFe } from './utilityfunc';
// Trang hiện thị chi tiết 1 NFT (theo địa chỉ của NFT, hiện thị nút mua, bán và ngừng bán)

const SellNFTDetail = () => {
    const { network, wallID} = useContext(NetworkProvider);
    const [data, setData] = useState({});

    const [dusername, setDUserName] = useState("");
    const [dpass, setDPass] = useState("");
    const [decyptAccept, setDecyptAccept] = useState(false);

    const {id} = useParams()

    useEffect(() => {
        const fetchData = () => {
        
        try {
            var jsonInput = JSON.stringify({
                "network": network,
                "list_state": id,
            });
            
            console.log("jsonInput", jsonInput)

            axios({
            // Endpoint to send files
            url: "http://localhost:8080/sol/v1/marketplace/list_details",
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
            .then((response) => {
                // console.log(response);
                if(response.data.success === true) {   
                    console.log("success. Please Wait.");
                    const result = response.data.result;
                    console.log("result", result);
                    // const description = result.description

                    try {
                        const descriptionJson = JSON.parse(result.nft.description)
                        result.username = descriptionJson.username
                        result.password = descriptionJson.password
                    } catch (error) {
                        console.error(error);
                    }
                    // setData(result)
                    console.log("result2", result)
                    response.data.result = result;
                    // return result;
                }
                // console.log("success: false", response);
                return response.data;
            })
            .then((responseData) => {
                if (responseData.success) {
                    console.log("success: true");
                    console.log("seller_address ", responseData.result.seller_address);
                    console.log("wallID ", wallID);
                    if (wallID && wallID == responseData.result.seller_address) {
                        console.log("set isOwner ");
                    }
                    setData(responseData.result)
                } else {
                    console.log("success: false");
                }
            })
        
            // Catch errors if any
            .catch((err) => {
            console.log(err);
            // setStatus("success: false");
            });
        } catch (error) {
            console.error(error);
        }
        }
        fetchData();
    }, []);


    const buyClick = async () => {
        try {

            var jsonInput = JSON.stringify({
                "network": network,
                "nft_address": data.nft.mint,
                "price": data.price,
                "seller_address": data.seller_address,
                "buyer_wallet": wallID,
            });

            console.log("jsonInput", jsonInput)

            const callback = (signature,result) => {
                console.log("Signature ",signature);
                console.log("result ",result);
                if(signature.err === null)
                {
                    // setMinted(saveMinted);
                    // setStatus("success: Successfully Signed and Minted.");
                }
                }
            axios({
                // Endpoint to send files
                url: "http://localhost:8080/sol/v1/marketplace/buy",
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



    const stopSellClick = async () => {
        try {
            var jsonInput = JSON.stringify({
                "network": network,
                "list_state": id,
                "seller_wallet": wallID,
            });

            console.log("jsonInput", jsonInput)

            const callback = (signature,result) => {
                console.log("Signature ",signature);
                console.log("result ",result);
                if(signature.err === null)
                {
                    // setMinted(saveMinted);
                    // setStatus("success: Successfully Signed and Minted.");
                }
                }
            
            axios({
                // Endpoint to send files
                url: "http://localhost:8080/sol/v1/marketplace/unlist",
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
        const result = await decode(wallID, data.nft_address, data.username, data.password);
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
  
  console.log("data",data)
  return (
    <div className=' mx-[200px]'>
        <div className='p-5 text-center'> 
            <p>Chi tiết sản phẩm </p>
        </div>
        <div className='grid grid-cols-2 gap-6'>
            <div>
                <img className='w-[600px] h-[330px]' src={data?.nft?.image_uri}/>
            </div>
            <div>
                <p className='my-2'>Giá sản phẩm : {data.price} Sol</p>
                <p className='my-2'>Loại sản phẩm : {data?.nft?.name}</p>
                <p className='my-2'>Chủ sản phẩm : {data?.seller_address}</p>
                <button className='my-6 px-3 py-2 bg-green-300 w-[300px] rounded-xl' onClick={handleClick}>
                    {decyptAccept ? (
                        <><p>Tài khoản :{dusername}</p>
                        <p>Mật khẩu : {dpass} </p></>
                    ): (
                        <><p>Tài khoản : {data?.username}</p>
                        <p>Mật khẩu : {data?.password} </p></>
                    )}
                    
                </button>
                {!(wallID == data.seller_address) && <div><button className='bg-green-500 p-3 rounded-lg opacity-70 hover:opacity-100 my-2' onClick={buyClick}>Mua</button></div>}
                {/* {(wallID == data.seller_address) && <button className='bg-red-500 p-3 rounded-lg m-3' onClick={sellClick}>Bán</button>} */}
                {(wallID == data.seller_address) && <button className='bg-violet-500 p-3 rounded-lg m-3' onClick={stopSellClick}>Ngừng bán</button>}
            </div>
        </div>
    </div>
    
  )
}

export default SellNFTDetail