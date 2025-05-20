import usersLogin from "./db";



function login(username, password){
    for (const user of usersLogin){
        if (username === user.username && password===user.password){
            return true
        }
    }

    return false       
}

function usernameAvailable(username){
     for (const user of usersLogin){
        if (username === user.username){
            return false
        }
    }

    return true
}

export {login, usernameAvailable} 

