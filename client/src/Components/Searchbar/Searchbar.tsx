import React ,{useRef} from 'react'
import './Searchbar.css'
export default function Searchbar({videourl,setVideourl}) {
  const p = useRef();

  return (
    <div className='searchbar'>

        <input ref={p} type="search" name="" id="" placeholder='Direct Link to a Video' onChange={(e)=>{setVideourl(e.target.value) && console.log(videourl)}}/>
        <button onClick={setVideourl(p.current && p.current.value)}><img src={`${import.meta.env.PUBLIC_URL}/icons/search.png`}  alt="" /></button>
       
    </div>
  )
}
