module aptosnft::videonft {
    use std::string::{Self, String};
    use std::signer;
    use std::vector;
    use aptos_framework::aptos_coin;
    use aptos_framework::coin;

    struct NFT has store, copy, drop{
        id: u64,
        owner: address,
        uri: String,
        price: u64
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

    public entry fun mint_nft(account: &signer, _uri: String, _price: u64) acquires GlobalNFTData{
        let minter = signer::address_of(account);

        let data = borrow_global_mut<GlobalNFTData>(MY_ADDR);
        data.total_nfts = data.total_nfts + 1;

        let new_nft = NFT {
            id: data.total_nfts,
            owner: minter,
            uri: _uri,
            price: _price,
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

    public entry fun pay_for_watch(sender: &signer, id: u64) acquires GlobalNFTData{
        let nft = get_nft_by_id(id);
        let price = nft.price;
        let receiver = nft.owner;
        let coin = coin::withdraw<aptos_coin::AptosCoin>(sender, price);
        coin::deposit(receiver, coin);
    }
}