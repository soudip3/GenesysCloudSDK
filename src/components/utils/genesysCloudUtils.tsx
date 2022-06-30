import { clientConfig } from '../../config';
const platformClient = require('purecloud-platform-client-v2/dist/node/purecloud-platform-client-v2.js');
const jp = require('jsonpath')

const conversationAPI = new platformClient.ConversationsApi()
const client = platformClient.ApiClient.instance;
const { clientId, redirectUri } = clientConfig;


export function authenticate() {
    return client.loginImplicitGrant(clientId, redirectUri, { state: 'state' })
        .then((data: any) => {
            return data;
        })
        .catch((err: any) => {
            console.error(err);
        });
}

export function getParticipantID(interactionID : string){
    return conversationAPI.getAnalyticsConversationDetails(interactionID)
    .then((data:any) =>{
        let participantID = ""
        let queueID = ""
        let segments = jp.query(data, '$.participants[?(@.purpose=="agent")].sessions[-1:].segments[-1:]')
        let participantIds = jp.query(data, '$.participants[?(@.purpose=="agent")].participantId')
        for(let i=0;i<participantIds.length;i++){
            if(!segments[i].disconnectType){
                participantID = participantIds[i]
                queueID = segments[i].queueId
            }
        }
        const value ={
            participantID: participantID,
            queueID: queueID
        }
        return value
    })
    .catch((err:any)=>{
        console.log(err)
    })
}

export function replaceInteraction(participantID:string, queueID:string, conversationID:string){
    let body = {
        "userId": "",
        "address": "",
        "userName": "",
        "queueId": queueID,
        "voicemail": false
    }
    return conversationAPI.postConversationsMessageParticipantReplace(conversationID, participantID, body)
    .then((data:any) =>{

        return "Success"
    })
    .catch((err:any) =>{
        return "Failure"
    })
}
