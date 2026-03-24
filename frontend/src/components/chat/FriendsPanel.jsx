// css
import '../../assets/css/chat_dashboard/friends-list.css'

// url backend
import { BASEURL_DEV } from '../../services/shared-api/apiSetup'

// api fn
import { friendReqApi } from '../../services/userApi'
import { getChatHistory } from '../../services/chatsApi'

// tanstack query
import { useQuery } from '@tanstack/react-query'

// usenavigate
import { useNavigate } from 'react-router-dom'

// current user
import { useAuth } from '../../contexts/AuthContext'





function FriendsPanel() {
  const {user} = useAuth()

  // Get All Friends In A List.
  const {
    data:friends,
    isLoading,
    isError
  } = useQuery({
    queryKey:["friendlist"],
    queryFn: () => friendReqApi.loadFriendList()
  }) 
  console.log("friends:", friends)
  const navigate = useNavigate()

  if (isLoading) 
    return <p>Loading Friends ...</p>
  if(isError) 
    return <p>Error loading friends list.</p>


  console.log("current user id :",user?.id)
  

  // Get Or Create Chat Between Current User And Friend. 
  const openChat = async (friend) => {
    try {
      const res = await fetch(
        `${BASEURL_DEV}${getChatHistory.getChats(user?.id, friend?.id)}`
      )

      const data = await res.json()

      navigate(`/chat-dashboard/chat/${friend.id}`, {
        state: {
          ...friend,
          friend_id:friend.id,
          chat_id: data.chat_id,
          current_user_id: user?.id,
        },
      })

    } catch (error) {
      console.error("Error opening chat:", error)
    }
  }


  return (
    <div className={`friends-container`}>
    
      <h2 className="title">Your Friends</h2>

      <div className="friends-list">
        {friends.map((friend) => (
          <div 
            key={friend.id} className="friend-item"
            
            onClick={ () => openChat(friend) }
          >
            
            <span className='usernameLogo'>{friend.username.charAt(0).toUpperCase()}</span> 

            <div className="friend-details">
              <h4>{friend.username.charAt(0).toUpperCase() + friend.username.slice(1,friend.length) }</h4>
              <p>{friend.contact}</p>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}

export default FriendsPanel