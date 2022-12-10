import React, { useState, useRef, useEffect } from 'react';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Button from '@mui/material/Button';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TuneIcon from '@mui/icons-material/Tune';
import { Input } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import './drag.css'

const Drag = () => {
  
  const dragItem = useRef();
  const dragOverItem = useRef();
  const[keys,setKeys]=useState(["Date","App","Request","Response","Impression","Clicks","Revenue","Fill Rate","CTR"]);
  const[copy,setCopy]=useState(["Date","App","Request","Response","Impression","Clicks","Revenue","Fill Rate","CTR"])
  const[displayDate,setDisplay]=useState(false)
  const[start,setStart]=useState("")
  const[end,setEnd]=useState("")
  const[range,setRange]=useState("Slect Range")
  const[data,setData]=useState([])
  const[app,setApp]=useState({})


  const[show,setShow]=useState({
    "Date":true,
    "App":true,
    "Request":true,
    "Response":true,
    "Impression":true,
    "Clicks":true,
    "Revenue":true,
    "Fill Rate":true,
    "CTR":true
  })

  const[copyShow,setCopyShow]=useState({
    "Date":true,
    "App":true,
    "Request":true,
    "Response":true,
    "Impression":true,
    "Clicks":true,
    "Revenue":true,
    "Fill Rate":true,
    "CTR":true
  })

  const dragStart = (e, position) => {
    dragItem.current = position;
  };
 
  const dragEnter = (e, position) => {
    dragOverItem.current = position;
  };
  const drop = (e) => {
    const copyListItems = [...copy];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    console.log(copyListItems);
    setCopy(copyListItems)
  };

  const applyChange=()=>{
    setKeys(copy);
    setSetting(item=>!item)
    setShow(copyShow)
  }

  const cancelChange=()=>{
    setCopy(keys)
    setCopyShow(show)
    setSetting(item=>!item)
  }

  useEffect(()=>{
    fetch(`http://go-dev.greedygame.com/v3/dummy/apps`,{
        method:"GET"
    }).then(res=>res.json())
    .then(res=>{
        res=res["data"]
        
        for(let i=0;i<res.length;i++){
          setApp(prev=>{
            console.log(prev);
            return {...prev,[res[i]["app_id"]]:res[i]["app_name"]}
          })
          
        }
    })

    fetch(`http://go-dev.greedygame.com/v3/dummy/report?startDate=2021-05-01&endDate=2021-05-03`,{
        method:"GET"
    }).then(res=>res.json())
    .then(res=>{
        for(let i=0;i<res["data"].length;i++){
            res["data"][i]["fillRate"]=parseFloat((parseFloat(res["data"][i]["requests"])/parseFloat(res["data"][i]["responses"]))*100).toFixed(2)
            res["data"][i]["ctr"]=parseFloat((parseFloat(res["data"][i]["clicks"])/parseFloat(res["data"][i]["impressions"]))*100).toFixed(2)
            const d=new Date(Date.parse(res["data"][i]["date"]))
            console.log(d)
            const da=d.getDate()+" "+d.toLocaleString('default', { month: 'long' })+" "+d.getFullYear()
            res["data"][i]["date"]=da

        }
        setData(res["data"])
        setOriginalData(res["data"])
    })
  },[])

  const[setting,setSetting]=useState(false)

  const keyMap={
    "Date":"date",
    "App":"app_id",
    "Request":"requests",
    "Response":"responses",
    "Impression":"impressions",
    "Clicks":"clicks",
    "Revenue":"revenue",
    "Fill Rate":"fillRate",
    "CTR":"ctr"
  }

  const handleRange=(item)=>{

    setEnd(item)
    setRange(start+" - "+item)

    fetch(`http://go-dev.greedygame.com/v3/dummy/report?startDate=2021-05-01&endDate=2021-05-03`,{
        method:"GET"
    }).then(res=>res.json())
    .then(res=>{
        for(let i=0;i<res["data"].length;i++){
            res["data"][i]["fillRate"]=parseFloat((parseFloat(res["data"][i]["requests"])/parseFloat(res["data"][i]["responses"]))*100).toFixed(2)
            res["data"][i]["ctr"]=parseFloat((parseFloat(res["data"][i]["clicks"])/parseFloat(res["data"][i]["impressions"]))*100).toFixed(2)
            const d=new Date(Date.parse(res["data"][i]["date"]))
            console.log(d)
            const da=d.getDate()+" "+d.toLocaleString('default', { month: 'long' })+" "+d.getFullYear()
            res["data"][i]["date"]=da

        }
        setData(res["data"])
    })

  }

  const handleShow=(item,index)=>{
    console.log(item,index);
    setCopyShow(prev=>{
        return {...prev,[item]:!prev[item]}
    })
  }

  return (
    <>
    <h3>Analytics</h3>
    <div>
     <Button variant="outlined" style={{color:"black",textAlign:"center",margin:"10px 0"}}
          onClick={()=>setDisplay(open=>!open)}><CalendarMonthIcon color="primary"/>{range}</Button>
      {
          displayDate?<div>

              <Input type="date" value={start} onChange={item=>setStart(item.target.value)} style={{marginRight:"10px"}}/>
              <Input type="date" value={end} onChange={item=>handleRange(item.target.value)}/>

          </div>:null
      }
    </div>
    <div style={{float:"right",position:"absolute",right:"20px", top:"90px"}}>

      <Button onClick={()=>setSetting(item=>!item)} variant="outlined"><TuneIcon/> Setting</Button>

    </div>

    
    
    <div style={{border:"1px solid rgba(0,0,0,0.1)", padding:"20px",margin:"10px 0"}}>

      <div style={{margin:"10px 0"}}>Dimensions and Metrics</div>

      <div style={{display:"flex",flexWrap:"wrap"}}>
          {
              copy&&
              copy.map((item, index) => (
              <div style={{borderRadius:"5px",borderRight:"1px solid grey",borderTop:"1px solid grey",borderBottom:"1px solid grey",padding:"5px",marginTop:"20px",marginBottom:"20px", textAlignLast:"left",marginRight:"10px",textAlign:'center',width:"150px", fontSize:'20px',borderLeft:copyShow[item]?"5px solid blue":"1px solid grey"}}
                  onDragStart={setting?(e) => dragStart(e, index):null}
                  onDragEnter={setting?(e) => dragEnter(e, index):null}
                  onDragEnd={setting?drop:null}
                  onClick={setting?()=>handleShow(item,index):null}
                  key={index}
                  draggable={setting?"true":"false"}>
                  {item}
              </div>
              ))
          }
      </div>

    </div>

    <div style={{display:"flex",justifyContent:"end"}}>
      {
          setting?
            <div>
              <Button variant='outlined' style={{margin:"10px"}} onClick={cancelChange}>Cancel</Button>
              <Button variant="contained" onClick={applyChange}>Apply</Button>
            </div>
          :null
      } 
    </div>

    <div style={{overflow:"auto"}}>
      <table className='table'>
          <tr>
              {
                  keys.map((item,index)=>(
                      show[item]?<th key={index}>
                        <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
                          <div>
                            <FilterAltIcon/>
                          </div>
                          <div style={{marginTop:"10px"}}>{item}</div>
                        </div>
                      </th>:null       
                  ))
              }
          </tr>
          {
              data && data.map((item,index)=>(
                  
                  <tr key={index} style={{borderBottom:"1px solid rgba(0,0,0,0.5)",padding:"10px"}}>
                      {
                        keys.map((key,index)=>(
                          show[key]?<td style={{textAlign:"center",marginBottom:"10px"}}>{key!=="App"?item[keyMap[key]]:app[item[keyMap[key]]]}</td>:null
                        ))
                      }
                  </tr> 
                  
              ))
          }
      </table>
    </div>

    </> 
  );
};
export default Drag;