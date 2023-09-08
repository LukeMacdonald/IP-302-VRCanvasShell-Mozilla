import { getRoom, loadRoom } from "../data/data"
import { Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
function Room (props){
    const {moduleName, roomName} = props
    const room = getRoom(moduleName,roomName) 
    const navigate = useNavigate();

    const handleRoomLoad = async () => {
        try{
            await loadRoom(moduleName,room["RoomID"]);
        }
        catch{
            navigate('/error');
        }
    }
    const handleRoomDeletion = () =>{

    }
    const handleRoomEdit = () =>{
        
    }
    
    return(
        <div className="card movie-card" style={{textAlign:'left', margin:'1rem'}}>
        <div className="row">
            <div className="col">
                <div className="card-body">
                    <h5 className="card-title">{roomName}</h5>
                    <ul>
                        <li style={{padding:'0.5rem'}}><Button onClick={handleRoomLoad}>Load Room</Button></li>
                        <li style={{padding:'0.5rem'}}><Button onClick={handleRoomEdit}>Edit Room</Button></li>
                        <li style={{padding:'0.5rem'}}><Button onClick={handleRoomDeletion}>Delete Room</Button></li>
                    </ul>
                    
                </div>
            </div>
        </div>
    </div>
    )
}
export default Room