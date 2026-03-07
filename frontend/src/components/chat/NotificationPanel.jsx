// css
import '../../assets/css/chat_dashboard/notifications/notification.css'
// state 
import { useEffect, useState } from 'react'

// Tanstack useQuery and useMutation
import { useMutation, useQuery , useQueryClient } from '@tanstack/react-query'

// api
import { friendReqApi } from '../../services/userApi'


function NotificationPanel() {

  const queryClient = useQueryClient()

  
  // useQuery For Loading Friend Request Recieved
  const {isLoading,data:request=[],refetch} = useQuery({
    queryKey:["friendRequestReceived"],
    queryFn: () => friendReqApi.requestReceived(),
    
  })

  // Mutation of Friend Request Through Buttons
  const sendAcceptOrRejectMutation = useMutation({
    mutationFn: (data) => friendReqApi.acceptOrRejectFreindRequest(data),
    // instant removal of friend request from ui instead of refetch.
    onSuccess : (_,variables) => {  
      
      queryClient.setQueryData(["friendRequestReceived"], (oldData = []) =>
        oldData.filter(req => req.id !== variables.id)
      )
        queryClient.invalidateQueries["friendsList"]
    }

  }) 



  return (
    <>
      <div className="notificationWrapper">

        <div className="notificationHeader">
          <h2>Notifications</h2>
        </div>

        {/* Friend Requests Section */}
        <div className="notificationSection">
          <h3 className="sectionTitle">Friend Requests</h3>

          {isLoading ? "loading..." : ''}

          {request.map((el)=>(
            <div key={el.id} className="notificationCard">
                <div className="notificationInfo">
                  <span className="userName">{el.sender_username}</span>
                  <span className="notificationText">
                    sent you a friend request
                  </span>
                </div>

                {/* Friend Request Actions */}
                <div className="actionButtons">
                  <button className="acceptBtn"
                    disabled={sendAcceptOrRejectMutation.isPending}
                    onClick={()=>sendAcceptOrRejectMutation.mutate({
                      id:el.id,
                      status:"accepted"
                    })}
                  >
                    {sendAcceptOrRejectMutation.isPending ? 'Processing...' : 'Accept'}
                  </button>

                  <button className="declineBtn"
                    disabled = {sendAcceptOrRejectMutation.isPending}
                    onClick={()=>sendAcceptOrRejectMutation.mutate({
                      id:el.id,
                      status:"cancelled"
                    })}
                  >
                    Decline
                  </button>
                </div>
            </div>
          ))}

        </div>

        {/* Messages Section */}
        <div className="notificationSection">

          <h3 className="sectionTitle">New Messages</h3>

          <div className="notificationCard messageCard">
            <div className="notificationInfo">
              <span className="userName">Ankit Verma</span>
              <span className="notificationText">
                sent you a message
              </span>
            </div>

            <button className="openChatBtn">Open Chat</button>
          </div>

        </div>

      </div>
    </>
  )
}

export default NotificationPanel