import React, { useState,useContext } from "react";
import axios from "axios";
import NetworkProvider from './context/NetworkProvider';
import NFT_CREATE_API from './Constant';
import abc from './assets/public_key.txt'
import Swal from 'sweetalert2'
import disPic from './resources/screenshots/upload-file.jpg';
// import './resources/css/custom2.css';
import { signAndConfirmTransactionFe } from "./utilityfunc";
import { Link } from "react-router-dom";
import {encrypt} from "./RSA"
import Loading from "./components/Loading";
import LoadingAction from "./components/LoadingAction";
import { useNavigate } from 'react-router-dom';

const Create = () => {
    const { network, setnetwork, wallID, setWallID  } = useContext(NetworkProvider);
	const [file, setfile] = useState();
    // const [base64, setBase64] = useState();
	const [displayPic, setDisplayPic] = useState(disPic);
	// const [network, setnetwork] = useState("devnet");
	// const [privKey, setprivKey] = useState();
	const [publicKey, setPublicKey] = useState('');
	const [name, setName] = useState("LOL");
	// const [symbol, setSymbol] = useState();
	const [desc, setDesc] = useState();
	const [extUrl, setExtUrl] = useState();
	const [maxSup, setMaxSup] = useState(0);
	const [roy, setRoy] = useState(99);
    const [username, SetUsername] = useState("")
    const [password, SetPassword] = useState("")
	const [mota, setMota] = useState("")
	const navigate = useNavigate();
	const [minted,setMinted] = useState();
	const [saveMinted,setSaveMinted] = useState();
	const [errorRoy, setErrorRoy] = useState();
    const [loading, setLoading] = useState(false)
	const [status, setStatus] = useState("Awaiting Upload");
	const [dispResponse, setDispResp] = useState("");

	const [connStatus, setConnStatus] = useState(true);
	// console.log("publicSenKey ", publicSenKey)
	
	const callback = (signature,result) => {
		console.log("Signature ",signature);
		console.log("result ",result);
		if(signature.err === null)
		{
			setMinted(saveMinted);
			setStatus("success: Successfully Signed and Minted.");
			console.log("minted", minted)
			Swal.fire({
				title: "Success",
				text: "Bạn đã tạo NFT thành công!",
				icon: "success"
			});
			console.log("minted2", minted)
			navigate(`/unsell/detail/${minted}`)
		}
		setDispResp(minted)
	  }

	const mintNow = (e) => {
		setLoading(true)
		e.preventDefault();
		setStatus("Loading");
		let formData = new FormData();
		formData.append("network", network);
		formData.append("wallet", wallID);
		formData.append("name", name);
		formData.append("symbol", "symbol");
		// formData.append("description", desc);
		// formData.append("attributes", JSON.stringify(attr));
		formData.append("external_url", extUrl);
		formData.append("max_supply", maxSup);
		formData.append("royalty", roy);
		formData.append("file", file);
		
		console.log("file1 ", file)
        // const base64 = convertBase64(file);
        // console.log("base64 ")
		const att = JSON.stringify({
			"username": encrypt(username),
			"password": encrypt(password),
			"description": mota
		}).toString()
		// setDesc(att)
		formData.append("description", att);
		// console.log("data ", data)

		console.log("att ", att)
		console.log(formData)
		axios({
			// url: NFT_CREATE_API, // https://api.shyft.to/sol/v1/nft/create_detach
			url: "https://api.shyft.to/sol/v1/nft/create_detach",
			method: "POST",
			headers: {
				"Content-Type": "multipart/form-data",
				"x-api-key": "H4blfpiI4gcGXQOj", // 
				Accept: "*/*",
				"Access-Control-Allow-Origin": "*",
			},

			// Attaching the form data
			data: formData,
		})
			// Handle the response from backend here
			.then(async (res) => {
				console.log(res);
				if(res.data.success === true)
				{
					setLoading(false)
					setStatus("success: Transaction Created. Signing Transactions. Please Wait.");
					const transaction = res.data.result.encoded_transaction;
					setSaveMinted(res.data.result.mint);
					const ret_result = await signAndConfirmTransactionFe(network,transaction,callback);
            		console.log(ret_result);
					// setDispResp(res.data);
				}
			})

			// Catch errors if any
			.catch((err) => {
				console.warn(err);
				setLoading(false)
				setStatus("success: false");
				Swal.fire({
					title: "ERROR",
					text: "Tạo NFT thất bại, hãy thử lại sau",
					icon: "error"
					});
			});
            console.log(network)

	}

	return (
		<div className="gradient-background">
				{loading && <LoadingAction/>}
			<div className="container p-5">
				{connStatus && (<div className="form-container border border-primary rounded py-3 px-5" style={{ backgroundColor: "#FFFFFFEE" }}>
					<h3 className="pt-4 text-center font-semibold text-[42px]">Tạo NFT</h3>
					<form>
						<div className="img-container text-center mt-5">
							<div
								className="uploaded-img"
								style={{
									height: "200px",
									width: "200px",
									backgroundColor: "grey",
									margin: "0 auto",
									borderRadius: "10px",
								}}
							>
								<img
									src={displayPic}
									alt="To be uploaded"
									style={{ height: "100%", width: "100%", objectFit: "cover" }}
								/>
							</div>
							<div className="mt-3"></div>
							<button className="btn btn-primary button-24 text-light rounded-pill m-2">Select File</button><br></br>
							<input
								type="file"
								style={{ position: "absolute", zIndex: "3", marginTop: "-50px", marginLeft: "-70px", width: "150px", height: "40px", opacity: "0" }}
								onChange={(e) => {
									const [file_selected] = e.target.files;
									setfile(e.target.files[0]);
									setDisplayPic(URL.createObjectURL(file_selected));
								}}
							/>
							<div className="mb-3"></div>
						</div>
						<div className="fields">
							<table className="table">
								<tbody>
								<tr>
									<td className="py-4 ps-2 w-50 text-start">
										Public Key<br />
										<small>Your wallet's public key (string)</small>
									</td>
									<td className="px-5 pt-4">
										<input type="text" className="form-control" placeholder="Enter Your Wallet's Public Key" readOnly value={wallID} onChange={(e) => setPublicKey(e.target.value)} required />
									</td>
								</tr>
								<tr>
									<td className="py-4 ps-2 text-start">Game<br />
										<small>Your NFT Game</small>
									</td>
									<td className="px-5 pt-4">
										{/* <input type="text" className="form-control" placeholder="Enter NFT Name" value={name} onChange={(e) => setName(e.target.value)} required /> */}
										<select
											name="network"
											className="form-control form-select w-[150px]"
											id=""
											onChange={(e) => setName(e.target.value)}
										>
											<option value="LOL">LOL</option>
											<option value="PUBG">PUBG</option>
											<option value="FIFA online 4">FIFA online 4</option>
										</select>
									</td>
								</tr>
								<tr>
									<td className="py-4 ps-2 text-start">
										Description<br />
										<small>Your NFT Description (string)</small>
									</td>
									<td className="px-5 pt-4">
										<input type="text" className="form-control" placeholder="Enter Your NFT Description" value={mota} onChange={(e) => setMota(e.target.value)} required />
									</td>
								</tr>
								{/* <tr>
									<td className="py-4 ps-2 text-start">
										Description <br />
										<small>Add a small story to this NFT (string)</small>
									</td>
									<td className="px-5 py-3">
										<textarea className="form-control" placeholder="Enter Description" value={desc} onChange={(e) => setDesc(e.target.value)} required></textarea>
									</td>
								</tr> */}
								<tr>
									<td className="py-4 ps-2 text-start">
										User_Name Your Account <br />
										<small>Your Login Info . (Should have 'user_name' and 'password')</small>
									</td>
									<td className="px-5 py-3">
										<textarea className="form-control" placeholder="Enter Your UserName " value={username} onChange={(e) => SetUsername(e.target.value)} required></textarea>
									</td>
								</tr>
                                <tr>
									<td className="py-4 ps-2 text-start">
										Password Your Account <br />
										<small>Your Password. (Write your password account of game)</small>
									</td>
									<td className="px-5 py-3">
										<textarea className="form-control" placeholder="Enter Your Password" value={password} onChange={(e) => SetPassword(e.target.value)} required></textarea>
									</td>
								</tr>
								</tbody>
							</table>
							<div className="p-5 text-center">
								<button type="submit" className="btn btn-success button-25" onClick={mintNow}>Submit</button>
							</div>
						</div>
					</form>
					<div className="text-center">
						This creates one of kind NFTs by setting the <code>max_supply</code> parameter to 0. But you can update it needed, it should be between <i>0-100</i>.
					</div>
				</div>)}

				<div className="py-5">
					<h2 className="text-center pb-3">Response</h2>
					<div className="status text-center text-info p-3"><b>{status}</b></div>
					<textarea
						className="form-control"
						name=""
						value={JSON.stringify(dispResponse)}
						id=""
						cols="30"
						rows="10"
					></textarea>
				</div>
				<div className="p-3 text-center">
					{dispResponse && (<Link to={`/unsell/detail/${minted}`} target="_blank" className="btn btn-warning m-2 py-2 px-4">View on Explorer</Link>)}
				</div>
			</div>
		</div>
	);
};

export default Create;
