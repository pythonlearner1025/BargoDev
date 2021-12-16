// change committed

// 12/16/21
// dev 15 error:
// function (useEffect) unable to initialize clickedOptions
// gotta load setClickedOptions before it is rendered at
// renderOptionScore and handleClick

import React, {useEffect, useState} from "react";

function zip(a,b){
  if (a.length !== b.length){
    return null
  }
  const zipped = []
  for (let i=0;i<a.length;i++){
    const smallZip = []
    smallZip.push(a[i])
    smallZip.push(b[i])
    zipped.push(smallZip)
  }
  return zipped
}

function isInt(x){
  return x%1==0;
}

export default function UserInput(){
  // replace begin and endtime with values retrieved from
  // redis db
    //const params = fetchParams()
    const [params, setParams] = useState(null)
    const [paramsLoaded, setParamsLoaded] = useState(false)
    const [scoreTrack, setScore] = useState(0)

    const begin = Date.now() 
    const endTime = begin + 10*60*1000
    const [timeTrack, setTime] = useState(0)
    
    // ui color schemes
    const [notClickedColor] = useState("bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100")
    const [clickedColor] = useState("bg-white border-b transition duration-300 ease-in-out bg-indigo-500")


   const [clickedOptions, setClickedOptions] = useState(null)

    useEffect(() => {
      const fetchData = async () => {
        const result = await fetch('/api/game/initGame')
        const data = result.json().then(result => {
          // set data
          setParams(result.data.gameParams)
          setParamsLoaded(true)
        })
      }
      fetchData()
    },[])

    useEffect(() => {
      console.log(paramsLoaded)
      if (paramsLoaded === true){
        const result = []
        for (let i=0;i<params.length;i++){
          const optionBools = [];
          for (let j=0;j<params[i].options.length;j++){
            optionBools.push(notClickedColor)
          }
          result.push(optionBools)
        }
          setClickedOptions(result)
      }
    }, [])



    function handleClick(interestIndex, optionScoreIndex){
      // first check if selected options at index has already been selected
      // if so, do nothing 
      if (clickedOptions[interestIndex][optionScoreIndex]===clickedColor){
        // do nothing, terminate code
        return;
      }
      // first clear all other clicked option-scores (will be true)
      // (will non-destructive changes to array be reflect in js? time will tell)
      var pastClickIndex = null
      for (let i=0;i<clickedOptions[interestIndex].length;i++){
        if (clickedOptions[interestIndex][i] === clickedColor){
          clickedOptions[interestIndex][i] = notClickedColor
          pastClickIndex = i
          break
        }
      }
      clickedOptions[interestIndex][optionScoreIndex] = clickedColor

      const thisInterest = params.interests[interestIndex]
      const thisOption = thisInterest.options[optionScoreIndex]
      const thisScore = thisInterest.scores[optionScoreIndex]

      var newScore = scoreTrack
      if (pastClickIndex !== null){
        newScore -= thisInterest.scores[pastClickIndex] 
      }
      newScore += thisScore
      setScore(newScore)
      console.log(newScore)
      console.log(clickedOptions)

      // else, add to gameState  
      // reflect changes in UI
    }

    function renderTables(){
      console.log('other',params)
      return params.map((interest, index)=>{
        return (
            renderInterest(interest, index)
        );
      })
    }

    function renderTime(){
      var time;
      var leftTime = setInterval(() => {
        var thisTime =  Date.now();
        var distance = endTime - thisTime;
        // Time calculations for days, hours, minutes and seconds
        // if duration greater than hour, to find leftover hour it would b
        // approrpirate to reformulate the below to: Math.floor(distance % (60*1000*60) / (60*1000))
        const hours = Math.floor((distance) / (60*60*1000))
        const minutes = Math.floor((distance % (60*60*1000)) / (1000 * 60))
        const findSec = (val)=>{
            if (isInt(val)){return val} else{return Math.ceil(val)}
        }
        const seconds = findSec(distance % (1000 * 60) / 1000);
        let hoursText = hours.toString();
        let minutesText = minutes.toString();
        let secondsText = seconds.toString();

        if (hoursText.length < 2){
          hoursText = '0' + hoursText
        }
        if (minutesText.length < 2){
          minutesText = '0' + minutesText 
        }
        if (secondsText.length < 2){
            secondsText = '0' + secondsText
        }

        time = 'Time Left' +  ' ' + hoursText+ ':' + minutesText + ':' + secondsText
        setTime(time)
        //console.log(time)
        if (distance <= 0) {
          clearInterval(leftTime);
        }
    }, 1000); 

      return () =>{
        clearInterval(leftTime)
      }
    }

    function renderInterest(interest, interestIndex){
      return (
        <div class="flex flex-col">
        <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
        <div class="overflow-hidden">
        <table class="min-w-full">
        <thead class="bg-white border-b">
          <tr>
          <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            {interest.name}
          </th>
          <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            option
          </th>
          <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            score
          </th>
          </tr>
        </thead>
        <tbody>
            {renderOptionsScores(interest.options, interest.scores, interestIndex)}
        </tbody>
        </table>
        </div>
        </div>
        </div>
        </div>
      );
    }

    function renderOptionsScores(options,scores, interestIndex){
      const optionScoreZipped = zip(options,scores)
      const arrLen = options.length

      // optionScoreIndex = option, scores of this interest zipped together 
      // into (think of as parallel assignedpython tuples) array
      return optionScoreZipped.map((zipped, optionScoreIndex) => {
        // zipped[0], zipped[1] = options[i], scores[i]
        const option = zipped[0]
        const score = zipped[1]

        return (
          <tr class={clickedOptions[interestIndex][optionScoreIndex]} onClick={()=>{
            handleClick(interestIndex, optionScoreIndex)
          }}>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{arrLen-optionScoreIndex}</td>
          <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap" >
            {option}
          </td>
          <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap" >
            {score}
          </td>
          <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
            misc
          </td>
          </tr>
        );
      })
    }

    return paramsLoaded === false ? (
      <div>
        Loading...
      </div>
    ) :(
      <div>
        <div>
          {scoreTrack}
        </div>
        <div>
          {timeTrack}
        </div>
        <div>
          {renderTables()}
        </div>
      </div>
    );
}