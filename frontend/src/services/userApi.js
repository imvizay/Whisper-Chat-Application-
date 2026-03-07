
// Api Endpoints Releted to user releted services.

import { http } from "./shared-api/httpRequest";

export const friendReqApi = {

    loadFriendList : () => http.get(''),  
    // Search users.
    searchFriend : (data) => http.get(`friends/search-friends/?query=${data}`),  

    // Send friend request.
    addFriend : (id) => http.post(`friends/add-friends/`,{
        reciever:id
    }),

    // Friend request recieved 
    requestReceived : () => http.get('friends/requests-recieved/'),

    // Friend request accept or reject
    acceptOrRejectFreindRequest : (data) => http.put(`friends/request-action/${data.id}/`,{
        status:data.status
    }), 

    // unfriend : (data) => http.post('',data), 
    // blockFriend : (data) => http.post('',data) 
} 

const userProfileApi = {
    updateProfile : (id) => http.post(`${id}`),
    deleteAccount : (id) => http.delete(`${id}`)
}

