import { Router } from "express";
import { createNFT, listNFT, unlistNFT, 
    activeListings, activeListings2, 
    readAllNFT, readAllNFT2, readNFT, 
    buyNFT, viewSensitiveNFT, listDetail, sellerListings } from "../controllers/shyftAPI";


const router = Router();
router.post('/sol/v1/nft/create_detach', createNFT); // return to encoded transaction => convert to formData instead of json 

router.post('/sol/v1/marketplace/list', listNFT); // put NFT into market place to sell: đăng bán 

router.post('/sol/v1/marketplace/list_details', listDetail); // put NFT into market place to sell: đăng bán 

router.post('/sol/v1/marketplace/unlist', unlistNFT); // remove (not have to delete) NFT from market place: không bán nữa

router.post('/sol/v1/marketplace/active_listings', activeListings); // get all active NFT listed in market place: lấy các NFT đang được đăng bán
router.post('/sol/v2/marketplace/active_listings', activeListings2); // similar, add more page and size param

router.post('/sol/v1/nft/read_all', readAllNFT); // get all NFT (can be in/not in market place) from a public key
router.post('/sol/v2/nft/read_all', readAllNFT2); // similar, add more page and size param

router.post('/sol/v1/nft/read', readNFT); // get detail information of a NFT

router.post('/sol/v1/marketplace/seller_listings', sellerListings); // put NFT into market place to sell: đăng bán 

router.post('/sol/v1/marketplace/buy', buyNFT); // buy NFT from nft mint address, buyer and seller wallet

router.post('/sol/v1/nft/view_sensitive', viewSensitiveNFT); // use key for decode encrypt data account if NFT owner is equal to connected wallet

export default router;