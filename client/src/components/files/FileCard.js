function FileCard (props){
    const {file, onSelect} = props
    const handleSelect = () => {
        onSelect(file);
    };
    return(
        <div className="card movie-card" style={{textAlign:'left'}}>
        <div className="row">
            <div className="col">
                <div className="card-body">
                    <h6 className="card-title">{file.display_name}</h6>
                    <p className="card-text">{file.id}</p>
                    <button className="btn btn-primary" style={{width:'100%'}}onClick={handleSelect}>Select</button>
                </div>
            </div>
        </div>
    </div>
    )
}
export default FileCard