const { assert } = require('chai');
const Market = artifacts.require("./NFTMarket.sol");
const GameItem = artifacts.require("./GameItem.sol");

require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

contract('NFTMarket', (accounts) => {
    let market
    let gameitem

    before(async () => {
        gameitem = await GameItem.deployed()
        market = await Market.deployed()
    })

    describe('deployment', async () => {
        it('deploys successfully', async () => {
            const address = market.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
            console.log("address", address)

            const gameitemaddress = gameitem.address
            assert.notEqual(gameitemaddress, 0x0)
            assert.notEqual(gameitemaddress, '')
            assert.notEqual(gameitemaddress, null)
            assert.notEqual(gameitemaddress, undefined)
            console.log("gameitemaddress", gameitemaddress)
        })

        it('market testing', async () => {
            let listingPrice = await market.listingPrice()
            const auctionPrice = tokens('1')
            // // console.log("auctionPrice", auctionPrice.toString())
            
            createItem1 = await market.createItem("https://test.com/1", auctionPrice, {value: listingPrice})
            createItem2 = await market.createItem("https://test.com/2", auctionPrice, {value: listingPrice})

            let result = await market.getTokenURI(createItem1.logs[0].args[0].toNumber())

            items = await market.getItemList()
            items = await Promise.all(items.map(async i => {
                const tokenUri = await market.getTokenURI(i.itemId)
                let item = {
                    itemId: i.itemId.toString(),
                    price: i.price.toString(),
                    tokenId: i.tokenId.toString(),
                    owner: i.owner,
                    tokenUri
                }
                return item
            }))
            console.log('items: ', items)

            // item1 = await gameitem.createToken("https://tokenTestItem.com1")
            // item2 = await gameitem.createToken("https://tokenTestItem.com2")
            // // console.log("item1", item1.toString())
            // console.log("item1 id", item1.logs[0].args[2].toNumber())
            // // console.log("item1 id 2", item1.tokenId.toString())
            // // console.log("item1 value", item1.logs[0].args.toString())
            // tokenUri = await gameitem.tokenURI(item1.logs[0].args[2].toNumber())
            // tokenUri2 = await gameitem.tokenURI(item1.logs[0].args[2].toNumber())
            // console.log("tokenUri", tokenUri.toString())
            // console.log("tokenUri2", tokenUri2.toString())

            // createdItem = await market.createMarketItem(gameitem.address, item1.logs[0].args[2].toNumber(), auctionPrice, { value: listingPrice })
            // createdItem2 = await market.createMarketItem(gameitem.address, item2.logs[0].args[2].toNumber(), auctionPrice, { value: listingPrice })
            
            // // await market.createMarketSale(gameitem.address, item1.logs[0].args[2].toNumber(), { value: auctionPrice})
            // await market.createMarketSale(gameitem.address, item1.logs[0].args[2].toNumber(), { value: auctionPrice})

            // items = await market.fetchMarketItems()
            // items = await Promise.all(items.map(async i => {
            // const tokenUri = await gameitem.tokenURI(i.tokenId)
            // let item = {
            //     price: i.price.toString(),
            //     tokenId: i.tokenId.toString(),
            //     seller: i.seller,
            //     owner: i.owner,
            //     tokenUri
            // }
            // return item
            // }))
            // console.log('items: ', items)
        })
    })
})