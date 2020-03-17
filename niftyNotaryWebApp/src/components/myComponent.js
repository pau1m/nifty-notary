import React, {Component, useEffect, useState} from 'react'
import request from 'superagent'

export default function(props) {

  // state = {
  //   lasthash:  '0x',
  //   res: '',
  // };
  const [lastHash, setLastHash] = useState('0x0')
  const [res, setRes] = useState({})
  const [txId, setTxId] = useState('0x0')
  const [message, setMessage] = useState('No message yet')
  const [fileExists, setFileExists] = useState(false)
  // const [txLink, setTxLink] = useState(null)
  // const [tx, setTxLink] = useState(null)
  // check what we get back from our hash
  // set the values on the page
  // how do we share a context between different things
  // set state

  useEffect((() => {
    setLastHash(props.hash)
  }))

  // replace with spinner working......

  useEffect(() => {
    if (props.hash !== '0x0' && lastHash !== props.hash) {
      setMessage('Making request to blockchain, this might take some time')

      setLastHash(props.hash)
      console.log('launching request')
      //this.setState({lasthash: this.props.hash});
      // first make a request to see if the hash already exists...
      // we can grab it from the database
      request.get('http://localhost:3600/notarised/getByHash/' + props.hash) // really should rename this digest
        .set('accept', 'json')
        .then((res) => {
          if (Object.keys(res.body).length !== 0) {
            setFileExists(true)
            setMessage('File already exists: ' + res.body.txId)
            console.log(res)
          } else {
            request.post('http://localhost:3600/notarise/hash')
              .set('accept', 'json')
              .send({
                "hash": props.hash, // maybe not bother about the type
                "hashType": "text/plain" // need to document this better to describe exactly... should also be able to do this onchain?
              })
              .end((err, res) => {
                if (!err) {
                  setTxId(res.body.txId)
                  setMessage('Transaction Id: ' + res.body.txId)
                  console.log(res)
                } else {
                  console.log(err)
                }
              })
          }
        })
    }
  });

              // }






  //     request.post('http://localhost:3600/notarise/hash')
  //       .set('accept', 'json')
  //       .send({
  //         "hash": '0x' + props.hash,
  //         "hashType": "text/plain" // need to document this better to describe exactly... should also be able to do this onchain?
  //       })
  //       .end((err, res) => {
  //         if (!err) {
  //           setTxId(res.body.txId)
  //           setMessage('Transaction Id: ' + res.body.txId)
  //           console.log(res)
  //         }
  //         else {
  //           console.log(err)
  //         }
  //       })
  //   }
  // });

  // body:
  //   txStatus: "success"
  // fileHash: "0x0286242595912d90250b121c2dcb897f80bb13c437c49177a95a2ce0ad97c254"
  // hashType: "sha256"
  // docType: "text/plain"
  // txId: "0x119bfc108f8569c8e83ad04505132b49fd3fa66f7a85ef3f4d44f8e0f34a36b2"
  // chainId: 1
  // timestamp: 1582318692963
  return (
    <div className="submitHash">
      <div>Fingerprint of file: {lastHash}</div>
      <br></br>
      <div>{ message }</div>
    </div>
  );
}


// export default