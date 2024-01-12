import React from 'react'
import PDFIcon from '../assets/images/pdf-icon.png'
import VideoIcon from '../assets/images/video-icon.png'
import ImgIcon from '../assets/images/img-icon.png'
import ObjectIcon from "../assets/images/3d-icon.png"
import MP3Icon from "../assets/images/sound-icon.png"


const FileType = (name) =>{
  const extension = name.split('.').pop();
    switch(extension){
        case "pdf":
            return PDFIcon
        case "mp4":
            return VideoIcon
        case "png":
        case "jpeg":
        case "jpg":
            return ImgIcon
        case "glb":
            return ObjectIcon
        case "mp3":
            return MP3Icon;
        default:
            return null
    }    
}

const CustomInput = ({value, name, onChange, min, max}) =>{
  return(
    <input
      className='w-1/3 rounded-sm pl-2'
      type='number'
      name={name}
      value={value}
      onChange={onChange}
      min={min}
      max={max}
    />

  )
}

const CustomInputGroup = ({name, group, onChange, min, max}) =>{
  return(
  <div className='w-full max-w-full flex items-center justify-between gap-6 my-1'>
          <p className='capitalize'>{name}</p>
          <div className='w-1/2 flex items-start justify-evenly gap-6 text-dark'>
            <CustomInput name={`${name}.x`} value={group.x} onChange={onChange} min={min} max={max}/>
            <CustomInput name={`${name}.y`} value={group.y} onChange={onChange} min={min} max={max}/>
            <CustomInput name={`${name}.z`} value={group.z} onChange={onChange} min={min} max={max}/>
          </div>
  </div>
  );
}

const SelectedFile = ({ file, onUpdate, index }) => {
    const handleInputChange = (event) => {
      event.preventDefault();
      const { name, value } = event.target;
      const [field, axis] = name.split('.'); // Splitting the name to get the field and axis
      const updatedFile = { ...file, [field]: { ...file[field], [axis]: Number(value) } };
      onUpdate(index, updatedFile);
    };
    return (
      <div className='w-full flex flex-col items-start justify-start bg-light p-2 rounded-md my-2 text-dark gap-2 border'>
        <p className='font-semibold'>{file.display_name}</p>
        <form>
          <CustomInputGroup 
            name={'position'} 
            group={file.position} 
            onChange={handleInputChange}
          />
          <CustomInputGroup 
            name={'scale'} 
            group={file.scale} 
            onChange={handleInputChange} 
            min={1}
          />
          <CustomInputGroup 
            name={'rotation'} 
            group={file.rotation} 
            onChange={handleInputChange} 
            min={0} 
            max={360}
          />
        </form>
      </div>
    );
  };

const RoomObject = ({file, updateFiles}) => {
  const img = FileType(file.display_name)

  const handleClick = () =>{
    file.position = {x: 0, y: 0, z:0};
    file.scale = {x: 1, y: 1, z:1}
    file.rotation = {x: 0, y: 0, z:0}
    updateFiles(file);
  }
  
  return (
    <div className='w-full flex items-center justify-between p-2 border-b'>
        <div className='flex items-center justify-between gap-3'>
            <img src={img} alt="pdf" className='h-10 w-10'/>
            <p>{file.display_name}</p>
        </div>
        <button 
          className='p-2 px-3 rounded-lg bg-dark text-light text-sm tracking-wide'
          onClick={handleClick}>Add</button>
    
    </div>
  )
}

export{
    RoomObject,
    SelectedFile
}