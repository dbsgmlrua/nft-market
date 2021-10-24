const { assert } = require('chai');
const Market = artifacts.require("./NFTMarket.sol");
const GameItem = artifacts.require("./Gamja.sol");

require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

contract('NFTMarket', ([deployer, creator, buyer]) => {
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
            const auctionPrice = tokens('50')
            // // console.log("auctionPrice", auctionPrice.toString())

            gameitem1 = await gameitem.createToken("https://test.com/1", {from: creator})
            gameitem2 = await gameitem.createToken("https://test.com/2", {from: creator})
            gameitem3 = await gameitem.createToken("https://test.com/3", {from: creator})
            gameitem4 = await gameitem.createToken("https://test.com/4", {from: creator})
            gameitem5 = await gameitem.createToken("https://test.com/5", {from: creator})

            // console.log("gameitem1", gameitem1)  
            // console.log("gameitem1 Id", gameitem1.logs[0].args[2].toString())   
            tokenURI = await gameitem.tokenURI(1)
            // console.log("tokenURI", tokenURI)
            
            createItem1 = await market.createItem(gameitem.address, gameitem1.logs[0].args[2].toNumber(), auctionPrice, {from: creator, value: listingPrice})
            createItem2 = await market.createItem(gameitem.address, gameitem2.logs[0].args[2].toNumber(), auctionPrice, {from: creator, value: listingPrice})
            createItem3 = await market.createItem(gameitem.address, gameitem3.logs[0].args[2].toNumber(), auctionPrice, {from: creator, value: listingPrice})
            createItem4 = await market.createItem(gameitem.address, gameitem4.logs[0].args[2].toNumber(), auctionPrice, {from: creator, value: listingPrice})
            createItem5 = await market.createItem(gameitem.address, gameitem5.logs[0].args[2].toNumber(), auctionPrice, {from: creator, value: listingPrice})

            // console.log("createItem2", createItem2.logs[0].args)

            items = await market.getItemList()
            items = await Promise.all(items.map(async i => {
                const tokenUri = await gameitem.tokenURI(i.tokenId)
                const ownerOf = await gameitem.ownerOf(i.tokenId)
                let item = {
                    itemId: i.itemId.toString(),
                    price: i.price.toString(),
                    tokenId: i.tokenId.toString(),
                    onSale: i.onSale,
                    owner: ownerOf,
                    tokenUri
                }
                return item
            }))
            console.log('items: ', items)
            
            ownable1 = await gameitem.ownerOf('1')
            console.log('items1 Ownable ', ownable1)

            await market.buyItem(gameitem3.logs[0].args[2].toNumber(), {from: buyer, value:auctionPrice})

            items = await market.getItemList()
            items = await Promise.all(items.map(async i => {
                const tokenUri = await gameitem.tokenURI(i.tokenId)
                const ownerOf = await gameitem.ownerOf(i.tokenId)
                let item = {
                    itemId: i.itemId.toString(),
                    price: i.price.toString(),
                    tokenId: i.tokenId.toString(),
                    onSale: i.onSale,
                    owner: ownerOf,
                    tokenUri
                }
                return item
            }))
            console.log('items: ', items)

            await market.changeSalePrice(gameitem3.logs[0].args[2].toNumber(), tokens('5'), {from: buyer})
            await market.changeOnSaleStatus(gameitem3.logs[0].args[2].toNumber(), true, {from: buyer})

            items = await market.getMyItemList({from:buyer})
            items = await Promise.all(items.map(async i => {
                const tokenUri = await gameitem.tokenURI(i.tokenId)
                const ownerOf = await gameitem.ownerOf(i.tokenId)
                let item = {
                    itemId: i.itemId.toString(),
                    price: i.price.toString(),
                    tokenId: i.tokenId.toString(),
                    onSale: i.onSale,
                    owner: ownerOf,
                    tokenUri
                }
                return item
            }))
            console.log('OwnerItems: ', items)
        })
    })
})