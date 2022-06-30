import React, { useEffect, useState } from 'react';
import { 
    getParticipantID,
    replaceInteraction
  } from '../utils/genesysCloudUtils';

export function Home(){
        // useEffect(() => {
        //     getPariticipantData();
        // }, []);

    let interactionID = ""
    const getInteractionID = (event :any)=>{
        interactionID = event.target.value;
        console.log(interactionID)
    }


    async function getPariticipantData() {
        await getParticipantID(interactionID)
        .then((data:any)=>{
            console.log(data)
            replaceInteractionData(data)
        })
        .catch((err:any)=>{
                console.log(err)
        });  
      }
    
    async function replaceInteractionData(data: { participantID: any; queueID: any; }){
        const participantID = data.participantID
        const queueID = data.queueID
        await replaceInteraction(participantID, queueID, interactionID)
        .then((data:any)=>{
            console.log(data)
        })
        .catch((err:any)=>{
            console.log(err)
        })
    }
    return(
        <div>
            <h1>Genesys Cloud</h1>
            <p>Interaction Pull Away</p>
            <label htmlFor='interactionID'>Interaction ID: </label>
            <input type={'text'} id="interactionID" name='interactionID' onChange={getInteractionID}></input><br></br>
            <button onClick={getPariticipantData}>Submit</button>
        </div>
    )
}