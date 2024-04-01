// import Product from "../models/product";
// import Category from "../models/Category";
// import { productSchema } from "../schemas/product";
import axios from "axios";
// import { any } from "joi";
const xApiKey = "H4blfpiI4gcGXQOj";

const NFT_CREATE_API = "https://api.shyft.to/sol/v1/nft/create_detach";
const NFT_READ_ALL_API1 = "https://api.shyft.to/sol/v1/nft/read_all";
const NFT_READ_ALL_API2 = "https://api.shyft.to/sol/v2/nft/read_all";
const NFT_READ_API = "https://api.shyft.to/sol/v1/nft/read";
// const NFT_VIEW_SENSITIVE_API = "https://api.shyft.to/sol/v1/nft/view_sensitive";

const NFT_MP_LIST_API = "https://api.shyft.to/sol/v1/marketplace/list";

const NFT_MP_LIST_DETAIL_API = "https://api.shyft.to/sol/v1/marketplace/list_details";

const NFT_MP_SELLER_LISTINGS_API = "https://api.shyft.to/sol/v1/marketplace/seller_listings";

// const NFT_MP_LIST_API2 = "https://api.shyft.to/sol/v1/marketplace/list";
const NFT_MP_UNLIST_API = "https://api.shyft.to/sol/v1/marketplace/unlist";
const NFT_MP_ACTIVE_LIST_API1 = "https://api.shyft.to/sol/v1/marketplace/active_listings";
const NFT_MP_ACTIVE_LIST_API2 = "https://api.shyft.to/sol/v2/marketplace/active_listings";
const NFT_MP_BUY_API = "https://api.shyft.to/sol/v1/marketplace/buy";

// old marketplace address for admin wallet
// const marketplace_address = "62iFzJjZ8W2KM3WCKApQPvdb5a35sJz8k5WTKdXsHtRx"
// const ADMIN_PUBLIC_KEY = "d1r6aeMX56xUMMKaw6LJrMk3irJoaLbiwGy4iMLzjuL";

// new marketplace address for sender wallet
const marketplace_address = "D7a47hBTijrXxGiX6BCqLGkWgxg7ES1kDYkFs8hzCNTW"
const ADMIN_PUBLIC_KEY = "CGhW9ocFVzauiAd6M3LwxdcvTkW2o6p8GPLwPCjo2RvH";

const MP_FEE = 0.00001
const service_charge = {
    "receiver": ADMIN_PUBLIC_KEY,
    "amount": MP_FEE
}



function encrypt(text) {
	let etext = '';
	const num = 5;
	for (let i = 0; i < text.length; i++) {
		etext += String.fromCharCode(text.charCodeAt(i) + 1 + (i % (num + i)));
	}
	return etext;
}

function decrypt(text) {
	let dtext = '';
    const num = 5;
	for (let i = 0; i < text.length; i++) {
		dtext += String.fromCharCode(text.charCodeAt(i) - 1 - (i % (num + i)));
	}
	return dtext;
}

// input: network, address, nft_address, username, password
// return encoded_transaction to be signed by buyer_wallet and ?
export const viewSensitiveNFT = async (req, res) => {
    try {
        const data = req.body
        var status = "false";
        if (!(data.network && data.address && data.nft_address && data.username && data.password))
            return res.status(500).send({
                success: status,
                message: "Input is not enough"
            })

        const result = await getOwnerOfNFT(data.network, data.nft_address);
        var message = "Address is not owner of nft address";
        
        console.log("input data ", data)
        console.log("result ", result)

        if (result.owner == data.address && result.username == data.username && result.password == data.password) {
            console.log("Accepted decrypt account");
            message = "Accepted decrypt account";
           
            try {
                data.username = decrypt(data.username);
                data.password = decrypt(data.password);
                status = "true";
            } catch (err) {
                message = err;
            }
        }

        return res.status(200).send({
            success: status,
            data: data,
            message: message
        })
    } catch (err) {
        console.warn(err);
        return res.status(500).send({
            success: "false",
            message: "Something wrong"
        })
    }
};

