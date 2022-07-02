//import { clientConfig } from '../../config';
const platformClient = require('purecloud-platform-client-v2/dist/node/purecloud-platform-client-v2.js');
const jp = require('jsonpath')

const conversationAPI = new platformClient.ConversationsApi()
const userAPI = new platformClient.UsersApi()
const routingAPI = new platformClient.RoutingApi()
// const client = platformClient.ApiClient.instance;
// const { clientId, redirectUri } = clientConfig;


// export function authenticate() {
//     return client.loginImplicitGrant(clientId, redirectUri, { state: 'state' })
//         .then((data: any) => {
//             return data;
//         })
//         .catch((err: any) => {
//             console.error(err);
//         });
// }

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
        console.log(value)
        return value
    })
    .catch((err:any)=>{
        console.log(err)
    })
}

export function replaceInteraction(participantID:string, queueID:string, conversationID:string, userID: string){
    let body = {
        "userId": userID,
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

export function getUserID(userEmailID:string){
    const body = {
        "pageSize": 1,
        "pageNumber": 1,
        "query": [
            {
                
                "fields": ["email"],
                "value": userEmailID,
                "type": "EXACT"
            }
        ]
    }
    return userAPI.postUsersSearch(body)
    .then((data:any) =>{
        return data.results[0].id
    })
    .catch((err:any)=>{
        console.log(err)
    })
}

export function getQueueID(queueName:string){
    let body = { 
        "pageNumber": 1, // Number | Page number
        "pageSize": 100, // Number | Page size
        "sortOrder": "asc", // String | Note: results are sorted by name.
        "name": queueName, // String | Filter by queue name
        "id": "", // [String] | Filter by queue ID(s)
        "divisionId": "" // [String] | Filter by queue division ID(s)
      };
    return routingAPI.getRoutingQueues(body)
    .then((data:any)=>{
        try{
            return data.entities[0].id
        }
        catch(e){
            console.log(e)
        }
    })
    .catch((err:any)=>{
        return err
    })
}

export function getUsersDetails(queueID:string){
    let body = { 
        "pageNumber": 1, // Number | 
        "pageSize": 100, // Number | Max value is 100
        "sortOrder": "asc", // String | Note: results are sorted by name.
    };
    //console.log(body+" "+queueID)
    return routingAPI.getRoutingQueueMembers(queueID, body)
    .then((data:any)=>{
        const totalAgents = data.entities.length;    
        interface usersDetails {
            agentName: string;
            agentID: string;
          }
          
          const obj: usersDetails[] = [];
          for(let i=0;i<totalAgents;i++){
            const a1: usersDetails = {
                agentName: data.entities[i].name,
                agentID : data.entities[i].id,
              };
              obj.push(a1);
          }
        return obj
    })
    .catch((err:any)=>{
        return err
    })
}

export function getDivision(){
    let body = { 
        "expand": "", // [String] | Which fields, if any, to expand.
        "integrationPresenceSource": "" // String | Get your presence for a given integration. This parameter will only be used when presence is provided as an expand.
      };
    return userAPI.getUsersMe(body)
    .then((data:any)=>{
        const divisionID = data.division.id;
        return divisionID
    })
    .catch((err:any)=>{
        return(err)
    })
}