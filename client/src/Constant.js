
const HOST = "http://localhost"
const PORT = "8080"

const NFT_CREATE_API = HOST + ":" + PORT + "/sol/v1/nft/create_detach";
const NFT_READ_ALL_API1 = HOST + ":" + PORT + "/sol/v1/nft/read_all";
const NFT_READ_ALL_API2 = HOST + ":" + PORT + "/sol/v2/nft/read_all";
const NFT_READ_API = HOST + ":" + PORT + "/sol/v1/nft/read";
const NFT_VIEW_SENSITIVE_API = HOST + ":" + PORT + "/sol/v1/nft/view_sensitive";

const NFT_MP_LIST_API = HOST + ":" + PORT + "/sol/v1/marketplace/list";
// const NFT_MP_LIST_API2 = HOST + ":" + PORT + "/sol/v1/marketplace/list";
const NFT_MP_UNLIST_API = HOST + ":" + PORT + "/sol/v1/marketplace/unlist";
const NFT_MP_ACTIVE_LIST_API1 = HOST + ":" + PORT + "/sol/v1/marketplace/active_listings";
const NFT_MP_ACTIVE_LIST_API2 = HOST + ":" + PORT + "/sol/v2/marketplace/active_listings";
const NFT_MP_BUY_API = HOST + ":" + PORT + "/sol/v2/marketplace/buy";