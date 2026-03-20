// css
import '../../assets/css/chat_dashboard/friends-list.css'

// url backend
import { BASEURL_DEV } from '../../services/shared-api/apiSetup'

// api fn
import { friendReqApi } from '../../services/userApi'

// tanstack query
import { useQuery } from '@tanstack/react-query'

// usenavigate
import { useNavigate } from 'react-router-dom'

// current user
import { useAuth } from '../../contexts/AuthContext'



function FriendsPanel() {
  const {user} = useAuth()
  const {data:friends,isLoading,isError} = useQuery({
    queryKey:["friendlist"],
    queryFn: () => friendReqApi.loadFriendList()
  }) 

  const navigate = useNavigate()

  if (isLoading) return <p>Loading Friends ...</p>
  if(isError) return <p>Error loading friends list.</p>

  console.log("current user id :",user?.id)
  
  const openChat = async (friend) => {
    try {
      const res = await fetch(
        `${BASEURL_DEV}/get-chat/?user1=${user?.id}&user2=${friend.id}`
      )

      const data = await res.json();

      navigate(`/chat-dashboard/${user?.id}`, {
        state: {
          ...friend,
          chat_id: data.chat_id,
          current_user_id: user?.id,
        },
      })

    } catch (error) {
      console.error("Error opening chat:", error);
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
              <h4>{friend.username}</h4>
              <p>{friend.contact}</p>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}

export default FriendsPanel