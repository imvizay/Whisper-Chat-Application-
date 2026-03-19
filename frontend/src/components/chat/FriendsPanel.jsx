// css
import '../../assets/css/chat_dashboard/friends-list.css'

// api fn
import { friendReqApi } from '../../services/userApi'

// tanstack query
import { useQuery } from '@tanstack/react-query'

// usenavigate
import { useNavigate } from 'react-router-dom'


function FriendsPanel() {

  const {data:friends,isLoading,isError} = useQuery({
    queryKey:["friendlist"],
    queryFn: () => friendReqApi.loadFriendList()
  }) 

  const navigate = useNavigate()

  if (isLoading) return <p>Loading Friends ...</p>
  if(isError) return <p>Error loading friends list.</p>



  return (
    <div className={`friends-container`}>
      <h2 className="title">Your Friends</h2>

      <div className="friends-list">
        {friends.map((friend) => (
          <div 
            key={friend.id} className="friend-item"
            
            onClick={ () => 
              navigate(`/chat-dashboard/${friend.id}`,{
              state:friend
            })}
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