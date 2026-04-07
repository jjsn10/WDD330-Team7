import { jwtDecode } from "jwt-decode";
import { loginRequest } from "./externalServices.mjs";
import { setLocalStorage, alertMessage, getLocalStorage } from "./utils.mjs";

export async function login(creds,redirect = "/"){
    
    try {        
        const token = await loginRequest(creds);
        console.log("Login successful, received token: ", token);
        setLocalStorage("so_token", token);
        window.location = redirect;
    } catch (error) {
        console.error("Login failed: ", error);
        alertMessage(error.message.message || "Login failed. Please try again.");
        throw error;
    }    

}
export function checkLogin(){
    const token = getLocalStorage("so_token");
    if (!isTokenValid(token)) {
        localStorage.removeItem("so_token");
        const location = window.location;
        console.log("Redirecting to login page from: ", location);
        window.location = `/login/index.html?redirect=${location.pathname}`;
        //return false;
    } else {
        return token;
    }
}
function isTokenValid(token){

    if(token){
        const decoded = jwtDecode(token);
        const exp = decoded.exp;
        const now = Math.floor(Date.now() / 1000);
        if (exp < now) {
            console.log("Token expired.");
            return false;
        } else {
            console.log("Token valid.");
            return true;
        }
    } else {
        console.log("No token found.");
        return false;       
    }
}