export const getOwnerOfNFT = async (network, nft_address) => {
    try {
        // console.log("req.body", data)
        return await axios({
			// Endpoint to send files
			url: NFT_READ_API + "?" 
            + "network=" + network 
            + "&token_address=" + nft_address,
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"x-api-key": xApiKey,
				Accept: "*/*",
				"Access-Control-Allow-Origin": "*",
			},
			// Attaching the form data
			// data: data,
		})
        // Handle the response from backend here
        .then(async (response) => {
            // console.log(response);
            if(response.data.success === true)
            {   
                console.log("success. Please Wait.");
                const result = response.data.result;

                try {
                    const descriptionJson = JSON.parse(result.description)
                    result.username = descriptionJson.username
                    result.password = descriptionJson.password
                } catch (error) {
                    console.error(error);
                }

                console.log(result);
                // return result;
                return result
            } else {
                console.log("success: false", response);
                return null;
            }
        })
        // Catch errors if any
        .catch((err) => {
            console.warn(err);
        });
    } catch (err) {
        console.warn(err);
        return null;
    }
};


// input: network, nft_address, price, seller_address, buyer_wallet
// return encoded_transaction to be signed by buyer_wallet and ?
export const buyNFT = async (req, res) => {
    try {
        const data = req.body

        if (!(data.network 
            && data.nft_address && data.price 
            && data.seller_address && data.buyer_wallet))
            return res.status(500).send({
                status: "false",
                message: "Input is not enough"
            })

        data.service_charge = service_charge
        data.marketplace_address = marketplace_address

        // console.log("req.body", data)
        axios({
			// Endpoint to send files
			url: NFT_MP_BUY_API,
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-api-key": xApiKey,
				Accept: "*/*",
				"Access-Control-Allow-Origin": "*",
			},
			// Attaching the form data
			data: data,
		})
			// Handle the response from backend here
			.then(async (response) => {
				// console.log(response);
				if(response.data.success === true)
				{   
                    console.log("success: Transaction Created. Please Wait Frontend Signing Transactions.");
					const transaction = response.data.result.encoded_transaction;
            		console.log("transaction", transaction);
                    return res.status(200).send(response.data);	
				}
                console.log("success: false", response);
                return res.status(200).send({
                    status: "false",
                    message: "Something wrong"
                })
			})

			// Catch errors if any
			.catch((err) => {
				console.warn(err);
				// setStatus("success: false");
			});

    } catch (err) {
        console.warn(err);
        return res.status(500).send({
            status: "false",
            message: "Something wrong"
        })
    }
};


// input: network, list_state (NFT address)
// return detail of a NFT
export const listDetail = async (req, res) => {
    try {
        const data = req.body

        if (!(data.network && data.list_state))
            return res.status(500).send({
                status: "false",
                message: "Input is not enough",
            })

        // console.log("req.body", data)
        axios({
			// Endpoint to send files
			url: NFT_MP_LIST_DETAIL_API + "?" 
            + "network=" + data.network 
            + "&marketplace_address=" + marketplace_address 
            + "&list_state=" + data.list_state,
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"x-api-key": xApiKey,
				Accept: "*/*",
				"Access-Control-Allow-Origin": "*",
			},
			// Attaching the form data
			// data: data,
		})
			// Handle the response from backend here
			.then(async (response) => {
				// console.log(response);
				if(response.data.success === true)
				{   
                    console.log("success. Please Wait.");
					const result = response.data.result;
                    console.log(result);
                    // return result;
                    return res.status(200).send(response.data);	
				}
                console.log("success: false", response);
                return res.status(200).send({
                    status: "false",
                    message: "Something wrong",
                })
			})

			// Catch errors if any
			.catch((err) => {
				console.warn(err);
				// setStatus("success: false");
                return res.status(500).send({
                    status: "false",
                    message: "Something wrong",
                })
			});

    } catch (err) {
        console.warn(err);
        return res.status(500).send({
            status: "false",
            message: "Something wrong",
        })
    }
};


function paginateArray(array, pageSize, pageNumber) {
    --pageNumber; // Giảm số trang đi 1 vì số trang bắt đầu từ 1 trong khi chỉ mục của mảng bắt đầu từ 0
    return array.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
}  

