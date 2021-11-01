import { Container, Form, Button, CloseButton } from "react-bootstrap";
import { useState, useEffect } from 'react';
import axios from "axios";
import {useHistory} from 'react-router-dom';
const Create = (webdata) => {
    const [formInput, updateFormInput] = useState({price: '', name: '', description: ''});
    const [fileUrl, setFileUrl] = useState();
    const [gamja, setGamja] = useState();
    const [gamjaAddress, setGamjaAddress] = useState('');
    const [account, setAccount] = useState();
    const [market, setMarket] = useState();

    const [attributeList, setAttributeList] = useState([]);

    const handleAttributeChange = (e, index) =>{
        const { name, value } = e.target;
        const list = [...attributeList];
        list[index][name] = value;
        setAttributeList(list);
    }
    const handleAddAttributeInput = () =>{
        setAttributeList([...attributeList, {trait_type: "", value: ""}]);
    }

    const handleRemoveAttributeInput = index => {
        const list = [...attributeList];
        list.splice(index,1);
        setAttributeList(list)
    }

    const history = useHistory();

    useEffect(()=>{
        setGamja(webdata.gamja)
        setAccount(webdata.account)
        setMarket(webdata.market)
        setGamjaAddress(webdata.gamjaAddress)
    }, [webdata])

    function tokens(n) {
        return window.web3.utils.toWei(n, 'ether');
    }

    function onChangeFile(e){
        setFileUrl(e.target.files[0]);
    }
    function checkAttributes(){
        for(var i = 0; i< attributeList.length;i++){
            if(!attributeList[i].trait_type || !attributeList[i].value){
                return true;
            }
        }
        return false;
    }
    const newPicture = () => {
        if(checkAttributes){
            window.alert('Attributes must not be empty')
            return;
        }
        if(!formInput.description){
            window.alert('Need description')
        }else{
            var base = window.location.href.split(':')
            var backendhost = base[0] + ':' + base[1] + ':8000/'
            let form_data = new FormData();
            form_data.append('file', fileUrl, fileUrl.name);
            form_data.append('title', formInput.name);
            let url = backendhost + 'tokens/postimage'
            axios.post(url, form_data, {
                headers: {
                  'content-type': 'multipart/form-data'
                }
            })
            .then(res => {
                console.log(res.data.file);
                mintToken(res.data.file);
            })
            .catch(err=> console.log(err))
        }
    }
    async function mintToken(file){
        const gamjaId = await gamja.methods._tokenIds().call()
        let count = parseInt(gamjaId)
        count = count + 1
        var base = window.location.href.split(':')
        var backendhost = base[0] + ':' + base[1] + ':8000/'
        let uri = backendhost + 'tokens/gettoken/' + count
        console.log("uri", uri)
        await gamja.methods.createToken(uri).send({from: account})
        .on('receipt', (receipt) => {
            console.log("resultado =", receipt)
            let idresult = receipt.events.Transfer.returnValues[2]
            console.log("id result =", idresult)
            createItem(idresult, file)
        })
    }
    async function createItem(token_id, file){
        let listingPrice = await market.methods.listingPrice().call()
        await market.methods.createItem(gamjaAddress, token_id, tokens(formInput.price)).send({from: account, value: listingPrice})
        .on('receipt', (receipt) => {
            console.log("marketresultado =", receipt)
            let idresult = receipt.events.MarketItemCreated.returnValues[0]
            console.log("marketid result =", idresult)
            // const attributes = []

            // for(var i=0;i<10;i++){
            //     let attData = {
            //         trait_type: "att_" + i,
            //         value: i
            //     }
            //     attributes.push(attData)
            // }
            let data = {
                item_id: idresult,
                token_id: token_id,
                description: formInput.description,
                external_url: "http://localhost:3000/",
                image: file,
                name: formInput.name,
                attributes: attributeList
            }
            var base = window.location.href.split(':')
            var backendhost = base[0] + ':' + base[1] + ':8000/'
            let url = backendhost + 'tokens/minttoken'
            axios.post(url, data)
            .then(res => {
                console.log(res.data);
                history.push('/');
            })
            .catch(err=> console.log(err))
        })
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
            <label>Set Attribute</label>
            <Button variant="primary" onClick={handleAddAttributeInput}>Add</Button>
            {attributeList.map((item, i) => {
                return(
                    <div key={i} className="box">
                        <input 
                            type="text" 
                            name="trait_type"
                            placeholder="Trait type"
                            value={item.trait_type}
                            className="mr10 m-1"
                            onChange={e => handleAttributeChange(e, i)}
                        />

                        <input 
                                type="text" 
                                name="value"
                                placeholder="Trait value"
                                value={item.value}
                                className="mr10 m-1"
                                onChange={e => handleAttributeChange(e, i)}
                        /> 
                        {/* <Button variant="Link" className="m-1" onClick={()=>handleRemoveAttributeInput(i)}>&#10006;</Button> */}
                        <CloseButton onClick={()=>handleRemoveAttributeInput(i)} />
                    </div>
                )
            })}
            <br />
            <Button variant="primary" onClick={newPicture}>
                Submit
            </Button>
        </Form>
        </Container>
     );
}
 
export default Create;