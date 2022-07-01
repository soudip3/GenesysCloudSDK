import React, { useEffect, useState } from 'react';
import { 
    getParticipantID,
    replaceInteraction,
    getUserID,
    getQueueID,
    getUsersDetails
  } from '../utils/genesysCloudUtils';

export function Home(){
    
    const [userEmailID, setUserEmailID] = useState("")
    const [interactionID, setInteractionID] = useState("")
    const [userEmailVisible, setUserEmailVisible] = useState(false)
    const [queueVisible, setQueueVisible] = useState(false)
    const [userListVisible, setUserListVisible] = useState(false)
    const [taskComplete, setTaskComplete] = useState("")
    const [queueName, setQueueName] = useState("")
    //const [participantID, setParticipantID] = useState("")
    //const [queueID, setQueueID] = useState("")
    //const [userID, setUserID] = useState("")
    const [radioValue, setRadioValue] = useState("")
    useEffect(() => {
    }, []);

    const getInteractionID = (event :any)=>{
        setInteractionID(event.target.value)
    }

    const getEmailID = (event :any)=>{
        setUserEmailID(event.target.value)
    }

    const getQueueName = (event:any)=>{
        setQueueName(event.target.value)
    }


    async function getPariticipantData() {
        await getParticipantID(interactionID)
        .then((data:any)=>{
            //setParticipantID(data.participantID)
            //setQueueID(data.queueID)
            //console.log(radioValue)
            replaceInteractionData(data.participantID, data.queueID)
        })
        .catch((err:any)=>{
                console.log(err)
        });  
      }
    
    async function getUserList() {
        await getQueueID(queueName)
        .then(async (data:any)=>{
            const queueID = data
            await getUsersDetails(queueID)
            .then((data:any)=>{
                console.log(data)
            })
            .catch((err:any)=>{
                console.log(err)
            })
        })
        .catch((err:any)=>{
            console.log(err)
        })
    }
    
    async function replaceInteractionData(participantID:string, queueID:string){
        //console.log(1)
        if(radioValue === 'transferSameQueue'){
            await replaceInteraction(participantID, queueID, interactionID, "")
            .then((data:any)=>{
                setTaskComplete(data)
            })
            .catch((err:any)=>{
                setTaskComplete(err)
            })
        }
        else if(radioValue === 'transferUser'){
            await getUserID(userEmailID)
            .then(async (data:any)=>{
                const userID = data
                console.log(data)
                await replaceInteraction(participantID,"",interactionID, userID)
                .then((data:any)=>{
                    setTaskComplete(data)
                })
                .catch((err:any)=>{
                    setTaskComplete(err)
                })
            })
        }
        else if(radioValue === 'transferAnotherQueueUser'){
            console.log("hello")
        }
        
    }
    return(
        <div>
            <h1>Genesys Cloud</h1>
            <p>Pull Away Interaction From Connected Agent</p>
            <label htmlFor='interactionID'>Interaction ID: </label>
            <input type={'text'} id="interactionID" name='interactionID' onChange={getInteractionID}></input><br></br><br></br>
            <input type={'radio'} id='transferSameQueue' value='transferSameQueue' name='optionType' onClick={(e) => {
                setUserEmailVisible(false)
                setQueueVisible(false)
                setUserListVisible(false)}} onChange={(e) => setRadioValue(e.target.value)}></input>
            <label htmlFor='transferSameQueue'>Transfer to Same Queue</label><br></br><br></br>
            <input type={'radio'} id='transferAnotherQueueUser' value='transferAnotherQueueUser' name='optionType' onChange={(e) => setRadioValue(e.target.value)} onClick={() => {
                setQueueVisible(true)
                setUserListVisible(true)
                setUserEmailVisible(false)
            }}></input>
            <label htmlFor='transferAnotherQueueUser'>Transfer to User of Another Queue</label><br></br><br></br>
            <input type={'radio'} id='transferUser' value='transferUser' name='optionType' onClick={() => {
                setUserEmailVisible(true)
                setQueueVisible(false)
                setUserListVisible(false)}} onChange={(e) => setRadioValue(e.target.value)}></input>
            <label htmlFor='transferUser'>Transfer to Agent</label><br></br><br></br>
            {queueVisible ? <div>
                <label htmlFor='queueName'>Queue Name: </label>
                <input type={'text'} id='queueName' name='queueName' onChange={getQueueName}></input><br></br><br></br>
            </div>:null}
            {userListVisible ? <div>
                <label htmlFor='userList'>User List: </label>
                <select onClick={getUserList}>
                    <option>Select</option>
                </select><br></br><br></br>
            </div>:null}
            {userEmailVisible ? <div> 
                <label htmlFor='userEmail'>Agent Email ID: </label>
                <input type={'text'} id='userEmail' name='userEmail' onChange={getEmailID}></input><br></br><br></br>
            </div>:null}
            <button onClick={getPariticipantData}>Submit</button><br></br>
            <p>{taskComplete}</p>
        </div>
    )
}