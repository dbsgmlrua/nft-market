import { Container, Form, Button } from "react-bootstrap";
import { useState, useEffect } from 'react';
import axios from "axios";
const Create = (account, createContent) => {
    const [formInput, updateFormInput] = useState({price: '', name: '', description: ''});
    const [fileUrl, setFileUrl] = useState();
    const [file, setFile] = useState();

    function onChangeFile(e){
        setFileUrl(e.target.files[0]);
    }
    const newPicture = () => {
        if(formInput.description){
            console.log("dlTek")
        } else{
            window.alert('Need description')
        }

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
        //     // console.log(res);
        //     console.log(res.data.file);
        // })
        // .catch(err=> console.log(err))
    }
    
    return ( 
        <Container className="center-block col-md-6 m-5">
        <Form onSubmit={(event) => {
            // event.proventDefault()
            // createContent(formInput, fileUrl)
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
                    <img src={fileUrl} className="rounded mt-4" />
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