// input: network, seller_address, page, size
// return json.data = list of NFT
export const sellerListings = async (req, res) => {
    try {
        const data = req.body

        if (!(data.network && data.seller_address && data.page && data.size))
            return res.status(500).send({
                status: "false",
                message: "Input is not enough",
                result: []
            })

        // console.log("req.body", data)
        axios({
			// Endpoint to send files
			url: NFT_MP_SELLER_LISTINGS_API + "?" 
            + "network=" + data.network 
            + "&marketplace_address=" + marketplace_address 
            + "&seller_address=" + data.seller_address,
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"x-api-key": xApiKey,
				Accept: "*/*",
				"Access-Control-Allow-Origin": "*",
			},
			// Attaching the form data
			// data: data,
		})
			// Handle the response from backend here
			.then(async (response) => {
				// console.log(response);
				if(response.data.success === true)
				{   
                    console.log("success. Please Wait.");
					const result = response.data.result;
                    // var newResult = []
                    const newResult = result.filter((item)=> item.cancelled_at == null)
                    response.data.result = paginateArray(newResult, data.size, data.page)

                    console.log(newResult);
                    // return result;
                    return res.status(200).send(response.data);	
				}
                console.log("success: false", response);
                return res.status(200).send({
                    status: "false",
                    message: "Something wrong",
                    result: []
                })
			})

			// Catch errors if any
			.catch((err) => {
				console.warn(err);
				// setStatus("success: false");
			});

    } catch (err) {
        console.warn(err);
        return res.status(500).send({
            status: "false",
            message: "Something wrong",
            result: []
        })
    }
};


// input: network, token_address (NFT address)
// return detail of a NFT
export const readNFT = async (req, res) => {
    try {
        const data = req.body

        if (!(data.network && data.token_address))
            return res.status(500).send({
                status: "false",
                message: "Input is not enough",
            })

        // console.log("req.body", data)
        axios({
			// Endpoint to send files
			url: NFT_READ_API + "?" 
            + "network=" + data.network 
            + "&token_address=" + data.token_address,
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"x-api-key": xApiKey,
				Accept: "*/*",
				"Access-Control-Allow-Origin": "*",
			},
			// Attaching the form data
			// data: data,
		})
			// Handle the response from backend here
			.then(async (response) => {
				// console.log(response);
				if(response.data.success === true)
				{   
                    console.log("success. Please Wait.");
					const result = response.data.result;
                    console.log(result);
                    // return result;
                    return res.status(200).send(response.data);	
				}
                console.log("success: false", response);
                return res.status(200).send({
                    status: "false",
                    message: "Something wrong",
                })
			})

			// Catch errors if any
			.catch((err) => {
				console.warn(err);
				// setStatus("success: false");
                return res.status(500).send({
                    status: "false",
                    message: "Something wrong",
                })
			});

    } catch (err) {
        console.warn(err);
        return res.status(500).send({
            status: "false",
            message: "Something wrong",
        })
    }
};


// input: network, address, page, size
// return json.data = list of NFT
export const readAllNFT2 = async (req, res) => {
    try {
        const data = req.body

        if (!(data.network && data.address && data.page && data.size))
            return res.status(500).send({
                status: "false",
                message: "Input is not enough",
                result: []
            })

        // console.log("req.body", data)
        axios({
			// Endpoint to send files
			url: NFT_READ_ALL_API2 + "?" 
            + "network=" + data.network 
            + "&address=" + data.address 
            + "&page=" + data.page 
            + "&size=" + data.size,
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"x-api-key": xApiKey,
				Accept: "*/*",
				"Access-Control-Allow-Origin": "*",
			},
			// Attaching the form data
			// data: data,
		})
			// Handle the response from backend here
			.then(async (response) => {
				// console.log(response);
				if(response.data.success === true)
				{   
                    console.log("success. Please Wait.");
					const result = response.data.result;
                    console.log(result);
                    // return result;
                    return res.status(200).send(response.data);	
				}
                console.log("success: false", response);
                return res.status(200).send({
                    status: "false",
                    message: "Something wrong",
                    result: []
                })
			})

			// Catch errors if any
			.catch((err) => {
				console.warn(err);
				// setStatus("success: false");
                return res.status(500).send({
                    status: "false",
                    message: "Something wrong",
                    result: []
                })
			});

    } catch (err) {
        console.warn(err);
        return res.status(500).send({
            status: "false",
            message: "Something wrong",
            result: []
        })
    }
};


