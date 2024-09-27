module aptosnft::nftaptos {
    use std::string::{Self, String};
    use std::signer;
    use std::vector;

    struct NFT has store, copy{
        id: u64,
        owner: address,
        uri: String,
    }

    struct GlobalNFTData has key {
        nfts: vector<NFT>,
        total_nfts: u64, 
    }

    const EINVALID_ID: u64 = 1;

    const MY_ADDR: address = @aptosnft;


    public entry fun init_contract(sender: &signer) {
        let global_data = GlobalNFTData { nfts: vector::empty<NFT>(), total_nfts: 0};
        move_to(sender, global_data);
    }

    public entry fun mint_nft(account: &signer, _uri: String) acquires GlobalNFTData{
        let minter = signer::address_of(account);

        let data = borrow_global_mut<GlobalNFTData>(MY_ADDR);
        data.total_nfts = data.total_nfts + 1;

        let new_nft = NFT {
            id: data.total_nfts,
            owner: minter,
            uri: _uri,
        };

        vector::push_back(&mut data.nfts, new_nft);
    }

    #[view]
    public fun get_total_count(): u64 acquires GlobalNFTData {
        let data = borrow_global_mut<GlobalNFTData>(MY_ADDR);

        data.total_nfts
    }

    #[view]
    public fun get_nft_by_id(id: u64): NFT acquires GlobalNFTData {
        let data = borrow_global_mut<GlobalNFTData>(MY_ADDR);

        let nft_ref = vector::borrow(&data.nfts, id);
        let nft_copy = *nft_ref;

        nft_copy
    }
}