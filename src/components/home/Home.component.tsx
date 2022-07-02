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
    const [userList, setUserList] = useState([{
        agentName:'Select',
        agentID:'Select'
    }])
    const [userID, setUserID] = useState("")
    const [userName, setUserName] = useState("")
    const [participantID, setParticipantID] = useState("")
    const [queueID, setQueueID] = useState("")
    const [radioValue, setRadioValue] = useState("")
    const [transferSameQueue, setTransferSameQueue] = useState(false)
    useEffect(() => {
        
    },);

    const getInteractionID = (event :any)=>{
        setInteractionID(event.target.value)
    }

    const getEmailID = (event :any)=>{
        setUserEmailID(event.target.value)
    }

    const getUsers = (event: any)=>{
        console.log(event.target.value)
        setUserID(event.target.value)
    }

    const getQueueName = (event:any)=>{
        setQueueName(event.target.value)
        setUserList([{
            agentName:'Select',
            agentID:'Select'
        }])
    }

    // async function usersDetails() {
    //     console.log(userList)
    // }


    async function getPariticipantData() {
        await getParticipantID(interactionID)
        .then((data:any)=>{
            setParticipantID(data.participantID)
            setQueueID(data.queueID)
            //console.log(radioValue)
            //replaceInteractionData()
        })
        .catch((err:any)=>{
                console.log(err)
        });  
      }
    
    async function getUserList() {
        await getQueueID(queueName)
        .then(async (data:any)=>{
            const queueID = data
            console.log(queueID)
            setQueueID(queueID)
            if(radioValue !== 'transferAnotherQueue'){
                await getUsersDetails(queueID)
                .then((data:any)=>{
                    setUserList(data)
                })
                .catch((err:any)=>{
                    console.log(err)
                })
            }
        })
        .catch((err:any)=>{
            console.log(err)
        })
    }
    
    async function replaceInteractionData(){
        //console.log(1)
        if(radioValue === 'transferSameQueue'){
            await replaceInteraction(participantID, queueID, interactionID, "")
            .then((data:any)=>{
                setTaskComplete(data)
                setInteractionID("")
                setTransferSameQueue(false)
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
            await replaceInteraction(participantID,queueID,interactionID, userID)
            .then((data:any)=>{
                setTaskComplete(data)
            })
            .catch((err:any)=>{
                setTaskComplete(err)
            })
        }
        else if(radioValue === 'transferAnotherQueue'){
            console.log("hello")
            console.log(participantID)
            console.log(interactionID)
            console.log(queueID)
            await replaceInteraction(participantID,queueID,interactionID, "")
            .then((data:any)=>{
                setTaskComplete(data)
                setInteractionID("")
                setQueueName("")
            })
            .catch((err:any)=>{
                setTaskComplete(err)
            })
        }
        
    }
    return(
        <div>
            <h1>Genesys Cloud</h1>
            <p>Pull Away Interaction From Connected Agent</p>
            <label htmlFor='interactionID'>Interaction ID: </label>
            <input type={'text'} id="interactionID" name='interactionID' onChange={getInteractionID} onBlur={getPariticipantData} value={interactionID}></input><br></br><br></br>
            <input type={'radio'} id='transferSameQueue' value='transferSameQueue' checked={transferSameQueue} name='optionType' onClick={(e) => {
                setUserEmailVisible(false)
                setTransferSameQueue(true)
                setQueueVisible(false)
                setUserListVisible(false)
                setUserList([{
                    agentName:'Select',
                    agentID:'Select'
                }])}} onChange={(e) => setRadioValue(e.target.value)}></input>
            <label htmlFor='transferSameQueue'>Transfer to Same Queue</label><br></br><br></br>
            <input type={'radio'} id='transferAnotherQueue' value='transferAnotherQueue' name='optionType' onChange={(e) => setRadioValue(e.target.value)} onClick={ () =>{
                setQueueVisible(true)
                setUserListVisible(false)
                setUserEmailVisible(false)
                setUserList([{
                    agentName:'Select',
                    agentID:'Select'
                }])
            }}></input>
            <label htmlFor='transferAnotherQueue'>Transfer to Another Queue</label><br></br><br></br>
            <input type={'radio'} id='transferAnotherQueueUser' value='transferAnotherQueueUser' name='optionType' onChange={(e) => setRadioValue(e.target.value)} onClick={() => {
                setQueueVisible(true)
                setUserListVisible(true)
                setUserEmailVisible(false)
                setUserList([{
                    agentName:'Select',
                    agentID:'Select'
                }])
            }}></input>
            <label htmlFor='transferAnotherQueueUser'>Transfer to User of Another Queue</label><br></br><br></br>
            <input type={'radio'} id='transferUser' value='transferUser' name='optionType' onClick={() => {
                setUserEmailVisible(true)
                setQueueVisible(false)
                setUserListVisible(false)}} onChange={(e) => setRadioValue(e.target.value)}></input>
            <label htmlFor='transferUser'>Transfer to Agent</label><br></br><br></br>
            {queueVisible ? <div>
                <label htmlFor='queueName'>Queue Name: </label>
                <input type={'text'} id='queueName' name='queueName' onChange={getQueueName} onBlur={getUserList} value={queueName}></input><br></br><br></br>
            </div>:null}
            {userListVisible ? <div>
                {/* <button onClick={usersDetails}>Get User</button><br></br><br></br> */}
                <label htmlFor='userList'>User List: </label>
                <select onBlur={getUsers}>
                {userList.map((user) =>{
                    return <option value={user.agentID} key={user.agentID}>{user.agentName}</option>
                })}
                </select><br></br><br></br>      
                {/* <ul>
                {userList.map((user) =>{
                    return <li>{user.agentName}</li>
                })}
                </ul>           */}
            </div>:null}
            {userEmailVisible ? <div> 
                <label htmlFor='userEmail'>Agent Email ID: </label>
                <input type={'text'} id='userEmail' name='userEmail' onChange={getEmailID}></input><br></br><br></br>
            </div>:null}
            <button onClick={replaceInteractionData}>Submit</button><br></br>
            <p>{taskComplete}</p>
            
        </div>
    )
}