// input: network, address
// return json.data = list of NFT
export const readAllNFT = async (req, res) => {
    try {
        const data = req.body

        if (!(data.network && data.address))
            return res.status(500).send({
                status: "false",
                message: "Input is not enough",
                result: []
            })

        // console.log("req.body", data)
        axios({
			// Endpoint to send files
			url: NFT_READ_ALL_API1 + "?" 
            + "network=" + data.network 
            + "address=" + data.address,
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-api-key": xApiKey,
				Accept: "*/*",
				"Access-Control-Allow-Origin": "*",
			},
			// Attaching the form data
			// data: data,
		})
			// Handle the response from backend here
			.then(async (response) => {
				// console.log(response);
				if(response.data.success === true)
				{   
                    console.log("success. Please Wait.");
					const result = response.data.result;
                    console.log(result);
                    // return result;
                    return res.status(200).send(response.data);	
				}
                console.log("success: false", response);
                return res.status(200).send({
                    status: "false",
                    message: "Something wrong",
                    result: []
                })
			})

			// Catch errors if any
			.catch((err) => {
				console.warn(err);
				// setStatus("success: false");
			});

    } catch (err) {
        console.warn(err);
        return res.status(500).send({
            status: "false",
            message: "Something wrong",
            result: []
        })
    }
};


// input: network, marketplace_address, page, size
// return json.data = list of NFT
export const activeListings2 = async (req, res) => {
    try {
        const data = req.body

        if (!(data.network && data.page && data.size))
            return res.status(500).send({
                status: "false",
                message: "Input is not enough",
                result: []
            })
        
        
        data.marketplace_address = marketplace_address
        
        // console.log("req.body", data)
        axios({
			// Endpoint to send files
			url: NFT_MP_ACTIVE_LIST_API2 + "?" 
            + "network=" + data.network 
            + "&marketplace_address=" + marketplace_address 
            + "&page=" + data.page  
            + "&size=" + data.size ,
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"x-api-key": xApiKey,
				Accept: "*/*",
				"Access-Control-Allow-Origin": "*",
			},
			// Attaching the form data
			// data: data,
		})
			// Handle the response from backend here
			.then(async (response) => {
				// console.log(response);
				if(response.data.success === true)
				{   
                    console.log("success. Please Wait.");
					const result = response.data.result;
                    console.log(result);
                    // return result;
                    return res.status(200).send(response.data);	
				}
                console.log("success: false", response);
                return res.status(200).send({
                    status: "false",
                    message: "Something wrong",
                    result: []
                })
			})

			// Catch errors if any
			.catch((err) => {
				console.warn(err);
				// setStatus("success: false");
                return res.status(500).send({
                    status: "false",
                    message: "Something wrong",
                    result: []
                })
			});

    } catch (err) {
        console.warn(err);
        return res.status(500).send({
            status: "false",
            message: "Something wrong",
            result: []
        })
    }
};


// input: network, marketplace_address
// return json.data = list of NFT
export const activeListings = async (req, res) => {
    try {
        const data = req.body

        if (!data.network)
            return res.status(500).send({
                status: "false",
                message: "Input is not enough",
                result: []
            })

        // console.log("req.body", data)
        axios({
			// Endpoint to send files
			url: NFT_MP_ACTIVE_LIST_API1 + "?" + "network=" + data.network + "&marketplace_address=" + marketplace_address,
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"x-api-key": xApiKey,
				Accept: "*/*",
				"Access-Control-Allow-Origin": "*",
			},
			// Attaching the form data
			// data: data,
		})
			// Handle the response from backend here
			.then(async (response) => {
				// console.log(response);
				if(response.data.success === true)
				{   
                    console.log("success. Please Wait.");
					const result = response.data.result;
                    console.log(result);
                    // return result;
                    return res.status(200).send(response.data);	
				}
                console.log("success: false", response);
                return res.status(200).send({
                    status: "false",
                    message: "Something wrong",
                    result: []
                })
			})

			// Catch errors if any
			.catch((err) => {
				console.warn(err);
				// setStatus("success: false");
                return res.status(500).send({
                    status: "false",
                    message: "Something wrong",
                    result: []
                })
			});

    } catch (err) {
        console.warn(err);
        return res.status(500).send({
            status: "false",
            message: "Something wrong",
            result: []
        })
    }
};


