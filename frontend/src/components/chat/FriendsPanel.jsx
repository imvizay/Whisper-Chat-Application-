// css
import '../../assets/css/chat_dashboard/friends-list.css'

// api fn
import { friendReqApi } from '../../services/userApi'

// custom static data
const friendsData = [
  {
    id: 1,
    name: "Rahul Sharma",
    phone: "+91 9876543210",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Anjali Verma",
    phone: "+91 9123456780",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 3,
    name: "Amit Patel",
    phone: "+91 9988776655",
    avatar: "https://i.pravatar.cc/150?img=8",
  },
]

// tanstack query
import { useQuery } from '@tanstack/react-query'


function FriendsPanel() {

  const {data:friends,isLoading,isError} = useQuery({
    queryKey:["friendlist"],
    queryFn: () => friendReqApi.loadFriendList()
  }) 

  if (isLoading) return <p>Loading Friends ...</p>
  if(isError) return <p>Error loading friends list.</p>



  return (
    <div className="friends-container">
      <h2 className="title">Your Friends</h2>

      <div className="friends-list">
        {friendsData.map((friend) => (
          <div key={friend.id} className="friend-item">
            
            <img src={friend.avatar} alt={friend.name} />

            <div className="friend-details">
              <h4>{friend.name}</h4>
              <p>{friend.phone}</p>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}

export default FriendsPanel