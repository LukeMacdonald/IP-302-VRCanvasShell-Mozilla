import { getModule } from "../data/data"
import RoomCard from "./RoomCard"
import { Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

function ModuleCard (props){

    const {moduleName} = props

    const navigate = useNavigate();
    
    const module = getModule(moduleName)

    const handleSelect = () => {
        navigate('/room/create', { state: { moduleName } });
    }

    const rooms = Object.keys(module["Rooms"])
    
    return(
        <div className="card movie-card" style={{textAlign:'left'}}>
        <div className="row">
            <div className="col">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <h2 className="card-title">{moduleName}</h2>
                        </div>
                        <div className="col-md-6" style={{textAlign:'right', paddingRight:'3rem'}}>
                            <Button 
                                variant={'outline-danger'} 
                                style={{borderRadius:'10px',fontSize:'0.75rem', height:'2rem', width:'6rem' }} 
                                onClick={handleSelect}>Add Room
                            </Button>
                        </div>
                    </div>
                    {rooms.map((room, index)=>(
                        <RoomCard key={index} moduleName = {moduleName} roomName = {room} />
                    ))}
                </div>
            </div>
        </div>
    </div>
    )
}
export default ModuleCard