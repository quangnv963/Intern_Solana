import axios from 'axios'
import React, { useState, useEffect, useContext } from 'react'
import NetworkProvider from './context/NetworkProvider';
import { Link } from 'react-router-dom';
import NFT_MP_ACTIVE_LIST_API2 from './Constant';
import Loading from './components/Loading';

// Trang hiện các sản phẩm đang bán ( chỉ hiện thị hình ảnh , giá bán, loại tài khoản)

const MyCollection = () => {
    const { network, wallID} = useContext(NetworkProvider);
    const [data, setData] = useState([]);
    const [NFTAdds, setNFTAdds] = useState([]);
    const [dictionary, setDict] = useState(new Object());
    const [loading, setLoading] = useState(false)

    console.log(wallID)
    useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true)
            var jsonInput = JSON.stringify({
                "network": network,
                "address": wallID,
                "page": 1,
                "size": 20,
            });
            var result = [];
            console.log(jsonInput)
            await axios({
                // Endpoint to send files
                url: "http://localhost:8080/sol/v2/nft/read_all",
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
                    console.log("read_all success. Please Wait.");
                    result = response.data.result.nfts;
                    console.log("read_all result ", result)
                    // setData(result)
                } else {
                    console.log("read_all success: false", response);
                }     
            })
            // Catch errors if any
            .catch((err) => {
                console.warn(err);
                console.log("read_all success: false");
            // setStatus("success: false");
            });


            var jsonInput = JSON.stringify({
                "network": network,
                "seller_address": wallID,
                "page": 1,
                "size": 10,
            });
            await axios({
                url: "http://localhost:8080/sol/v1/marketplace/seller_listings",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                    "Access-Control-Allow-Origin": "*",
                },
                data: jsonInput,
            }).then(async (response) => {
                
                if(response.data.success === true) {   
                    console.log("seller_listings success. Please Wait.");
                    const nfts = response.data.result;
                    var lists = [];
                    var dicts = new Object();
                    for (let i = 0; i < nfts.length; i++) {
                        lists.push(nfts[i].nft_address)
                        dicts[nfts[i].nft_address] = nfts[i].list_state
                    }
                    console.log("lists", lists)
                    console.log("dicts", dicts)
                    setNFTAdds(lists);
                    setDict(dicts);
                    setData(result)
                    setLoading(false)
                } else {
                    console.log("seller_listings success: false", response);
                }              
            }).catch((err) => {
                console.warn(err);
                setLoading(false)
            });
        } catch (error) {
            console.error(error);
            setLoading(false)
        }
    };
    fetchData()
  }, [wallID, network]);

  // dang giao ban là true khi NFTAdds.includes(item.nft_address) `
  if(loading){
    return <Loading/>
  }
  return (

    <div className='mx-20'>
     {wallID ? ( <>
      <h1 className='text-center p-5'>My NFT Collection</h1>
      <div className='grid grid-cols-4 gap-3 '> 
          {data.map((item, i) => (
            (NFTAdds.indexOf(item.mint)+1) ? (
                <Link className='bg-slate-200 rounded-xl relative px-3 pb-[120px]'  to={`/detail/${dictionary[item?.mint]}`}>
                <div key={i + 1}>
                    <div className='w-[372px]'>
                        <img className='object-center object-cover h-[270px] w-[100%]' src={item?.image_uri}/>
                    </div>
                    <div className='absolute top-[78%]'>
                        <p>Thể loại game: {item?.name}</p>
                        <p>Đang giao bán</p>
                    </div>
                </div>
                </Link>
            ): (
                <Link className='bg-slate-200 rounded-xl relative px-3 pb-20'  to={`/unsell/detail/${item?.mint}`}>
                  <div key={i + 1}>
                      <div className='w-[372px]'>
                          <img className='object-center object-cover h-[270px] w-[100%]' src={item?.image_uri}/>
                      </div>
                      <div className='absolute top-[78%]'>
                          <p>Thể loại game: {item?.name}</p>
                          {/* <p>Giá : {item?.price} Sol</p> */}
                          <p>Chưa giao bán</p>
                      </div>
                  </div>
                </Link>
            )
              
          ))}
      </div></>):( <div>
        <p>Connect ví để xem My Collection trên nền tảng</p>
      </div>)
      }
    </div>
  )
}

export default MyCollection