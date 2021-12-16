import { useForm } from "react-hook-form";
import React, {useEffect, useState} from "react";
import cookie from "js-cookie";
import {useRouter} from 'next/router';
//const point2 = 'http://localhost:3060/';
 

// required compartments for short lobby prototype: 
// "enter agreement & enter room"
// "select player" (whoever clicks first)
// "lobby timer"
// "stake amount"


// things Server needs to receive & store from lobby: 
// (exception) game length default 5 min
// player IDs 
// room ID
// amount staked by each player

/*
Compartment: SELECT PLAYER
CLIENT SIDE FUNCTION: 
    1) Player can choose between two roles
    2) Player can see what opponent chose
    3) Player cannot choose what opponent already chose
    4) (optional)

BACKEND RELAY:
    1) send Player role corresponding to Player ID
    2) legality of requests to change roles are checked in backend
*/


// create game-room to redis database if one player connects
async function createGame(){
    console.log('in createGame');
    await fetch('/api/lobby/create', {
        body: JSON.stringify({
            createNew: true,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
    })
}


const notClickedColor = "w-full sm:w-1/2 md:w-1/2 lg:w-1/4 px-4 py-4 mt-6 bg-white shadow-lg rounded-lg";
const clickedColor = "w-full sm:w-1/2 md:w-1/2 lg:w-1/4 px-4 py-4 mt-6 bg-white shadow-lg rounded-lg dark:bg-gray-800";

export default function Role(){
  //createGame();

  const [toggle, setToggle] = useState(true);

  if (toggle){
      setToggle(false);
      createGame();
  }

  const [roleA] = useState(['employee', 'The Big Daddy 3000 boss'],);
  const [roleAclicked, setRoleAclicked] = useState(false);
  const [roleB] = useState(['recruit', 'Big Daddys Official Spank Machine']);
  const [roleBclicked, setRoleBclicked] = useState(false);
  const [roleAcolor, setRoleAcolor] =  useState(notClickedColor);
  const [roleBcolor, setRoleBcolor] = useState(notClickedColor);
    
  const router = useRouter();
  
  // for user input  
  const [userAccount, setAccount] = useState(null);
  const [userValue, setUserValue] = useState(null);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();


  // game generation button
  // state 0 (not clicked by user)
  // state 1 (clicked by user, ready, awaiting other user to click)
  const [buttonState, setButtonState] = useState(0);
  const [stateVals] = useState([
      {
        msg: 'Begin Game'
     },
     {
         msg: 'Waiting for Opponent'
     }

  ])
  async function isClickValid(userAccount, role){

    const cookieArray = cookie.get();
    const thisUserCookie = cookieArray[userAccount];
    console.log('get this users cookie: '+thisUserCookie);
    // attempt to modify the gameState data
    // that should be saved on serverside.
    // for example,
    // if gameState.roleA is unoccupied, it will
    // now be set equal to the sessionId of user
    // however, if gameState.roleA is occupied,
    // nothing will happen
    await fetch('/api/cookies/logClick',{
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({account: userAccount, role: role}),
    }) 
    
    // attempt: fetch modified data about gameState from
    // router /isClickValid. 
    // check if the modified role is equal to the sessionId
    // if so, return true. click is valid
    // else, return false. click is not valid
    const response = await fetch('/api/lobby/isClickValid');
    const data = await response.json();
    const gameState = data.gameState;

    if (role === 'roleA' && gameState.roleA.id === thisUserCookie){
        return true
    } else if (role === 'roleB' && gameState.roleB.id === thisUserCookie){
        return true
    } else {
        return false
    } 
}

    async function updateState(userAccount, readyState){
        const response = await fetch('/api/lobby/updateReadyState',{
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({account: userAccount, readyState: true}),
        });
        return response.json();
    }

    async function isGameStateValid(){
        const jsonResp = await fetch('/api/lobby/checkReadyState');
        const resp = await jsonResp.json();
        // checkReadyState either returns true or false value in its ready
        if (resp.ready === true){
            return true
        } else {
            return false
        }
    }
  // user inputted value
  const handleMoneySubmit = (data) => {
      console.log(data.moneyValue);
      var value = parseInt(data.moneyValue,10);
      if (Number.isNaN(value) || value <= 0){
          alert('please enter integer >0');
      }
     setUserValue(value);
    }

    // user inputted address
    const handleAccountSubmit = (data) => {
        console.log(data.account);
        // validate account
        if (userAccount !== data.account){
            setAccount(data.account);
            //cookie.set("account", data.account, {expires: 1/24});    
            submitCookie(data.account);
        }
    }

    async function submitCookie(accountVal){
        console.log('cookie submitted');
        const response = await fetch('/api/cookies/logCookie',{
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({account: accountVal}),
        })
        return response.json();
    }


// handle clicks for role A, roleB
// can only click and set role if 
// another user has not selected their role 
// to be clicked role

    const handleAClick = () => {
        const truth = isClickValid(userAccount,'roleA');
        truth.then(result => {
            console.log(result);
            if (result === true){
                if (!roleAclicked){
                    setRoleAclicked(true)
                    setRoleAcolor(clickedColor)
                } else {
                    setRoleAclicked(false)
                    setRoleAcolor(notClickedColor)
                }
            }
        })
    }

    const handleBClick = () => {
        const truth = isClickValid(userAccount,'roleB');
        truth.then(result => {
            console.log(result);
            if (result === true){
                if (!roleBclicked){
                    setRoleBclicked(true)
                    setRoleBcolor(clickedColor) 
                } else {
                    setRoleBclicked(false)
                    setRoleBcolor(notClickedColor);
                }
            }
        });
    }

    // when user first clicks gameGenerate, it should show
    // *** awaiting other user to be ready ***
    // the client should constantly check with server to see if 
    // other user has also clicked ready state
    // if this is fulfilled, begin game and update UI accordingly
    function handleGameGeneration(){
        if (buttonState === 0){
            setButtonState(1);
            const updated = updateState(userAccount, true);
            updated.then(result => {

                console.log('update state result:')
                console.log(result);
                
                const checkReadyStatus = setInterval(() => {
                    const isValid = isGameStateValid();
                    isValid.then(result => {
                        if (result === true){
                        console.log('both parties ready'); 
                        fetch('/api/lobby/sendToGame')
                        router.push({pathname: '/posts/game'}) 
                        clearInterval(checkReadyStatus);
                        }
                    })
                },1000);
                })
       }
        // if true, generate game and redirect players to game page
    }

  useEffect(() => {

    // only allow role choosing if user has inputted money
    if (userAccount !== null && userValue !== null){

        if (roleAclicked===true){
        //socket.emit('clicked', roleA[0]);
        } else if (roleBclicked===true){
        //socket.emit('clicked', roleB[0]);
        }

    }
    // if in ready state, check with server to see if 
    // other mf clicked button to at X intervals
  })
  return(
    <div className="sm:flex flex-wrap justify-center items-center text-center gap-8">
        <div className={roleAcolor} onClick={handleAClick}>
            <div className="flex-shrink-0">
                <div className="flex items-center mx-auto justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <svg width="20" height="20" fill="currentColor" class="h-6 w-6" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                        <path d="M491 1536l91-91-235-235-91 91v107h128v128h107zm523-928q0-22-22-22-10 0-17 7l-542 542q-7 7-7 17 0 22 22 22 10 0 17-7l542-542q7-7 7-17zm-54-192l416 416-832 832h-416v-416zm683 96q0 53-37 90l-166 166-416-416 166-165q36-38 90-38 53 0 91 38l235 234q37 39 37 91z">
                        </path>
                    </svg>
                </div>
            </div>
            <h3 className="text-2xl sm:text-xl text-gray-500 font-semibold dark:text-white py-4">
                {roleA[0]}
            </h3>
            <p className="text-md text-gray-500 dark:text-gray-300 py-4">
                {roleA[1]}
            </p>
        </div>
        <div className={roleBcolor} onClick={handleBClick}>
            <div className="flex-shrink-0">
                <div className="flex items-center mx-auto justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <svg width="20" height="20" fill="currentColor" class="h-6 w-6" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                        <path d="M491 1536l91-91-235-235-91 91v107h128v128h107zm523-928q0-22-22-22-10 0-17 7l-542 542q-7 7-7 17 0 22 22 22 10 0 17-7l542-542q7-7 7-17zm-54-192l416 416-832 832h-416v-416zm683 96q0 53-37 90l-166 166-416-416 166-165q36-38 90-38 53 0 91 38l235 234q37 39 37 91z">
                        </path>
                    </svg>
                </div>
            </div>
        <h3 className="text-2xl sm:text-xl text-gray-700 font-semibold dark:text-white py-4">
            {roleB[0]}
        </h3>
        <p className="text-md  text-gray-500 dark:text-gray-300 py-4">
                {roleB[1]}
        </p>
        </div>


        <div>

        <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <form onSubmit={handleSubmit(handleMoneySubmit)}>
            <input
                type="text"
                name="price"
                id="price"
                placeholder="0.0"
                defaultValue="0.0"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                {...register("moneyValue", { required: true })}/>
                 {errors.moneyValue && <span>required field</span>}
            </form>
        </div>
      </div>

      <div>
        <label htmlFor="ethereum account" className="block text-sm font-medium text-gray-700">
          Account 
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <form onSubmit={handleSubmit(handleAccountSubmit)}>
            <input
                type="text"
                name="account"
                id="account"
                placeholder="0x29D7d1dd5B6f9C864d9db560D72a247c178aE86B"
                defaultValue="0x29D7d1dd5B6f9C864d9db560D72a247c178aE86B"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                {...register("account", { required: true })}/>
                 {errors.account && <span>required field</span>}
            </form>
        </div>
      </div>

        </div>

        <div>
        <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleGameGeneration}>
            {stateVals[buttonState].msg}
        </div>
        </div>
    </div>
    
  );
}

// function that tags user with certain input + id for db

