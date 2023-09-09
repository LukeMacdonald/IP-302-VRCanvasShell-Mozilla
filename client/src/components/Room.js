import { getRoom, loadRoom } from "../data/data"
import { Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import "../styles/components.css"
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
    return(
        <div className="card room-card" >
        <div className="row">
            <div className="col">
                <div className="card-body room-card-text" >
                    <h5 className="room-card-text" >{roomName}</h5>
                    <Button variant="danger" className={"load-room-button"}onClick={handleRoomLoad}>Load Room</Button>
                </div>
            </div>
        </div>
    </div>
    )
}
export default Room