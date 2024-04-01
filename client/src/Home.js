import axios from 'axios'

import React, { useState, useEffect, useContext } from 'react'

import NetworkProvider from './context/NetworkProvider';
import { Link } from 'react-router-dom';
import NFT_MP_ACTIVE_LIST_API2 from './Constant';
import Loading from './components/Loading';

// Trang hiện các sản phẩm đang bán ( chỉ hiện thị hình ảnh , giá bán, loại tài khoản)

const Home = () => {
    const { network} = useContext(NetworkProvider);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false)
    useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true)
            var jsonInput = JSON.stringify({
                "network": network,
                // "marketplace_address": marketplace_address,
                "page": 1,
                "size": 20,
            });

            
            await axios({
                // Endpoint to send files
                url: "http://localhost:8080/sol/v2/marketplace/active_listings",
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
                
                if(response.data.success === true) {   
                    console.log("success. Please Wait.");
                    const result = response.data.result.data;
                    setData(result)
                    setLoading(false)
                }
                console.log("success: false", response);
            })
        
            // Catch errors if any
            .catch((err) => {
                console.warn(err);
                setLoading(false)

            // setStatus("success: false");
            });
        } catch (error) {
            console.error(error);
            setLoading(false)
        }
    };

    fetchData();
  }, [network]);
  console.log(data.length)
  if(loading){
    return <Loading/>
  }

  return (
    <div className='mx-20'>
        <h1 className='text-center p-5'></h1>
    <div className='grid grid-cols-4 gap-3 '> 
            {data.map((item, i) => (
                <Link className='bg-slate-200 rounded-xl relative px-3 pb-20' to={`/detail/${item.list_state}`}>
                    <div key={i + 1}>
                        <div className='w-[372px]'>
                            <img className='object-center object-cover h-[270px] w-[100%]' src={item.nft.image_uri}/>
                        </div>
                        <div className='absolute top-[78%]'>
                            <p>Thể loại game: {item.nft.name}</p>
                            <p>Giá : {item.price} Sol</p>
                        </div>
                    </div>
                </Link>
            ))}
    </div>
    </div>
  )
}

export default Home