// input: network, list_state, seller_wallet
// return encoded_transaction to be signed by seller_wallet
export const unlistNFT = async (req, res) => {
    try {
        const data = req.body

        if (!(data.network
            && data.list_state && data.seller_wallet))
            return res.status(500).send({
                status: "false",
                message: "Input is not enough"
            })
        data.marketplace_address = marketplace_address
        // console.log("req.body", data)
        axios({
			// Endpoint to send files
			url: NFT_MP_UNLIST_API,
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-api-key": xApiKey,
				Accept: "*/*",
				"Access-Control-Allow-Origin": "*",
			},
			// Attaching the form data
			data: data,
		})
			// Handle the response from backend here
			.then(async (response) => {
				// console.log(response);
				if(response.data.success === true)
				{   
                    console.log("success: Transaction Created. Please Wait Frontend Signing Transactions.");
					const transaction = response.data.result.encoded_transaction;
            		console.log("transaction", transaction);
                    return res.status(200).send(response.data);	
				}
                console.log("success: false", response);
                return res.status(200).send({
                    status: "false",
                    message: "Something wrong"
                })
			})

			// Catch errors if any
			.catch((err) => {
				console.warn(err);
				// setStatus("success: false");
			});

    } catch (err) {
        console.warn(err);
        return res.status(500).send({
            status: "false",
            message: "Something wrong"
        })
    }
};


// input: network, nft_address, price, seller_wallet
// return encoded_transaction to be signed by seller_wallet
export const listNFT = async (req, res) => {
    try {
        const data = req.body

        if (!(data.network 
            && data.nft_address && data.price && data.seller_wallet))
            return res.status(500).send({
                status: "false",
                message: "Input is not enough"
            })
        data.marketplace_address = marketplace_address
        data.service_charge = service_charge

        // console.log("req.body", data)
        await axios({
			// Endpoint to send files
			url: NFT_MP_LIST_API,
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-api-key": xApiKey,
				Accept: "*/*",
				"Access-Control-Allow-Origin": "*",
			},
			// Attaching the form data
			data: data,
		})
			// Handle the response from backend here
			.then(async (response) => {
				// console.log(response);
				if(response.data.success === true)
				{   
                    console.log("success: Transaction Created. Please Wait Frontend Signing Transactions.");
					const transaction = response.data.result.encoded_transaction;
            		console.log("transaction", transaction);
                    return res.status(200).send(response.data);	
				}
                console.log("success: false", response);
                return res.status(200).send({
                    status: "false",
                    message: "Something wrong"
                })
			})

			// Catch errors if any
			.catch((err) => {
				console.warn(err);
                return res.status(500).send({
                    status: "false",
                    message: "Something wrong"
                })
				// setStatus("success: false");
			});

    } catch (err) {
        console.warn(err);
        return res.status(500).send({
            status: "false",
            message: "Something wrong"
        })
    }
};


// input: 
// return encoded_transaction to be signed by owner of wallet
export const createNFT = async (req, res) => {
    try {
        const data = req.body
        console.log("data", data)
        axios({
			// Endpoint to send files
			url: NFT_CREATE_API,
			method: "POST",
			headers: {
				"Content-Type": "multipart/form-data",
				"x-api-key": xApiKey,
				Accept: "*/*",
				"Access-Control-Allow-Origin": "*",
			},
			// Attaching the form data
			data: data,
		})
			// Handle the response from backend here
			.then(async (response) => {
				// console.log(response);
				if(response.data.success === true)
				{
					const transaction = response.data.result.encoded_transaction;
            		console.log(transaction);
                    return res.status(200).send(response.data);	
				}
			})

			// Catch errors if any
			.catch((err) => {
				console.warn(err);
				// setStatus("success: false");
			});

    } catch (err) {
        res.status(500).send({
            status: "false",
            message: "Something wrong"
        })
    }
};

