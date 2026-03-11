// css
import "../../../assets/css/chat_dashboard/empty_window/empty-chatwindow.css";

// states 
import { useState,useEffect } from "react";

// api
import { friendReqApi } from "../../../services/userApi";

// queryClient Instant Ui Updates 
import { useQueryClient } from "@tanstack/react-query";

// tanstack mutation fn
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";

function EmptyChatWindow() {
    const [query,setQuery] = useState('')
    const queryClient = useQueryClient()


    // Persist Query Result After Refresh
    useEffect(()=>{
      const savedQuery = localStorage.getItem("lastSearch")
      if(savedQuery){
        setQuery(savedQuery)
      }
    },[])

    // Load Query Results On Basis Of Search
    const {isLoading,data:queryResults=[],refetch} = useQuery({
      queryKey:['searchFriends',query],
      queryFn : () => friendReqApi.searchFriend(query),
      enabled : query.length > 0
    })

    // Search Button To Call Tanstack UseQuery Fn. 
    const handleQuery = () => {
        if(!query.trim()) return
        localStorage.setItem("lastSearch",query)
        console.log("Query Fn Initiated.")
        refetch()
    }

    // Mutation Fn To Send FriendRequest

    const sendFriendReqMutation = useMutation({
      mutationFn : (recieverId) => friendReqApi.addFriend(recieverId),

      onSuccess : (data,recieverId) => {
        console.log("Friends Request has sent successfully.")
       
        queryClient.setQueryData("searchFriends",query),(oldData)=>{
          if(!oldData) return
        }

        return oldData.map((user)=>{
            user.id == recieverId ? {...user,status:"pending"} : user
        })
      },
      
      onError : (error) => {
        console.log(error)
      }
    })

    const sendFriendRequest = (recieverId) => {
        sendFriendReqMutation.mutate(recieverId)      
    }

    // Searched User Card 
    const UserCard = ({u}) => (
       <div className="searchUserCard">
          <div className="userAvatar">{u.username.slice(0,1).toUpperCase()}</div>
          <div className="userInfo">
            <p>{u.username}</p>
          </div>
          <button 
             onClick={() => sendFriendRequest(u.id)}
             disabled={u.status !== "not_friends"}
             className="addFriendButton"
          >  
             {u.status=="not_friends" ? "Add" : u.status == "friends" ? "Friends" : "Pending" }
          </button>
        </div>
    )

    

  return (
    <div className="emptyChatWindow">

      {/* Header */}
      <div className="searchHeader">
        <h2>Find Friends</h2>
        <p>Search users by username or contact number</p>
      </div>

      {/* Search Input */}
      <div className="searchBoxWrapper">
        <input
          type="text"
          value={query}
          onChange={ (e) => setQuery(e.target.value)}

          onKeyDown={(e)=>{
              if(e.key === "Enter") handleQuery()
          }}

          placeholder="Search by username or contact..."
          className="searchInput"
        />
        <button 
            disabled={ isLoading } 
            onClick={handleQuery} className="searchButton"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Results */}
      <div className="searchResults">
          {queryResults.map((el)=>(
            <UserCard key={el.id} u={el} />
          ))}
      </div>

    </div>
  );
}

export default EmptyChatWindow;