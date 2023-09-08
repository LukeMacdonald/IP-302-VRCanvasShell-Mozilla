import { getRoom, loadRoom } from "../data/data"
import { Button } from "react-bootstrap"
function RoomCard (props){
    const {moduleName, roomName} = props
    const room = getRoom(moduleName,roomName)
    const roomLink = "https://virtualcanvashubscloud.com/" + room["RoomID"]

    const handleRoomLoad = async () => {
        await loadRoom(moduleName,room["RoomID"])
    }
    
    return(
        <div className="card movie-card" style={{textAlign:'left', margin:'1rem'}}>
        <div className="row">
            <div className="col">
                <div className="card-body">
                    <h5 className="card-title">{roomName}</h5>
                    <ul>
                        <li style={{padding:'0.5rem'}}><Button onClick={handleRoomLoad}>Load Room</Button></li>
                        <li style={{padding:'0.5rem'}}><a href={roomLink}>Edit Room</a></li>
                        <li style={{padding:'0.5rem'}}><a href={roomLink}>Delete Room</a></li>
                    </ul>
                    
                </div>
            </div>
        </div>
    </div>
    )
}
export default RoomCard