export const getAllNFT = async (req, res) => {
   
    try {
        const movies = [{
            "id":"1",
            "name ":"Acc lol chiến",
            "type":"League of Legend",
            "price": '1',
            "img":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6eJzknN7QRpcR0HdOPFlr18rV-jiWZw6uDw&usqp=CAU",
            "desc":"Sản phẩm này là account rất ngon, khỏe"
        },
        {
            "id":"2",
            "name ":"Acc Bubg ngon",
            "type":"PUBG",
            "price": '1,2',
            "img":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6eJzknN7QRpcR0HdOPFlr18rV-jiWZw6uDw&usqp=CAU",
            "desc":"Sản phẩm này là account rất ngon, khỏe"
        },
        {
            "id":"3",
            "name ":"Acc lol chiến 2",
        "type":"League of Legend",
        "price": '1',
        "img":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6eJzknN7QRpcR0HdOPFlr18rV-jiWZw6uDw&usqp=CAU",
        "desc":"Sản phẩm này là account rất ngon, khỏe"
        },
        
        {       
            "id":"4",
            "name ":"Acc lol chiến 3",
        "type":"League of Legend",
        "price": '1',
        "img":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6eJzknN7QRpcR0HdOPFlr18rV-jiWZw6uDw&usqp=CAU",
        "desc":"Sản phẩm này là account rất ngon, khỏe"
        },
        {
            "id":"5",
        "name ":"Acc FIFA khủng",
        "type":"League of Legend",
        "price": '3',
        "img":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6eJzknN7QRpcR0HdOPFlr18rV-jiWZw6uDw&usqp=CAU",
        "desc":"Sản phẩm này là account rất ngon, khỏe"
        }]
        res.send(movies)
    } catch (err) {
        res.status(500).send({
            message: "Cố lỗi xảy ra"
        })
    }
        res.end()
}

export const getOneNFT = async (req, res) => {
    const {id} = req.params
    try {
        const movies = [{
            "id":"1",
            "name ":"Acc lol chiến",
            "type":"League of Legend",
            "price": '1',
            "img":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6eJzknN7QRpcR0HdOPFlr18rV-jiWZw6uDw&usqp=CAU",
            "desc":"Sản phẩm này là account rất ngon, khỏe"
        },
        {
            "id":"2",
            "name ":"Acc Bubg ngon",
            "type":"PUBG",
            "price": '1,2',
            "img":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6eJzknN7QRpcR0HdOPFlr18rV-jiWZw6uDw&usqp=CAU",
            "desc":"Sản phẩm này là account rất ngon, khỏe"
        },
        {
            "id":"3",
            "name ":"Acc lol chiến 2",
        "type":"League of Legend",
        "price": '1',
        "img":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6eJzknN7QRpcR0HdOPFlr18rV-jiWZw6uDw&usqp=CAU",
        "desc":"Sản phẩm này là account rất ngon, khỏe"
        },
        
        {       
            "id":"4",
            "name ":"Acc lol chiến 3",
        "type":"League of Legend",
        "price": '1',
        "img":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6eJzknN7QRpcR0HdOPFlr18rV-jiWZw6uDw&usqp=CAU",
        "desc":"Sản phẩm này là account rất ngon, khỏe"
        },
        {
            "id":"5",
        "name ":"Acc FIFA khủng",
        "type":"League of Legend",
        "price": '3',
        "img":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6eJzknN7QRpcR0HdOPFlr18rV-jiWZw6uDw&usqp=CAU",
        "desc":"Sản phẩm này là account rất ngon, khỏe"
        }]
        const one = movies.find(item => item.id == id)
        res.send(one)
    } catch (err) {
        res.status(500).send({
            message: "Cố lỗi xảy ra"
        })
    }
    res.end()
}

export const getAllNFTOfWallet = async (req, res) => {
    const key = req.body
    console.log(key)
    try {
        const movies = [{
            "id":"1",
            "name ":"Acc lol chiến",
            "type":"League of Legend",
            "price": '1',
            "img":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6eJzknN7QRpcR0HdOPFlr18rV-jiWZw6uDw&usqp=CAU",
            "desc":"Sản phẩm này là account rất ngon, khỏe"
        },
        {
            "id":"2",
            "name ":"Acc Bubg ngon",
            "type":"PUBG",
            "price": '1,2',
            "img":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6eJzknN7QRpcR0HdOPFlr18rV-jiWZw6uDw&usqp=CAU",
            "desc":"Sản phẩm này là account rất ngon, khỏe"
        }
        ]
        
        return res.status(200).send(movies)
    } catch (err) {
        return res.status(500).send({
            message: "Cố lỗi xảy ra"
        })
    }
    res.end()
}
// export const decrypt = anync (req, res) =>{

// }