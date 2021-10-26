import { Container, Form, Button, Image } from "react-bootstrap";
import { useState, useEffect } from 'react';
import axios from "axios";
const Create = (webdata) => {
    const [formInput, updateFormInput] = useState({price: '', name: '', description: ''});
    const [fileUrl, setFileUrl] = useState();
    const [file, setFile] = useState();
    const [gamja, setGamja] = useState();
    const [account, setAccount] = useState();
    const [market, setMarket] = useState();

    useEffect(()=>{
        setGamja(webdata.gamja)
        setAccount(webdata.account)
        setMarket(webdata.market)
    }, [webdata])

    function tokens(n) {
        return window.web3.utils.toWei(n, 'ether');
    }

    function onChangeFile(e){
        setFileUrl(e.target.files[0]);
    }
    const newPicture = () => {
        if(!formInput.description){
            window.alert('Need description')
        }else{
            const attributes = []

            for(var i=0;i<10;i++){
                let attData = {
                    trait_type: "att_" + i,
                    value: i
                }
                attributes.push(attData)
            }

            let data = {
                item_id: 1,
                token_id: 1,
                description: formInput.description,
                external_url: "http://localhost:3000/",
                image: 'http://localhost:8000/tokens/minttoken',
                name: formInput.name,
                attributes: attributes
            }
            let url = 'http://localhost:8000/tokens/minttoken'
            axios.post(url, data)
            .then(res => {
                console.log(res.data);
            })
            .catch(err=> console.log(err))

            // let form_data = new FormData();
            // form_data.append('file', fileUrl, fileUrl.name);
            // form_data.append('title', formInput.name);
            // let url = 'http://localhost:8000/tokens/postimage'
            // axios.post(url, form_data, {
            //     headers: {
            //       'content-type': 'multipart/form-data'
            //     }
            // })
            // .then(res => {
            //     console.log(res.data.file);
            //     mintToken(res.data.file);
            // })
            // .catch(err=> console.log(err))
        }
    }
    async function mintToken(file){
        const gamjaId = await gamja.methods._tokenIds().call()
        let count = parseInt(gamjaId)
        count = count + 1
        let uri = 'http://localhost:8000/tokens/getyoken/' + count
        console.log("uri", uri)
        await gamja.methods.createToken(uri).send({from: account})
        .on('receipt', (receipt) => {
            console.log("resultado =", receipt)
            let idresult = receipt.events.Transfer.returnValues[2]
            console.log("id result =", idresult)
            createItem(idresult)
        })
    }
    async function createItem(token_id){
        let listingPrice = await market.methods.listingPrice().call()
        await market.methods.createItem(gamja.address, token_id, tokens('1'), {from: account, value: listingPrice})
    }
    
    return ( 
        <Container className="center-block col-md-6 m-5">
        <Form onSubmit={(event) => {
            // event.proventDefault()
        }}>
            <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Asset Name</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="Asset name"
                    onChange={e=> {
                            updateFormInput({...formInput, name: e.target.value });
                        }
                    }
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicDescription">
                <Form.Label>Asset Description</Form.Label>
                <Form.Control 
                    as="textarea" 
                    rows={3} 
                    placeholder="Asset Description" 
                    onChange={e=> {
                        updateFormInput({...formInput,  description: e.target.value });
                    }}
                    />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPrice">
                <Form.Label>Asset Price</Form.Label>
                <Form.Control 
                    type="number" 
                    placeholder="Asset price"
                    onChange={e=> {
                            updateFormInput({...formInput, price: e.target.value });
                        }
                    }
                />
            </Form.Group>
            <Form.Group controlId="formFileSm" className="mb-3">
                <Form.Label>File Select</Form.Label>
                <Form.Control type="file" size="sm" accept="image/png, image/gif"
                    onChange={onChangeFile}/>
                <Form.Text className="text-muted">
                    png, gif file only
                </Form.Text>
                {fileUrl && 
                    <div>
                        <img src={URL.createObjectURL(fileUrl)} className="img-thumbnail" width="180px" height="180px"/>
                    </div>
                }
            </Form.Group>
            {/* <Button variant="primary" type="submit">
                Submit
            </Button> */}
            <Button variant="primary" onClick={newPicture}>
                Submit
            </Button>
        </Form>
        </Container>
     );
}
 
export default Create;